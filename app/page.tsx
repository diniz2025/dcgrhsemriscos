export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center max-w-2xl">
        {/* Logo DCG */}
        <div className="mb-8">
          <span className="text-5xl font-bold" style={{ color: "#1565A8" }}>DCG</span>
          <span className="text-2xl text-gray-600 ml-2">RH Sem Riscos</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Conformidade NR-1 para sua empresa
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Gestão de riscos psicossociais, saúde ocupacional e benefícios corporativos.
          Powered by <strong>DCG Corretora de Seguros LTDA</strong> — 28 anos de mercado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://ivinr1.com"
            className="px-8 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1565A8" }}
          >
            Acessar Plataforma IVI
          </a>
          <a
            href="https://wa.me/5511994104891"
            className="px-8 py-3 rounded-lg border-2 font-semibold transition-colors hover:bg-gray-50"
            style={{ borderColor: "#1565A8", color: "#1565A8" }}
          >
            (11) 99410-4891
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-12">
          © 2026 DCG Corretora de Seguros LTDA — CNPJ 16.383.565/0001-35 — SUSEP · ANS · LGPD
        </p>
        <p className="text-xs text-gray-400 mt-1">
          &quot;Acredite firmemente no seu gênio criador, na força ativa da mente, nas maravilhas do amor.&quot; — Dinamor
        </p>
      </div>
    </main>
  );
}
