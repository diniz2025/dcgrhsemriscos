import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import logoIvi from "@/assets/logo-ivi.png";

const mainLinks = [
  { href: "#visao", label: "Visão Geral" },
  { href: "#cronograma", label: "Cronograma" },
  { href: "#gro-pgr", label: "GRO/PGR" },
  { href: "#portaria", label: "Portaria 1.419" },
  { href: "#checklist", label: "Checklist" },
  { href: "#psicossociais", label: "Psicossociais" },
  { href: "#penalidades", label: "Penalidades" },
  { href: "#faq", label: "FAQ" },
];

const moreLinks = [
  { href: "#abrangencia", label: "Abrangência" },
  { href: "#ivi", label: "Sobre a IVI" },
  { href: "#leigos", label: "Para Leigos" },
  { href: "#modelos", label: "Modelos" },
  { href: "#lgpd", label: "LGPD" },
];

const allSections = [...mainLinks, ...moreLinks].map((l) => l.href.replace("#", ""));

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let current = "";
      for (const id of allSections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-border"
          : "bg-card/80 backdrop-blur-lg border-b border-transparent"
      }`}
    >
      <div className="max-w-[1140px] mx-auto px-6 flex items-center h-[60px]">
        <div className="flex items-center gap-3 mr-5 flex-shrink-0">
          <img src={logoIvi} alt="IVI" className="h-9" />
          <div className="hidden sm:flex flex-col">
            <span className="font-display font-bold text-[0.9rem] leading-none text-foreground">
              IVI Plataforma
            </span>
            <span className="font-mono text-[0.65rem] text-muted-foreground tracking-wider mt-0.5">
              NR-1 · GRO · PGR
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 flex-1 min-w-0 ml-2">
          {mainLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-2.5 py-1.5 text-[0.78rem] font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeId === link.href.replace("#", "")
                  ? "bg-ivi-orange-pale text-ivi-orange"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </a>
          ))}

          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[0.78rem] font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Mais <ChevronDown size={12} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute top-full mt-1 right-0 bg-card border border-border rounded-xl shadow-lg py-2 min-w-[160px] z-50">
                  {moreLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-ivi-orange text-primary-foreground rounded-full font-display font-bold text-[0.78rem] hover:bg-ivi-orange-dark transition-all shadow-[0_2px_8px_hsl(var(--ivi-orange)/0.3)]"
          >
            Acessar Plataforma
          </Link>
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-card border-t border-border px-6 py-4 space-y-1">
          {[...mainLinks, ...moreLinks].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="block px-3 py-2 text-sm font-bold text-ivi-orange"
            onClick={() => setOpen(false)}
          >
            Acessar Plataforma →
          </Link>
        </div>
      )}
    </nav>
  );
};

export default TopBar;
