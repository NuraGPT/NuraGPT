import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LedgerEntry {
  id: string;
  type: string;
  amount: number;
  currency: string;
  user_id: string | null;
  recipient_id: string | null;
  description: string | null;
  created_at: string;
}

export default function ProfessionalTransactions() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        navigate(`/auth?mode=login&role=psychologist&next=${encodeURIComponent("/professional/transactions")}`);
        return;
      }

      const { data: rows } = await supabase
        .from("platform_ledger")
        .select("*")
        .or(`recipient_id.eq.${user.id},recipient_id.is.null`)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        setEntries((rows ?? []) as any);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display text-foreground">Transacciones</h1>
            <p className="text-sm text-muted-foreground mt-1">Registro contable de pagos y liquidaciones.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/professional/dashboard")}>
            Volver al panel
          </Button>
        </div>

        <div className="glass-surface overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Usuario</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Ingreso</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Gasto</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Psicólogo</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Cargando...
                    </td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No hay transacciones registradas.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => {
                    const isInbound = entry.type === "subscription_payment";
                    const isOutbound = entry.type === "professional_service_fee";
                    return (
                      <tr key={entry.id} className="border-b border-border/40 last:border-0">
                        <td className="px-4 py-3 text-xs font-tabular text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString("es-ES")}
                        </td>
                        <td className="px-4 py-3 text-xs font-tabular text-foreground">
                          {entry.user_id?.slice(0, 8) ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-sm font-tabular text-foreground">
                          {isInbound ? `${entry.amount.toFixed(2)}€` : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm font-tabular text-muted-foreground">
                          {isOutbound ? `−${entry.amount.toFixed(2)}€` : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs font-tabular text-foreground">
                          {entry.recipient_id?.slice(0, 8) ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">
                            Liquidado
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

