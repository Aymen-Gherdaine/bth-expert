/**
 * Notification email — Netlify event-triggered function.
 *
 * Déclenchée AUTOMATIQUEMENT par Netlify à chaque nouvelle soumission de
 * formulaire (événement "submission-created"). Le formulaire passe d'abord
 * par Netlify Forms (stockage dans le dashboard + filtrage anti-spam Akismet),
 * puis cette fonction envoie un email premium via Resend.
 *
 * Pour éviter le doublon, désactiver la notification email native de Netlify :
 * Site settings → Forms → Form notifications → supprimer "Email notification".
 *
 * Variables d'environnement :
 * - RESEND_API_KEY      : clé API Resend (dashboard.resend.com/api-keys) — REQUISE
 * - CONTACT_RECIPIENTS  : adresses destinataires séparées par des virgules — OPTIONNELLE
 *                         (ex: "a@x.com, b@y.com"). À défaut, valeur DEFAULT_RECIPIENTS.
 *
 * Le nom du fichier "submission-created" est imposé par Netlify : c'est le nom
 * de l'événement qui déclenche la fonction. Ne pas renommer.
 */

import type { Handler } from "@netlify/functions";

// Destinataires par défaut, utilisés si CONTACT_RECIPIENTS n'est pas défini
// sur Netlify. Pour modifier les destinataires sans toucher au code :
// Site configuration → Environment variables → CONTACT_RECIPIENTS.
const DEFAULT_RECIPIENTS = [
  "gherdaineaymen1995@gmail.com",
  "lahmerr.amine@gmail.com",
];

function getRecipients(): string[] {
  const fromEnv = process.env.CONTACT_RECIPIENTS;
  if (!fromEnv) return DEFAULT_RECIPIENTS;
  const list = fromEnv
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);
  return list.length > 0 ? list : DEFAULT_RECIPIENTS;
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  "etude-impact": "Étude d'impact environnemental",
  "etude-dangers": "Étude de dangers",
  "plan-gestion": "Plan de gestion environnementale",
  "audit-env": "Audit environnemental",
  "eie": "Étude d'impact environnemental",
  "autre": "Autre / Non précisé",
};

export const handler: Handler = async (event) => {
  let data: Record<string, string> = {};
  try {
    const parsed = JSON.parse(event.body ?? "{}");
    data = parsed?.payload?.data ?? {};
  } catch {
    console.error("Payload Netlify illisible");
    return { statusCode: 400, body: "Bad payload" };
  }

  const name        = (data.name ?? "").trim();
  const email       = (data.email ?? "").trim();
  const phone       = (data.phone ?? "").trim();
  const projectType = (data.projectType ?? "").trim();
  const message     = (data.message ?? "").trim();

  if (!name || !phone || !message) {
    // Soumission incomplète (probablement spam filtré) — on ignore sans erreur.
    return { statusCode: 200, body: "Skipped" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY non défini");
    return { statusCode: 500, body: "Config manquante" };
  }

  const projectLabel = PROJECT_TYPE_LABELS[projectType] ?? projectType ?? "Non précisé";

  const date = new Intl.DateTimeFormat("fr-DZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Algiers",
  }).format(new Date());

  const html = buildEmail({ name, email, phone, projectLabel, message, date });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BTH Expert <contact@bthexpert.com>",
        to: getRecipients(),
        ...(email ? { reply_to: email } : {}),
        subject: `Nouveau message de ${name} — BTH Expert`,
        html,
        headers: {
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          "Importance": "high",
        },
      }),
    });

    if (!res.ok) {
      console.error("Erreur Resend:", await res.text());
      return { statusCode: 502, body: "Échec d'envoi" };
    }

    return { statusCode: 200, body: "OK" };
  } catch (err) {
    console.error("Erreur fonction submission-created:", err);
    return { statusCode: 500, body: "Erreur interne" };
  }
};

// ─── HTML email template ────────────────────────────────────────────────────

interface EmailData {
  name: string;
  email: string;
  phone: string;
  projectLabel: string;
  message: string;
  date: string;
}

function buildEmail(d: EmailData): string {
  const e = escapeHtml;
  const sans = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const serif = "Georgia,'Times New Roman',serif";

  const emailValue = d.email
    ? `<a href="mailto:${e(d.email)}" style="color:#1a2e1e;text-decoration:none;border-bottom:1px solid #c9a96e;">${e(d.email)}</a>`
    : `<span style="color:#9aa39a;">Non renseigné</span>`;

  const replyBtn = d.email
    ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:34px;">
        <tr>
          <td style="border-radius:8px;background-color:#1a2e1e;">
            <a href="mailto:${e(d.email)}?subject=Re%3A%20Votre%20demande%20%E2%80%94%20BTH%20Expert"
               style="display:inline-block;font-family:${sans};font-size:14px;font-weight:600;
                      color:#f5f0e8;text-decoration:none;padding:14px 34px;letter-spacing:0.02em;">
              Répondre à ${e(d.name)}
            </a>
          </td>
        </tr>
      </table>`
    : "";

  const row = (label: string, value: string, last = false) => `
              <tr>
                <td width="120" valign="middle"
                    style="padding:16px 24px 16px 0;white-space:nowrap;
                           ${last ? "" : "border-bottom:1px solid #ece5d6;"}
                           font-family:${sans};font-size:11px;color:#6b7455;
                           text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">
                  ${label}
                </td>
                <td valign="middle"
                    style="padding:16px 0;${last ? "" : "border-bottom:1px solid #ece5d6;"}
                           font-family:${sans};font-size:15px;color:#1a2e1e;line-height:1.5;">
                  ${value}
                </td>
              </tr>`;

  return `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Nouvelle demande — BTH Expert</title>
  <style>
    :root { color-scheme: light only; }

    /* Gmail Android dark mode — injecte [data-ogsc] sur <html> */
    [data-ogsc] body,
    [data-ogsc] .email-wrapper { background-color: #f5f0e8 !important; }
    [data-ogsc] .email-card   { background-color: #ffffff !important; }
    [data-ogsc] .email-card td,
    [data-ogsc] td,
    [data-ogsc] p,
    [data-ogsc] span           { color: #1a2e1e !important;
                                  background-color: inherit !important; }
    [data-ogsc] .bg-cream      { background-color: #faf7f2 !important; }
    [data-ogsc] .bg-green      { background-color: #1a2e1e !important; }
    [data-ogsc] .bg-gold       { background-color: #c9a96e !important; }
    [data-ogsc] .color-muted   { color: #6b7455 !important; }
    [data-ogsc] .color-faded   { color: #9aa39a !important; }
    [data-ogsc] .color-gold    { color: #a88a4c !important; }
    [data-ogsc] .color-cream   { color: #f5f0e8 !important; }
    [data-ogsc] .border-light  { border-color: #ece5d6 !important; }

    /* Fallback @media pour autres clients */
    @media (prefers-color-scheme: dark) {
      body                     { background-color: #f5f0e8 !important; }
      .email-card              { background-color: #ffffff !important; }
      td, p, span              { color: #1a2e1e !important; }
      .bg-cream                { background-color: #faf7f2 !important; }
      .bg-green                { background-color: #1a2e1e !important; }
      .bg-gold                 { background-color: #c9a96e !important; }
      .color-muted             { color: #6b7455 !important; }
      .color-faded             { color: #9aa39a !important; }
      .color-gold              { color: #a88a4c !important; }
      .color-cream             { color: #f5f0e8 !important; }
    }
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;background-color:#f5f0e8;"
      bgcolor="#f5f0e8">

<!-- Préheader masqué -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">
  Nouvelle demande de contact de ${e(d.name)} · ${e(d.projectLabel)}
</div>

<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" border="0"
       bgcolor="#f5f0e8"
       style="background-color:#f5f0e8;padding:40px 16px;">
  <tr>
    <td align="center">

      <!-- Conteneur 600px -->
      <table class="email-card" width="600" cellpadding="0" cellspacing="0" border="0"
             bgcolor="#ffffff"
             style="max-width:600px;width:100%;background-color:#ffffff;
                    border:1px solid #e7ded0;border-radius:8px;overflow:hidden;
                    box-shadow:0 1px 3px rgba(26,46,30,0.05);">

        <!-- ── LOGO ───────────────────────────────────────── -->
        <tr>
          <td align="center" style="padding:40px 40px 0;background-color:#ffffff;"
              bgcolor="#ffffff">
            <img src="https://bthexpert.com/bth-expert-logo-email.png"
                 width="156" height="44" alt="BTH Expert"
                 style="display:block;border:0;outline:none;text-decoration:none;
                        height:44px;width:156px;">
          </td>
        </tr>

        <!-- filet or -->
        <tr>
          <td align="center" style="padding:26px 40px 0;background-color:#ffffff;"
              bgcolor="#ffffff">
            <table cellpadding="0" cellspacing="0" border="0" width="44">
              <tr><td class="bg-gold" style="height:2px;background-color:#c9a96e;font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <!-- ── EN-TÊTE ────────────────────────────────────── -->
        <tr>
          <td align="center" style="padding:24px 40px 0;background-color:#ffffff;"
              bgcolor="#ffffff">
            <p class="color-muted" style="margin:0 0 8px;font-family:${sans};font-size:11px;color:#6b7455;
                       text-transform:uppercase;letter-spacing:0.16em;font-weight:600;">
              Formulaire de contact
            </p>
            <p style="margin:0 0 6px;font-family:${serif};font-size:26px;color:#1a2e1e;
                       font-weight:400;line-height:1.25;">
              Nouvelle demande reçue
            </p>
            <p class="color-faded" style="margin:0;font-family:${sans};font-size:13px;color:#9aa39a;
                       letter-spacing:0.01em;">
              ${e(d.date)}
            </p>
          </td>
        </tr>

        <!-- ── INFOS ──────────────────────────────────────── -->
        <tr>
          <td style="padding:32px 40px 0;background-color:#ffffff;" bgcolor="#ffffff">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              ${row("Nom", `<strong style="font-weight:600;color:#1a2e1e;">${e(d.name)}</strong>`)}
              ${row("Email", emailValue)}
              ${row("Téléphone", `<a href="tel:${e(d.phone)}" style="color:#1a2e1e;text-decoration:none;">${e(d.phone)}</a>`)}
              ${row("Projet", `<span style="color:#1a2e1e;font-weight:600;">${e(d.projectLabel)}</span>`, true)}
            </table>
          </td>
        </tr>

        <!-- ── MESSAGE ────────────────────────────────────── -->
        <tr>
          <td style="padding:30px 40px 0;background-color:#ffffff;" bgcolor="#ffffff">
            <p class="color-muted" style="margin:0 0 12px;font-family:${sans};font-size:11px;color:#6b7455;
                       text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">
              Message
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="border:1px solid #ece5d6;border-radius:8px;">
              <tr>
                <td class="bg-gold" width="3" style="background-color:#c9a96e;font-size:0;line-height:0;">&nbsp;</td>
                <td class="bg-cream" style="padding:22px 24px;background-color:#faf7f2;" bgcolor="#faf7f2">
                  <p style="margin:0;font-family:${serif};font-size:16px;color:#3d4a40;
                             line-height:1.8;white-space:pre-wrap;">${e(d.message)}</p>
                </td>
              </tr>
            </table>

            ${replyBtn}
          </td>
        </tr>

        <!-- ── FOOTER ─────────────────────────────────────── -->
        <tr>
          <td style="padding:40px 40px 36px;background-color:#ffffff;" bgcolor="#ffffff">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td class="border-light" style="border-top:1px solid #ece5d6;font-size:0;line-height:0;padding-bottom:24px;">&nbsp;</td></tr>
              <tr>
                <td align="left">
                  <p style="margin:0 0 5px;font-family:${serif};font-size:14px;
                             color:#1a2e1e;font-weight:400;letter-spacing:0.02em;">
                    BTH Expert
                  </p>
                  <p class="color-faded" style="margin:0 0 18px;font-family:${sans};font-size:11px;color:#9aa39a;
                             line-height:1.8;">
                    40, Lotissement 119 · Bir El Djir, Oran · Algérie<br>
                    +213 (670) 70 81 38 · contact@bthexpert.com
                  </p>
                </td>
              </tr>
              <tr><td class="border-light" style="border-top:1px solid #ece5d6;font-size:0;line-height:0;padding-bottom:18px;">&nbsp;</td></tr>
              <tr>
                <td align="left">
                  <a href="https://bthexpert.com" class="color-gold"
                     style="font-family:${sans};font-size:12px;color:#a88a4c;
                            text-decoration:none;font-weight:600;letter-spacing:0.02em;">
                    bthexpert.com
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!-- /conteneur -->

    </td>
  </tr>
</table>

</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
