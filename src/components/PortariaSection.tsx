import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./ScrollReveal";

const mudancas = [
  { titulo: "Inclusão obrigatória de riscos psicossociais", desc: "O GRO/PGR deve contemplar fatores psicossociais no inventário de riscos e no plano de ação.", tag: "Nova exigência" },
  { titulo: "Avaliação contínua e participativa", desc: "A identificação de riscos deve ser contínua, envolvendo consulta aos trabalhadores.", tag: "Nova exigência" },
  { titulo: "Medidas de prevenção com evidência", desc: "A empresa precisa demonstrar ações concretas de prevenção e controle.", tag: "Reforço" },
  { titulo: "Prazo de adequação: 26/05/2026", desc: "As empresas têm até 26 de maio de 2026 para adequar o PGR.", tag: "Prazo" },
];

const tagColor: Record<string, string> = {
  "Nova exigência": "badge-red",
  "Reforço": "badge-amber",
  "Prazo": "badge-red",
};

const PortariaSection = () => (
  <section id="portaria" className="scroll-anchor py-[72px]">
    <motion.div
      className="max-w-[1140px] mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        <span className="font-mono text-xs tracking-widest uppercase text-primary font-medium">Portaria MTE nº 1.419/2024</span>
      </motion.div>
      <motion.h2 variants={staggerItem} className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight mb-4">
        Principais alterações normativas
      </motion.h2>
      <motion.p variants={staggerItem} className="text-sm text-muted-foreground max-w-[560px] mb-10">
        Publicada em <strong className="text-foreground">27 de agosto de 2024</strong>, aprovou a nova redação do capítulo 1.5 (GRO).
      </motion.p>

      <motion.div className="space-y-3" variants={staggerContainer}>
        {mudancas.map((m, i) => (
          <motion.div key={i} variants={staggerItem} className="pill-item flex flex-col sm:flex-row sm:items-start gap-3 p-5">
            <span className={`badge ${tagColor[m.tag]} flex-shrink-0 self-start`}>{m.tag}</span>
            <div>
              <strong className="text-sm block mb-1">{m.titulo}</strong>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default PortariaSection;
