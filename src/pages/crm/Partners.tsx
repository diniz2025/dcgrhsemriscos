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

type Partner = {
  id: string; name: string; company: string | null; email: string | null;
  phone: string | null; commission_pct: number | null; status: string; notes: string | null;
};

const emptyForm = { name: "", company: "", email: "", phone: "", commission_pct: 10, status: "ativo", notes: "" };

const Partners = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetch = async () => {
    if (!user) return;
    const { data } = await supabase.from("partners").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setPartners((data as Partner[]) || []);
  };

  useEffect(() => { if (user) fetch(); }, [user]);

  const handleSave = async () => {
    if (!user || !form.name.trim()) return;
    const payload = { ...form, user_id: user.id, commission_pct: Number(form.commission_pct) };
    if (editingId) await supabase.from("partners").update(payload).eq("id", editingId);
    else await supabase.from("partners").insert(payload);
    setDialogOpen(false); setEditingId(null); setForm(emptyForm); fetch();
    toast({ title: editingId ? "Parceiro atualizado" : "Parceiro criado" });
  };

  const handleEdit = (p: Partner) => {
    setEditingId(p.id);
    setForm({ name: p.name, company: p.company || "", email: p.email || "", phone: p.phone || "", commission_pct: Number(p.commission_pct) || 10, status: p.status, notes: p.notes || "" });
    setDialogOpen(true);
  };

  if (authLoading) return <CrmLayout><div className="flex items-center justify-center h-64">Carregando...</div></CrmLayout>;

  return (
    <CrmLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Parceiros</h1>
          <p className="text-muted-foreground text-sm">{partners.length} parceiros cadastrados</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button className="bg-ivi-orange hover:bg-ivi-orange-dark text-primary-foreground"><Plus size={16} className="mr-1" /> Novo Parceiro</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingId ? "Editar Parceiro" : "Novo Parceiro"}</DialogTitle></DialogHeader>
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
                <div><Label>Comissão (%)</Label><Input type="number" value={form.commission_pct} onChange={(e) => setForm({ ...form, commission_pct: Number(e.target.value) })} /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Comissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.company}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell><span className="font-mono text-ivi-orange">{p.commission_pct}%</span></TableCell>
                <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "ativo" ? "bg-green-pale text-success" : "bg-secondary text-muted-foreground"}`}>{p.status === "ativo" ? "Ativo" : "Inativo"}</span></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(p)} className="p-1 hover:bg-secondary rounded"><Pencil size={14} /></button>
                    <button onClick={() => { supabase.from("partners").delete().eq("id", p.id).then(fetch); toast({ title: "Parceiro removido" }); }} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 size={14} /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {partners.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum parceiro</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </CrmLayout>
  );
};

export default Partners;
