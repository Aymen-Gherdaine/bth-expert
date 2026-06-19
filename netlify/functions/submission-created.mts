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
  const replyBtn = d.email
    ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
        <tr>
          <td align="center">
            <a href="mailto:${e(d.email)}?subject=Re%3A%20Votre%20demande%20%E2%80%94%20BTH%20Expert"
               style="display:inline-block;background-color:#1a2e1e;color:#C9A96E;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.06em;">
              &#8594;&nbsp; Répondre à ${e(d.name)}
            </a>
          </td>
        </tr>
      </table>`
    : "";

  const emailRow = d.email
    ? `<a href="mailto:${e(d.email)}" style="color:#1a2e1e;text-decoration:none;border-bottom:1px solid #C9A96E;">${e(d.email)}</a>`
    : `<span style="color:#b0bab0;font-style:italic;">Non renseigné</span>`;

  return `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Nouveau message — BTH Expert</title>
</head>
<body style="margin:0;padding:0;background-color:#eae6dc;">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background-color:#eae6dc;padding:40px 16px;">
  <tr>
    <td align="center">

      <!-- Conteneur principal 600px -->
      <table width="600" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px;width:100%;border-radius:14px;overflow:hidden;
                    box-shadow:0 8px 32px rgba(26,46,30,0.16);">

        <!-- ── HEADER ─────────────────────────────────────── -->
        <tr>
          <td style="background-color:#1a2e1e;padding:32px 40px 26px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="middle">
                  <p style="margin:0 0 3px;font-family:Georgia,'Times New Roman',serif;
                             font-size:20px;font-weight:700;color:#C9A96E;
                             letter-spacing:0.08em;text-transform:uppercase;">
                    BTH Expert
                  </p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                             font-size:11px;color:rgba(201,169,110,0.55);
                             letter-spacing:0.12em;text-transform:uppercase;">
                    Bureau d'études environnemental agréé
                  </p>
                </td>
                <td align="right" valign="middle">
                  <span style="display:inline-block;background:rgba(201,169,110,0.14);
                               border:1px solid rgba(201,169,110,0.35);border-radius:20px;
                               padding:5px 14px;font-family:Arial,Helvetica,sans-serif;
                               font-size:10px;color:#C9A96E;letter-spacing:0.1em;
                               text-transform:uppercase;font-weight:700;">
                    Nouveau message
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- barre or -->
        <tr>
          <td style="background-color:#C9A96E;height:3px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- ── CORPS ──────────────────────────────────────── -->
        <tr>
          <td style="background-color:#ffffff;padding:36px 40px 32px;">

            <!-- Titre + date -->
            <p style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;
                       font-size:22px;font-weight:700;color:#1a2e1e;line-height:1.3;">
              Un client vous a contacté
            </p>
            <p style="margin:0 0 30px;font-family:Arial,Helvetica,sans-serif;
                       font-size:12px;color:#8a9a8a;letter-spacing:0.02em;">
              ${e(d.date)} · bthexpert.com
            </p>

            <!-- Carte info ─────────────────────────────── -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="border-radius:10px;overflow:hidden;border:1px solid #e8e2d8;
                          margin-bottom:26px;">

              <!-- En-tête carte -->
              <tr>
                <td colspan="2"
                    style="background-color:#1a2e1e;padding:11px 20px;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                             font-size:10px;font-weight:700;color:#C9A96E;
                             letter-spacing:0.12em;text-transform:uppercase;">
                    Informations de contact
                  </p>
                </td>
              </tr>

              <!-- Nom -->
              <tr style="background-color:#faf8f4;">
                <td width="120"
                    style="padding:13px 20px;font-family:Arial,Helvetica,sans-serif;
                           font-size:11px;color:#7a8a7a;text-transform:uppercase;
                           letter-spacing:0.07em;font-weight:700;
                           border-bottom:1px solid #ede9e1;">
                  Nom
                </td>
                <td style="padding:13px 20px;font-family:Arial,Helvetica,sans-serif;
                           font-size:15px;color:#1a2e1e;font-weight:700;
                           border-bottom:1px solid #ede9e1;">
                  ${e(d.name)}
                </td>
              </tr>

              <!-- Email -->
              <tr style="background-color:#ffffff;">
                <td width="120"
                    style="padding:13px 20px;font-family:Arial,Helvetica,sans-serif;
                           font-size:11px;color:#7a8a7a;text-transform:uppercase;
                           letter-spacing:0.07em;font-weight:700;
                           border-bottom:1px solid #ede9e1;">
                  Email
                </td>
                <td style="padding:13px 20px;font-family:Arial,Helvetica,sans-serif;
                           font-size:14px;color:#1a2e1e;
                           border-bottom:1px solid #ede9e1;">
                  ${emailRow}
                </td>
              </tr>

              <!-- Téléphone -->
              <tr style="background-color:#faf8f4;">
                <td width="120"
                    style="padding:13px 20px;font-family:Arial,Helvetica,sans-serif;
                           font-size:11px;color:#7a8a7a;text-transform:uppercase;
                           letter-spacing:0.07em;font-weight:700;
                           border-bottom:1px solid #ede9e1;">
                  Téléphone
                </td>
                <td style="padding:13px 20px;font-family:Arial,Helvetica,sans-serif;
                           font-size:15px;color:#1a2e1e;font-weight:700;
                           border-bottom:1px solid #ede9e1;">
                  <a href="tel:${e(d.phone)}"
                     style="color:#1a2e1e;text-decoration:none;">
                    ${e(d.phone)}
                  </a>
                </td>
              </tr>

              <!-- Projet -->
              <tr style="background-color:#ffffff;">
                <td width="120"
                    style="padding:13px 20px;font-family:Arial,Helvetica,sans-serif;
                           font-size:11px;color:#7a8a7a;text-transform:uppercase;
                           letter-spacing:0.07em;font-weight:700;">
                  Projet
                </td>
                <td style="padding:13px 20px;">
                  <span style="display:inline-block;background-color:#1a2e1e;
                               color:#C9A96E;font-family:Arial,Helvetica,sans-serif;
                               font-size:11px;font-weight:700;padding:5px 14px;
                               border-radius:20px;letter-spacing:0.05em;">
                    ${e(d.projectLabel)}
                  </span>
                </td>
              </tr>

            </table>
            <!-- /carte info -->

            <!-- Bloc message ─────────────────────────── -->
            <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;
                       font-size:10px;font-weight:700;color:#7a8a7a;
                       text-transform:uppercase;letter-spacing:0.12em;">
              Message
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="3" style="background-color:#C9A96E;border-radius:3px;">&nbsp;</td>
                <td style="padding:18px 20px;background-color:#F5F0E8;border-radius:0 8px 8px 0;">
                  <p style="margin:0;font-family:Georgia,'Times New Roman',serif;
                             font-size:15px;color:#1a2e1e;line-height:1.85;
                             white-space:pre-wrap;">
                    ${e(d.message)}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Bouton répondre -->
            ${replyBtn}

          </td>
        </tr>

        <!-- ── FOOTER ─────────────────────────────────────── -->
        <tr>
          <td style="background-color:#f5f1ea;border-top:1px solid #e4dfd4;
                     padding:22px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="top">
                  <p style="margin:0 0 3px;font-family:Georgia,'Times New Roman',serif;
                             font-size:13px;font-weight:700;color:#1a2e1e;">
                    BTH Expert
                  </p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                             font-size:11px;color:#9aaa9a;line-height:1.7;">
                    40, Lotissement 119 · Bir El Djir, Oran · Algérie<br>
                    +213 (670) 70 81 38 · info@bthexpert.dz
                  </p>
                </td>
                <td align="right" valign="top">
                  <a href="https://bthexpert.com"
                     style="font-family:Arial,Helvetica,sans-serif;
                            font-size:12px;color:#C9A96E;text-decoration:none;
                            font-weight:700;">
                    bthexpert.com &#8599;
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
