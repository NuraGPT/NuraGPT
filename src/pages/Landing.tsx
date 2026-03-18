import { motion } from "framer-motion";
import { ArrowRight, Brain, Shield, TreePine, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLockup } from "@/components/brand/Brand";

const features = [
  {
    icon: Brain,
    title: "Diagnóstico Silencioso",
    description: "La IA analiza patrones emocionales en segundo plano, sin interrumpir la conversación natural.",
  },
  {
    icon: Shield,
    title: "Validación Profesional",
    description: "Cada caso es revisado por psicólogos certificados que validan y refinan las intervenciones.",
  },
  {
    icon: TreePine,
    title: "Árbol de Crecimiento",
    description: "Visualiza tu progreso desde las raíces hasta los frutos de tu transformación personal.",
  },
  {
    icon: Users,
    title: "Ciclo de Retroalimentación",
    description: "Las correcciones profesionales mejoran continuamente la precisión de tu acompañamiento.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass-surface">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center">
            <BrandLockup className="h-9 md:h-10" />
          </div>
          <div className="flex items-center gap-6">
            <Link to="/auth?mode=login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Iniciar Sesión
            </Link>
            <Link
              to="/auth?mode=signup&role=patient"
              className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-sage" />
              <span className="text-xs text-muted-foreground tracking-wide uppercase">Terapia asistida por IA</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display leading-[1.1] mb-6 text-gradient-sage">
              Tu espejo <br className="hidden md:block" />
              <em>intencional</em>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              NuraGPT combina inteligencia artificial empática con validación profesional humana para guiarte desde la
              introspección hacia el cambio real.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/chat"
                className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
              >
                Habla con Nura
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/professional"
                className="flex items-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
              >
                Portal Profesional
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="glass-surface rounded-2xl p-8 glow-sage hover:border-sage-muted/50 transition-colors"
              >
                <f.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-display text-xl text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl text-gradient-sage mb-4">
            De la catarsis a la acción
          </h2>
          <p className="text-muted-foreground mb-8">
            No se trata de desahogar. Se trata de entender, reinterpretar y actuar.
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
          >
            Comienza tu proceso
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 NuraGPT. Todos los derechos reservados.</span>
          <span>Ingeniería Intencional</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
