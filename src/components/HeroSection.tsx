import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TARGET = new Date("2026-05-26T00:00:00-03:00").getTime();
const customEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: customEase },
});

const HeroSection = () => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, TARGET - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const units = [
    { label: "Dias", value: days },
    { label: "Horas", value: hours },
    { label: "Min", value: minutes },
    { label: "Seg", value: seconds },
  ];

  const stats = [
    { num: "100%", label: "Empresas CLT afetadas" },
    { num: "5", label: "Itens que o fiscal pede" },
    { num: "7 dias", label: "Teste grátis sem cartão" },
  ];

  return (
    <section id="visao" className="scroll-anchor bg-ink relative overflow-hidden py-20">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <motion.div
        className="absolute -top-32 -right-20 w-[600px] h-[600px] bg-[radial-gradient(circle,hsl(var(--ivi-orange)/0.25),transparent_65%)] pointer-events-none"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
      />

      <div className="relative z-10 max-w-[1140px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
        <div>
          <motion.div {...fade(0.1)} className="inline-flex items-center gap-2 bg-[hsl(var(--ivi-orange)/0.2)] border border-[hsl(var(--ivi-orange)/0.4)] text-[#FFB088] px-3.5 py-1.5 rounded-full mb-7">
            <span className="font-mono text-xs tracking-wider uppercase font-medium">Plataforma IVI — Ferramenta educativa</span>
          </motion.div>

          <motion.h1 {...fade(0.2)} className="font-display text-[clamp(2.6rem,5vw,4.4rem)] font-extrabold leading-[1.04] tracking-tighter text-primary-foreground mb-6">
            O que muda a partir<br />de <em className="not-italic text-[#FFB088]">26/05/2026?</em>
          </motion.h1>

          <motion.p {...fade(0.35)} className="text-lg text-primary-foreground/60 leading-relaxed max-w-[560px] mb-10">
            A NR-1 exige que a empresa <strong className="text-primary-foreground">comprove</strong> que faz gestão preventiva de riscos ocupacionais. Se não consegue provar, a fiscalização considera que não cumpre a norma.
          </motion.p>

          <motion.div {...fade(0.5)} className="flex gap-3 items-center flex-wrap">
            <motion.a
              href="#checklist"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-ivi-orange text-primary-foreground rounded-full font-display font-bold text-[0.95rem] hover:bg-ivi-orange-dark transition-all shadow-[0_4px_20px_hsl(var(--ivi-orange)/0.4)]"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📋 Fazer o Checklist
            </motion.a>
            <motion.a
              href="#gro-pgr"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-primary-foreground border border-primary-foreground/20 rounded-full font-medium text-[0.95rem] hover:bg-primary-foreground/[0.08] hover:border-primary-foreground/40 transition-all"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Entender o GRO/PGR →
            </motion.a>
          </motion.div>

          <motion.div {...fade(0.65)} className="flex gap-8 mt-12 pt-8 border-t border-primary-foreground/[0.08]">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 + i * 0.1, ease: customEase }}
              >
                <div className="font-display text-2xl font-extrabold text-primary-foreground leading-none">{s.num}</div>
                <div className="text-sm text-primary-foreground/45 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="hidden lg:block flex-shrink-0 bg-primary-foreground/5 border border-primary-foreground/10 rounded-3xl p-8 text-center min-w-[240px] backdrop-blur-xl"
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: customEase }}
        >
          <div className="font-mono text-[0.68rem] tracking-widest text-primary-foreground/40 uppercase mb-4">Contagem regressiva</div>
          <motion.div
            className="font-display text-[1.05rem] font-bold text-destructive bg-destructive/15 border border-destructive/30 rounded-lg px-4 py-2 mb-6 inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            26 Mai · 2026
          </motion.div>
          <div className="grid grid-cols-4 gap-2">
            {units.map((u, i) => (
              <motion.div
                key={u.label}
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
              >
                <div className="font-display text-3xl font-extrabold text-primary-foreground leading-none min-w-[48px] bg-primary-foreground/[0.08] rounded-lg py-2 px-2">
                  {String(u.value).padStart(2, "0")}
                </div>
                <span className="font-mono text-[0.6rem] text-primary-foreground/40 tracking-wider uppercase">{u.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
