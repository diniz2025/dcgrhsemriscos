import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CtaSection = () => (
  <section className="bg-ink py-16 relative overflow-hidden">
    <motion.div
      className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[radial-gradient(circle,hsl(var(--ivi-orange)/0.2),transparent_65%)] pointer-events-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    />
    <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
      <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight text-primary-foreground mb-4">
        Pronto para se adequar à NR-1?
      </h2>
      <p className="text-primary-foreground/60 mb-8 max-w-[500px] mx-auto">
        Acesse a plataforma IVI e tenha controle completo: CRM, financeiro, parceiros e gestão de SST em um só lugar.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-ivi-orange text-primary-foreground rounded-full font-display font-bold hover:bg-ivi-orange-dark transition-all shadow-[0_4px_20px_hsl(var(--ivi-orange)/0.4)]"
        >
          Acessar Plataforma →
        </Link>
        <a
          href="#contato"
          className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-primary-foreground border border-primary-foreground/20 rounded-full font-medium hover:bg-primary-foreground/[0.08] transition-all"
        >
          Falar com a Carol
        </a>
      </div>
    </div>
  </section>
);

export default CtaSection;
