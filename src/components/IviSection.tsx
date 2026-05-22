import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./ScrollReveal";
import logoIvi from "@/assets/logo-ivi.png";

const IviSection = () => (
  <section id="ivi" className="scroll-anchor py-[72px]">
    <motion.div
      className="max-w-[800px] mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-ivi-orange rounded-full" />
        <span className="font-mono text-xs tracking-widest uppercase text-ivi-orange font-medium">Sobre a IVI</span>
      </motion.div>
      <motion.div variants={staggerItem} className="flex items-center gap-4 mb-6">
        <img src={logoIvi} alt="IVI" className="h-14" />
        <div>
          <h2 className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight">IVI Plataforma</h2>
          <p className="text-sm text-muted-foreground">Soluções integradas para segurança e saúde no trabalho</p>
        </div>
      </motion.div>
      <motion.p variants={staggerItem} className="text-[0.95rem] text-muted-foreground leading-relaxed mb-6">
        A IVI é uma plataforma completa que conecta empresas, parceiros e profissionais de SST. Oferecemos ferramentas de gestão, CRM profissional, módulo financeiro e controle de comissões para parceiros.
      </motion.p>
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { emoji: "🏢", title: "Para Empresas", desc: "Gestão completa de SST, NR-1, PGR e riscos psicossociais." },
          { emoji: "🤝", title: "Para Parceiros", desc: "Controle de comissões, pipeline de vendas e CRM integrado." },
          { emoji: "👷", title: "Para Profissionais", desc: "Ferramentas de auditoria, checklists e modelos prontos." },
        ].map((item) => (
          <div key={item.title} className="pill-item p-5 text-center">
            <span className="text-2xl block mb-2">{item.emoji}</span>
            <div className="font-semibold text-sm mb-1">{item.title}</div>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default IviSection;
