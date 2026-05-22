import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CreditCard, Calendar, Building2, FileText, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: string;
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string;
  responsavel_nome: string;
  email: string;
  faixa_funcionarios: string | null;
}

interface Subscription {
  id: string;
  status: string;
  start_date: string | null;
  next_billing_date: string | null;
  plan: { name: string; employee_range: string; price: number; billing_cycle: string } | null;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  paid_at: string | null;
  created_at: string;
  transaction_id: string | null;
}

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Ativa", variant: "default" },
  pending: { label: "Pendente", variant: "secondary" },
  past_due: { label: "Em atraso", variant: "destructive" },
  cancelled: { label: "Cancelada", variant: "outline" },
  expired: { label: "Expirada", variant: "outline" },
  approved: { label: "Pago", variant: "default" },
  rejected: { label: "Recusado", variant: "destructive" },
  refunded: { label: "Estornado", variant: "outline" },
};

const MinhaContaPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    document.title = "Minha conta — IVI NR-1";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Painel da sua assinatura IVI NR-1: dados da empresa, plano contratado e histórico de pagamentos.");

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const userId = session.user.id;

      const [{ data: customers }, { data: subs }, { data: pays }] = await Promise.all([
        supabase.from("customers").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("subscriptions").select("*, plan:subscription_plans(name, employee_range, price, billing_cycle)").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("payments").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
      ]);

      setCustomer(customers as any);
      setSubscription(subs as any);
      setPayments((pays || []) as any);
      setLoading(false);
    };

    init();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da sua conta");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Minha conta</h1>
        <p className="text-muted-foreground mb-8">Gerencie sua assinatura, dados e histórico de pagamentos.</p>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-64 md:col-span-2" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Empresa */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle>Empresa</CardTitle>
                </div>
                <CardDescription>Dados cadastrais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {customer ? (
                  <>
                    <p><strong>Razão social:</strong> {customer.razao_social}</p>
                    {customer.nome_fantasia && <p><strong>Nome fantasia:</strong> {customer.nome_fantasia}</p>}
                    <p><strong>CNPJ:</strong> {customer.cnpj}</p>
                    <p><strong>Responsável:</strong> {customer.responsavel_nome}</p>
                    <p><strong>E-mail:</strong> {customer.email}</p>
                    {customer.faixa_funcionarios && <p><strong>Faixa:</strong> {customer.faixa_funcionarios}</p>}
                  </>
                ) : (
                  <p className="text-muted-foreground">Nenhuma empresa cadastrada ainda.</p>
                )}
              </CardContent>
            </Card>

            {/* Assinatura */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>Assinatura</CardTitle>
                </div>
                <CardDescription>Seu plano atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {subscription && subscription.plan ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{subscription.plan.name}</p>
                      <Badge variant={statusLabel[subscription.status]?.variant || "secondary"}>
                        {statusLabel[subscription.status]?.label || subscription.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{subscription.plan.employee_range}</p>
                    <p><strong>Valor:</strong> R$ {Number(subscription.plan.price).toFixed(2).replace(".", ",")} / {subscription.plan.billing_cycle}</p>
                    {subscription.start_date && <p><strong>Início:</strong> {new Date(subscription.start_date).toLocaleDateString("pt-BR")}</p>}
                    {subscription.next_billing_date && <p><strong>Próximo vencimento:</strong> {new Date(subscription.next_billing_date).toLocaleDateString("pt-BR")}</p>}
                  </>
                ) : (
                  <div>
                    <p className="text-muted-foreground mb-3">Você ainda não tem uma assinatura ativa.</p>
                    <Button asChild size="sm">
                      <Link to="/#planos">Ver planos</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagamentos */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle>Histórico de pagamentos</CardTitle>
                </div>
                <CardDescription>Últimos 10 pagamentos</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhum pagamento registrado ainda.</p>
                ) : (
                  <div className="space-y-3">
                    {payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">R$ {Number(p.amount).toFixed(2).replace(".", ",")}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.payment_method.toUpperCase()} · {new Date(p.paid_at || p.created_at).toLocaleDateString("pt-BR")}
                            {p.transaction_id && ` · ${p.transaction_id}`}
                          </p>
                        </div>
                        <Badge variant={statusLabel[p.status]?.variant || "secondary"}>
                          {statusLabel[p.status]?.label || p.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documentos / Cancelamento */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Outras ações</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:dcg@dcgrhsemriscos.com.br?subject=Segunda via de nota fiscal`}>
                    Solicitar nota fiscal
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:dcg@dcgrhsemriscos.com.br?subject=Alteração de plano`}>
                    Mudar de plano
                  </a>
                </Button>
                {subscription?.status === "active" && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:dcg@dcgrhsemriscos.com.br?subject=Solicitação de cancelamento`}>
                      Solicitar cancelamento
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
};

export default MinhaContaPage;
