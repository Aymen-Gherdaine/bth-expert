"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { Dictionary } from "@/lib/i18n";

void ScrollTrigger;

type ContactFormDict = Dictionary["contact"]["form"];

interface ContactFormProps {
  dict: ContactFormDict;
  lang: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

const labelCls =
  "block text-[var(--text-caption)] uppercase tracking-widest text-muted mb-2";

const inputCls =
  "w-full bg-white border border-line rounded-[var(--radius-sm)] px-4 py-3 text-[var(--text-body)] text-ink placeholder:text-muted focus:border-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]";

function Required() {
  return (
    <span aria-hidden className="text-[#b42318] ms-0.5">
      *
    </span>
  );
}

export function ContactForm({ dict, lang }: ContactFormProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [isValid, setIsValid] = useState(false);

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
        scrollTrigger: { trigger: card, start: "top 85%", once: true },
      });
    },
    { scope: cardRef }
  );

  function handleChange() {
    setIsValid(formRef.current?.checkValidity() ?? false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current?.checkValidity()) return;
    setState("submitting");

    const data = new FormData(e.currentTarget);
    const body = new URLSearchParams();
    for (const [key, value] of data.entries()) body.append(key, String(value));

    try {
      // POST to the static mirror — the path Netlify serves the form from.
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
      className="bg-white rounded-[var(--radius-md)] border border-line shadow-[var(--shadow-subtle)] p-6 sm:p-8 lg:p-10"
    >
      {state === "success" ? (
        <div className="py-12 text-center" role="status">
          <p className="font-display text-[var(--text-h3)] font-medium tracking-[-0.01em] text-ink mb-4">
            {dict.successTitle}
          </p>
          <p className="text-[var(--text-body)] text-ink-soft leading-[1.7]">
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
          onChange={handleChange}
          noValidate
          className="space-y-6"
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
              className={inputCls}
              autoComplete="name"
            />
          </div>

          <div className="sm:grid sm:grid-cols-2 sm:gap-6 space-y-6 sm:space-y-0">
            <div data-form-field>
              <label htmlFor="email" className={labelCls}>
                {dict.email}
                <Required />
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                className={inputCls}
                autoComplete="email"
              />
            </div>
            <div data-form-field>
              <label htmlFor="phone" className={labelCls}>
                {dict.phone}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={inputCls}
                autoComplete="tel"
              />
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
              className={`${inputCls} cursor-pointer`}
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
          </div>

          <div data-form-field>
            <label htmlFor="message" className={labelCls}>
              {dict.message}
              <Required />
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div data-form-field>
            <label className="flex items-start gap-3 cursor-pointer text-[var(--text-small)] text-ink-soft leading-[1.6]">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-1 size-4 shrink-0 accent-[var(--color-brand)]"
              />
              <span>
                {dict.consentPrefix}{" "}
                <Link
                  href={`/${lang}/confidentialite`}
                  className="underline underline-offset-2 hover:text-gold transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]"
                >
                  {dict.consentLink}
                </Link>
                .<Required />
              </span>
            </label>
          </div>

          {state === "error" && (
            <p className="text-[var(--text-small)] text-[#b42318]" role="alert">
              {dict.errorMessage}
            </p>
          )}

          <div data-form-field>
            <button
              type="submit"
              disabled={!isValid || state === "submitting"}
              className="w-full inline-flex items-center justify-center px-6 py-4 rounded-[var(--radius-sm)] bg-brand text-cream text-[0.9375rem] font-medium tracking-tight hover:bg-brand-soft hover:tracking-[0.02em] transition-[background-color,letter-spacing,color] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] disabled:bg-line disabled:text-muted disabled:cursor-not-allowed disabled:tracking-tight"
            >
              {state === "submitting" ? dict.submitting : dict.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
