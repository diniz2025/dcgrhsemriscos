import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./ScrollReveal";

const sectors = [
  { emoji: "🏨", label: "Hotéis e Pousadas" },
  { emoji: "🍽️", label: "Restaurantes e Bares" },
  { emoji: "🏥", label: "Hospitais e Clínicas" },
  { emoji: "🏗️", label: "Construção Civil" },
  { emoji: "🏭", label: "Indústria" },
  { emoji: "🏢", label: "Escritórios e TI" },
  { emoji: "🛒", label: "Comércio Varejista" },
  { emoji: "🚚", label: "Logística e Transporte" },
];

const AbrangenciaSection = () => (
  <section id="abrangencia" className="scroll-anchor py-[72px]">
    <motion.div
      className="max-w-[1140px] mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        <span className="font-mono text-xs tracking-widest uppercase text-primary font-medium">Abrangência</span>
      </motion.div>
      <motion.h2 variants={staggerItem} className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight mb-4">
        Quais setores são afetados?
      </motion.h2>
      <motion.p variants={staggerItem} className="text-sm text-muted-foreground max-w-[560px] mb-10">
        Todas as organizações com empregados CLT são obrigadas a cumprir a NR-1.
      </motion.p>

      <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4" variants={staggerContainer}>
        {sectors.map((s) => (
          <motion.div key={s.label} variants={staggerItem} className="pill-item text-center p-6 hover:border-primary/30 transition-colors">
            <span className="text-3xl block mb-3">{s.emoji}</span>
            <span className="text-sm font-semibold">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default AbrangenciaSection;
