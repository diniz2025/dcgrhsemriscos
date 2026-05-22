import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./ScrollReveal";

const LgpdSection = () => (
  <section id="lgpd" className="scroll-anchor py-[72px] bg-surface">
    <motion.div
      className="max-w-[800px] mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        <span className="font-mono text-xs tracking-widest uppercase text-primary font-medium">LGPD</span>
      </motion.div>
      <motion.h2 variants={staggerItem} className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight mb-4">
        LGPD e dados de saúde
      </motion.h2>
      <motion.p variants={staggerItem} className="text-sm text-muted-foreground leading-relaxed mb-6">
        A gestão de riscos psicossociais envolve dados sensíveis de saúde dos trabalhadores. A empresa deve garantir conformidade com a LGPD (Lei 13.709/2018) em todo o processo.
      </motion.p>
      <motion.div variants={staggerItem} className="space-y-3">
        {[
          "Dados de saúde são dados sensíveis — exigem consentimento específico ou base legal adequada.",
          "Pesquisas de clima devem ser anônimas sempre que possível.",
          "Relatórios de SST não devem identificar indivíduos sem necessidade.",
          "O DPO (Encarregado de Dados) deve ser consultado nos processos de SST.",
        ].map((item, i) => (
          <div key={i} className="pill-item p-4 flex items-start gap-3">
            <span className="text-primary font-bold">•</span>
            <p className="text-sm text-foreground">{item}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default LgpdSection;
