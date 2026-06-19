/**
 * Fonction de contact — Netlify serverless function.
 *
 * Reçoit les données du formulaire de contact et les envoie par email
 * aux deux destinataires via l'API Resend.
 *
 * Variable d'environnement requise (à définir sur Netlify) :
 * - RESEND_API_KEY : clé API Resend (dashboard.resend.com/api-keys)
 *
 * Le domaine bthexpert.com doit être vérifié dans Resend pour que l'expéditeur
 * "contact@bthexpert.com" soit accepté sans passer en spam.
 */

import type { Context } from "@netlify/functions";

const RECIPIENTS = [
  "gherdaineaymen1995@gmail.com",
  "lahmerr.amine@gmail.com",
];

const PROJECT_TYPE_LABELS: Record<string, string> = {
  "etude-impact": "Étude d'impact environnemental",
  "etude-dangers": "Étude de dangers",
  "plan-gestion": "Plan de gestion environnementale",
  "audit-env": "Audit environnemental",
  "autre": "Autre / Non précisé",
};

export default async function handler(req: Request, _context: Context) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Parse URL-encoded body
  const text = await req.text();
  const params = new URLSearchParams(text);

  const botField = params.get("bot-field") ?? "";
  if (botField) {
    // Spam détecté — répondre 200 pour ne pas alerter le bot
    return new Response("OK", { status: 200 });
  }

  const name = params.get("name")?.trim() ?? "";
  const email = params.get("email")?.trim() ?? "";
  const phone = params.get("phone")?.trim() ?? "";
  const projectType = params.get("projectType")?.trim() ?? "";
  const message = params.get("message")?.trim() ?? "";

  if (!name || !phone || !projectType || !message) {
    return new Response("Champs obligatoires manquants", { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY non défini");
    return new Response("Erreur de configuration serveur", { status: 500 });
  }

  const projectLabel = PROJECT_TYPE_LABELS[projectType] ?? projectType;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Message BTH Expert</title></head>
<body style="font-family:sans-serif;color:#1a2e1e;max-width:600px;margin:0 auto;padding:24px">
  <div style="border-left:4px solid #C9A96E;padding-left:16px;margin-bottom:24px">
    <h1 style="margin:0 0 4px;font-size:20px">Nouveau message de contact</h1>
    <p style="margin:0;color:#666;font-size:13px">BTH Expert — bthexpert.com</p>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;width:140px;font-size:13px">Nom</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">${escapeHtml(name)}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee">${email ? `<a href="mailto:${escapeHtml(email)}" style="color:#1a2e1e">${escapeHtml(email)}</a>` : "Non renseigné"}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px">Téléphone</td><td style="padding:8px 0;border-bottom:1px solid #eee"><a href="tel:${escapeHtml(phone)}" style="color:#1a2e1e">${escapeHtml(phone)}</a></td></tr>
    <tr><td style="padding:8px 0;color:#666;font-size:13px">Type de projet</td><td style="padding:8px 0">${escapeHtml(projectLabel)}</td></tr>
  </table>
  <div style="background:#F5F0E8;border-radius:8px;padding:16px">
    <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#888">Message</p>
    <p style="margin:0;line-height:1.7;white-space:pre-wrap">${escapeHtml(message)}</p>
  </div>
  ${email ? `<p style="margin-top:24px;font-size:13px;color:#666">Répondre directement à : <a href="mailto:${escapeHtml(email)}" style="color:#1a2e1e">${escapeHtml(email)}</a></p>` : ""}
</body>
</html>`.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BTH Expert <contact@bthexpert.com>",
        to: RECIPIENTS,
        ...(email ? { reply_to: email } : {}),
        subject: `Nouveau message de ${name} — BTH Expert`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Erreur Resend:", err);
      return new Response("Échec d'envoi email", { status: 502 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Erreur fonction contact:", err);
    return new Response("Erreur interne", { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
