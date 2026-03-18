import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CASE_CATEGORIES = ["Ansiedad", "Estrés laboral", "Depresión", "Burnout", "Relaciones", "Duelo"];

const MOCK_CASES = [
  { id: "C-2026-001", category: "Ansiedad", summary: "Ansiedad generalizada con disparadores laborales", urgency: "Standard" },
  { id: "C-2026-002", category: "Estrés laboral", summary: "Burnout ejecutivo con síntomas somáticos", urgency: "Priority" },
  { id: "C-2026-003", category: "Depresión", summary: "Episodio depresivo mayor, 6 meses de evolución", urgency: "Standard" },
  { id: "C-2026-004", category: "Burnout", summary: "Fatiga por compasión en personal sanitario", urgency: "Standard" },
  { id: "C-2026-005", category: "Relaciones", summary: "Ajuste post-separación con rumiación", urgency: "Priority" },
  { id: "C-2026-006", category: "Duelo", summary: "Duelo complicado con culpa persistente", urgency: "Standard" },
];

type VerificationStatus = "pending" | "verified" | "rejected";

function VerificationOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md bg-background/40 rounded-2xl">
      <div className="glass-surface rounded-2xl p-6 max-w-sm text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 mb-4">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-sage" />
          <span className="text-xs font-medium text-amber-700">Pendiente de aprobación</span>
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2">Cuenta en verificación</h3>
        <p className="text-sm text-muted-foreground">
          El equipo revisa tus credenciales normalmente en 24–48 horas. Te avisaremos por email cuando tu cuenta sea aprobada.
        </p>
      </div>
    </div>
  );
}

function ReviewModal({
  caseItem,
  onClose,
  onSubmit,
}: {
  caseItem: (typeof MOCK_CASES)[0];
  onClose: () => void;
  onSubmit: (content: string, timeSpent: number) => void;
}) {
  const [content, setContent] = useState("");
  const [showCertify, setShowCertify] = useState(false);
  const [startTs, setStartTs] = useState<number | null>(null);

  const handleFocus = () => {
    if (!startTs) setStartTs(Date.now());
  };

  const handleCertify = () => {
    const timeSpent = startTs ? Math.round((Date.now() - startTs) / 1000) : 0;
    onSubmit(content, timeSpent);
  };

  if (showCertify) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
        <div className="glass-surface rounded-2xl p-6 max-w-md w-full mx-4">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-foreground">Declaración de integridad</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Certifico que esta revisión fue realizada personalmente y sin asistencia de IA generativa. Entiendo que incumplir
                esta declaración es causal de terminación y reporte a autoridades competentes.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowCertify(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCertify}>Certificar y enviar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
      <div className="glass-surface rounded-2xl p-6 max-w-lg w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Revisión: {caseItem.id}</h3>
            <p className="text-sm text-muted-foreground">{caseItem.summary}</p>
          </div>
          <span className="text-xs font-mono text-muted-foreground px-2 py-1 bg-secondary rounded">{caseItem.category}</span>
        </div>

        <textarea
          className="w-full h-48 p-3 rounded-lg bg-input text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Escribe tu análisis profesional..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={handleFocus}
        />

        <div className="flex justify-between items-center mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => setShowCertify(true)} disabled={content.trim().length < 50}>
            Enviar revisión
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalDashboard() {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("pending");
  const isPending = verificationStatus === "pending";
  const [selectedCase, setSelectedCase] = useState<(typeof MOCK_CASES)[0] | null>(null);
  const [filter, setFilter] = useState<string>("Todos");

  const nextAfterAuth = useMemo(() => encodeURIComponent("/professional/dashboard"), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (cancelled) return;
      if (!user) {
        navigate(`/auth?mode=login&role=psychologist&next=${nextAfterAuth}`);
        return;
      }

      // Try psychologists table first, then profiles as fallback
      try {
        const { data: row, error } = await supabase
          .from("psychologists")
          .select("verification_status")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!cancelled) {
          if (!error && row?.verification_status) setVerificationStatus(row.verification_status as VerificationStatus);
        }
      } catch {
        // ignore
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("verification_status")
          .eq("id", user.id)
          .maybeSingle();
        if (!cancelled) {
          if (!error && profile?.verification_status) setVerificationStatus(profile.verification_status as VerificationStatus);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, nextAfterAuth]);

  const filteredCases =
    filter === "Todos" ? MOCK_CASES : MOCK_CASES.filter((c) => c.category === filter);

  const handleSubmitReview = (content: string, timeSpent: number) => {
    const aiFlag = timeSpent < 120;
    console.log("Review submitted:", {
      caseId: selectedCase?.id,
      contentLength: content.length,
      timeSpentSeconds: timeSpent,
      flaggedForAiScrutiny: aiFlag,
    });
    toast.success("Revisión enviada.");
    setSelectedCase(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-foreground">Panel de casos</h1>
          {isPending && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-sage" />
              <span className="text-xs font-medium text-amber-700">Pendiente</span>
            </div>
          )}
          {verificationStatus === "verified" && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-700">Verificado</span>
            </div>
          )}
          {verificationStatus === "rejected" && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              <span className="text-xs font-medium text-destructive">Rechazado</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono">$0.00</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/professional/transactions")}>
            Transacciones
          </Button>
          <Button size="sm" onClick={() => navigate("/professional/reviews")} disabled={isPending}>
            Revisiones Pro
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="relative">
          <div className="glass-surface rounded-2xl p-5">
            {isPending && <VerificationOverlay />}

            <div className="mb-4 flex items-center gap-2 flex-wrap">
              {["Todos", ...CASE_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => !isPending && setFilter(cat)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    filter === cat ? "bg-foreground text-background" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-3">
              {filteredCases.map((c) => (
                <div key={c.id} className="bg-secondary/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-medium text-foreground">{c.id}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                          {c.category}
                        </span>
                        {c.urgency === "Priority" && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700">Prioridad</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{c.summary}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => !isPending && setSelectedCase(c)} disabled={isPending}>
                    Revisar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {selectedCase && <ReviewModal caseItem={selectedCase} onClose={() => setSelectedCase(null)} onSubmit={handleSubmitReview} />}
    </div>
  );
}

