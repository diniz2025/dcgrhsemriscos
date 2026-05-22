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

type Contract = {
  id: string; client_name: string; company: string | null; monthly_value: number | null;
  start_date: string | null; end_date: string | null; status: string; notes: string | null;
  partner_id: string | null;
};

type Partner = { id: string; name: string; company: string | null; commission_pct: number | null };

const statusLabels: Record<string, string> = { ativo: "Ativo", pausado: "Pausado", cancelado: "Cancelado", finalizado: "Finalizado" };
const statusColors: Record<string, string> = { ativo: "bg-green-pale text-success", pausado: "bg-amber-pale text-warning", cancelado: "bg-red-pale text-destructive", finalizado: "bg-secondary text-muted-foreground" };

const emptyForm = { client_name: "", company: "", monthly_value: 0, start_date: "", end_date: "", status: "ativo", notes: "", partner_id: "" };

const Contracts = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchContracts = async () => {
    if (!user) return;
    const { data } = await supabase.from("contracts").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setContracts((data as Contract[]) || []);
  };

  const fetchPartners = async () => {
    if (!user) return;
    const { data } = await supabase.from("partners").select("id, name, company, commission_pct").eq("user_id", user.id).eq("status", "ativo");
    setPartners((data as Partner[]) || []);
  };

  useEffect(() => {
    if (user) {
      fetchContracts();
      fetchPartners();
    }
  }, [user]);

  const generateCommission = async (contractId: string, partnerId: string, monthlyValue: number) => {
    if (!user) return;
    const partner = partners.find((p) => p.id === partnerId);
    if (!partner) return;
    const pct = Number(partner.commission_pct || 10);
    const amount = (monthlyValue * pct) / 100;
    if (amount <= 0) return;

    await supabase.from("commissions").insert({
      user_id: user.id,
      partner_id: partnerId,
      contract_id: contractId,
      amount,
      status: "pendente",
      description: `Comissão ${pct}% sobre contrato de ${form.client_name} (R$ ${monthlyValue.toLocaleString("pt-BR")}/mês)`,
    });
  };

  const handleSave = async () => {
    if (!user || !form.client_name.trim()) return;
    const monthlyValue = Number(form.monthly_value);
    const payload = {
      client_name: form.client_name,
      company: form.company || null,
      monthly_value: monthlyValue,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status,
      notes: form.notes || null,
      partner_id: form.partner_id || null,
      user_id: user.id,
    };

    if (editingId) {
      const oldContract = contracts.find((c) => c.id === editingId);
      await supabase.from("contracts").update(payload).eq("id", editingId);

      // If partner changed or was newly added, generate commission
      if (form.partner_id && form.partner_id !== oldContract?.partner_id && monthlyValue > 0) {
        await generateCommission(editingId, form.partner_id, monthlyValue);
        toast({ title: "Contrato atualizado e comissão gerada automaticamente" });
      } else {
        toast({ title: "Contrato atualizado" });
      }
    } else {
      const { data } = await supabase.from("contracts").insert(payload).select("id").single();
      if (data && form.partner_id && monthlyValue > 0) {
        await generateCommission(data.id, form.partner_id, monthlyValue);
        toast({ title: "Contrato criado e comissão gerada automaticamente" });
      } else {
        toast({ title: "Contrato criado" });
      }
    }
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchContracts();
  };

  const handleEdit = (c: Contract) => {
    setEditingId(c.id);
    setForm({
      client_name: c.client_name,
      company: c.company || "",
      monthly_value: Number(c.monthly_value) || 0,
      start_date: c.start_date || "",
      end_date: c.end_date || "",
      status: c.status,
      notes: c.notes || "",
      partner_id: c.partner_id || "",
    });
    setDialogOpen(true);
  };

  const getPartnerName = (partnerId: string | null) => {
    if (!partnerId) return "—";
    const p = partners.find((x) => x.id === partnerId);
    return p ? p.name : "—";
  };

  if (authLoading) return <CrmLayout><div className="flex items-center justify-center h-64">Carregando...</div></CrmLayout>;

  return (
    <CrmLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Contratos</h1>
          <p className="text-muted-foreground text-sm">{contracts.length} contratos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button className="bg-ivi-orange hover:bg-ivi-orange-dark text-primary-foreground"><Plus size={16} className="mr-1" /> Novo Contrato</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingId ? "Editar Contrato" : "Novo Contrato"}</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Cliente *</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} /></div>
                <div><Label>Empresa</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Valor mensal</Label><Input type="number" value={form.monthly_value} onChange={(e) => setForm({ ...form, monthly_value: Number(e.target.value) })} /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Parceiro (comissão automática)</Label>
                <Select value={form.partner_id} onValueChange={(v) => setForm({ ...form, partner_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Sem parceiro vinculado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {partners.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.commission_pct}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.partner_id && form.monthly_value > 0 && (
                  <p className="text-xs text-ivi-orange mt-1">
                    💰 Comissão estimada: R$ {((Number(form.monthly_value) * Number(partners.find(p => p.id === form.partner_id)?.commission_pct || 10)) / 100).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Início</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
                <div><Label>Término</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
              </div>
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
              <TableHead>Cliente</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Parceiro</TableHead>
              <TableHead>Valor/mês</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.client_name}</TableCell>
                <TableCell>{c.company}</TableCell>
                <TableCell>{getPartnerName(c.partner_id)}</TableCell>
                <TableCell>R$ {Number(c.monthly_value || 0).toLocaleString("pt-BR")}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status] || ""}`}>{statusLabels[c.status] || c.status}</span></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(c)} className="p-1 hover:bg-secondary rounded"><Pencil size={14} /></button>
                    <button onClick={() => { supabase.from("contracts").delete().eq("id", c.id).then(fetchContracts); toast({ title: "Contrato removido" }); }} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 size={14} /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {contracts.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum contrato</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </CrmLayout>
  );
};

export default Contracts;
