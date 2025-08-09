import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  useEffect(() => {
    document.title = "Procedure Safety Assistant — Clear, Fast Checks";
    const meta = document.querySelector('meta[name="description"]');
    const text = "Quick contraindications, considerations, equipment and tailored prompts for junior doctors.";
    if (meta) meta.setAttribute("content", text);
    else {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      m.setAttribute("content", text);
      document.head.appendChild(m);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="text-center space-y-6 px-6">
        <h1 className="text-4xl font-bold tracking-tight">Procedure Safety Assistant</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get instant, patient-specific safety prompts plus equipment, contraindications and considerations for common ward procedures.
        </p>
        <Link to="/procedures">
          <Button size="lg">Open Assistant</Button>
        </Link>
      </main>
    </div>
  );
};

export default Index;
