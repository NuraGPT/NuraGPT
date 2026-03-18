import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = ["Identidad", "Credenciales", "Cobro", "Contrato"];

interface OnboardingStepperProps {
  currentStep: number;
}

export function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  return (
    <nav className="flex items-center justify-center gap-1 mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-foreground text-background",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-sm transition-colors duration-200",
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground",
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn("w-8 h-px mx-3", index < currentStep ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

