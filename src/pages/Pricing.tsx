import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NURA_PLUS } from "@/lib/stripe";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const priceLabel = useMemo(() => {
    const amount = `${NURA_PLUS.price.toFixed(0)}€`;
    return `${amount}/${NURA_PLUS.interval === "month" ? "mes" : "año"}`;
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate(`/auth?mode=login&next=${encodeURIComponent("/pricing")}`);
        return;
      }

      const priceId = NURA_PLUS.price_id;
      if (!priceId || priceId.includes("REPLACE_WITH_YOUR_PRICE_ID")) {
        toast.error("Falta configurar `VITE_STRIPE_PRICE_ID_PLUS`.");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", { body: { priceId } });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("No se recibió URL de checkout.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error iniciando el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display text-3xl text-foreground">Obtener Plus</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Desbloquea supervisión profesional y funciones avanzadas.
          </p>
        </div>

        <div className="glass-surface rounded-2xl p-6 space-y-5">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{NURA_PLUS.name}</p>
              <p className="text-xs text-muted-foreground">Suscripción recurrente</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display text-foreground">{priceLabel}</p>
            </div>
          </div>

          <ul className="space-y-2">
            {NURA_PLUS.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <Button className="w-full" onClick={handleCheckout} disabled={loading}>
            {loading ? "Redirigiendo..." : "Continuar al pago"}
          </Button>

          <Button variant="ghost" className="w-full" onClick={() => navigate("/chat")}>
            Volver al chat
          </Button>
        </div>
      </div>
    </div>
  );
}

