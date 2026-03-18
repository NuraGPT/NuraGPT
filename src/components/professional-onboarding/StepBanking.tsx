import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepBankingProps {
  data: { iban: string; swift: string };
  onChange: (data: StepBankingProps["data"]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepBanking({ data, onChange, onNext, onBack }: StepBankingProps) {
  const isValid = data.iban.trim().length >= 15;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Datos de cobro</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Los pagos se procesarán a esta cuenta cuando tus revisiones sean aprobadas.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="iban" className="text-sm">
            IBAN
          </Label>
          <Input
            id="iban"
            placeholder="ES12 3456 7890 1234 5678 9012"
            value={data.iban}
            className="font-mono tracking-wide"
            onChange={(e) => onChange({ ...data, iban: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="swift" className="text-sm">
            SWIFT / BIC (opcional)
          </Label>
          <Input
            id="swift"
            placeholder="ABCDESMMXXX"
            value={data.swift}
            className="font-mono"
            onChange={(e) => onChange({ ...data, swift: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Continuar
        </Button>
      </div>
    </div>
  );
}

