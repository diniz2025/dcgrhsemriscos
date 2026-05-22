import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CrmLayout from "@/components/crm/CrmLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  stage: string;
  estimated_value: number | null;
  source: string | null;
  notes: string | null;
  created_at: string;
};

const stageLabels: Record<string, string> = {
  novo_lead: "Novo Lead",
  qualificacao: "Qualificação",
  proposta: "Proposta",
  negociacao: "Negociação",
  fechado_ganho: "Fechado ✅",
  fechado_perdido: "Perdido ❌",
};

const stageColors: Record<string, string> = {
  novo_lead: "bg-blue-pale text-primary",
  qualificacao: "bg-amber-pale text-warning",
  proposta: "bg-ivi-orange-pale text-ivi-orange",
  negociacao: "bg-ivi-orange-pale text-ivi-orange-dark",
  fechado_ganho: "bg-green-pale text-success",
  fechado_perdido: "bg-red-pale text-destructive",
};

const emptyForm = { name: "", company: "", email: "", phone: "", stage: "novo_lead", estimated_value: 0, source: "", notes: "" };

const Leads = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchLeads = async () => {
    if (!user) return;
    const { data } = await supabase.from("leads").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setLeads((data as Lead[]) || []);
  };

  useEffect(() => { if (user) fetchLeads(); }, [user]);

  const handleSave = async () => {
    if (!user || !form.name.trim()) return;
    const payload = { ...form, user_id: user.id, estimated_value: Number(form.estimated_value) };

    if (editingId) {
      const { error } = await supabase.from("leads").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const id = crypto.randomUUID();
      const { error } = await supabase.from("leads").insert({ ...payload, id });
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }

      // Notifica por e-mail (não bloqueia o fluxo se falhar)
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "new-lead-notification",
          recipientEmail: "dcg@dcgrhsemriscos.com.br",
          idempotencyKey: `new-lead-${id}`,
          templateData: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            company: form.company,
            source: form.source || "CRM",
            message: form.notes,
          },
        },
      }).catch((e) => console.error("Falha ao notificar novo lead", e));
    }
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchLeads();
    toast({ title: editingId ? "Lead atualizado" : "Lead criado" });
  };

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setForm({ name: lead.name, company: lead.company || "", email: lead.email || "", phone: lead.phone || "", stage: lead.stage, estimated_value: Number(lead.estimated_value) || 0, source: lead.source || "", notes: lead.notes || "" });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("leads").delete().eq("id", id);
    fetchLeads();
    toast({ title: "Lead removido" });
  };

  if (authLoading) return <CrmLayout><div className="flex items-center justify-center h-64">Carregando...</div></CrmLayout>;

  return (
    <CrmLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Leads</h1>
          <p className="text-muted-foreground text-sm">{leads.length} leads cadastrados</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button className="bg-ivi-orange hover:bg-ivi-orange-dark text-primary-foreground"><Plus size={16} className="mr-1" /> Novo Lead</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingId ? "Editar Lead" : "Novo Lead"}</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nome *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Empresa</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Estágio</Label>
                  <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(stageLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Valor estimado</Label><Input type="number" value={form.estimated_value} onChange={(e) => setForm({ ...form, estimated_value: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Origem</Label><Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /></div>
              <div><Label>Notas</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={handleSave} className="bg-ivi-orange hover:bg-ivi-orange-dark text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Estágio</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${stageColors[lead.stage] || ""}`}>{stageLabels[lead.stage] || lead.stage}</span></TableCell>
                <TableCell>R$ {Number(lead.estimated_value || 0).toLocaleString("pt-BR")}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(lead)} className="p-1 hover:bg-secondary rounded"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(lead.id)} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 size={14} /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum lead cadastrado</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </CrmLayout>
  );
};

export default Leads;
