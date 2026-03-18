import brandIcon from "@/assets/brand-icon.png";
import brandLockup from "@/assets/brand-lockup.png";
import { cn } from "@/lib/utils";

type BrandVariant = "icon" | "lockup";

export function Brand({
  variant = "lockup",
  className,
  alt = "NuraGPT",
}: {
  variant?: BrandVariant;
  className?: string;
  alt?: string;
}) {
  if (variant === "icon") {
    return <img src={brandIcon} alt={alt} className={cn("h-9 w-9", className)} />;
  }

  // lockup already includes icon + wordmark
  return (
    <img
      src={brandLockup}
      alt={alt}
      className={cn("h-10 w-auto", className)}
      style={{ imageRendering: "auto" }}
    />
  );
}

export function BrandIcon({ className, alt = "NuraGPT" }: { className?: string; alt?: string }) {
  return <img src={brandIcon} alt={alt} className={cn("h-9 w-9", className)} />;
}

export function BrandLockup({ className, alt = "NuraGPT" }: { className?: string; alt?: string }) {
  return <img src={brandLockup} alt={alt} className={cn("h-10 w-auto", className)} />;
}

