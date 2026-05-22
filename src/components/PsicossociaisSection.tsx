import { motion } from "framer-motion";
import { staggerContainer, staggerItem, staggerItemScale } from "./ScrollReveal";

const risks = [
  { icon: "😤", title: "Estresse Ocupacional", desc: "Pressão excessiva, metas inalcançáveis, sobrecarga constante." },
  { icon: "🚫", title: "Assédio Moral e Sexual", desc: "Comportamentos que humilham, constrangem ou intimidam colaboradores." },
  { icon: "⚡", title: "Sobrecarga de Trabalho", desc: "Jornadas extensas, ausência de pausas e acúmulo de funções." },
  { icon: "🎯", title: "Pressão por Metas", desc: "Metas inalcançáveis com ameaça de punição geram ansiedade crônica." },
  { icon: "🔇", title: "Falta de Autonomia", desc: "Microgerenciamento e ausência de participação nas decisões." },
  { icon: "💔", title: "Falta de Reconhecimento", desc: "Ausência de feedback e desvalorização do esforço." },
];

const PsicossociaisSection = () => (
  <section id="psicossociais" className="scroll-anchor bg-ink relative overflow-hidden py-[72px]">
    <motion.div
      className="relative z-10 max-w-[1140px] mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-[#FFB088] rounded-full" />
        <span className="font-mono text-xs tracking-widest uppercase text-[#FFB088] font-medium">Portaria 1.419/2024</span>
      </motion.div>
      <motion.h2 variants={staggerItem} className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight text-primary-foreground mb-4">
        Riscos Psicossociais:<br />a nova fronteira da NR-1
      </motion.h2>
      <motion.p variants={staggerItem} className="text-sm text-primary-foreground/60 max-w-[560px] mb-10">
        A partir da Portaria 1.419/2024, as empresas devem identificar, avaliar e controlar riscos psicossociais no ambiente de trabalho.
      </motion.p>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={staggerContainer}>
        {risks.map((r) => (
          <motion.div key={r.title} variants={staggerItemScale} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6 backdrop-blur-sm">
            <span className="text-3xl block mb-3">{r.icon}</span>
            <div className="font-semibold text-sm text-primary-foreground mb-2">{r.title}</div>
            <p className="text-xs text-primary-foreground/50 leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default PsicossociaisSection;
