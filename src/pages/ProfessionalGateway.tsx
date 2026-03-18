import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, FileCheck, Shield } from "lucide-react";
import { BrandLockup } from "@/components/brand/Brand";

export default function ProfessionalGateway() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="glass-surface rounded-2xl p-8">
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center">
              <BrandLockup className="h-10" />
            </div>
            <span className="block font-display text-2xl text-foreground">Portal Profesional</span>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            Verificación de identidad y credenciales para psicólogos/as que revisan casos.
          </p>

          <div className="space-y-4 text-left mb-8">
            {[
              { icon: Shield, title: "Verificación de identidad", desc: "Documentación oficial y validación de licencia" },
              { icon: FileCheck, title: "Contrato vinculante", desc: "Firma digital con cláusulas de integridad profesional" },
              { icon: Clock, title: "Distribución de casos", desc: "USD $5.00 por caso revisado con control de calidad" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40">
                <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Button className="w-full" onClick={() => navigate("/professional/onboarding")}>
              Comenzar acreditación
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/professional/dashboard")}>
              Ir al panel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

