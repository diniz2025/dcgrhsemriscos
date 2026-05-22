import { motion } from "framer-motion";
import { Check, Phone } from "lucide-react";

const planos = [
  { faixa: "Até 15 funcionários", preco: "R$ 419", destaque: false },
  { faixa: "16 a 25 funcionários", preco: "R$ 539", destaque: false },
  { faixa: "26 a 50 funcionários", preco: "R$ 659", destaque: true },
  { faixa: "51 a 99 funcionários", preco: "R$ 779", destaque: false },
  { faixa: "100+", preco: "Sob consulta", destaque: false, consulta: true },
];

const beneficios = [
  "Plataforma IVI completa",
  "Gestão GRO + PGR",
  "Inventário de riscos psicossociais",
  "Atualizações conforme NR-1",
  "Suporte especializado",
  "Modelos e checklists prontos",
];

const PrecosSection = () => (
  <section id="precos" className="py-20 bg-bg">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-ivi-orange/10 text-ivi-orange rounded-full text-xs font-display font-bold tracking-wider uppercase mb-4">
          Planos & Investimento
        </span>
        <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold tracking-tight text-ink mb-3">
          Escolha o plano ideal para sua empresa
        </h2>
        <p className="text-ink/60 max-w-[600px] mx-auto">
          Mensalidade conforme o número de funcionários. Tudo incluso, sem taxa de adesão.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {planos.map((plano, i) => (
          <motion.div
            key={plano.faixa}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative rounded-2xl p-6 border-2 transition-all hover:-translate-y-1 ${
              plano.destaque
                ? "bg-ink text-primary-foreground border-ivi-orange shadow-[0_10px_40px_hsl(var(--ivi-orange)/0.3)]"
                : "bg-card text-ink border-ink/10 hover:border-ivi-orange/40"
            }`}
          >
            {plano.destaque && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-ivi-orange text-primary-foreground text-[10px] font-display font-bold tracking-wider uppercase rounded-full">
                Mais escolhido
              </span>
            )}
            <p className={`text-xs font-display font-bold uppercase tracking-wider mb-2 ${plano.destaque ? "text-ivi-orange" : "text-ink/50"}`}>
              {plano.faixa}
            </p>
            <div className="mb-4">
              {plano.consulta ? (
                <div className="flex items-center gap-2 py-2">
                  <Phone className="w-5 h-5 text-ivi-orange" />
                  <span className="font-display text-xl font-extrabold">Sob consulta</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold">{plano.preco}</span>
                  <span className={`text-sm ${plano.destaque ? "text-primary-foreground/60" : "text-ink/50"}`}>/mês</span>
                </div>
              )}
            </div>
            <a
              href="#contato"
              className={`block text-center py-2.5 rounded-full font-display font-bold text-sm transition-all ${
                plano.destaque
                  ? "bg-ivi-orange text-primary-foreground hover:bg-ivi-orange-dark"
                  : "bg-ink/5 text-ink hover:bg-ink hover:text-primary-foreground"
              }`}
            >
              {plano.consulta ? "Falar com a Carol" : "Contratar"}
            </a>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 bg-card border border-ink/10 rounded-2xl p-6">
        <p className="font-display font-bold text-ink mb-4 text-sm uppercase tracking-wider">Todos os planos incluem:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {beneficios.map((b) => (
            <div key={b} className="flex items-center gap-2 text-ink/70 text-sm">
              <Check className="w-4 h-4 text-ivi-orange flex-shrink-0" />
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default PrecosSection;
