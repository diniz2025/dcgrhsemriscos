import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./ScrollReveal";

const models = [
  { icon: "📄", title: "Modelo de PGR", desc: "Estrutura básica do Programa de Gerenciamento de Riscos." },
  { icon: "📋", title: "Inventário de Riscos", desc: "Template para mapear riscos por atividade/função." },
  { icon: "🎓", title: "Ata de Treinamento", desc: "Modelo de registro de treinamento com lista de presença." },
  { icon: "📝", title: "Ordem de Serviço", desc: "Modelo de OS com riscos e medidas por função." },
];

const ModelosSection = () => (
  <section id="modelos" className="scroll-anchor py-[72px]">
    <motion.div
      className="max-w-[1140px] mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        <span className="font-mono text-xs tracking-widest uppercase text-primary font-medium">Modelos</span>
      </motion.div>
      <motion.h2 variants={staggerItem} className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight mb-4">
        Modelos e templates
      </motion.h2>
      <motion.p variants={staggerItem} className="text-sm text-muted-foreground max-w-[560px] mb-8">
        Modelos de documentos para ajudar na adequação. Use como referência — adapte à sua realidade.
      </motion.p>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer}>
        {models.map((m) => (
          <motion.div key={m.title} variants={staggerItem} className="pill-item p-6 text-center hover:border-primary/30 transition-colors">
            <span className="text-3xl block mb-3">{m.icon}</span>
            <div className="font-semibold text-sm mb-1">{m.title}</div>
            <p className="text-xs text-muted-foreground">{m.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default ModelosSection;
