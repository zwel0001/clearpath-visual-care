import { useEffect, useMemo, useState } from "react";
import { allProcedures, getProcedureInfo } from "@/features/procedures/engine";
import type { ProcedureId } from "@/features/procedures/data";
import { analyzeHistory } from "@/features/procedures/engine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Stethoscope, ClipboardList, Syringe } from "lucide-react";
import { Link } from "react-router-dom";

// Minimal SEO helper
function useSEO({ title, description, canonical }: { title: string; description: string; canonical?: string }) {
  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);
    else {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      m.setAttribute("content", description);
      document.head.appendChild(m);
    }
    if (canonical) {
      let linkEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!linkEl) {
        linkEl = document.createElement("link");
        linkEl.setAttribute("rel", "canonical");
        document.head.appendChild(linkEl);
      }
      linkEl.setAttribute("href", canonical);
    }
  }, [title, description, canonical]);
}

export default function ProceduresPage() {
  useSEO({
    title: "Procedure Safety Assistant for Junior Doctors",
    description:
      "Quick contraindications, considerations, equipment, and patient-specific prompts from history for common ward procedures.",
    canonical: typeof window !== "undefined" ? window.location.href : undefined,
  });

  const [procedure, setProcedure] = useState<ProcedureId | undefined>("iv_cannulation");
  const [history, setHistory] = useState("");

  const issues = useMemo(() => (procedure ? analyzeHistory(history, procedure) : []), [history, procedure]);
  const info = useMemo(() => (procedure ? getProcedureInfo(procedure) : undefined), [procedure]);

  return (
    <div>
      {/* Page meta */}
      <header className="w-full border-b">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Procedure Safety Assistant</h1>
              <p className="text-muted-foreground mt-1">Designed for junior doctors — quick safety checks before common procedures.</p>
            </div>
            <Link to="/">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <section className="grid gap-6 md:grid-cols-5">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Stethoscope className="h-5 w-5" /> Select procedure</CardTitle>
              <CardDescription>Choose the procedure and paste a short patient history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={procedure} onValueChange={(v) => setProcedure(v as ProcedureId)}>
                <SelectTrigger aria-label="Procedure">
                  <SelectValue placeholder="Select a procedure" />
                </SelectTrigger>
                <SelectContent>
                  {allProcedures.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <label className="mb-2 block text-sm font-medium">Brief patient history/notes</label>
                <Textarea
                  placeholder="e.g. 78F with AF on apixaban. Left-sided lymphoedema post-mastectomy. Facial trauma from fall yesterday."
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  rows={8}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: mention anticoagulants, allergies (latex/chlorhexidine), recent trauma/surgery, neurological signs, AV fistula, etc.
                </p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Clinical judgement required</AlertTitle>
                <AlertDescription>
                  Educational tool only. Always follow local policy and seek senior help when uncertain.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Overview</CardTitle>
                <CardDescription>{info?.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Equipment</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {info?.equipment.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Contraindications</h3>
                    <div className="flex flex-wrap gap-2">
                      {info?.contraindications.map((c, i) => (
                        <Badge key={i} variant="secondary">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Considerations</h3>
                    <div className="flex flex-wrap gap-2">
                      {info?.considerations.map((c, i) => (
                        <Badge key={i} variant="outline">{c}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="prompts">
              <TabsList>
                <TabsTrigger value="prompts">Patient-specific prompts</TabsTrigger>
                <TabsTrigger value="redflags">Red flags</TabsTrigger>
              </TabsList>
              <TabsContent value="prompts">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Syringe className="h-5 w-5" /> What to consider now</CardTitle>
                    <CardDescription>Generated from the history you entered.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {issues.filter(i => i.category !== "red-flag").length === 0 ? (
                      <p className="text-muted-foreground">Add relevant history to see tailored prompts.</p>
                    ) : (
                      <ul className="space-y-2">
                        {issues
                          .filter((i) => i.category !== "red-flag")
                          .map((i, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className={`mt-1 h-2 w-2 rounded-full ${i.severity === "high" ? "bg-destructive" : i.severity === "medium" ? "bg-primary" : "bg-muted"}`}></span>
                              <span>{i.text}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="redflags">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Red flags</CardTitle>
                    <CardDescription>Urgent items to address before proceeding.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {issues.filter(i => i.category === "red-flag").length === 0 ? (
                      <p className="text-muted-foreground">No red flags detected from current text. Use clinical judgement.</p>
                    ) : (
                      <ul className="list-disc pl-5 space-y-2">
                        {issues
                          .filter((i) => i.category === "red-flag")
                          .map((i, idx) => (
                            <li key={idx}>{i.text}</li>
                          ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {info?.redFlags && info.redFlags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Procedure-specific red flags</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {info.redFlags.map((rf, i) => (
                      <li key={i}>{rf}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {info?.references && info.references.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>References</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {info.references.map((r, i) => (
                      <li key={i}><a className="underline" href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
          Not medical advice. For education only. Follow local policies and consult seniors.
        </div>
      </footer>
    </div>
  );
}
