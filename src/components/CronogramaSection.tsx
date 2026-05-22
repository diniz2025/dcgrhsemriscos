import { motion } from "framer-motion";
import { staggerContainer, staggerItem, staggerItemLeft } from "./ScrollReveal";

const steps = [
  { date: "JAN 2022", title: "NR-1 entra em vigor com GRO/PGR", desc: "Todas as empresas passam a ser obrigadas a ter o PGR substituindo o antigo PPRA.", filled: true },
  { date: "AGO 2024", title: "Portaria MTE nº 1.419/2024", desc: "Inclui oficialmente os riscos psicossociais no escopo obrigatório do GRO/PGR.", filled: true },
  { date: "MAI 2025", title: "Portaria MTE nº 765/2025 — Prorrogação", desc: "Prorrogou por 1 ano a vigência do capítulo 1.5 (GRO). Início do período educativo.", filled: true },
  { date: "26 MAI 2026", title: "Fiscalização ativa com penalidades (previsto)", desc: "Data prevista para início das autuações.", warning: true },
];

const CronogramaSection = () => (
  <section id="cronograma" className="scroll-anchor py-16 bg-card">
    <div className="max-w-[1140px] mx-auto px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          <span className="font-mono text-xs tracking-widest uppercase text-primary font-medium">Cronograma</span>
        </motion.div>
        <motion.h2 variants={staggerItem} className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight mb-4">A linha do tempo da NR-1</motion.h2>
        <motion.p variants={staggerItem} className="text-sm text-muted-foreground mb-10">Entenda os marcos que levaram ao prazo atual.</motion.p>

        <div className="relative pl-8">
          <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/10" />
          <motion.div className="space-y-9" variants={staggerContainer}>
            {steps.map((s, i) => (
              <motion.div key={i} className="relative" variants={staggerItemLeft}>
                <div className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 z-10 ${
                  (s as any).warning ? "border-destructive bg-destructive" : s.filled ? "border-primary bg-primary" : "border-border bg-card"
                }`} />
                <div className="font-mono text-xs tracking-wider text-muted-foreground mb-1">{s.date}</div>
                <div className="font-semibold text-sm mb-1">{s.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CronogramaSection;
