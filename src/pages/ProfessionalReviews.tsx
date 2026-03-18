import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Review {
  id: string;
  user_id: string;
  status: string;
  priority: boolean;
  notes: string | null;
  session_data: any;
  created_at: string;
  locked: boolean;
}

export default function ProfessionalReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("case_reviews")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });
    setReviews((data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!data.user) {
        navigate(`/auth?mode=login&role=psychologist&next=${encodeURIComponent("/professional/reviews")}`);
        return;
      }
      await fetchReviews();
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSubmitReview = async () => {
    if (!selectedReview) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("complete-review", {
        body: { reviewId: selectedReview.id, notes: reviewNotes },
      });
      if (error) throw error;

      toast.success("Revisión validada. Se registró el pago (y payout si aplica).");
      setSelectedReview(null);
      setReviewNotes("");
      fetchReviews();
    } catch (err: any) {
      toast.error(err.message || "No se pudo completar la revisión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display text-foreground">Revisiones (Pro)</h1>
            <p className="text-sm text-muted-foreground mt-1">Revisiones pendientes de usuarios Pro.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/professional/dashboard")}>
            Volver al panel
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-surface p-4 h-20 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-surface p-8 text-center rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No hay revisiones pendientes en este momento.</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="glass-surface p-4 relative rounded-2xl"
                >
                  <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {review.priority ? (
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          Usuario: {review.user_id?.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-muted-foreground font-tabular">
                          {new Date(review.created_at).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>

                    <Badge variant={review.status === "completed" ? "default" : "secondary"}>
                      {review.status === "pending"
                        ? "Pendiente"
                        : review.status === "in_review"
                          ? "En revisión"
                          : "Completado"}
                    </Badge>

                    <Button
                      size="sm"
                      variant={review.locked ? "ghost" : "default"}
                      disabled={review.locked || review.status === "completed"}
                      onClick={() => {
                        setSelectedReview(review);
                        setReviewNotes(review.notes ?? "");
                      }}
                    >
                      {review.status === "completed" ? "Cerrado" : "Revisar"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <Sheet open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Revisión de sesión</SheetTitle>
            <SheetDescription>Revisa los datos de la sesión y envía tus notas clínicas.</SheetDescription>
          </SheetHeader>

          {selectedReview && (
            <div className="mt-6 space-y-4">
              <div className="glass-surface p-4 rounded-2xl">
                <p className="text-xs text-muted-foreground mb-1">ID de usuario</p>
                <p className="text-sm font-tabular text-foreground break-all">{selectedReview.user_id}</p>
              </div>

              {selectedReview.session_data && (
                <div className="glass-surface p-4 rounded-2xl">
                  <p className="text-xs text-muted-foreground mb-2">Datos de sesión</p>
                  <pre className="text-xs text-muted-foreground overflow-auto max-h-48">
                    {JSON.stringify(selectedReview.session_data, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Notas clínicas</p>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Escribe tus observaciones clínicas..."
                  rows={6}
                />
              </div>

              <Button onClick={handleSubmitReview} disabled={submitting} className="w-full" size="lg">
                {submitting ? "Procesando..." : "Enviar revisión"}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

