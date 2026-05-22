import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./ScrollReveal";
import { MessageCircle, Phone, Mail, Headphones } from "lucide-react";

const WHATSAPP = "5511982918252";
const SUPORTE = "5511997788999";

const ContatoSection = () => (
  <section id="contato" className="scroll-anchor py-[72px] bg-card">
    <motion.div
      className="max-w-[800px] mx-auto px-6 text-center"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-ivi-orange rounded-full" />
        <span className="font-mono text-xs tracking-widest uppercase text-ivi-orange font-medium">Contato</span>
      </motion.div>
      <motion.h2 variants={staggerItem} className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight mb-4">
        Fale com a Carol Dassie
      </motion.h2>
      <motion.p variants={staggerItem} className="text-sm text-muted-foreground mb-8">
        Tire suas dúvidas, conheça nossos planos ou torne-se um parceiro IVI.
      </motion.p>

      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <a
          href={`tel:+${SUPORTE}`}
          className="pill-item p-6 hover:border-primary/40 hover:bg-blue-pale transition-colors group"
        >
          <Headphones className="mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" size={28} />
          <div className="font-semibold text-sm mb-1">Suporte IVI</div>
          <div className="font-mono text-xs text-muted-foreground">(11) 99778-8999</div>
        </a>
        <a
          href={`https://wa.me/${WHATSAPP}?text=Ol%C3%A1%20Carol%2C%20vim%20pelo%20site%20da%20IVI%20e%20gostaria%20de%20saber%20mais.`}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-item p-6 hover:border-green-500/40 hover:bg-green-pale transition-colors group"
        >
          <MessageCircle className="mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform" size={28} />
          <div className="font-semibold text-sm mb-1">WhatsApp</div>
          <div className="font-mono text-xs text-muted-foreground">(11) 98291-8252</div>
        </a>
        <a
          href="mailto:carolina.dassie@hisnek.com"
          className="pill-item p-6 hover:border-primary/40 hover:bg-blue-pale transition-colors group"
        >
          <Mail className="mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" size={28} />
          <div className="font-semibold text-sm mb-1">E-mail</div>
          <div className="font-mono text-xs text-muted-foreground">carolina.dassie@hisnek.com</div>
        </a>
        <a
          href={`https://wa.me/${WHATSAPP}?text=Quero%20me%20tornar%20parceiro%20IVI`}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-item p-6 hover:border-ivi-orange/40 hover:bg-ivi-orange-pale transition-colors group"
        >
          <Mail className="mx-auto mb-3 text-ivi-orange group-hover:scale-110 transition-transform" size={28} />
          <div className="font-semibold text-sm mb-1">Seja Parceiro</div>
          <div className="font-mono text-xs text-muted-foreground">Comissões atrativas</div>
        </a>
      </motion.div>

      <motion.a
        variants={staggerItem}
        href={`https://wa.me/${WHATSAPP}?text=Ol%C3%A1%20Carol%2C%20vim%20pelo%20site%20da%20IVI%20e%20gostaria%20de%20saber%20mais.`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-primary-foreground rounded-full font-display font-bold text-base hover:bg-green-700 transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
      >
        <MessageCircle size={20} />
        Chamar no WhatsApp
      </motion.a>
    </motion.div>
  </section>
);

export default ContatoSection;
