import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Clock,
  DollarSign,
  FileText,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLockup } from "@/components/brand/Brand";

interface CaseItem {
  id: string;
  topic: string;
  severity: "baja" | "media" | "alta";
  days: number;
  summary: string;
}

const MOCK_CASES: CaseItem[] = [
  { id: "1", topic: "Ansiedad Generalizada", severity: "alta", days: 11, summary: "Paciente presenta rumiación constante sobre el futuro laboral. Patrón de evitación detectado." },
  { id: "2", topic: "Autoestima", severity: "media", days: 8, summary: "Creencia nuclear de insuficiencia. Relacionado con experiencias de invalidación en la infancia." },
  { id: "3", topic: "Duelo", severity: "alta", days: 11, summary: "Proceso de duelo complicado. Culpa del sobreviviente identificada como emoción predominante." },
];

const severityColor = {
  baja: "text-sage-foreground bg-sage-muted",
  media: "text-cream bg-secondary",
  alta: "text-destructive bg-destructive/10",
};

const Psychologist = () => {
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <BrandLockup className="h-8 md:h-9" />
            <span className="font-display text-lg text-foreground">Portal Profesional</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5" />
              <span>3 revisiones completadas · $15.00</span>
            </div>
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Salir
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: FileText, label: "Casos Pendientes", value: "3" },
            { icon: ClipboardCheck, label: "Revisiones Hoy", value: "1" },
            { icon: Clock, label: "Tiempo Promedio", value: "12 min" },
          ].map((s) => (
            <div key={s.label} className="glass-surface rounded-xl p-5">
              <s.icon className="w-4 h-4 text-primary mb-2" />
              <p className="text-2xl font-display text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {!selectedCase ? (
          /* Case List */
          <div>
            <h2 className="font-display text-2xl text-foreground mb-4">Casos Pendientes</h2>
            <div className="space-y-3">
              {MOCK_CASES.map((c, i) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedCase(c)}
                  className="w-full glass-surface rounded-xl p-5 text-left hover:border-primary/30 transition-colors flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{c.topic}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${severityColor[c.severity]}`}>
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.summary}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{c.days} días de datos acumulados</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* Split Screen Review */
          <div>
            <button
              onClick={() => setSelectedCase(null)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              ← Volver a casos
            </button>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left: Diagnostic File */}
              <div className="glass-surface rounded-xl p-6 space-y-4">
                <h3 className="font-display text-lg text-foreground">Fichero Diagnóstico</h3>
                <div className="space-y-3 text-sm">
                  <DiagBlock label="Síntoma Visible" value="Preocupación constante, dificultad para dormir." />
                  <DiagBlock label="Emoción Asociada" value="Miedo al fracaso, sensación de no ser suficiente." />
                  <DiagBlock label="Creencia Oculta" value="'Si no controlo todo, algo terrible va a pasar.'" />
                  <DiagBlock label="Raíz" value="Experiencia de inestabilidad en la infancia. Padre ausente emocionalmente." />
                  <DiagBlock label="Reinterpretación" value="El control es una estrategia aprendida, no una necesidad real." />
                  <DiagBlock label="Nueva Acción" value="Practicar la delegación en tareas de bajo riesgo." />
                </div>
              </div>

              {/* Right: Validation */}
              <div className="glass-surface rounded-xl p-6 space-y-5">
                <h3 className="font-display text-lg text-foreground">Validación Profesional</h3>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    ¿Qué necesita este paciente?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Escribe tu valoración..."
                    className="w-full bg-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    ¿Qué es lo que menos necesita?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Escribe tu valoración..."
                    className="w-full bg-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-lg px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                  <Sparkles className="w-4 h-4" />
                  Generar Propuesta de Intervención
                </button>
                <button className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
                  Aprobar y Enviar Revisión — $5.00
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DiagBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="border-l-2 border-primary/30 pl-3">
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
    <p className="text-foreground leading-relaxed">{value}</p>
  </div>
);

export default Psychologist;
