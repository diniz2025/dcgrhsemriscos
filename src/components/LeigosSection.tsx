import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./ScrollReveal";

const terms = [
  { term: "NR-1", def: "Norma Regulamentadora nº 1 — norma geral de segurança e saúde no trabalho." },
  { term: "GRO", def: "Gerenciamento de Riscos Ocupacionais — processo contínuo de identificar, avaliar e controlar riscos." },
  { term: "PGR", def: "Programa de Gerenciamento de Riscos — documento obrigatório que substituiu o PPRA." },
  { term: "Riscos Psicossociais", def: "Fatores do ambiente de trabalho que afetam a saúde mental: estresse, assédio, sobrecarga." },
  { term: "eSocial", def: "Sistema do governo para envio digital de informações trabalhistas, incluindo SST." },
];

const LeigosSection = () => (
  <section id="leigos" className="scroll-anchor py-[72px] bg-surface">
    <motion.div
      className="max-w-[800px] mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        <span className="font-mono text-xs tracking-widest uppercase text-primary font-medium">Para Leigos</span>
      </motion.div>
      <motion.h2 variants={staggerItem} className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight mb-4">
        Glossário simplificado
      </motion.h2>
      <motion.p variants={staggerItem} className="text-sm text-muted-foreground mb-8">
        Entenda os termos técnicos de forma simples e direta.
      </motion.p>

      <motion.div className="space-y-3" variants={staggerContainer}>
        {terms.map((t) => (
          <motion.div key={t.term} variants={staggerItem} className="pill-item p-5">
            <div className="font-display font-bold text-sm text-ivi-orange mb-1">{t.term}</div>
            <p className="text-sm text-muted-foreground">{t.def}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default LeigosSection;
