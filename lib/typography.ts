/**
 * French typographic rules applied at render time.
 *
 * In French, a space precedes « ? », « ! », « : », « ; » and sits inside
 * guillemets. If that space is an ordinary one, the browser may wrap the
 * punctuation alone onto the next line (a lone « ? » under a title). The
 * narrow no-break space (U+202F) is the typographically correct glue; the
 * no-break space (U+00A0) is used inside guillemets.
 *
 * Content authors keep typing plain spaces in Keystatic; this runs once on
 * the French dictionary and on rendered French markdown.
 */

const NNBSP = " ";
const NBSP = " ";

/** Apply the rules to one string. Idempotent. */
export function frenchPunctuation(text: string): string {
  return text
    .replace(/[   ]+([?!:;»])/g, `${NNBSP}$1`)
    .replace(/«[   ]+/g, `«${NBSP}`);
}

/**
 * Walk a JSON-like value and apply `frenchPunctuation` to every string.
 * Keys are left untouched. Returns the same shape (typed as the input).
 */
export function frenchPunctuationDeep<T>(value: T): T {
  if (typeof value === "string") return frenchPunctuation(value) as T;
  if (Array.isArray(value)) return value.map(frenchPunctuationDeep) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = frenchPunctuationDeep(v);
    }
    return out as T;
  }
  return value;
}

/**
 * Same rule on an HTML string: only text nodes are touched, so attributes
 * such as href="https://…" keep their ordinary characters.
 */
export function frenchPunctuationHtml(html: string): string {
  return html.replace(/>([^<]+)</g, (_m, text: string) => `>${frenchPunctuation(text)}<`);
}
