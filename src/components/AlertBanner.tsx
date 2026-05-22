import { useEffect, useState } from "react";

const TARGET = new Date("2026-05-26T00:00:00-03:00").getTime();

const AlertBanner = () => {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, TARGET - Date.now());
      setDays(Math.floor(diff / 86400000));
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-destructive text-destructive-foreground py-2 px-6 font-mono text-[0.7rem] tracking-wider">
      <div className="max-w-[1140px] mx-auto flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse flex-shrink-0" />
        <span className="text-center">
          PRAZO NR-1: <strong>26 MAI 2026</strong> — PERÍODO EDUCATIVO EM VIGOR — <strong>{days} DIAS</strong> RESTANTES
        </span>
        <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse flex-shrink-0" />
      </div>
    </div>
  );
};

export default AlertBanner;
