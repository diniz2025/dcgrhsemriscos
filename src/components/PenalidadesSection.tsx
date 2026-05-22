import { motion } from "framer-motion";
import { staggerContainer, staggerItem, staggerItemScale } from "./ScrollReveal";

const penalties = [
  { icon: "💰", label: "Ausência de PGR", value: "R$ 2.396 a R$ 6.708 por item" },
  { icon: "📋", label: "Inventário incompleto", value: "R$ 2.396 a R$ 6.708" },
  { icon: "🚫", label: "Embargo / Interdição", value: "Paralisação imediata + custos" },
  { icon: "⚖️", label: "Ação regressiva INSS", value: "Valor integral do benefício" },
];

const PenalidadesSection = () => (
  <section id="penalidades" className="scroll-anchor py-[72px] bg-surface">
    <motion.div
      className="max-w-[1140px] mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
        <span className="font-mono text-xs tracking-widest uppercase text-destructive font-medium">Consequências</span>
      </motion.div>

      <motion.div variants={staggerItem} className="relative bg-destructive rounded-3xl p-10 mb-6 overflow-hidden">
        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[5rem] leading-none opacity-[0.12] pointer-events-none">⚠</span>
        <h2 className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight text-destructive-foreground mb-2">
          O que acontece se não adequar?
        </h2>
        <p className="text-destructive-foreground/75 text-[0.95rem]">
          Multas administrativas, interdições, ações regressivas do INSS e responsabilidade civil e criminal.
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer}>
        {penalties.map((p) => (
          <motion.div key={p.label} variants={staggerItemScale} className="bg-card border border-border rounded-2xl p-6 text-center">
            <span className="text-3xl block mb-3">{p.icon}</span>
            <div className="font-mono text-[0.72rem] tracking-wider text-muted-foreground uppercase mb-2">{p.label}</div>
            <div className="font-display font-bold text-base text-destructive leading-tight">{p.value}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default PenalidadesSection;
