import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CrmLayout from "@/components/crm/CrmLayout";
import { Card } from "@/components/ui/card";
import { Users, FileText, TrendingUp, DollarSign, Handshake } from "lucide-react";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ leads: 0, contracts: 0, pipelineValue: 0, activeContracts: 0, partners: 0, revenue: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const [leadsRes, contractsRes, partnersRes, transRes] = await Promise.all([
        supabase.from("leads").select("estimated_value, stage").eq("user_id", user.id),
        supabase.from("contracts").select("monthly_value, status").eq("user_id", user.id),
        supabase.from("partners").select("id").eq("user_id", user.id),
        supabase.from("financial_transactions").select("amount, type").eq("user_id", user.id),
      ]);
      const leads = leadsRes.data || [];
      const contracts = contractsRes.data || [];
      const partners = partnersRes.data || [];
      const trans = transRes.data || [];
      setStats({
        leads: leads.length,
        contracts: contracts.length,
        pipelineValue: leads.reduce((sum, l) => sum + Number(l.estimated_value || 0), 0),
        activeContracts: contracts.filter((c) => c.status === "ativo").length,
        partners: partners.length,
        revenue: trans.filter(t => t.type === "receita").reduce((sum, t) => sum + Number(t.amount || 0), 0),
      });
    };
    fetchStats();
  }, [user]);

  if (authLoading) return <CrmLayout><div className="flex items-center justify-center h-64">Carregando...</div></CrmLayout>;

  const cards = [
    { label: "Total de Leads", value: stats.leads, icon: Users, color: "text-primary" },
    { label: "Valor no Pipeline", value: `R$ ${stats.pipelineValue.toLocaleString("pt-BR")}`, icon: TrendingUp, color: "text-ivi-orange" },
    { label: "Contratos Ativos", value: stats.activeContracts, icon: FileText, color: "text-success" },
    { label: "Parceiros", value: stats.partners, icon: Handshake, color: "text-warning" },
    { label: "Receita Total", value: `R$ ${stats.revenue.toLocaleString("pt-BR")}`, icon: DollarSign, color: "text-success" },
    { label: "Total Contratos", value: stats.contracts, icon: FileText, color: "text-primary" },
  ];

  return (
    <CrmLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visão geral do seu CRM</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon size={20} className={c.color} />
            </div>
            <div className="font-display font-bold text-2xl">{c.value}</div>
          </Card>
        ))}
      </div>
    </CrmLayout>
  );
};

export default Dashboard;
