export interface CheckItem {
  id: string;
  label: string;
  detail: string;
}

export interface CheckCategory {
  id: string;
  title: string;
  emoji: string;
  items: CheckItem[];
}

export const checklistData: CheckCategory[] = [
  {
    id: "rh",
    title: "RH — Recursos Humanos",
    emoji: "👥",
    items: [
      { id: "rh-1", label: "ASO (admissional, periódico, demissional) em dia", detail: "Conferir prazos e validade de todos os ASOs ativos." },
      { id: "rh-2", label: "Fichas de EPI com assinatura do trabalhador", detail: "Registro de entrega, troca e orientação de uso." },
      { id: "rh-3", label: "Integração de segurança para novos colaboradores", detail: "Treinamento admissional com registro (ata + lista de presença)." },
      { id: "rh-4", label: "Controle de jornada atualizado", detail: "Banco de horas, horas extras, pausas — evidências de gestão." },
      { id: "rh-5", label: "Registro de afastamentos e CAT", detail: "Comunicações de acidente do trabalho emitidas no prazo." },
      { id: "rh-6", label: "Canal de denúncias / ouvidoria ativo", detail: "Mecanismo acessível para relatos de assédio e riscos." },
    ],
  },
  {
    id: "sesmt",
    title: "SESMT — Segurança e Saúde",
    emoji: "🛡️",
    items: [
      { id: "sesmt-1", label: "PGR atualizado (inventário + plano de ação)", detail: "Documento revisado, assinado e acessível." },
      { id: "sesmt-2", label: "Inventário de riscos por atividade/função", detail: "Incluir riscos físicos, químicos, biológicos, ergonômicos e psicossociais." },
      { id: "sesmt-3", label: "Plano de ação com responsáveis e prazos", detail: "Cada risco com medida de controle, responsável e prazo." },
      { id: "sesmt-4", label: "PCMSO alinhado ao PGR", detail: "Exames coerentes com os riscos identificados." },
      { id: "sesmt-5", label: "Ordens de serviço assinadas", detail: "OS por função, com riscos e medidas, assinada pelo trabalhador." },
      { id: "sesmt-6", label: "DDS / diálogos de segurança registrados", detail: "Atas ou listas de presença dos diálogos periódicos." },
      { id: "sesmt-7", label: "Laudos técnicos válidos (LTCAT, laudo ergonômico)", detail: "Verificar validade e escopo dos laudos." },
    ],
  },
  {
    id: "juridico",
    title: "Jurídico / Compliance",
    emoji: "⚖️",
    items: [
      { id: "jur-1", label: "Política de SST formalizada", detail: "Documento aprovado pela direção e comunicado a todos." },
      { id: "jur-2", label: "Política anti-assédio publicada", detail: "Inclui canais, fluxo de apuração e medidas." },
      { id: "jur-3", label: "Termos de responsabilidade atualizados", detail: "Termos para terceiros, visitantes e prestadores." },
      { id: "jur-4", label: "Revisão de contratos com terceirizadas", detail: "Cláusulas de SST e corresponsabilidade." },
      { id: "jur-5", label: "Mapeamento de passivo trabalhista (SST)", detail: "Ações judiciais e reclamações envolvendo SST." },
    ],
  },
  {
    id: "lideranca",
    title: "Lideranças / Gestão",
    emoji: "📋",
    items: [
      { id: "lid-1", label: "Líderes treinados em riscos psicossociais", detail: "Capacitação documentada sobre assédio, sobrecarga, gestão de clima." },
      { id: "lid-2", label: "Reuniões periódicas de SST com ata", detail: "Evidência de governança e acompanhamento." },
      { id: "lid-3", label: "Indicadores de SST acompanhados", detail: "Taxa de frequência, gravidade, absenteísmo, near-miss." },
      { id: "lid-4", label: "Plano de contingência / emergência testado", detail: "Simulados realizados e registrados." },
      { id: "lid-5", label: "Feedback e escuta ativa documentados", detail: "Pesquisa de clima, rodas de conversa, 1:1 sobre bem-estar." },
    ],
  },
];
