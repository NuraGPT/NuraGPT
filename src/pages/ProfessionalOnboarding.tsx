import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OnboardingStepper } from "@/components/professional-onboarding/OnboardingStepper";
import { StepIdentity } from "@/components/professional-onboarding/StepIdentity";
import { StepCredentials } from "@/components/professional-onboarding/StepCredentials";
import { StepBanking } from "@/components/professional-onboarding/StepBanking";
import { StepContract } from "@/components/professional-onboarding/StepContract";

export default function ProfessionalOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [identity, setIdentity] = useState({
    fullName: "",
    dateOfBirth: "",
    dniFront: null as File | null,
    dniBack: null as File | null,
  });

  const [credentials, setCredentials] = useState({
    licenseId: "",
    countryCode: "",
  });

  const [banking, setBanking] = useState({
    iban: "",
    swift: "",
  });

  const nextAfterAuth = useMemo(
    () => encodeURIComponent("/professional/onboarding"),
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!data.user) {
        navigate(`/auth?mode=login&role=psychologist&next=${nextAfterAuth}`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, nextAfterAuth]);

  const upsertPendingInProfiles = async (userId: string) => {
    try {
      await supabase
        .from("profiles")
        .update({ role: "psychologist", verification_status: "pending" } as any)
        .eq("id", userId);
    } catch {
      // ignore
    }
  };

  const handleSign = async (signatureSvg: string) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Debes iniciar sesión para completar el onboarding.");
        return;
      }

      // Upload DNI files (store paths; you can later generate signed URLs server-side)
      let dniFrontPath = "";
      let dniBackPath = "";

      if (identity.dniFront) {
        const ext = identity.dniFront.name.split(".").pop();
        const path = `dni/${user.id}/${Date.now()}-front.${ext}`;
        const { error } = await supabase.storage.from("documents").upload(path, identity.dniFront);
        if (error) throw error;
        dniFrontPath = path;
      }

      if (identity.dniBack) {
        const ext = identity.dniBack.name.split(".").pop();
        const path = `dni/${user.id}/${Date.now()}-back.${ext}`;
        const { error } = await supabase.storage.from("documents").upload(path, identity.dniBack);
        if (error) throw error;
        dniBackPath = path;
      }

      // Prefer dedicated table (as in gateway). If it doesn't exist, fallback to profiles.
      const { error } = await supabase.from("psychologists").insert({
        user_id: user.id,
        full_name: identity.fullName,
        date_of_birth: identity.dateOfBirth,
        dni_front_url: dniFrontPath,
        dni_back_url: dniBackPath,
        license_id: credentials.licenseId,
        country_code: credentials.countryCode,
        iban_encrypted: banking.iban,
        swift: banking.swift,
        signature_svg: signatureSvg,
        contract_signed_at: new Date().toISOString(),
        verification_status: "pending",
      } as any);

      if (error) {
        await upsertPendingInProfiles(user.id);
      } else {
        await upsertPendingInProfiles(user.id);
      }

      toast.success("Solicitud enviada. Queda pendiente de aprobación.");
      navigate("/professional/dashboard");
    } catch (err: any) {
      toast.error(err.message || "No se pudo enviar tu solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-[560px]">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl text-foreground">Acreditación profesional</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Los datos inconsistentes pueden retrasar la verificación o provocar rechazo.
          </p>
        </div>

        <OnboardingStepper currentStep={step} />

        <div className="glass-surface rounded-2xl p-6">
          {step === 0 && <StepIdentity data={identity} onChange={setIdentity} onNext={() => setStep(1)} />}
          {step === 1 && (
            <StepCredentials
              data={credentials}
              onChange={setCredentials}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <StepBanking data={banking} onChange={setBanking} onNext={() => setStep(3)} onBack={() => setStep(1)} />
          )}
          {step === 3 && <StepContract onSign={handleSign} onBack={() => setStep(2)} isSubmitting={isSubmitting} />}
        </div>
      </div>
    </div>
  );
}

