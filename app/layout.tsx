import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DCG RH Sem Riscos | Conformidade NR-1",
  description: "Plataforma de gestão de riscos e conformidade NR-1 para empresas. Powered by DCG Corretora de Seguros LTDA — 28 anos de mercado.",
  keywords: ["NR-1", "RH", "conformidade", "riscos psicossociais", "saúde ocupacional", "DCG"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
