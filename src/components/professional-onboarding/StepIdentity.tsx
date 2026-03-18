import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Upload } from "lucide-react";

interface StepIdentityProps {
  data: {
    fullName: string;
    dateOfBirth: string;
    dniFront: File | null;
    dniBack: File | null;
  };
  onChange: (data: StepIdentityProps["data"]) => void;
  onNext: () => void;
}

function DniDropzone({
  label,
  file,
  onFile,
}: {
  label: string;
  file: File | null;
  onFile: (f: File) => void;
}) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  return (
    <label
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg cursor-pointer transition-colors hover:bg-secondary border border-dashed border-border bg-input/40"
    >
      {file ? (
        <div className="flex items-center gap-2 text-sm">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="text-foreground font-medium truncate max-w-[200px]">{file.name}</span>
        </div>
      ) : (
        <>
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </>
      )}
      <input
        type="file"
        className="hidden"
        accept="image/*,.pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </label>
  );
}

export function StepIdentity({ data, onChange, onNext }: StepIdentityProps) {
  const isValid = data.fullName.trim() && data.dateOfBirth && data.dniFront && data.dniBack;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Identidad</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Asegúrate de que los datos coincidan con tu identificación oficial.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-sm">
            Nombre legal completo
          </Label>
          <Input
            id="fullName"
            placeholder="María García López"
            value={data.fullName}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dob" className="text-sm">
            Fecha de nacimiento
          </Label>
          <Input
            id="dob"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">DNI / Identificación</Label>
          <div className="grid grid-cols-2 gap-3">
            <DniDropzone label="Sube el frente" file={data.dniFront} onFile={(f) => onChange({ ...data, dniFront: f })} />
            <DniDropzone label="Sube el reverso" file={data.dniBack} onFile={(f) => onChange({ ...data, dniBack: f })} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onNext} disabled={!isValid}>
          Continuar
        </Button>
      </div>
    </div>
  );
}

