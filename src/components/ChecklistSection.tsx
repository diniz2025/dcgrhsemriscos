import { useState, useEffect, useCallback } from "react";
import { checklistData, type CheckCategory } from "@/data/checklistData";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, staggerItemScale } from "./ScrollReveal";

const STORAGE_KEY = "nr1-checklist-state";

const loadState = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const ChecklistSection = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const total = checklistData.reduce((s, c) => s + c.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const exportCSV = () => {
    const rows = [["Área", "Item", "Detalhe", "Concluído"]];
    checklistData.forEach((cat) =>
      cat.items.forEach((it) =>
        rows.push([cat.title, it.label, it.detail, checked[it.id] ? "Sim" : "Não"])
      )
    );
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist-nr1-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="checklist" className="scroll-anchor py-16 bg-card">
      <motion.div
        className="max-w-[1140px] mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          <span className="font-mono text-xs tracking-widest uppercase text-primary font-medium">Checklist</span>
        </motion.div>
        <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold tracking-tight">Checklist por área</h2>
            <p className="text-muted-foreground text-sm mt-1">{done}/{total} concluídos ({pct}%)</p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold border border-border bg-surface hover:bg-blue-pale hover:text-primary hover:border-primary/20 transition-colors"
          >
            <Download size={14} />
            Exportar CSV
          </button>
        </motion.div>

        <motion.div variants={staggerItem} className="w-full h-1.5 rounded-full bg-surface mb-8 overflow-hidden">
          <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${pct}%` }} />
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={staggerContainer}>
          {checklistData.map((cat) => (
            <motion.div key={cat.id} variants={staggerItemScale}>
              <CategoryCard cat={cat} checked={checked} toggle={toggle} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

const CategoryCard = ({ cat, checked, toggle }: { cat: CheckCategory; checked: Record<string, boolean>; toggle: (id: string) => void }) => {
  const catDone = cat.items.filter((i) => checked[i.id]).length;
  return (
    <div>
      <h3 className="font-display font-bold text-sm mb-3">
        {cat.emoji} {cat.title} <span className="text-muted-foreground font-normal font-sans">({catDone}/{cat.items.length})</span>
      </h3>
      <div className="space-y-2">
        {cat.items.map((item) => (
          <label key={item.id} className="flex gap-3 p-4 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40 hover:bg-blue-pale/30 transition-colors items-start">
            <input type="checkbox" checked={!!checked[item.id]} onChange={() => toggle(item.id)} className="mt-1 accent-ivi-orange scale-110" />
            <div>
              <span className={`text-sm font-medium block ${checked[item.id] ? "line-through text-muted-foreground" : ""}`}>{item.label}</span>
              <small className="text-muted-foreground text-xs leading-snug">{item.detail}</small>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChecklistSection;
