"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

type ContactFormDict = Dictionary["contact"]["form"];

interface ContactFormProps {
  dict: ContactFormDict;
  lang: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

const labelCls =
  "block text-[var(--text-caption)] uppercase tracking-widest text-muted mb-2";

const inputCls =
  "w-full bg-transparent border-b border-line py-3 text-[var(--text-body)] text-ink placeholder:text-muted focus:outline-none focus:border-brand transition-colors duration-300 ease-[var(--ease-out-expo)]";

export function ContactForm({ dict, lang }: ContactFormProps) {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });

      if (res.ok) {
        setState("success");
        form.reset();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="py-16 border-b border-line">
        <p className="font-display text-[var(--text-h3)] font-medium tracking-[-0.01em] text-ink mb-4">
          {dict.successTitle}
        </p>
        <p className="text-[var(--text-body)] text-ink-soft leading-[1.7]">
          {dict.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Netlify hidden fields */}
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="lang" value={lang} />
      <p className="hidden" aria-hidden="true">
        <label>
          Don&apos;t fill this out:{" "}
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div>
          <label htmlFor="name" className={labelCls}>
            {dict.name}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder={dict.namePlaceholder}
            className={inputCls}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            {dict.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={dict.emailPlaceholder}
            className={inputCls}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div>
          <label htmlFor="phone" className={labelCls}>
            {dict.phone}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder={dict.phonePlaceholder}
            className={inputCls}
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="subject" className={labelCls}>
            {dict.subject}
          </label>
          <select
            id="subject"
            name="subject"
            required
            className={`${inputCls} cursor-pointer`}
          >
            <option value="" disabled selected>
              —
            </option>
            {Object.entries(dict.subjectOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          {dict.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={dict.messagePlaceholder}
          className={`${inputCls} resize-none`}
        />
      </div>

      {state === "error" && (
        <p className="text-[var(--text-small)] text-muted">{dict.errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center justify-center px-6 py-3 rounded-sm bg-brand text-cream text-[0.9375rem] font-medium tracking-tight transition-[background-color,opacity] duration-300 ease-[var(--ease-out-expo)] hover:bg-brand-soft disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === "submitting" ? dict.submitting : dict.submit}
      </button>
    </form>
  );
}
