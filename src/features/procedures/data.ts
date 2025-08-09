export type ProcedureId =
  | "iv_cannulation"
  | "venepuncture"
  | "urinary_catheter"
  | "ng_tube"
  | "lumbar_puncture";

export interface ProcedureInfo {
  id: ProcedureId;
  name: string;
  summary: string;
  contraindications: string[];
  considerations: string[];
  equipment: string[];
  redFlags?: string[];
  references?: { title: string; url: string }[];
}

export const PROCEDURES: Record<ProcedureId, ProcedureInfo> = {
  iv_cannulation: {
    id: "iv_cannulation",
    name: "Peripheral IV Cannulation",
    summary:
      "Insert a peripheral intravenous cannula for fluids, medications, or blood sampling.",
    contraindications: [
      "Cellulitis or burns at intended site",
      "Lymphoedema or post-mastectomy arm (avoid)",
      "Ipsilateral AV fistula (avoid)",
      "Severe coagulopathy (relative)"
    ],
    considerations: [
      "Consider ultrasound guidance if difficult access",
      "Use smallest gauge suitable for therapy",
      "Check allergies (latex, chlorhexidine)",
      "Aseptic non-touch technique (ANTT)"
    ],
    equipment: [
      "Gloves, apron",
      "Skin prep (chlorhexidine 2% in alcohol or povidone-iodine if allergic)",
      "Tourniquet",
      "Cannula (14–24G) + dressing",
      "Flush + saline",
      "Sharps bin"
    ],
    redFlags: [
      "Suspected sepsis with poor access — escalate for senior/IO",
      "Known lymphoedema/AV fistula — avoid that arm"
    ],
    references: [
      {
        title: "Australian Commission on Safety and Quality in Health Care: Peripheral IV",
        url: "https://www.safetyandquality.gov.au/"
      }
    ]
  },
  venepuncture: {
    id: "venepuncture",
    name: "Venepuncture (Phlebotomy)",
    summary: "Collect venous blood safely and aseptically.",
    contraindications: [
      "Same as IV access (cellulitis, AV fistula, lymphoedema)",
      "Severe coagulopathy (relative)"
    ],
    considerations: [
      "Check tests and required tubes",
      "Avoid IV infusing limb if possible",
      "Warm hand improves venous filling",
      "Check allergies (latex, chlorhexidine)"
    ],
    equipment: [
      "Gloves",
      "Skin prep",
      "Tourniquet",
      "Needle/vacutainer + tubes",
      "Gauze + dressing",
      "Sharps bin"
    ]
  },
  urinary_catheter: {
    id: "urinary_catheter",
    name: "Urinary Catheterisation",
    summary:
      "Insert urethral catheter for monitoring urine output or relieving retention.",
    contraindications: [
      "Suspected urethral injury (blood at meatus, perineal ecchymosis)",
      "Pelvic fracture with high-riding prostate",
      "Urethral stricture (relative)"
    ],
    considerations: [
      "Use smallest appropriate catheter size",
      "Consider suprapubic if urethral injury suspected (senior help)",
      "Check allergies (latex)",
      "Aseptic technique — infection prevention"
    ],
    equipment: [
      "Sterile catheter kit (catheter, gloves, drape)",
      "Lubricant (lignocaine gel)",
      "Antiseptic",
      "Drainage bag"
    ],
    redFlags: [
      "Blood at meatus/pelvic trauma — do not insert; call urology",
      "Sepsis or obstructive uropathy — escalate"
    ]
  },
  ng_tube: {
    id: "ng_tube",
    name: "Nasogastric Tube Insertion",
    summary: "Insert NG tube for decompression or feeding.",
    contraindications: [
      "Suspected basal skull or mid-face fracture",
      "Recent nasal surgery",
      "Esophageal varices (relative — senior input)",
      "Caustic ingestion (relative)"
    ],
    considerations: [
      "Check patency of nares",
      "Sit patient up if possible",
      "Confirm position (pH aspirate/X-ray as per local policy)",
      "Check coagulation if bleeding risk"
    ],
    equipment: [
      "NG tube appropriate size",
      "Lubricant",
      "pH paper",
      "Syringe",
      "Fixation device/tape"
    ],
    redFlags: [
      "Facial trauma/basal skull fracture — avoid nasal route",
      "Respiratory distress during insertion — stop"
    ]
  },
  lumbar_puncture: {
    id: "lumbar_puncture",
    name: "Lumbar Puncture",
    summary: "Obtain CSF for diagnostic purposes.",
    contraindications: [
      "Signs of raised intracranial pressure (papilloedema, focal neurology)",
      "Coagulopathy/anticoagulation",
      "Local infection at puncture site",
      "Spinal cord mass lesion (suspected)"
    ],
    considerations: [
      "Check coagulation, platelets",
      "Neuroimaging before LP if focal deficit/seizure/altered consciousness",
      "Positioning and analgesia/sedation considerations",
      "Consent and post-procedure advice"
    ],
    equipment: [
      "LP kit (spinal needle, manometer)",
      "Antiseptic, sterile drape",
      "Local anaesthetic",
      "CSF collection tubes"
    ],
    redFlags: [
      "Suspicion of space-occupying lesion — image first",
      "Anticoagulated patient — correct before LP"
    ]
  }
};
