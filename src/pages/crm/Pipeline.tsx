import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CrmLayout from "@/components/crm/CrmLayout";

type Lead = { id: string; name: string; company: string | null; estimated_value: number | null; stage: string };

const stages = [
  { key: "novo_lead", label: "Novo Lead", color: "border-t-primary" },
  { key: "qualificacao", label: "Qualificação", color: "border-t-warning" },
  { key: "proposta", label: "Proposta", color: "border-t-ivi-orange" },
  { key: "negociacao", label: "Negociação", color: "border-t-ivi-orange-dark" },
  { key: "fechado_ganho", label: "Fechado ✅", color: "border-t-success" },
  { key: "fechado_perdido", label: "Perdido ❌", color: "border-t-destructive" },
];

const Pipeline = () => {
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("leads").select("id, name, company, estimated_value, stage").eq("user_id", user.id).then(({ data }) => setLeads((data as Lead[]) || []));
  }, [user]);

  if (authLoading) return <CrmLayout><div className="flex items-center justify-center h-64">Carregando...</div></CrmLayout>;

  const handleDrop = async (leadId: string, newStage: string) => {
    await supabase.from("leads").update({ stage: newStage }).eq("id", leadId);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
  };

  return (
    <CrmLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Pipeline</h1>
        <p className="text-muted-foreground text-sm">Visão Kanban dos seus leads</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {stages.map((s) => {
          const stageLeads = leads.filter((l) => l.stage === s.key);
          const total = stageLeads.reduce((sum, l) => sum + Number(l.estimated_value || 0), 0);
          return (
            <div
              key={s.key}
              className={`bg-card rounded-xl border border-border border-t-4 ${s.color} min-h-[300px]`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const leadId = e.dataTransfer.getData("leadId");
                if (leadId) handleDrop(leadId, s.key);
              }}
            >
              <div className="p-3 border-b border-border">
                <div className="font-semibold text-xs">{s.label}</div>
                <div className="text-xs text-muted-foreground">{stageLeads.length} · R$ {total.toLocaleString("pt-BR")}</div>
              </div>
              <div className="p-2 space-y-2">
                {stageLeads.map((l) => (
                  <div
                    key={l.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("leadId", l.id)}
                    className="bg-background rounded-lg border border-border p-3 cursor-grab hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-xs mb-1">{l.name}</div>
                    {l.company && <div className="text-[0.65rem] text-muted-foreground">{l.company}</div>}
                    <div className="text-xs font-mono text-ivi-orange mt-1">R$ {Number(l.estimated_value || 0).toLocaleString("pt-BR")}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </CrmLayout>
  );
};

export default Pipeline;
