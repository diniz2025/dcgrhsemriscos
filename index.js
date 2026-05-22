
require('dotenv').config()
const { Resend } = require('resend')
const resendClient = new Resend(process.env.RESEND_API_KEY)
const express  = require('express')
const nodemailer = require('nodemailer')
const fetch    = require('node-fetch')

const app = express()
app.use(express.json())

// ── CONFIG ────────────────────────────────────────────────────────────────
const MP_TOKEN       = process.env.MP_ACCESS_TOKEN
const ZAPI_INSTANCE  = process.env.ZAPI_INSTANCE_ID
const ZAPI_TOKEN     = process.env.ZAPI_TOKEN
const ZAPI_CLIENT    = process.env.ZAPI_CLIENT_TOKEN
const IVI_SITE       = process.env.IVI_SITE || 'https://diseg.base44.app/NR1IVI'
const PORT           = process.env.PORT || 3050

// ── PLANOS ────────────────────────────────────────────────────────────────
const PLANOS = {
  starter: { nome: 'Starter', preco: 'R$ 199/mês', faixa: 'até 10 funcionários' },
  pme:     { nome: 'PME',     preco: 'R$ 299/mês', faixa: 'até 25 funcionários' },
  empresa: { nome: 'Empresa', preco: 'R$ 499/mês', faixa: 'até 50 funcionários' },
  corp:    { nome: 'Corporativo', preco: 'Sob consulta', faixa: 'acima de 50 funcionários' },
}

// ── NODEMAILER ────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// ── FUNÇÕES AUXILIARES ─────────────────────────────────────────────────────
async function getPayment(id) {
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${MP_TOKEN}` },
  })
  if (!r.ok) return null
  return r.json()
}

async function enviarWhatsApp(fone, nome, planoId) {
  if (!fone) return { success: false, error: 'Sem telefone' }
  const numero = fone.replace(/\D/g, '').startsWith('55')
    ? fone.replace(/\D/g, '')
    : '55' + fone.replace(/\D/g, '')

  const plano = PLANOS[planoId] || PLANOS.starter

  const msg =
`Olá, ${nome}! 👋

Sua assinatura do *Plano IVI NR-1 ${plano.nome}* está confirmada! ✅

📋 *Resumo da contratação:*
• Plano: *${plano.nome}* (${plano.faixa})
• Valor: *${plano.preco}*
• Cobertura: Todos os recursos IVI inclusos ✅

*O que está incluso em todos os planos:*
✅ Mapeamento NR-1 completo (HSE)
✅ Documentação válida para fiscalização (MTE)
✅ App IVI para colaboradores
✅ IVI Assistente IA 24h/7 dias
✅ Rastreio de ansiedade e depressão
✅ Psicoterapia online
✅ Relatórios mensais e trimestrais
✅ Workshops para líderes

📅 *Adequação NR-1 concluída em 48 horas após o início do questionário.*

A Carolina Dassie entrará em contato em breve para dar início ao onboarding.

📞 Contato Carolina: (11) 98291-8252
🌐 ${IVI_SITE}

Obrigado por confiar na plataforma IVI! 💚`

  try {
    const r = await fetch(
      `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Client-Token': ZAPI_CLIENT },
        body: JSON.stringify({ phone: numero, message: msg }),
      }
    )
    const d = await r.json()
    console.log(`[IVI WPP] → ${numero}:`, d.messageId || JSON.stringify(d).slice(0, 80))
    return { success: true, messageId: d.messageId }
  } catch (e) {
    console.error('[IVI WPP] Erro:', e.message)
    return { success: false, error: e.message }
  }
}

async function enviarEmail(emailDest, nome, planoId) {
  const plano = PLANOS[planoId] || PLANOS.starter

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9f4f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">

    <!-- Header IVI -->
    <div style="background:linear-gradient(135deg,#E8714A 0%,#d4603a 100%);padding:32px 40px;text-align:center;">
      <div style="font-size:36px;font-weight:900;letter-spacing:8px;font-style:italic;color:#fff;margin-bottom:6px;">i v i</div>
      <p style="color:rgba(255,255,255,0.85);margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Tecnologia para transformar a saúde mental</p>
    </div>

    <!-- Urgência NR-1 -->
    <div style="background:#B71C1C;padding:10px 40px;text-align:center;">
      <p style="margin:0;color:#fff;font-size:13px;font-weight:700;">✅ Pagamento confirmado — Prazo NR-1: 26/05/2026</p>
    </div>

    <!-- Corpo -->
    <div style="padding:40px;">
      <h2 style="color:#E8714A;margin-top:0;font-size:22px;">Bem-vindo à plataforma IVI, ${nome}! 🎉</h2>
      <p style="color:#555;font-size:15px;line-height:1.7;">
        Sua assinatura do <strong>Plano ${plano.nome}</strong> (${plano.faixa}) foi confirmada com sucesso.
      </p>

      <!-- Box plano -->
      <div style="background:#fff8f5;border-left:4px solid #E8714A;border-radius:0 8px 8px 0;padding:20px 24px;margin:24px 0;">
        <p style="margin:0 0 6px;font-weight:700;color:#E8714A;font-size:14px;">📋 Resumo da contratação:</p>
        <p style="margin:0 0 4px;font-size:14px;color:#333;">• Plano: <strong>${plano.nome}</strong></p>
        <p style="margin:0 0 4px;font-size:14px;color:#333;">• Faixa: <strong>${plano.faixa}</strong></p>
        <p style="margin:0;font-size:14px;color:#333;">• Valor: <strong>${plano.preco}</strong></p>
      </div>

      <!-- Cobertura -->
      <p style="font-weight:700;color:#333;margin-bottom:12px;">✅ Toda a cobertura IVI está inclusa:</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="vertical-align:top;padding-right:10px;">
            <p style="margin:0 0 8px;font-size:13px;color:#555;">✅ Mapeamento NR-1 (HSE)</p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;">✅ Documentação MTE válida</p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;">✅ App IVI colaboradores</p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;">✅ IVI Assistente IA 24h</p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;">✅ Rastreio ansiedade/depressão</p>
            <p style="margin:0;font-size:13px;color:#555;">✅ Psicoterapia online</p>
          </td>
          <td width="50%" style="vertical-align:top;">
            <p style="margin:0 0 8px;font-size:13px;color:#555;">✅ Pesquisa de clima</p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;">✅ Relatórios mensais/trimestrais</p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;">✅ Workshops para líderes</p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;">✅ Atualização automática normas</p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;">✅ Plano de cuidado personalizado</p>
            <p style="margin:0;font-size:13px;color:#555;">✅ Adequação NR-1 em 48h</p>
          </td>
        </tr>
      </table>

      <!-- Próximos passos -->
      <div style="background:#e8f5e9;border-radius:8px;padding:20px;margin:28px 0;">
        <p style="margin:0 0 8px;font-weight:700;color:#2e7d32;font-size:14px;">🚀 Próximos passos:</p>
        <p style="margin:0 0 6px;font-size:13px;color:#2e7d32;">1. A Carolina Dassie entrará em contato em até 2 horas úteis</p>
        <p style="margin:0 0 6px;font-size:13px;color:#2e7d32;">2. Início do questionário HSE com seus colaboradores</p>
        <p style="margin:0;font-size:13px;color:#2e7d32;">3. Documentação NR-1 disponível em até 48 horas</p>
      </div>

      <!-- Contato Carolina -->
      <div style="background:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
        <p style="margin:0 0 4px;font-weight:700;color:#333;font-size:14px;">📞 Contato direto — Carolina Dassie</p>
        <p style="margin:0 0 4px;font-size:13px;color:#666;">WhatsApp: <a href="https://wa.me/5511982918252" style="color:#E8714A;">(11) 98291-8252</a></p>
        <p style="margin:0;font-size:13px;color:#666;">E-mail: <a href="mailto:carolina.dassie@hisnek.com" style="color:#E8714A;">carolina.dassie@hisnek.com</a></p>
      </div>

      <div style="text-align:center;margin-top:32px;">
        <a href="${IVI_SITE}" style="background:#E8714A;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
          Acessar Plataforma IVI →
        </a>
      </div>
    </div>

    <!-- Footer LGPD -->
    <div style="padding:20px 40px;border-top:1px solid #f0e8e4;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;color:#aaa;">Plataforma desenvolvida pela Hisnek · minhaivi.com</p>
      <p style="margin:0;font-size:11px;color:#aaa;">Em conformidade com a LGPD (Lei 13.709/2018) · © 2026 IVI by Hisnek</p>
    </div>
  </div>
</body>
</html>`

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: emailDest,
      subject: `✅ Assinatura IVI NR-1 confirmada — Plano ${plano.nome}`,
      html,
    })
    console.log(`[IVI Email] Enviado para ${emailDest} | ${info.messageId}`)
    return { success: true, id: info.messageId }
  } catch (e) {
    console.error('[IVI Email] SMTP erro, tentando Resend:', e.message)
    // Fallback: Resend
    try {
      const plano = PLANOS[planoId] || PLANOS.starter
      const { data, error } = await resendClient.emails.send({
        from: 'IVI NR-1 | DCG <contato@dcgseguros.io>',
        to: emailDest,
        subject: `✅ Assinatura IVI NR-1 confirmada — Plano ${plano.nome}`,
        html: `<p>Olá <strong>${nome}</strong>!</p><p>Sua assinatura do <strong>Plano IVI NR-1 ${plano.nome}</strong> (${plano.faixa} · ${plano.preco}) está confirmada. ✅</p><p>Toda a cobertura IVI está inclusa. A Carolina Dassie entrará em contato em breve para o onboarding.</p><p>📞 (11) 98291-8252 · carolina.dassie@hisnek.com</p>`,
      })
      if (error) throw new Error(JSON.stringify(error))
      console.log('[IVI Resend] Fallback ok:', data?.id)
      return { success: true, id: data?.id, via: 'resend' }
    } catch(e2) {
      console.error('[IVI Resend] Fallback falhou:', e2.message)
      return { success: false, error: e2.message }
    }
  }
}

// ── ROTAS ──────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ ok: true, service: 'IVI NR-1 Webhook v1.0', ts: new Date().toISOString() }))

// Webhook Mercado Pago
app.post('/webhook/mp', async (req, res) => {
  try {
    const body = req.body
    console.log('[IVI Webhook] Evento:', JSON.stringify(body).slice(0, 300))

    const isPayment = body.type === 'payment' || (body.action && body.action.startsWith('payment'))
    if (!isPayment) return res.json({ ok: true, ignored: true })

    const paymentId = body.data?.id
    if (!paymentId) return res.json({ ok: true, ignored: true })

    const payment = await getPayment(String(paymentId))
    if (!payment) return res.status(404).json({ error: 'Pagamento não encontrado' })

    console.log('[IVI Webhook] Status:', payment.status)

    if (payment.status !== 'approved') {
      return res.json({ ok: true, status: payment.status })
    }

    // Extrair dados do pagador
    const nome      = payment.payer?.first_name || 'Cliente'
    const email     = payment.payer?.email || ''
    const fone      = payment.payer?.phone?.number || ''
    const planoId   = payment.metadata?.plano || payment.external_reference?.split('_')[1] || 'starter'

    console.log(`[IVI Webhook] ✅ Pagamento aprovado | ${nome} | ${email} | plano: ${planoId}`)

    // Disparar WPP + Email em paralelo
    const [wpp, mail] = await Promise.allSettled([
      enviarWhatsApp(fone, nome, planoId),
      enviarEmail(email, nome, planoId),
    ])

    console.log('[IVI Webhook] WPP:', wpp.status, '| Email:', mail.status)
    return res.json({ ok: true, nome, planoId, wpp: wpp.status, email: mail.status })

  } catch (e) {
    console.error('[IVI Webhook] Erro:', e.message)
    return res.status(500).json({ error: 'Erro interno' })
  }
})

// Teste manual de notificação
app.post('/notificar/teste', async (req, res) => {
  const { nome, email, fone, plano } = req.body
  if (!nome || !email) return res.status(400).json({ error: 'nome e email obrigatórios' })

  const [wpp, mail] = await Promise.allSettled([
    fone ? enviarWhatsApp(fone, nome, plano || 'starter') : Promise.resolve({ success: false, error: 'sem fone' }),
    enviarEmail(email, nome, plano || 'starter'),
  ])

  return res.json({
    ok: true,
    wpp: wpp.status === 'fulfilled' ? wpp.value : wpp.reason,
    email: mail.status === 'fulfilled' ? mail.value : mail.reason,
  })
})

app.listen(PORT, () => console.log(`[IVI Webhook] Rodando na porta ${PORT}`))


