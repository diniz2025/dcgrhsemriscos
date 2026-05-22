import { useState, useCallback } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, staggerItemRight } from "./ScrollReveal";

const fiscalItems = [
  { id: "inv", title: "Inventário de riscos atualizado", desc: "Todos os riscos identificados, avaliados e documentados — incluindo psicossociais." },
  { id: "plano", title: "Plano de ação documentado", desc: "Medidas de prevenção com responsáveis, prazos e indicadores de acompanhamento." },
  { id: "trein", title: "Treinamentos registrados", desc: "Lista de presença, conteúdo e datas. Colaboradores cientes dos riscos e medidas." },
  { id: "evid", title: "Evidências de execução", desc: "Comprovantes de que as medidas foram implementadas, não apenas planejadas." },
  { id: "psico", title: "Controle de riscos psicossociais", desc: "Avaliação formal de estresse, assédio, sobrecarga — mapeados e incluídos no PGR." },
];

const GroPgrSection = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / fiscalItems.length) * 100);

  return (
    <section id="gro-pgr" className="scroll-anchor py-[72px] bg-surface border-y border-border">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            className="lg:sticky lg:top-24"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span className="font-mono text-xs tracking-widest uppercase text-primary font-medium">O que o fiscal vai pedir</span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold leading-tight tracking-tight mb-4">
              NR-1 não é papel.<br />É gestão com prova.
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[0.95rem] text-muted-foreground leading-relaxed mb-6">
              A nova NR-1 mudou o paradigma: antes bastava ter o documento. Agora a empresa precisa <strong className="text-foreground">demonstrar</strong> que o processo de prevenção está vivo, ativo e registrado.
            </motion.p>
            <motion.div variants={staggerItem} className="flex gap-2 flex-wrap">
              <span className="badge badge-blue">GRO</span>
              <span className="badge badge-blue">PGR</span>
              <span className="badge badge-red">Riscos Psicossociais</span>
              <span className="badge badge-green">eSocial S-2241</span>
              <span className="badge badge-amber">Portaria 1.419/2024</span>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-8 p-6 bg-blue-pale rounded-2xl border border-primary/15">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:pr-4 sm:border-r sm:border-primary/15">
                  <div className="font-mono text-xs tracking-wider text-primary mb-2 uppercase">GRO</div>
                  <div className="font-semibold text-sm mb-1">Gerenciamento de Riscos Ocupacionais</div>
                  <div className="text-sm text-muted-foreground">Processo contínuo — é o "guarda-chuva" da gestão SST.</div>
                </div>
                <div className="sm:pl-4">
                  <div className="font-mono text-xs tracking-wider text-primary mb-2 uppercase">PGR</div>
                  <div className="font-semibold text-sm mb-1">Programa de Gerenciamento de Riscos</div>
                  <div className="text-sm text-muted-foreground">Documento formal. Substituiu o PPRA. Contém Inventário + Plano de Ação.</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="section-card overflow-hidden shadow-[var(--shadow-xl)]"
            variants={staggerItemRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="bg-ink p-5 flex items-center gap-3">
              <div className="w-9 h-9 bg-destructive/20 rounded-lg flex items-center justify-center text-lg">🔍</div>
              <div>
                <div className="font-display font-bold text-sm text-primary-foreground mb-0.5">O que o fiscal vai pedir</div>
                <div className="font-mono text-xs text-primary-foreground/50">Clique para marcar o que sua empresa já tem</div>
              </div>
            </div>

            <div className="px-6 pt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Sua prontidão</span>
                <span>{done} / {fiscalItems.length} itens</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden mb-4">
                <div className="h-full bg-success rounded-full transition-all duration-400" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div>
              {fiscalItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className="flex items-start gap-4 px-6 py-4 border-b border-border last:border-b-0 hover:bg-surface transition-colors cursor-pointer"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    checked[item.id] ? "bg-success border-success" : "border-border-md"
                  }`}>
                    {checked[item.id] && <Check size={12} className="text-primary-foreground" />}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm mb-1 ${checked[item.id] ? "line-through text-muted-foreground" : ""}`}>{item.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GroPgrSection;
