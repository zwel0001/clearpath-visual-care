import { PROCEDURES, ProcedureId } from "./data";

export type Issue = {
  category: "contraindication" | "consideration" | "red-flag";
  text: string;
  severity: "high" | "medium" | "low";
  tags?: string[];
};

const kw = (s: string) => new RegExp(`(^|[^a-z])${s}([^a-z]|$)`, "i");

const ANTICOAGS = [
  "warfarin",
  "apixaban",
  "rivaroxaban",
  "dabigatran",
  "edoxaban",
  "heparin",
  "enoxaparin",
  "clopidogrel",
  "ticagrelor",
  "prasugrel"
];

const LP_NEURO = [
  "papilloedema",
  "papilledema",
  "focal neurology",
  "seizure",
  "reduced consciousness",
  "brain tumour",
  "brain tumor",
  "mass lesion",
  "raised icp",
  "intracranial pressure"
];

const NG_TRAUMA = [
  "basal skull fracture",
  "mid-face fracture",
  "midface fracture",
  "facial trauma"
];

const CATHETR_TRAUMA = [
  "blood at meatus",
  "pelvic fracture",
  "high-riding prostate",
  "urethral injury"
];

const ARM_AVOID = ["lymphoedema", "lymphedema", "mastectomy", "av fistula", "cellulitis"];

const ALLERGY_LATEX = ["latex"];
const ALLERGY_CHX = ["chlorhexidine", "chloraprep"];

export function analyzeHistory(history: string, procedure: ProcedureId): Issue[] {
  const h = history.toLowerCase();
  const out: Issue[] = [];

  const hasAny = (arr: string[]) => arr.some((k) => h.includes(k));

  // Generic checks
  if (hasAny(ANTICOAGS)) {
    out.push({
      category: "consideration",
      text: "Anticoagulation/antiplatelet use — check INR/platelets; discuss timing/alternatives.",
      severity: "medium",
      tags: ["anticoagulation"]
    });
  }
  if (hasAny(ALLERGY_LATEX)) {
    out.push({
      category: "consideration",
      text: "Latex allergy — use non-latex equipment.",
      severity: "medium",
      tags: ["allergy"]
    });
  }
  if (hasAny(ALLERGY_CHX)) {
    out.push({
      category: "consideration",
      text: "Chlorhexidine allergy — use povidone-iodine skin prep.",
      severity: "medium",
      tags: ["allergy"]
    });
  }

  switch (procedure) {
    case "iv_cannulation":
    case "venepuncture": {
      if (hasAny(ARM_AVOID)) {
        out.push({
          category: "consideration",
          text: "Avoid limb with lymphoedema/AV fistula/previous mastectomy/cellulitis.",
          severity: "high",
          tags: ["site selection"]
        });
      }
      break;
    }
    case "urinary_catheter": {
      if (hasAny(CATHETR_TRAUMA)) {
        out.push({
          category: "contraindication",
          text: "Suspected urethral injury — do NOT pass catheter; call urology, consider suprapubic.",
          severity: "high",
          tags: ["trauma"]
        });
      }
      break;
    }
    case "ng_tube": {
      if (hasAny(NG_TRAUMA)) {
        out.push({
          category: "contraindication",
          text: "Basal skull/mid-face trauma — avoid nasal route; seek senior review.",
          severity: "high",
          tags: ["trauma"]
        });
      }
      break;
    }
    case "lumbar_puncture": {
      if (hasAny(LP_NEURO)) {
        out.push({
          category: "contraindication",
          text: "Signs of raised ICP/focal neurology — image first and discuss with senior.",
          severity: "high",
          tags: ["neuro"]
        });
      }
      if (hasAny(ANTICOAGS)) {
        out.push({
          category: "contraindication",
          text: "Anticoagulated — correct coagulopathy and check counts before LP.",
          severity: "high",
          tags: ["bleeding risk"]
        });
      }
      break;
    }
  }

  // Elevate any high-risk items to red-flag duplicates for emphasis
  out.forEach((i) => {
    if (i.severity === "high") {
      out.push({ ...i, category: "red-flag" });
    }
  });

  // De-duplicate by text+category
  const seen = new Set<string>();
  return out.filter((i) => {
    const k = `${i.category}|${i.text}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function getProcedureInfo(id: ProcedureId) {
  return PROCEDURES[id];
}

export const allProcedures = Object.values(PROCEDURES);
