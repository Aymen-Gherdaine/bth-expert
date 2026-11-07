"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { Dictionary } from "@/lib/i18n";


type ContactFormDict = Dictionary["contact"]["form"];

interface ContactFormProps {
  dict: ContactFormDict;
  lang: string;
  /** Privacy policy link + consent wording (loi 18-07), resolved server-side so the legal texts stay out of the client bundle. */
  privacy: { href: string; label: string; consentLabel: string };
}

type FormState = "idle" | "submitting" | "success" | "error";

/** Fields that carry a per-field message; the honeypot and message are free. */
type FieldName = "name" | "email" | "phone" | "projectType" | "consent";
const FIELD_NAMES: readonly FieldName[] = ["name", "email", "phone", "projectType", "consent"];
type FieldErrors = Partial<Record<FieldName, string>>;
type FieldElement = HTMLInputElement | HTMLSelectElement;

function isField(el: Element | null): el is FieldElement {
  return (
    (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) &&
    (FIELD_NAMES as readonly string[]).includes(el.name)
  );
}

const labelCls =
  "block text-[length:var(--text-small)] font-medium text-ink mb-2";

const errorCls = "mt-2 text-[length:var(--text-caption)] text-[#b42318] leading-[1.5]";

const inputCls =
  "w-full bg-white border border-line aria-[invalid=true]:border-[#b42318] rounded-[var(--radius-md)] px-4 py-3.5 text-[length:var(--text-body)] text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-gold)_22%,transparent)] transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]";

function Required() {
  return (
    <span aria-hidden className="text-[#b42318] ms-0.5">
      *
    </span>
  );
}

export function ContactForm({ dict, lang, privacy }: ContactFormProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const card = cardRef.current;
      if (!card) return;

      gsap.from(card.querySelectorAll("[data-form-field]"), {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
        delay: 0.15,
      });
    },
    { scope: cardRef }
  );

  // Inline validation (apple-design §16, feedback): a field is judged when
  // the user leaves it, re-judged on every change once it has been flagged
  // so the message clears as they fix it, and the submit button is never
  // disabled — pressing it shows exactly what is missing and focuses it.
  function messageFor(el: FieldElement): string | undefined {
    return el.validity.valid ? undefined : dict.errors[el.name as FieldName];
  }

  function validateField(el: FieldElement): boolean {
    const message = messageFor(el);
    setErrors((prev) => (prev[el.name as FieldName] === message ? prev : { ...prev, [el.name]: message }));
    return message === undefined;
  }

  function handleBlur(e: React.FocusEvent<HTMLFormElement>) {
    if (isField(e.target)) validateField(e.target);
  }

  function handleChange(e: React.FormEvent<HTMLFormElement>) {
    const el = e.target as Element;
    if (isField(el) && errors[el.name as FieldName]) validateField(el);
  }

  function validateAll(form: HTMLFormElement): boolean {
    const next: FieldErrors = {};
    let firstInvalid: FieldElement | null = null;
    for (const el of Array.from(form.elements)) {
      if (!isField(el)) continue;
      const message = messageFor(el);
      if (message) {
        next[el.name as FieldName] = message;
        firstInvalid ??= el;
      }
    }
    setErrors(next);
    firstInvalid?.focus();
    return firstInvalid === null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateAll(e.currentTarget)) return;
    setState("submitting");

    const data = new FormData(e.currentTarget);
    const body = new URLSearchParams();
    for (const [key, value] of data.entries()) body.append(key, String(value));

    try {
      // POST to the static mirror — Netlify Forms stocke la soumission (dashboard +
      // anti-spam) puis déclenche la fonction submission-created qui envoie l'email Resend.
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (res.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-[20px] border border-line p-6 sm:p-9 lg:p-10"
    >
      {state === "success" ? (
        <div className="py-12 text-center" role="status">
          <p className="font-display text-[length:var(--text-h3)] font-medium tracking-[-0.01em] text-ink mb-4">
            {dict.successTitle}
          </p>
          <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7]">
            {dict.successMessage}
          </p>
        </div>
      ) : (
        <form
          ref={formRef}
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          onBlur={handleBlur}
          onChange={handleChange}
          noValidate
          className="space-y-5"
        >
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="lang" value={lang} />
          {/* Honeypot — visually hidden, bots fill it, Netlify drops the entry */}
          <p className="hidden" aria-hidden="true">
            <label>
              Ne pas remplir :{" "}
              <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>

          <div data-form-field>
            <label htmlFor="name" className={labelCls}>
              {dict.name}
              <Required />
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder={dict.namePlaceholder}
              className={inputCls}
              autoComplete="name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className={errorCls}>
                {errors.name}
              </p>
            )}
          </div>

          <div className="sm:grid sm:grid-cols-2 sm:gap-5 space-y-5 sm:space-y-0">
            <div data-form-field>
              <label htmlFor="email" className={labelCls}>
                {dict.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={dict.emailPlaceholder}
                className={inputCls}
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className={errorCls}>
                  {errors.email}
                </p>
              )}
            </div>
            <div data-form-field>
              <label htmlFor="phone" className={labelCls}>
                {dict.phone}
                <Required />
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                // Compiled with the RegExp `v` flag by the browser: ( ) and - must be
                // escaped inside the class or the pattern is silently ignored.
                pattern="[+0-9][0-9 .\(\)\-]{7,}"
                placeholder={dict.phonePlaceholder}
                className={inputCls}
                autoComplete="tel"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className={errorCls}>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div data-form-field>
            <label htmlFor="projectType" className={labelCls}>
              {dict.projectType}
              <Required />
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              defaultValue=""
              className={`${inputCls} cursor-pointer pe-10`}
              aria-invalid={errors.projectType ? true : undefined}
              aria-describedby={errors.projectType ? "projectType-error" : undefined}
            >
              <option value="" disabled>
                {dict.projectTypePlaceholder}
              </option>
              {Object.entries(dict.projectTypeOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.projectType && (
              <p id="projectType-error" className={errorCls}>
                {errors.projectType}
              </p>
            )}
          </div>

          <div data-form-field>
            <label htmlFor="message" className={labelCls}>
              {dict.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder={dict.messagePlaceholder}
              className={`${inputCls} resize-none`}
            />
          </div>

          {state === "error" && (
            <p className="text-[length:var(--text-small)] text-[#b42318]" role="alert">
              {dict.errorMessage}
            </p>
          )}

          {/* Consent — loi 18-07 : le traitement repose sur un consentement
              exprès, donc une case obligatoire et non pré-cochée. */}
          <div data-form-field>
            <label htmlFor="consent" className="flex items-start gap-3 cursor-pointer min-h-11">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                value="oui"
                required
                className="mt-1 size-4 shrink-0 accent-[var(--color-brand)] cursor-pointer"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "consent-error" : undefined}
              />
              <span className="text-[length:var(--text-caption)] text-muted leading-[1.6]">
                {privacy.consentLabel}
                <Required />
              </span>
            </label>
            {errors.consent && (
              <p id="consent-error" className={errorCls}>
                {errors.consent}
              </p>
            )}
          </div>

          <p className="text-[length:var(--text-caption)] text-muted leading-[1.6]">
            {dict.privacyNote}{" "}
            <Link
              href={privacy.href}
              className="press-row inline-flex items-center min-h-11 -my-3 underline underline-offset-2 hover:text-ink transition-colors duration-[var(--duration-fast)]"
            >
              {privacy.label}
            </Link>
          </p>

          <div data-form-field>
            <button
              type="submit"
              disabled={state === "submitting"}
              className="press w-full inline-flex items-center justify-center px-6 py-4 rounded-[var(--radius-md)] bg-brand text-cream text-[0.9375rem] font-medium tracking-tight hover:bg-brand-soft transition-[background-color,opacity] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand"
            >
              {state === "submitting" ? dict.submitting : dict.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
