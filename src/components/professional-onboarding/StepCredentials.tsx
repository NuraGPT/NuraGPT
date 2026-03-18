import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const countries = [
  { code: "ES", name: "España" },
  { code: "MX", name: "México" },
  { code: "AR", name: "Argentina" },
  { code: "CO", name: "Colombia" },
  { code: "CL", name: "Chile" },
  { code: "PE", name: "Perú" },
  { code: "US", name: "Estados Unidos" },
  { code: "GB", name: "Reino Unido" },
  { code: "DE", name: "Alemania" },
  { code: "FR", name: "Francia" },
];

interface StepCredentialsProps {
  data: { licenseId: string; countryCode: string };
  onChange: (data: StepCredentialsProps["data"]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCredentials({ data, onChange, onNext, onBack }: StepCredentialsProps) {
  const isValid = data.licenseId.trim() && data.countryCode;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Credenciales</h2>
        <p className="text-sm text-muted-foreground mt-1">Ingresa tus datos de colegiación/licencia para verificación.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="licenseId" className="text-sm">
            Número de licencia
          </Label>
          <Input
            id="licenseId"
            placeholder="PSI-2024-0001234"
            value={data.licenseId}
            className="font-mono"
            onChange={(e) => onChange({ ...data, licenseId: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">Tal y como aparece en tu registro profesional.</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">País de licencia</Label>
          <Select value={data.countryCode} onValueChange={(v) => onChange({ ...data, countryCode: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un país" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

