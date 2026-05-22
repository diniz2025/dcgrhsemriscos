import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Users, Kanban, FileText, LogOut, Menu, Handshake, DollarSign, Percent } from "lucide-react";
import logoIvi from "@/assets/logo-ivi.png";

const navItems = [
  { to: "/crm", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/crm/leads", icon: Users, label: "Leads" },
  { to: "/crm/pipeline", icon: Kanban, label: "Pipeline" },
  { to: "/crm/contracts", icon: FileText, label: "Contratos" },
  { to: "/crm/partners", icon: Handshake, label: "Parceiros" },
  { to: "/crm/financial", icon: DollarSign, label: "Financeiro" },
  { to: "/crm/commissions", icon: Percent, label: "Comissões" },
];

const CrmLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-ink text-primary-foreground transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-primary-foreground/10 flex items-center gap-3">
          <img src={logoIvi} alt="IVI" className="h-8" />
          <span className="font-display font-bold">CRM IVI</span>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-ivi-orange text-primary-foreground"
                  : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-primary-foreground/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 w-full transition-colors">
            <LogOut size={18} /> Sair
          </button>
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-primary-foreground/40 hover:text-primary-foreground/60 w-full transition-colors mt-1">
            ← Voltar ao site
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-ink/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-card border-b border-border px-6 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <span className="font-display font-bold text-sm">CRM IVI</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default CrmLayout;
