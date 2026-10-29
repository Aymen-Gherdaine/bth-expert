import type { Locale } from "./i18n-config";

/**
 * The Algerian texts that trigger our studies, shown on the landing page.
 *
 * Kept in code (not Keystatic) because each entry is a legal citation that
 * must be checked against the Journal officiel before it changes, and because
 * `service` must stay a valid route. Only the published versions are
 * authoritative; the one-line summaries are our reading, not legal advice.
 */

export type ServiceSlug =
  | "etude-impact-environnemental"
  | "etude-de-dangers"
  | "audit-hse"
  | "plan-gestion-environnementale";

export interface RegulationEntry {
  /** Short reference used as the display numeral, e.g. "07-145". */
  ref: string;
  /** Kind + date, e.g. "Décret exécutif · 19 mai 2007". */
  kind: string;
  /** Official title (shortened). */
  title: string;
  /** What it means for an industrial operator, one sentence. */
  consequence: string;
  /** The study it triggers. */
  service: ServiceSlug;
  serviceLabel: string;
}

export interface RegulationSectionContent {
  eyebrow: string;
  heading: string;
  intro: string;
  note: string;
  entries: RegulationEntry[];
}

export const reglementation: Record<Locale, RegulationSectionContent> = {
  fr: {
    eyebrow: "Cadre réglementaire",
    heading: "Les textes qui déclenchent votre étude",
    intro:
      "Cinq textes structurent l'autorisation d'une installation en Algérie. Savoir lequel s'applique à votre projet, c'est déjà savoir quelle étude déposer, auprès de qui, et dans quel délai.",
    note: "Lecture indicative. Seules les versions publiées au Journal officiel font foi.",
    entries: [
      {
        ref: "03-10",
        kind: "Loi · 19 juillet 2003",
        title: "Protection de l'environnement dans le cadre du développement durable",
        consequence:
          "Le texte fondateur : il soumet tout projet susceptible d'affecter l'environnement à une étude ou une notice d'impact préalable.",
        service: "etude-impact-environnemental",
        serviceLabel: "Étude d'impact",
      },
      {
        ref: "07-145",
        kind: "Décret exécutif · 19 mai 2007",
        title: "Champ d'application, contenu et modalités d'approbation des études et notices d'impact",
        consequence:
          "Fixe la liste des projets soumis à EIE ou à notice, le contenu du rapport et son instruction par la wilaya, enquête publique comprise.",
        service: "etude-impact-environnemental",
        serviceLabel: "Étude d'impact",
      },
      {
        ref: "06-198",
        kind: "Décret exécutif · 31 mai 2006",
        title: "Réglementation applicable aux établissements classés pour la protection de l'environnement",
        consequence:
          "Conditionne l'autorisation d'exploitation d'un établissement classé à une étude de dangers et à un dossier technique complet.",
        service: "etude-de-dangers",
        serviceLabel: "Étude de dangers",
      },
      {
        ref: "07-144",
        kind: "Décret exécutif · 19 mai 2007",
        title: "Nomenclature des installations classées pour la protection de l'environnement",
        consequence:
          "Classe chaque activité par catégorie et désigne l'autorité qui délivre l'autorisation : ministre, wali ou président d'APC.",
        service: "etude-de-dangers",
        serviceLabel: "Étude de dangers",
      },
      {
        ref: "04-20",
        kind: "Loi · 25 décembre 2004",
        title: "Prévention des risques majeurs et gestion des catastrophes",
        consequence:
          "Impose aux exploitants d'installations à risque la maîtrise des scénarios d'accident et des plans d'intervention internes.",
        service: "etude-de-dangers",
        serviceLabel: "Étude de dangers",
      },
    ],
  },
  ar: {
    eyebrow: "الإطار التنظيمي",
    heading: "النصوص التي تستوجب دراستكم",
    intro:
      "خمسة نصوص تؤطّر ترخيص المنشآت في الجزائر. معرفة النص الذي ينطبق على مشروعكم تعني معرفة الدراسة الواجب إيداعها، ولدى من، وفي أي أجل.",
    note: "قراءة إرشادية. النسخ المنشورة في الجريدة الرسمية هي وحدها المعتمدة.",
    entries: [
      {
        ref: "03-10",
        kind: "قانون · 19 يوليو 2003",
        title: "حماية البيئة في إطار التنمية المستدامة",
        consequence:
          "النص المؤسِّس : يُخضع كل مشروع قد يؤثر على البيئة لدراسة أو موجز تأثير مسبق.",
        service: "etude-impact-environnemental",
        serviceLabel: "دراسة التأثير",
      },
      {
        ref: "07-145",
        kind: "مرسوم تنفيذي · 19 مايو 2007",
        title: "مجال تطبيق ومحتوى وكيفيات المصادقة على دراسات وموجزات التأثير على البيئة",
        consequence:
          "يحدد قائمة المشاريع الخاضعة لدراسة أو موجز التأثير، ومحتوى التقرير، ومعالجته على مستوى الولاية بما فيها التحقيق العمومي.",
        service: "etude-impact-environnemental",
        serviceLabel: "دراسة التأثير",
      },
      {
        ref: "06-198",
        kind: "مرسوم تنفيذي · 31 مايو 2006",
        title: "التنظيم المطبق على المؤسسات المصنفة لحماية البيئة",
        consequence:
          "يربط رخصة استغلال المؤسسة المصنفة بدراسة أخطار وملف تقني كامل.",
        service: "etude-de-dangers",
        serviceLabel: "دراسة الأخطار",
      },
      {
        ref: "07-144",
        kind: "مرسوم تنفيذي · 19 مايو 2007",
        title: "قائمة المنشآت المصنفة لحماية البيئة",
        consequence:
          "يصنّف كل نشاط حسب الفئة ويعيّن السلطة المانحة للرخصة : الوزير أو الوالي أو رئيس المجلس الشعبي البلدي.",
        service: "etude-de-dangers",
        serviceLabel: "دراسة الأخطار",
      },
      {
        ref: "04-20",
        kind: "قانون · 25 ديسمبر 2004",
        title: "الوقاية من الأخطار الكبرى وتسيير الكوارث",
        consequence:
          "يلزم مستغلي المنشآت الخطرة بالتحكم في سيناريوهات الحوادث وإعداد مخططات التدخل الداخلية.",
        service: "etude-de-dangers",
        serviceLabel: "دراسة الأخطار",
      },
    ],
  },
  en: {
    eyebrow: "Regulatory framework",
    heading: "The texts that trigger your study",
    intro:
      "Five texts structure the authorisation of a facility in Algeria. Knowing which one applies to your project already tells you which study to file, with whom, and within what timeframe.",
    note: "Indicative reading. Only the versions published in the Official Journal are authoritative.",
    entries: [
      {
        ref: "03-10",
        kind: "Law · 19 July 2003",
        title: "Protection of the environment within the framework of sustainable development",
        consequence:
          "The founding text: any project likely to affect the environment requires a prior impact assessment or impact notice.",
        service: "etude-impact-environnemental",
        serviceLabel: "Impact assessment",
      },
      {
        ref: "07-145",
        kind: "Executive decree · 19 May 2007",
        title: "Scope, content and approval procedure of environmental impact assessments and notices",
        consequence:
          "Sets the list of projects subject to an EIA or a notice, the content of the report and its review by the wilaya, public inquiry included.",
        service: "etude-impact-environnemental",
        serviceLabel: "Impact assessment",
      },
      {
        ref: "06-198",
        kind: "Executive decree · 31 May 2006",
        title: "Regulations applicable to classified establishments for environmental protection",
        consequence:
          "Makes the operating permit of a classified establishment conditional on a hazard study and a complete technical file.",
        service: "etude-de-dangers",
        serviceLabel: "Hazard study",
      },
      {
        ref: "07-144",
        kind: "Executive decree · 19 May 2007",
        title: "Nomenclature of classified installations for environmental protection",
        consequence:
          "Classifies each activity by category and names the authority that issues the permit: minister, wali or municipal president.",
        service: "etude-de-dangers",
        serviceLabel: "Hazard study",
      },
      {
        ref: "04-20",
        kind: "Law · 25 December 2004",
        title: "Prevention of major risks and disaster management",
        consequence:
          "Requires operators of hazardous facilities to control accident scenarios and maintain internal intervention plans.",
        service: "etude-de-dangers",
        serviceLabel: "Hazard study",
      },
    ],
  },
};
