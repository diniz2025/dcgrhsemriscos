import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CrmLayout from "@/components/crm/CrmLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Commission = {
  id: string;
  amount: number;
  status: string;
  description: string | null;
  paid_at: string | null;
  created_at: string;
  partner_id: string;
  contract_id: string | null;
  partner?: { name: string; company: string | null; commission_pct: number | null };
  contract?: { client_name: string; monthly_value: number | null };
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
  cancelado: "Cancelado",
};

const statusColors: Record<string, string> = {
  pendente: "bg-amber-100 text-amber-800 border-amber-200",
  pago: "bg-green-100 text-green-800 border-green-200",
  cancelado: "bg-red-100 text-red-800 border-red-200",
};

const Commissions = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [filterStatus, setFilterStatus] = useState("todos");

  const fetchCommissions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("commissions")
      .select("*, partner:partners(name, company, commission_pct), contract:contracts(client_name, monthly_value)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setCommissions((data as Commission[]) || []);
  };

  useEffect(() => {
    if (user) fetchCommissions();
  }, [user]);

  const handleMarkPaid = async (id: string) => {
    await supabase
      .from("commissions")
      .update({ status: "pago", paid_at: new Date().toISOString() })
      .eq("id", id);
    toast({ title: "Comissão marcada como paga" });
    fetchCommissions();
  };

  const handleCancel = async (id: string) => {
    await supabase.from("commissions").update({ status: "cancelado" }).eq("id", id);
    toast({ title: "Comissão cancelada" });
    fetchCommissions();
  };

  const filtered = filterStatus === "todos" ? commissions : commissions.filter((c) => c.status === filterStatus);

  const totalPending = commissions.filter((c) => c.status === "pendente").reduce((s, c) => s + Number(c.amount), 0);
  const totalPaid = commissions.filter((c) => c.status === "pago").reduce((s, c) => s + Number(c.amount), 0);
  const totalAll = commissions.reduce((s, c) => s + Number(c.amount), 0);

  if (authLoading)
    return (
      <CrmLayout>
        <div className="flex items-center justify-center h-64">Carregando...</div>
      </CrmLayout>
    );

  return (
    <CrmLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Comissões</h1>
        <p className="text-muted-foreground text-sm">Comissões automáticas geradas a partir dos contratos vinculados a parceiros</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Geral</span>
            <TrendingUp size={18} className="text-ivi-orange" />
          </div>
          <div className="font-display font-bold text-2xl">R$ {totalAll.toLocaleString("pt-BR")}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pendentes</span>
            <Clock size={18} className="text-warning" />
          </div>
          <div className="font-display font-bold text-2xl text-warning">R$ {totalPending.toLocaleString("pt-BR")}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pagas</span>
            <DollarSign size={18} className="text-success" />
          </div>
          <div className="font-display font-bold text-2xl text-success">R$ {totalPaid.toLocaleString("pt-BR")}</div>
        </Card>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-muted-foreground">Filtrar:</span>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="pago">Pagas</SelectItem>
            <SelectItem value="cancelado">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parceiro</TableHead>
              <TableHead>Contrato / Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="font-medium">{c.partner?.name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{c.partner?.company}</div>
                </TableCell>
                <TableCell>
                  <div>{c.contract?.client_name || "—"}</div>
                  {c.contract?.monthly_value && (
                    <div className="text-xs text-muted-foreground">
                      Contrato: R$ {Number(c.contract.monthly_value).toLocaleString("pt-BR")}/mês
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono font-semibold text-ivi-orange">
                  R$ {Number(c.amount).toLocaleString("pt-BR")}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[c.status] || ""}>
                    {statusLabels[c.status] || c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  {c.status === "pendente" && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="text-xs h-7 text-success border-success/30 hover:bg-success/10" onClick={() => handleMarkPaid(c.id)}>
                        <CheckCircle size={12} className="mr-1" /> Pagar
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive" onClick={() => handleCancel(c.id)}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                  {c.status === "pago" && c.paid_at && (
                    <span className="text-xs text-muted-foreground">
                      Pago em {new Date(c.paid_at).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhuma comissão {filterStatus !== "todos" ? statusLabels[filterStatus]?.toLowerCase() : ""}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </CrmLayout>
  );
};

export default Commissions;
