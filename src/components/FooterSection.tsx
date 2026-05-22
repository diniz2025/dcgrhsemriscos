import logoIvi from "@/assets/logo-ivi.png";

const FooterSection = () => (
  <footer className="bg-ink border-t border-primary-foreground/10 py-10 px-6">
    <div className="max-w-[1140px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src={logoIvi} alt="IVI" className="h-8 opacity-80" />
        <span className="font-display font-bold text-sm text-primary-foreground/80">IVI Plataforma</span>
      </div>
      <div className="text-xs text-primary-foreground/40 text-center sm:text-right">
        <p>© {new Date().getFullYear()} IVI — Todos os direitos reservados.</p>
        <p className="mt-1">Conteúdo educacional. Não substitui consultoria profissional de SST.</p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
