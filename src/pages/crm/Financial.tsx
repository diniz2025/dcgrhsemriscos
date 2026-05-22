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
import { Card } from "@/components/ui/card";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Transaction = {
  id: string; type: string; category: string | null; amount: number;
  description: string | null; transaction_date: string; contract_id: string | null;
};

const categories = ["Serviços SST", "Consultoria", "Treinamento", "Comissão Parceiro", "Infraestrutura", "Marketing", "Salários", "Outros"];

const emptyForm = { type: "receita", category: "", amount: 0, description: "", transaction_date: new Date().toISOString().slice(0, 10) };

const Financial = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetch = async () => {
    if (!user) return;
    const { data } = await supabase.from("financial_transactions").select("*").eq("user_id", user.id).order("transaction_date", { ascending: false });
    setTransactions((data as Transaction[]) || []);
  };

  useEffect(() => { if (user) fetch(); }, [user]);

  const handleSave = async () => {
    if (!user || !form.amount) return;
    await supabase.from("financial_transactions").insert({ ...form, user_id: user.id, amount: Number(form.amount) });
    setDialogOpen(false); setForm(emptyForm); fetch();
    toast({ title: "Transação registrada" });
  };

  if (authLoading) return <CrmLayout><div className="flex items-center justify-center h-64">Carregando...</div></CrmLayout>;

  const receitas = transactions.filter(t => t.type === "receita").reduce((s, t) => s + Number(t.amount), 0);
  const despesas = transactions.filter(t => t.type === "despesa").reduce((s, t) => s + Number(t.amount), 0);
  const saldo = receitas - despesas;

  return (
    <CrmLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground text-sm">Controle de receitas e despesas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setForm(emptyForm); }}>
          <DialogTrigger asChild>
            <Button className="bg-ivi-orange hover:bg-ivi-orange-dark text-primary-foreground"><Plus size={16} className="mr-1" /> Nova Transação</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Transação</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Valor (R$)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoria</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Data</Label><Input type="date" value={form.transaction_date} onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} /></div>
              </div>
              <div><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <Button onClick={handleSave} className="bg-ivi-orange hover:bg-ivi-orange-dark text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Receitas</span>
            <TrendingUp size={18} className="text-success" />
          </div>
          <div className="font-display font-bold text-xl text-success">R$ {receitas.toLocaleString("pt-BR")}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Despesas</span>
            <TrendingDown size={18} className="text-destructive" />
          </div>
          <div className="font-display font-bold text-xl text-destructive">R$ {despesas.toLocaleString("pt-BR")}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Saldo</span>
            <DollarSign size={18} className={saldo >= 0 ? "text-success" : "text-destructive"} />
          </div>
          <div className={`font-display font-bold text-xl ${saldo >= 0 ? "text-success" : "text-destructive"}`}>R$ {saldo.toLocaleString("pt-BR")}</div>
        </Card>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs">{new Date(t.transaction_date).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === "receita" ? "bg-green-pale text-success" : "bg-red-pale text-destructive"}`}>{t.type === "receita" ? "Receita" : "Despesa"}</span></TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell className="text-sm">{t.description}</TableCell>
                <TableCell className={`font-mono font-medium ${t.type === "receita" ? "text-success" : "text-destructive"}`}>{t.type === "receita" ? "+" : "-"} R$ {Number(t.amount).toLocaleString("pt-BR")}</TableCell>
                <TableCell>
                  <button onClick={() => { supabase.from("financial_transactions").delete().eq("id", t.id).then(fetch); toast({ title: "Removido" }); }} className="p-1 hover:bg-destructive/10 rounded text-destructive"><Trash2 size={14} /></button>
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhuma transação</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </CrmLayout>
  );
};

export default Financial;
