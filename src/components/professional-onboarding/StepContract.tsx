import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SignatureCanvas } from "./SignatureCanvas";

interface StepContractProps {
  onSign: (svg: string) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const CONTRACT_TEXT = `CONTRATO DE INTEGRIDAD PROFESIONAL Y PRESTACIÓN DE SERVICIOS

Este contrato ("Contrato") se celebra entre el Profesional ("Tú") y la Plataforma al completar el proceso de acreditación.

ARTÍCULO 1 — ALCANCE
1.1 Te comprometes a realizar revisiones profesionales de casos a través de la Plataforma.
1.2 Cada revisión debe realizarse personalmente y con diligencia profesional.

ARTÍCULO 2 — COMPENSACIÓN
2.1 Recibirás USD $5.00 (cinco dólares estadounidenses) por cada caso revisado y aprobado.
2.2 El pago se procesará a la cuenta bancaria indicada durante el onboarding, dentro de los 30 días hábiles posteriores a la aprobación.
2.3 La Plataforma podrá retener pagos en revisiones con incidencias de calidad o cumplimiento.

ARTÍCULO 3 — PROHIBICIÓN DE USO DE IA GENERATIVA
3.1 Queda estrictamente prohibido usar herramientas de inteligencia artificial generativa para producir, redactar o modificar sustancialmente revisiones de casos.
3.2 La violación de esta cláusula es causal de terminación inmediata, pérdida de pagos pendientes y reporte a autoridades competentes.
3.3 La Plataforma utiliza sistemas automatizados y revisión manual para detectar contenido generado por IA.

ARTÍCULO 4 — REPORTE INTERNACIONAL DE MALA PRAXIS
4.1 Consientes que la Plataforma reporte incidentes verificados de mala praxis, fraude o violaciones éticas a las autoridades de tu jurisdicción.
4.2 Este consentimiento incluye el intercambio de credenciales, registros de revisión y evidencia de incumplimiento con organismos reguladores.

ARTÍCULO 5 — PROTECCIÓN DE DATOS
5.1 La información de casos es confidencial. Te comprometes a cumplir normativa aplicable (GDPR/HIPAA o equivalentes).
5.2 No almacenarás, copiarás ni transmitirás datos fuera del entorno seguro de la Plataforma.

ARTÍCULO 6 — TERMINACIÓN
6.1 Cualquiera de las partes puede terminar este Contrato con 30 días de aviso.
6.2 La Plataforma puede terminar inmediatamente por causa (uso de IA, brechas de datos, pérdida de licencia, etc.).

Al firmar, confirmas que has leído, entendido y aceptas todos los términos de este Contrato.`;

export function StepContract({ onSign, onBack, isSubmitting }: StepContractProps) {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    if (atBottom && !hasScrolledToEnd) setHasScrolledToEnd(true);
  }, [hasScrolledToEnd]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Contrato</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Debes leer el contrato completo. Desplázate hasta el final para habilitar la firma.
        </p>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-[280px] overflow-y-auto rounded-lg p-4 text-sm leading-relaxed bg-input"
      >
        <pre className="whitespace-pre-wrap font-sans text-foreground">{CONTRACT_TEXT}</pre>
      </div>

      {!hasScrolledToEnd && (
        <p className="text-xs text-muted-foreground text-center">↓ Desplázate al final para poder firmar</p>
      )}

      <div className="space-y-3">
        <SignatureCanvas onSign={onSign} disabled={!hasScrolledToEnd || isSubmitting} />
      </div>

      <div className="flex justify-start">
        <Button variant="ghost" onClick={onBack} disabled={isSubmitting}>
          Atrás
        </Button>
      </div>
    </div>
  );
}

