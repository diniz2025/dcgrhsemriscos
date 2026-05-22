import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, MailX, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "valid" | "already" | "invalid" | "submitting" | "success" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    document.title = "Cancelar inscrição — IVI";
    if (!token) {
      setStatus("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json();
        if (res.ok && data.valid) setStatus("valid");
        else if (data?.reason === "already_unsubscribed") setStatus("already");
        else setStatus("invalid");
      } catch {
        setStatus("invalid");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setStatus("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) setStatus("success");
      else if (data?.reason === "already_unsubscribed") setStatus("already");
      else {
        setErrorMsg(data?.error ?? "Erro inesperado");
        setStatus("error");
      }
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Falha ao processar");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6 py-16">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-sm text-center">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto mb-4 text-primary animate-spin" size={40} />
            <h1 className="font-display font-bold text-xl mb-2">Validando link...</h1>
            <p className="text-sm text-muted-foreground">Aguarde um instante.</p>
          </>
        )}
        {status === "valid" && (
          <>
            <MailX className="mx-auto mb-4 text-primary" size={40} />
            <h1 className="font-display font-bold text-xl mb-2">Cancelar inscrição</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Confirme abaixo para parar de receber e-mails da IVI neste endereço.
            </p>
            <Button onClick={confirm} className="rounded-full px-8">
              Confirmar cancelamento
            </Button>
          </>
        )}
        {status === "submitting" && (
          <>
            <Loader2 className="mx-auto mb-4 text-primary animate-spin" size={40} />
            <p className="text-sm text-muted-foreground">Processando...</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto mb-4 text-green-600" size={40} />
            <h1 className="font-display font-bold text-xl mb-2">Inscrição cancelada</h1>
            <p className="text-sm text-muted-foreground">
              Você não receberá mais e-mails da IVI. Sentiremos sua falta!
            </p>
          </>
        )}
        {status === "already" && (
          <>
            <CheckCircle2 className="mx-auto mb-4 text-muted-foreground" size={40} />
            <h1 className="font-display font-bold text-xl mb-2">Já cancelado</h1>
            <p className="text-sm text-muted-foreground">
              Este e-mail já foi removido da nossa lista anteriormente.
            </p>
          </>
        )}
        {(status === "invalid" || status === "error") && (
          <>
            <AlertCircle className="mx-auto mb-4 text-destructive" size={40} />
            <h1 className="font-display font-bold text-xl mb-2">Link inválido</h1>
            <p className="text-sm text-muted-foreground">
              {errorMsg || "Este link expirou ou não é válido. Tente clicar novamente no link mais recente do e-mail."}
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;
