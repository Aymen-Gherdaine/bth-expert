import type { Locale } from "./i18n-config";
import { siteContact } from "./site-config";

/**
 * Legal pages (mentions légales, politique de confidentialité).
 *
 * Deliberately kept out of Keystatic: these texts are legal statements that
 * must only change through a reviewed commit, not from the CMS. Each locale is
 * written by hand — the translation pipeline does not touch this file.
 */

export interface LegalSection {
  heading: string;
  /** Paragraphs; `\n` inside a paragraph is rendered as a line break. */
  paragraphs: string[];
}

export interface LegalPage {
  /** URL segment, identical in every locale (site convention). */
  slug: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heading: string;
  updatedLabel: string;
  sections: LegalSection[];
}

/** ISO date of the last substantive change — printed on both pages. */
export const LEGAL_UPDATED_AT = "2026-10-29";

const { address, legalName, email, phoneDisplay } = siteContact;
const postal = `${address.street}, ${address.locality}, ${address.city}, ${address.country}`;

const HOST = "Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis — www.netlify.com";
const HOST_EN = "Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, United States — www.netlify.com";
const HOST_AR = "Netlify, Inc.‏، 512 2nd Street, Suite 200, San Francisco, CA 94107، الولايات المتحدة — www.netlify.com";

const MENTIONS: Record<Locale, LegalPage> = {
  fr: {
    slug: "mentions-legales",
    navLabel: "Mentions légales",
    metaTitle: "Mentions légales | BTH Expert",
    metaDescription: `Mentions légales du site bthexpert.com, édité par ${legalName}, bureau d'études environnemental agréé à Oran, Algérie.`,
    eyebrow: "Informations légales",
    heading: "Mentions légales",
    updatedLabel: "Dernière mise à jour",
    sections: [
      {
        heading: "Éditeur du site",
        paragraphs: [
          `${legalName}, bureau d'études en environnement et sécurité industrielle, agréé par le Ministère de l'Environnement et de la Qualité de la Vie.`,
          `Siège : ${postal}\nEmail : ${email}\nTéléphone : ${phoneDisplay}`,
          "Directeur de la publication : Amine Lahmer, Gérant.",
        ],
      },
      {
        heading: "Hébergement",
        paragraphs: [`Le site est hébergé par ${HOST}.`],
      },
      {
        heading: "Propriété intellectuelle",
        paragraphs: [
          `L'ensemble des contenus du site (textes, illustrations, logo, structure) est la propriété de ${legalName} ou de ses partenaires et est protégé par la législation algérienne relative aux droits d'auteur (ordonnance n° 03-05 du 19 juillet 2003). Toute reproduction, même partielle, sans autorisation écrite préalable est interdite.`,
          "Les références aux textes réglementaires algériens (lois, décrets exécutifs) sont citées à titre d'information. Seules les versions publiées au Journal officiel font foi.",
        ],
      },
      {
        heading: "Responsabilité",
        paragraphs: [
          `${legalName} s'efforce de maintenir des informations exactes et à jour, mais ne peut garantir l'exhaustivité ni l'absence d'erreur. Les contenus du site ne constituent pas un avis réglementaire : chaque projet fait l'objet d'une analyse spécifique dans le cadre d'une mission.`,
          "Les liens vers des sites tiers sont fournis pour information ; leur contenu n'engage pas la responsabilité de l'éditeur.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [`Pour toute question relative au site, écrivez à ${email}.`],
      },
    ],
  },
  ar: {
    slug: "mentions-legales",
    navLabel: "إشعار قانوني",
    metaTitle: "إشعار قانوني | BTH Expert",
    metaDescription: `الإشعار القانوني لموقع bthexpert.com، الذي تنشره ${legalName}، مكتب دراسات بيئية معتمد في وهران، الجزائر.`,
    eyebrow: "معلومات قانونية",
    heading: "إشعار قانوني",
    updatedLabel: "آخر تحديث",
    sections: [
      {
        heading: "ناشر الموقع",
        paragraphs: [
          `${legalName}، مكتب دراسات في البيئة والسلامة الصناعية، معتمد من وزارة البيئة وجودة الحياة.`,
          `المقر : ${postal}\nالبريد الإلكتروني : ${email}\nالهاتف : ${phoneDisplay}`,
          "مدير النشر : أمين لحمر، المسيّر.",
        ],
      },
      {
        heading: "الاستضافة",
        paragraphs: [`يُستضاف الموقع لدى ${HOST_AR}.`],
      },
      {
        heading: "الملكية الفكرية",
        paragraphs: [
          `جميع محتويات الموقع (نصوص، رسوم، شعار، بنية) ملك لـ ${legalName} أو لشركائها ومحمية بموجب التشريع الجزائري المتعلق بحقوق المؤلف (الأمر رقم 03-05 المؤرخ في 19 يوليو 2003). يُمنع أي استنساخ، ولو جزئي، دون إذن كتابي مسبق.`,
          "تُذكر الإحالات إلى النصوص التنظيمية الجزائرية (قوانين، مراسيم تنفيذية) على سبيل الإعلام. النسخ المنشورة في الجريدة الرسمية هي وحدها المعتمدة.",
        ],
      },
      {
        heading: "المسؤولية",
        paragraphs: [
          `تحرص ${legalName} على تقديم معلومات دقيقة ومحدّثة دون أن تضمن شموليتها أو خلوّها من الخطأ. لا تشكّل محتويات الموقع رأياً تنظيمياً : كل مشروع يخضع لتحليل خاص في إطار مهمة.`,
          "تُقدَّم الروابط نحو مواقع خارجية للإعلام فقط ولا تتحمّل الجهة الناشرة مسؤولية محتواها.",
        ],
      },
      {
        heading: "اتصال",
        paragraphs: [`لأي سؤال يخص الموقع، راسلونا على ${email}.`],
      },
    ],
  },
  en: {
    slug: "mentions-legales",
    navLabel: "Legal notice",
    metaTitle: "Legal notice | BTH Expert",
    metaDescription: `Legal notice for bthexpert.com, published by ${legalName}, an accredited environmental consultancy based in Oran, Algeria.`,
    eyebrow: "Legal information",
    heading: "Legal notice",
    updatedLabel: "Last updated",
    sections: [
      {
        heading: "Publisher",
        paragraphs: [
          `${legalName}, environmental and industrial-safety consultancy, accredited by the Algerian Ministry of Environment and Quality of Life.`,
          `Registered office: ${postal}\nEmail: ${email}\nPhone: ${phoneDisplay}`,
          "Publishing director: Amine Lahmer, Managing Director.",
        ],
      },
      {
        heading: "Hosting",
        paragraphs: [`The site is hosted by ${HOST_EN}.`],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          `All site content (texts, illustrations, logo, structure) belongs to ${legalName} or its partners and is protected under Algerian copyright law (Ordinance No. 03-05 of 19 July 2003). Any reproduction, even partial, without prior written consent is prohibited.`,
          "References to Algerian regulations (laws, executive decrees) are given for information only. Only the versions published in the Official Journal are authoritative.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          `${legalName} strives to keep information accurate and current but cannot guarantee completeness or the absence of errors. Site content is not regulatory advice: every project is assessed specifically within an engagement.`,
          "Links to third-party sites are provided for information; the publisher is not responsible for their content.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [`For any question about the site, write to ${email}.`],
      },
    ],
  },
};

const PRIVACY: Record<Locale, LegalPage> = {
  fr: {
    slug: "confidentialite",
    navLabel: "Confidentialité",
    metaTitle: "Politique de confidentialité | BTH Expert",
    metaDescription: `Quelles données ${legalName} collecte via son formulaire de contact, pourquoi, combien de temps, et vos droits au titre de la loi n° 18-07.`,
    eyebrow: "Données personnelles",
    heading: "Politique de confidentialité",
    updatedLabel: "Dernière mise à jour",
    sections: [
      {
        heading: "Ce que nous collectons",
        paragraphs: [
          "La consultation du site ne nécessite aucune inscription et ne collecte aucune donnée personnelle. Le site n'utilise ni cookie de suivi ni outil de mesure d'audience.",
          "Lorsque vous remplissez le formulaire de contact, nous recevons les informations que vous saisissez : nom, numéro de téléphone, adresse email (facultative), type de projet et message (facultatif).",
        ],
      },
      {
        heading: "Pourquoi",
        paragraphs: [
          "Ces données servent uniquement à répondre à votre demande et, le cas échéant, à préparer une proposition. Elles ne sont ni vendues, ni cédées, ni utilisées pour de la prospection non sollicitée.",
        ],
      },
      {
        heading: "Qui y a accès",
        paragraphs: [
          `Les envois du formulaire transitent par notre hébergeur (Netlify Forms) puis nous sont transmis par email via le service Resend. Ces prestataires agissent comme sous-traitants techniques et n'exploitent pas vos données pour leur compte. Seule l'équipe de ${legalName} lit vos messages.`,
        ],
      },
      {
        heading: "Combien de temps",
        paragraphs: [
          "Vos données sont conservées le temps nécessaire au traitement de votre demande et au suivi qui en découle, puis supprimées. Une demande restée sans suite est effacée au plus tard douze mois après sa réception.",
        ],
      },
      {
        heading: "Vos droits",
        paragraphs: [
          `Conformément à la loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données. Pour l'exercer, écrivez à ${email} en précisant votre demande ; nous répondons sous un mois.`,
        ],
      },
      {
        heading: "Responsable du traitement",
        paragraphs: [`${legalName}, ${postal}. Contact : ${email}.`],
      },
    ],
  },
  ar: {
    slug: "confidentialite",
    navLabel: "الخصوصية",
    metaTitle: "سياسة الخصوصية | BTH Expert",
    metaDescription: `ما هي البيانات التي تجمعها ${legalName} عبر نموذج الاتصال، ولماذا، ولأي مدة، وما هي حقوقكم بموجب القانون رقم 18-07.`,
    eyebrow: "البيانات الشخصية",
    heading: "سياسة الخصوصية",
    updatedLabel: "آخر تحديث",
    sections: [
      {
        heading: "ما نجمعه",
        paragraphs: [
          "لا يتطلّب تصفح الموقع أي تسجيل ولا يجمع أي بيانات شخصية. لا يستعمل الموقع ملفات تعريف الارتباط للتتبّع ولا أدوات قياس الجمهور.",
          "عند ملء نموذج الاتصال نتلقّى المعلومات التي تدخلونها : الاسم، رقم الهاتف، البريد الإلكتروني (اختياري)، نوع المشروع والرسالة (اختيارية).",
        ],
      },
      {
        heading: "لماذا",
        paragraphs: [
          "تُستعمل هذه البيانات حصراً للرد على طلبكم، وعند الاقتضاء لإعداد عرض. لا تُباع ولا تُحوَّل ولا تُستعمل لأي استقطاب غير مرغوب فيه.",
        ],
      },
      {
        heading: "من يطّلع عليها",
        paragraphs: [
          `تمر إرسالات النموذج عبر مضيفنا (Netlify Forms) ثم تُحوَّل إلينا بالبريد الإلكتروني عبر خدمة Resend. يعمل هذان المزوّدان كمعالجَين تقنيين ولا يستغلان بياناتكم لحسابهما. فريق ${legalName} وحده يقرأ رسائلكم.`,
        ],
      },
      {
        heading: "لأي مدة",
        paragraphs: [
          "تُحفظ بياناتكم للمدة اللازمة لمعالجة طلبكم ومتابعته ثم تُحذف. يُمحى أي طلب لم يُستكمل في أجل أقصاه اثنا عشر شهراً من تاريخ استلامه.",
        ],
      },
      {
        heading: "حقوقكم",
        paragraphs: [
          `طبقاً للقانون رقم 18-07 المؤرخ في 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي، لكم حق الاطلاع على بياناتكم وتصحيحها والاعتراض على معالجتها وحذفها. لممارسة هذه الحقوق راسلونا على ${email} مع توضيح طلبكم ؛ نرد في أجل شهر.`,
        ],
      },
      {
        heading: "المسؤول عن المعالجة",
        paragraphs: [`${legalName}، ${postal}. للاتصال : ${email}.`],
      },
    ],
  },
  en: {
    slug: "confidentialite",
    navLabel: "Privacy",
    metaTitle: "Privacy policy | BTH Expert",
    metaDescription: `What ${legalName} collects through its contact form, why, for how long, and your rights under Algerian Law No. 18-07.`,
    eyebrow: "Personal data",
    heading: "Privacy policy",
    updatedLabel: "Last updated",
    sections: [
      {
        heading: "What we collect",
        paragraphs: [
          "Browsing the site requires no registration and collects no personal data. The site uses no tracking cookies and no audience-measurement tool.",
          "When you fill in the contact form, we receive what you type: name, phone number, email address (optional), project type and message (optional).",
        ],
      },
      {
        heading: "Why",
        paragraphs: [
          "This data is used solely to answer your request and, where relevant, to prepare a proposal. It is never sold, shared or used for unsolicited prospecting.",
        ],
      },
      {
        heading: "Who has access",
        paragraphs: [
          `Form submissions pass through our host (Netlify Forms) and are forwarded to us by email through the Resend service. Both act as technical processors and do not use your data for their own purposes. Only the ${legalName} team reads your messages.`,
        ],
      },
      {
        heading: "For how long",
        paragraphs: [
          "Your data is kept for as long as needed to handle your request and the follow-up it entails, then deleted. A request with no follow-up is erased at the latest twelve months after receipt.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          `Under Algerian Law No. 18-07 of 10 June 2018 on the protection of natural persons in the processing of personal data, you may access, correct, object to and erase your data. To do so, write to ${email} stating your request; we reply within one month.`,
        ],
      },
      {
        heading: "Data controller",
        paragraphs: [`${legalName}, ${postal}. Contact: ${email}.`],
      },
    ],
  },
};

export const legalPages = {
  mentions: MENTIONS,
  privacy: PRIVACY,
} as const;

export type LegalPageKey = keyof typeof legalPages;
