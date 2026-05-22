import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "./ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "O que muda com a NR-1 a partir de 26/05/2026?", a: "A principal mudança é a obrigatoriedade de incluir riscos psicossociais no PGR (Portaria 1.419/2024). Empresas devem manter a adequação em andamento." },
  { q: "Todas as empresas precisam ter PGR?", a: "Sim. O PGR é obrigatório para todas as organizações que possuam empregados regidos pela CLT, independentemente do porte ou grau de risco." },
  { q: "O que são riscos psicossociais na NR-1?", a: "São fatores organizacionais que podem causar danos à saúde mental: assédio moral/sexual, sobrecarga de trabalho, jornada excessiva, pressão por metas irreais, falta de autonomia." },
  { q: "Quem é responsável pelo PGR na empresa?", a: "A responsabilidade é do empregador, que pode delegar a elaboração ao SESMT ou consultor, mas mantém a responsabilidade legal." },
  { q: "Qual a multa por descumprimento?", a: "Varia conforme a infração e o porte da empresa. Pode ir de R$ 1.000 a mais de R$ 100.000 por item." },
  { q: "Este site substitui uma consultoria de SST?", a: "Não. Este é um guia educacional da IVI. A implementação deve ser conduzida por profissional habilitado." },
];

const FaqSection = () => (
  <section id="faq" className="scroll-anchor py-[72px]">
    <motion.div
      className="max-w-[800px] mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        <span className="font-mono text-xs tracking-widest uppercase text-primary font-medium">FAQ</span>
      </motion.div>
      <motion.h2 variants={staggerItem} className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight mb-8">
        Perguntas frequentes
      </motion.h2>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <motion.div key={i} variants={staggerItem}>
            <AccordionItem value={`faq-${i}`} className="border border-border rounded-2xl px-5 data-[state=open]:bg-surface transition-colors">
              <AccordionTrigger className="text-sm font-semibold text-left py-4 hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  </section>
);

export default FaqSection;
