import type { Locale } from "./i18n-config";
import { siteContact, legalRegistration } from "./site-config";
import { frenchPunctuationDeep } from "./typography";

/**
 * Legal pages (mentions légales, politique de confidentialité).
 *
 * Deliberately kept out of Keystatic: these texts are legal statements that
 * must only change through a reviewed commit, not from the CMS. Each locale is
 * written by hand; the translation pipeline does not touch this file.
 *
 * Texts cited (Journal officiel de la République algérienne) :
 * - Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes
 *   physiques dans le traitement des données à caractère personnel.
 * - Ordonnance n° 03-05 du 19 juillet 2003 relative aux droits d'auteur et
 *   aux droits voisins.
 * - Loi n° 03-10 du 19 juillet 2003 relative à la protection de
 *   l'environnement dans le cadre du développement durable.
 */

export interface LegalSection {
  heading: string;
  /** Paragraphs; `\n` inside a paragraph is rendered as a line break. */
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs. */
  list?: string[];
  /** Optional closing paragraph rendered after the list. */
  after?: string;
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

/** ISO date of the last substantive change, printed on both pages. */
export const LEGAL_UPDATED_AT = "2026-10-29";

const { address, legalName, email, phoneDisplay } = siteContact;
const postal = `${address.street}, ${address.locality}, ${address.city}, ${address.country}`;
const postalEn = `${address.street}, ${address.locality}, ${address.city}, Algeria`;
const postalAr = `${address.street}، ${address.locality}، ${address.city}، الجزائر`;

const HOST_NAME = "Netlify, Inc.";
const HOST_SITE = "www.netlify.com";

/** Registration lines, only for values the client has provided. */
function registrationLines(labels: {
  legalForm: string;
  capital: string;
  rc: string;
  nif: string;
  nis: string;
  ai: string;
  agrement: string;
}): string[] {
  const r = legalRegistration;
  const lines: string[] = [];
  if (r.legalForm) lines.push(`${labels.legalForm} : ${r.legalForm}`);
  if (r.capital) lines.push(`${labels.capital} : ${r.capital}`);
  if (r.rc) lines.push(`${labels.rc} : ${r.rc}`);
  if (r.nif) lines.push(`${labels.nif} : ${r.nif}`);
  if (r.nis) lines.push(`${labels.nis} : ${r.nis}`);
  if (r.ai) lines.push(`${labels.ai} : ${r.ai}`);
  if (r.agrement) lines.push(`${labels.agrement} : ${r.agrement}`);
  return lines;
}

const REG_FR = registrationLines({
  legalForm: "Forme juridique",
  capital: "Capital social",
  rc: "Registre de commerce",
  nif: "Numéro d'identification fiscale (NIF)",
  nis: "Numéro d'identification statistique (NIS)",
  ai: "Article d'imposition",
  agrement: "Agrément ministériel",
});
const REG_EN = registrationLines({
  legalForm: "Legal form",
  capital: "Share capital",
  rc: "Trade register",
  nif: "Tax identification number (NIF)",
  nis: "Statistical identification number (NIS)",
  ai: "Tax article",
  agrement: "Ministerial accreditation",
});
const REG_AR = registrationLines({
  legalForm: "الشكل القانوني",
  capital: "رأس المال",
  rc: "السجل التجاري",
  nif: "رقم التعريف الجبائي (NIF)",
  nis: "رقم التعريف الإحصائي (NIS)",
  ai: "مادة الضريبة",
  agrement: "الاعتماد الوزاري",
});

// ─────────────────────────────────────────────────────────────────────────────
// Mentions légales
// ─────────────────────────────────────────────────────────────────────────────

const MENTIONS: Record<Locale, LegalPage> = {
  fr: {
    slug: "mentions-legales",
    navLabel: "Mentions légales",
    metaTitle: "Mentions légales | BTH Expert",
    metaDescription: `Mentions légales du site bthexpert.com édité par ${legalName}, bureau d'études en environnement et sécurité industrielle agréé, établi à Oran, Algérie.`,
    eyebrow: "Informations légales",
    heading: "Mentions légales",
    updatedLabel: "Dernière mise à jour",
    sections: [
      {
        heading: "Éditeur du site",
        paragraphs: [
          `Le site bthexpert.com (ci-après « le Site ») est édité par ${legalName}, bureau d'études en environnement, hygiène et sécurité industrielle, agréé par le Ministère de l'Environnement et de la Qualité de la Vie pour la réalisation des études d'impact sur l'environnement et des études de dangers.`,
          [`Siège social : ${postal}`, `Courriel : ${email}`, `Téléphone : ${phoneDisplay}`, ...REG_FR].join("\n"),
          "Directeur de la publication : Amine Lahmer, Gérant.",
        ],
      },
      {
        heading: "Hébergement",
        paragraphs: [
          `Le Site est hébergé par ${HOST_NAME} (${HOST_SITE}). Les données techniques de connexion que cet hébergeur enregistre sont décrites dans notre politique de confidentialité.`,
        ],
      },
      {
        heading: "Activité réglementée",
        paragraphs: [
          `${legalName} exerce une activité de bureau d'études soumise à agrément. Ses prestations (études d'impact sur l'environnement, études de dangers, audits hygiène-sécurité-environnement, plans de gestion environnementale) s'inscrivent dans le cadre de la loi n° 03-10 du 19 juillet 2003 relative à la protection de l'environnement dans le cadre du développement durable et de ses textes d'application, notamment les décrets exécutifs n° 06-198 du 31 mai 2006, n° 07-144 et n° 07-145 du 19 mai 2007.`,
          "Les références réglementaires reproduites sur le Site le sont à titre d'information générale. Seules les versions publiées au Journal officiel de la République algérienne démocratique et populaire font foi.",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        paragraphs: [
          `L'ensemble des éléments composant le Site (textes, illustrations, cartes, logo, charte graphique, structure et code) est protégé par l'ordonnance n° 03-05 du 19 juillet 2003 relative aux droits d'auteur et aux droits voisins. Ces éléments sont la propriété exclusive de ${legalName} ou font l'objet d'une autorisation d'utilisation.`,
          `Toute reproduction, représentation, adaptation ou diffusion, totale ou partielle, par quelque procédé que ce soit, sans l'autorisation écrite préalable de ${legalName}, est interdite et constitue une contrefaçon. La citation courte à des fins d'information, avec mention de la source et lien vers le Site, est autorisée.`,
          "La dénomination « BTH Expert » et son logo sont des signes distinctifs de l'éditeur. Leur usage sans autorisation est prohibé.",
        ],
      },
      {
        heading: "Contenu du Site et responsabilité",
        paragraphs: [
          `${legalName} apporte le plus grand soin à l'exactitude et à l'actualisation des informations publiées. Elles ont néanmoins un caractère général : elles ne constituent ni un conseil juridique, ni un avis réglementaire applicable à une situation particulière, ni une offre contractuelle. Chaque mission fait l'objet d'une analyse spécifique, formalisée par un devis et un contrat.`,
          `${legalName} ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation des informations du Site, d'une interruption ou d'une indisponibilité du Site, ou de la présence de virus ou d'éléments nuisibles indépendants de sa volonté.`,
          "Le Site peut contenir des liens vers des sites tiers (administrations, organismes, partenaires). Ces liens sont fournis pour la commodité des visiteurs. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques.",
        ],
      },
      {
        heading: "Données personnelles",
        paragraphs: [
          "Le traitement des données à caractère personnel collectées sur le Site est régi par la loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel. Les finalités, destinataires, durées de conservation et vos droits sont détaillés dans notre politique de confidentialité, accessible depuis chaque page du Site.",
        ],
      },
      {
        heading: "Droit applicable et juridiction",
        paragraphs: [
          `Les présentes mentions légales sont régies par le droit algérien. En cas de litige relatif au Site, les parties rechercheront d'abord une solution amiable. À défaut, le litige sera porté devant les juridictions compétentes du ressort du siège social de ${legalName}, à Oran.`,
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          `Pour toute question relative au Site ou pour signaler un contenu, écrivez à ${email} ou adressez un courrier au siège social indiqué ci-dessus.`,
        ],
      },
    ],
  },

  ar: {
    slug: "mentions-legales",
    navLabel: "الإشعار القانوني",
    metaTitle: "الإشعار القانوني | BTH Expert",
    metaDescription: `الإشعار القانوني لموقع bthexpert.com الذي تنشره ${legalName}، مكتب دراسات معتمد في البيئة والسلامة الصناعية، مقره وهران، الجزائر.`,
    eyebrow: "معلومات قانونية",
    heading: "الإشعار القانوني",
    updatedLabel: "آخر تحديث",
    sections: [
      {
        heading: "ناشر الموقع",
        paragraphs: [
          `يُنشر موقع bthexpert.com (المشار إليه فيما يلي بـ« الموقع ») من طرف ${legalName}، مكتب دراسات في البيئة والنظافة والسلامة الصناعية، معتمد من وزارة البيئة وجودة الحياة لإنجاز دراسات التأثير على البيئة ودراسات الأخطار.`,
          [`المقر الاجتماعي : ${postalAr}`, `البريد الإلكتروني : ${email}`, `الهاتف : ${phoneDisplay}`, ...REG_AR].join("\n"),
          "مدير النشر : أمين لحمر، المسيّر.",
        ],
      },
      {
        heading: "الاستضافة",
        paragraphs: [
          `يُستضاف الموقع لدى ${HOST_NAME}‏ (${HOST_SITE}). البيانات التقنية للاتصال التي يسجّلها هذا المضيف موصوفة في سياسة الخصوصية الخاصة بنا.`,
        ],
      },
      {
        heading: "نشاط منظَّم",
        paragraphs: [
          `تمارس ${legalName} نشاط مكتب دراسات خاضع للاعتماد. تندرج خدماتها (دراسات التأثير على البيئة، دراسات الأخطار، تدقيقات النظافة والسلامة والبيئة، مخططات التسيير البيئي) في إطار القانون رقم 03-10 المؤرخ في 19 يوليو 2003 المتعلق بحماية البيئة في إطار التنمية المستدامة ونصوصه التطبيقية، لا سيما المراسيم التنفيذية رقم 06-198 المؤرخ في 31 مايو 2006 ورقم 07-144 ورقم 07-145 المؤرخين في 19 مايو 2007.`,
          "تُدرج المراجع التنظيمية المذكورة في الموقع على سبيل الإعلام العام. النسخ المنشورة في الجريدة الرسمية للجمهورية الجزائرية الديمقراطية الشعبية هي وحدها المعتمدة.",
        ],
      },
      {
        heading: "الملكية الفكرية",
        paragraphs: [
          `جميع العناصر المكوّنة للموقع (نصوص، رسوم، خرائط، شعار، هوية بصرية، بنية وشفرة) محمية بموجب الأمر رقم 03-05 المؤرخ في 19 يوليو 2003 المتعلق بحقوق المؤلف والحقوق المجاورة. هذه العناصر ملك حصري لـ ${legalName} أو محل ترخيص باستعمالها.`,
          `يُمنع أي استنساخ أو تمثيل أو تكييف أو نشر، كلي أو جزئي، بأي وسيلة كانت، دون إذن كتابي مسبق من ${legalName}، ويُعدّ تقليداً. يُسمح بالاقتباس القصير لأغراض إعلامية مع ذكر المصدر ووضع رابط نحو الموقع.`,
          "تسمية « BTH Expert » وشعارها علامتان مميزتان للناشر. يُحظر استعمالهما دون إذن.",
        ],
      },
      {
        heading: "محتوى الموقع والمسؤولية",
        paragraphs: [
          `تولي ${legalName} أقصى العناية لدقة المعلومات المنشورة وتحديثها. غير أنها تكتسي طابعاً عاماً : فهي لا تشكّل استشارة قانونية، ولا رأياً تنظيمياً ينطبق على حالة خاصة، ولا عرضاً تعاقدياً. كل مهمة تخضع لتحليل خاص يُضبط بعرض سعر وعقد.`,
          `لا تتحمّل ${legalName} أي مسؤولية عن الأضرار المباشرة أو غير المباشرة الناتجة عن استعمال معلومات الموقع، أو عن انقطاعه أو عدم توفره، أو عن وجود فيروسات أو عناصر ضارة خارجة عن إرادتها.`,
          "قد يحتوي الموقع على روابط نحو مواقع خارجية (إدارات، هيئات، شركاء). تُقدَّم هذه الروابط لتسهيل التصفح. لا يمارس الناشر أي رقابة على تلك المواقع ولا يتحمل أي مسؤولية عن محتواها أو ممارساتها.",
        ],
      },
      {
        heading: "البيانات الشخصية",
        paragraphs: [
          "تخضع معالجة البيانات ذات الطابع الشخصي المجمَّعة عبر الموقع للقانون رقم 18-07 المؤرخ في 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي. الأغراض والمستلمون ومدد الحفظ وحقوقكم مفصّلة في سياسة الخصوصية المتاحة من كل صفحة في الموقع.",
        ],
      },
      {
        heading: "القانون المطبّق والاختصاص القضائي",
        paragraphs: [
          `يخضع هذا الإشعار القانوني للقانون الجزائري. في حال نزاع يتعلق بالموقع، يسعى الطرفان أولاً إلى حل ودي. وفي غياب ذلك، يُرفع النزاع أمام الجهات القضائية المختصة التابعة لدائرة اختصاص المقر الاجتماعي لـ ${legalName} بوهران.`,
        ],
      },
      {
        heading: "اتصال",
        paragraphs: [
          `لأي سؤال يخص الموقع أو للإبلاغ عن محتوى، راسلونا على ${email} أو عبر البريد إلى المقر الاجتماعي المذكور أعلاه.`,
        ],
      },
    ],
  },

  en: {
    slug: "mentions-legales",
    navLabel: "Legal notice",
    metaTitle: "Legal notice | BTH Expert",
    metaDescription: `Legal notice for bthexpert.com, published by ${legalName}, an accredited environmental and industrial-safety consultancy established in Oran, Algeria.`,
    eyebrow: "Legal information",
    heading: "Legal notice",
    updatedLabel: "Last updated",
    sections: [
      {
        heading: "Publisher",
        paragraphs: [
          `The website bthexpert.com (the "Site") is published by ${legalName}, an environmental, health and industrial-safety consultancy accredited by the Algerian Ministry of Environment and Quality of Life to carry out environmental impact assessments and hazard studies.`,
          [`Registered office: ${postalEn}`, `Email: ${email}`, `Phone: ${phoneDisplay}`, ...REG_EN.map((l) => l.replace(" : ", ": "))].join("\n"),
          "Publishing director: Amine Lahmer, Managing Director.",
        ],
      },
      {
        heading: "Hosting",
        paragraphs: [
          `The Site is hosted by ${HOST_NAME} (${HOST_SITE}). The technical connection data recorded by this host is described in our privacy policy.`,
        ],
      },
      {
        heading: "Regulated activity",
        paragraphs: [
          `${legalName} operates as a consultancy subject to ministerial accreditation. Its services (environmental impact assessments, hazard studies, health-safety-environment audits, environmental management plans) fall within Law No. 03-10 of 19 July 2003 on the protection of the environment within the framework of sustainable development and its implementing texts, in particular Executive Decrees No. 06-198 of 31 May 2006 and No. 07-144 and No. 07-145 of 19 May 2007.`,
          "Regulatory references reproduced on the Site are provided for general information. Only the versions published in the Official Journal of the People's Democratic Republic of Algeria are authoritative.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          `All elements of the Site (texts, illustrations, maps, logo, visual identity, structure and code) are protected by Ordinance No. 03-05 of 19 July 2003 on copyright and related rights. They are the exclusive property of ${legalName} or are used under licence.`,
          `Any reproduction, representation, adaptation or distribution, in whole or in part, by any means, without the prior written consent of ${legalName}, is prohibited and constitutes infringement. Short quotations for information purposes, with attribution and a link to the Site, are permitted.`,
          'The name "BTH Expert" and its logo are distinctive signs of the publisher. Their use without authorisation is prohibited.',
        ],
      },
      {
        heading: "Site content and liability",
        paragraphs: [
          `${legalName} takes great care to keep the information published accurate and current. It is nonetheless general in nature: it is neither legal advice, nor a regulatory opinion applicable to a specific situation, nor a contractual offer. Each engagement is assessed individually and formalised in a quotation and a contract.`,
          `${legalName} cannot be held liable for direct or indirect damage arising from the use of the Site's information, from any interruption or unavailability of the Site, or from viruses or harmful elements beyond its control.`,
          "The Site may contain links to third-party websites (administrations, bodies, partners). They are provided for the convenience of visitors. The publisher has no control over these sites and accepts no responsibility for their content or practices.",
        ],
      },
      {
        heading: "Personal data",
        paragraphs: [
          "The processing of personal data collected on the Site is governed by Algerian Law No. 18-07 of 10 June 2018 on the protection of natural persons in the processing of personal data. Purposes, recipients, retention periods and your rights are set out in our privacy policy, accessible from every page of the Site.",
        ],
      },
      {
        heading: "Governing law and jurisdiction",
        paragraphs: [
          `This legal notice is governed by Algerian law. In the event of a dispute relating to the Site, the parties will first seek an amicable solution. Failing that, the dispute will be brought before the competent courts of the jurisdiction of ${legalName}'s registered office in Oran.`,
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          `For any question about the Site or to report content, write to ${email} or by post to the registered office above.`,
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Politique de confidentialité
// ─────────────────────────────────────────────────────────────────────────────

const PRIVACY: Record<Locale, LegalPage> = {
  fr: {
    slug: "confidentialite",
    navLabel: "Politique de confidentialité",
    metaTitle: "Politique de confidentialité | BTH Expert",
    metaDescription: `Comment ${legalName} collecte, utilise et protège vos données personnelles, et vos droits au titre de la loi n° 18-07 du 10 juin 2018.`,
    eyebrow: "Données personnelles",
    heading: "Politique de confidentialité",
    updatedLabel: "Dernière mise à jour",
    sections: [
      {
        heading: "Notre engagement",
        paragraphs: [
          `${legalName} traite les données à caractère personnel des visiteurs de son site conformément à la loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel. La présente politique décrit, en termes clairs, quelles données nous collectons, pourquoi, qui y accède, combien de temps nous les conservons et comment vous pouvez exercer vos droits.`,
        ],
      },
      {
        heading: "Responsable du traitement",
        paragraphs: [
          `${legalName}, ${postal}.\nCourriel : ${email}\nTéléphone : ${phoneDisplay}`,
        ],
      },
      {
        heading: "Données que nous collectons",
        paragraphs: [
          "La simple consultation du Site ne nécessite ni inscription ni communication de données personnelles. Nous collectons des données dans deux situations seulement.",
          "Lorsque vous utilisez le formulaire de contact, nous recevons les informations que vous saisissez :",
        ],
        list: [
          "votre nom complet ;",
          "votre numéro de téléphone ;",
          "votre adresse de courriel, si vous la renseignez (champ facultatif) ;",
          "le type de projet concerné ;",
          "votre message, si vous en rédigez un (champ facultatif) ;",
          "la langue dans laquelle vous consultez le Site.",
        ],
        after:
          "Lorsque vous naviguez sur le Site, notre hébergeur enregistre dans ses journaux techniques des données de connexion : adresse IP, type de navigateur, pages consultées, date et heure. Ces journaux servent exclusivement à la sécurité et au bon fonctionnement du service. Nous ne collectons aucune donnée dite sensible et nous ne réalisons aucun profilage.",
      },
      {
        heading: "Finalités et fondement du traitement",
        paragraphs: [
          "Les données du formulaire sont utilisées pour une seule finalité : répondre à votre demande, puis, si vous le souhaitez, préparer une proposition et assurer le suivi de notre échange. Le traitement repose sur votre consentement, exprimé en cochant la case prévue à cet effet avant l'envoi, et sur les démarches précontractuelles engagées à votre demande.",
          "Vos données ne sont ni vendues, ni louées, ni cédées. Elles ne servent à aucune prospection commerciale que vous n'auriez pas sollicitée et ne font l'objet d'aucune décision automatisée.",
        ],
      },
      {
        heading: "Destinataires et sous-traitants",
        paragraphs: [
          `Vos messages sont lus uniquement par l'équipe de ${legalName}. Pour les acheminer, nous faisons appel à deux prestataires techniques agissant sur nos instructions et tenus à la confidentialité :`,
        ],
        list: [
          `${HOST_NAME} (hébergement du Site et réception des formulaires) ;`,
          "Resend, Inc. (acheminement de la notification par courriel vers notre messagerie).",
        ],
        after:
          "Ces prestataires n'utilisent pas vos données pour leur propre compte. Aucune autre communication à des tiers n'est effectuée, sauf obligation légale ou demande d'une autorité habilitée.",
      },
      {
        heading: "Durée de conservation",
        paragraphs: [
          "Les données d'une demande de contact sont conservées le temps nécessaire à son traitement et au suivi qui en découle. Une demande restée sans suite est supprimée au plus tard douze mois après sa réception.",
          "Lorsqu'une demande aboutit à une mission, les données nécessaires à l'exécution du contrat sont conservées pendant la durée de la relation, puis archivées pendant les délais imposés par les obligations comptables, fiscales et de preuve en vigueur en Algérie.",
          "Les journaux techniques de l'hébergeur sont conservés pour une durée limitée, définie par celui-ci, à des fins de sécurité.",
        ],
      },
      {
        heading: "Sécurité",
        paragraphs: [
          "Le Site est servi exclusivement en HTTPS. L'accès aux soumissions du formulaire et à notre messagerie est restreint aux personnes habilitées et protégé par authentification. Le formulaire comporte un dispositif anti-robots. Malgré ces mesures, aucune transmission sur Internet n'est totalement sûre ; nous vous invitons à ne pas transmettre d'information confidentielle par le formulaire et à privilégier un échange direct pour les documents sensibles.",
        ],
      },
      {
        heading: "Vos droits",
        paragraphs: [
          "Conformément à la loi n° 18-07, vous disposez des droits suivants sur vos données :",
        ],
        list: [
          "droit d'accès : obtenir la confirmation que vos données sont traitées et en recevoir une copie ;",
          "droit de rectification : faire corriger des données inexactes ou incomplètes ;",
          "droit d'opposition : vous opposer, pour des motifs légitimes, à un traitement ;",
          "droit d'effacement : obtenir la suppression de vos données lorsqu'elles ne sont plus nécessaires ;",
          "droit de retirer votre consentement à tout moment, sans que cela remette en cause les traitements déjà effectués.",
        ],
        after: `Pour exercer ces droits, écrivez à ${email} ou au siège social en précisant votre demande. Nous pourrons vous demander un justificatif d'identité si cela est nécessaire pour vérifier que la demande émane bien de vous. Nous répondons dans un délai d'un mois. Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir l'Autorité nationale de protection des données à caractère personnel (ANPDP), autorité algérienne compétente en la matière.`,
      },
      {
        heading: "Cookies et traceurs",
        paragraphs: [
          "Le Site n'utilise aucun cookie publicitaire, aucun cookie de mesure d'audience et aucun traceur tiers. Seuls des éléments techniques strictement nécessaires au fonctionnement du service peuvent être déposés par l'hébergeur ; ils ne permettent pas de vous identifier. L'espace d'administration du contenu, réservé à l'éditeur, utilise ses propres cookies d'authentification et n'est pas accessible au public.",
        ],
      },
      {
        heading: "Mineurs",
        paragraphs: [
          "Le Site s'adresse à des professionnels et à des porteurs de projets. Nous ne collectons pas sciemment de données concernant des mineurs. Si vous pensez qu'un mineur nous a transmis des données, contactez-nous : elles seront supprimées.",
        ],
      },
      {
        heading: "Modifications de la présente politique",
        paragraphs: [
          "Cette politique peut être mise à jour pour tenir compte d'évolutions réglementaires, techniques ou organisationnelles. La version en vigueur est celle publiée sur cette page, avec sa date de mise à jour. En cas de changement substantiel affectant vos droits, nous l'indiquerons de manière visible sur le Site.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [`Pour toute question relative à la protection de vos données : ${email}.`],
      },
    ],
  },

  ar: {
    slug: "confidentialite",
    navLabel: "سياسة الخصوصية",
    metaTitle: "سياسة الخصوصية | BTH Expert",
    metaDescription: `كيف تجمع ${legalName} بياناتكم الشخصية وتستعملها وتحميها، وما هي حقوقكم بموجب القانون رقم 18-07 المؤرخ في 10 يونيو 2018.`,
    eyebrow: "البيانات الشخصية",
    heading: "سياسة الخصوصية",
    updatedLabel: "آخر تحديث",
    sections: [
      {
        heading: "التزامنا",
        paragraphs: [
          `تعالج ${legalName} البيانات ذات الطابع الشخصي لزوار موقعها طبقاً للقانون رقم 18-07 المؤرخ في 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي. تبيّن هذه السياسة، بعبارات واضحة، البيانات التي نجمعها، ولماذا، ومن يطّلع عليها، ومدة حفظها، وكيف تمارسون حقوقكم.`,
        ],
      },
      {
        heading: "المسؤول عن المعالجة",
        paragraphs: [`${legalName}، ${postalAr}.\nالبريد الإلكتروني : ${email}\nالهاتف : ${phoneDisplay}`],
      },
      {
        heading: "البيانات التي نجمعها",
        paragraphs: [
          "لا يتطلّب مجرد تصفح الموقع أي تسجيل ولا تقديم بيانات شخصية. نجمع بيانات في حالتين فقط.",
          "عند استعمال نموذج الاتصال، نتلقى المعلومات التي تدخلونها :",
        ],
        list: [
          "اسمكم الكامل ؛",
          "رقم هاتفكم ؛",
          "بريدكم الإلكتروني إن أدخلتموه (حقل اختياري) ؛",
          "نوع المشروع المعني ؛",
          "رسالتكم إن كتبتموها (حقل اختياري) ؛",
          "اللغة التي تتصفحون بها الموقع.",
        ],
        after:
          "عند تصفح الموقع، يسجّل مضيفنا في سجلاته التقنية بيانات الاتصال : عنوان IP، نوع المتصفح، الصفحات المزارة، التاريخ والساعة. تُستعمل هذه السجلات حصراً لأمن الخدمة وحسن سيرها. لا نجمع أي بيانات تُعدّ حساسة ولا نقوم بأي تنميط.",
      },
      {
        heading: "أغراض المعالجة وأساسها",
        paragraphs: [
          "تُستعمل بيانات النموذج لغرض واحد : الرد على طلبكم، ثم، إن رغبتم، إعداد عرض ومتابعة تواصلنا. تستند المعالجة إلى موافقتكم، المعبَّر عنها بتأشير الخانة المخصصة قبل الإرسال، وإلى الإجراءات السابقة للتعاقد التي تطلبونها.",
          "لا تُباع بياناتكم ولا تُؤجَّر ولا تُحوَّل. ولا تُستعمل في أي استقطاب تجاري لم تطلبوه، ولا تخضع لأي قرار آلي.",
        ],
      },
      {
        heading: "المستلمون والمعالجون من الباطن",
        paragraphs: [
          `يقرأ رسائلكم فريق ${legalName} وحده. ولتوجيهها نستعين بمزوّدَين تقنيَين يعملان وفق تعليماتنا ويلتزمان بالسرية :`,
        ],
        list: [
          `${HOST_NAME}‏ (استضافة الموقع واستقبال النماذج) ؛`,
          "Resend, Inc.‏ (توجيه الإشعار بالبريد الإلكتروني إلى صندوق بريدنا).",
        ],
        after:
          "لا يستعمل هذان المزوّدان بياناتكم لحسابهما الخاص. ولا يتم أي تبليغ آخر للغير إلا بموجب التزام قانوني أو طلب من سلطة مخوّلة.",
      },
      {
        heading: "مدة الحفظ",
        paragraphs: [
          "تُحفظ بيانات طلب الاتصال للمدة اللازمة لمعالجته ومتابعته. يُحذف أي طلب لم يُستكمل في أجل أقصاه اثنا عشر شهراً من تاريخ استلامه.",
          "إذا أفضى الطلب إلى مهمة، تُحفظ البيانات اللازمة لتنفيذ العقد طيلة مدة العلاقة، ثم تُؤرشف خلال الآجال التي تفرضها الالتزامات المحاسبية والجبائية والإثباتية السارية في الجزائر.",
          "تُحفظ السجلات التقنية للمضيف لمدة محدودة يحددها هو، لأغراض أمنية.",
        ],
      },
      {
        heading: "الأمن",
        paragraphs: [
          "يُقدَّم الموقع حصراً عبر HTTPS. الوصول إلى إرسالات النموذج وإلى بريدنا مقصور على الأشخاص المخوّلين ومحمي بالمصادقة. يتضمن النموذج آلية مضادة للروبوتات. ورغم هذه التدابير، لا يوجد إرسال عبر الإنترنت آمن بشكل مطلق ؛ لذا ننصحكم بعدم إرسال معلومات سرية عبر النموذج وتفضيل التواصل المباشر للوثائق الحساسة.",
        ],
      },
      {
        heading: "حقوقكم",
        paragraphs: ["طبقاً للقانون رقم 18-07، تتمتعون بالحقوق التالية على بياناتكم :"],
        list: [
          "حق الاطلاع : الحصول على تأكيد بمعالجة بياناتكم وعلى نسخة منها ؛",
          "حق التصحيح : تصحيح البيانات غير الدقيقة أو غير الكاملة ؛",
          "حق الاعتراض : الاعتراض على معالجة ما لأسباب مشروعة ؛",
          "حق المحو : الحصول على حذف بياناتكم عندما لا تعود ضرورية ؛",
          "حق سحب الموافقة في أي وقت، دون المساس بالمعالجات المنجزة قبل ذلك.",
        ],
        after: `لممارسة هذه الحقوق، راسلونا على ${email} أو عبر البريد إلى المقر الاجتماعي مع توضيح طلبكم. قد نطلب منكم إثبات هوية إذا كان ذلك ضرورياً للتحقق من أن الطلب صادر عنكم. نرد في أجل شهر. وإذا رأيتم أن حقوقكم لم تُحترم، يمكنكم اللجوء إلى السلطة الوطنية لحماية المعطيات ذات الطابع الشخصي، وهي السلطة الجزائرية المختصة في هذا المجال.`,
      },
      {
        heading: "ملفات تعريف الارتباط وأدوات التتبع",
        paragraphs: [
          "لا يستعمل الموقع أي ملفات تعريف ارتباط إشهارية، ولا لقياس الجمهور، ولا أدوات تتبع من الغير. وحدها العناصر التقنية الضرورية لسير الخدمة قد يضعها المضيف ؛ وهي لا تسمح بالتعرف عليكم. أما فضاء إدارة المحتوى، المخصص للناشر، فيستعمل ملفات مصادقة خاصة به وليس متاحاً للعموم.",
        ],
      },
      {
        heading: "القاصرون",
        paragraphs: [
          "يتوجه الموقع إلى المهنيين وأصحاب المشاريع. لا نجمع عن علم بيانات تخص قاصرين. إذا كنتم تعتقدون أن قاصراً أرسل إلينا بيانات، فاتصلوا بنا وسيتم حذفها.",
        ],
      },
      {
        heading: "تعديل هذه السياسة",
        paragraphs: [
          "قد تُحدَّث هذه السياسة لمراعاة تطورات تنظيمية أو تقنية أو تنظيمية داخلية. النسخة السارية هي المنشورة في هذه الصفحة بتاريخ تحديثها. وفي حال تغيير جوهري يمس حقوقكم، سنشير إليه بشكل ظاهر في الموقع.",
        ],
      },
      {
        heading: "اتصال",
        paragraphs: [`لأي سؤال يخص حماية بياناتكم : ${email}.`],
      },
    ],
  },

  en: {
    slug: "confidentialite",
    navLabel: "Privacy policy",
    metaTitle: "Privacy policy | BTH Expert",
    metaDescription: `How ${legalName} collects, uses and protects your personal data, and your rights under Algerian Law No. 18-07 of 10 June 2018.`,
    eyebrow: "Personal data",
    heading: "Privacy policy",
    updatedLabel: "Last updated",
    sections: [
      {
        heading: "Our commitment",
        paragraphs: [
          `${legalName} processes the personal data of its website visitors in accordance with Algerian Law No. 18-07 of 10 June 2018 on the protection of natural persons in the processing of personal data. This policy explains, in plain terms, what data we collect, why, who has access to it, how long we keep it and how you can exercise your rights.`,
        ],
      },
      {
        heading: "Data controller",
        paragraphs: [`${legalName}, ${postalEn}.\nEmail: ${email}\nPhone: ${phoneDisplay}`],
      },
      {
        heading: "Data we collect",
        paragraphs: [
          "Simply browsing the Site requires no registration and no personal data. We collect data in two situations only.",
          "When you use the contact form, we receive the information you enter:",
        ],
        list: [
          "your full name;",
          "your phone number;",
          "your email address, if you provide it (optional field);",
          "the type of project concerned;",
          "your message, if you write one (optional field);",
          "the language in which you browse the Site.",
        ],
        after:
          "When you browse the Site, our host records connection data in its technical logs: IP address, browser type, pages visited, date and time. These logs are used solely for the security and proper operation of the service. We collect no sensitive data and carry out no profiling.",
      },
      {
        heading: "Purposes and legal basis",
        paragraphs: [
          "Form data is used for one purpose only: to answer your request and, if you wish, to prepare a proposal and follow up on our exchange. Processing is based on your consent, given by ticking the box provided before sending, and on the pre-contractual steps taken at your request.",
          "Your data is never sold, rented or shared. It is not used for any commercial prospecting you have not asked for, and it is not subject to any automated decision-making.",
        ],
      },
      {
        heading: "Recipients and processors",
        paragraphs: [
          `Your messages are read only by the ${legalName} team. To deliver them, we rely on two technical providers acting on our instructions and bound by confidentiality:`,
        ],
        list: [
          `${HOST_NAME} (Site hosting and form reception);`,
          "Resend, Inc. (delivery of the email notification to our mailbox).",
        ],
        after:
          "These providers do not use your data for their own purposes. No other disclosure to third parties is made, except where required by law or requested by a competent authority.",
      },
      {
        heading: "Retention period",
        paragraphs: [
          "Contact request data is kept for as long as needed to handle the request and the follow-up it entails. A request with no follow-up is deleted at the latest twelve months after receipt.",
          "When a request leads to an engagement, the data needed to perform the contract is kept for the duration of the relationship, then archived for the periods required by Algerian accounting, tax and evidentiary obligations.",
          "The host's technical logs are kept for a limited period, set by the host, for security purposes.",
        ],
      },
      {
        heading: "Security",
        paragraphs: [
          "The Site is served exclusively over HTTPS. Access to form submissions and to our mailbox is restricted to authorised persons and protected by authentication. The form includes an anti-bot mechanism. Despite these measures, no transmission over the Internet is entirely secure; we ask you not to send confidential information through the form and to prefer a direct exchange for sensitive documents.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: ["Under Law No. 18-07, you have the following rights over your data:"],
        list: [
          "right of access: to obtain confirmation that your data is processed and to receive a copy;",
          "right of rectification: to have inaccurate or incomplete data corrected;",
          "right to object: to object, on legitimate grounds, to a processing operation;",
          "right to erasure: to have your data deleted when it is no longer necessary;",
          "right to withdraw your consent at any time, without affecting processing already carried out.",
        ],
        after: `To exercise these rights, write to ${email} or to the registered office, stating your request. We may ask for proof of identity where necessary to verify that the request comes from you. We reply within one month. If you believe your rights have not been respected, you may refer the matter to the Autorité nationale de protection des données à caractère personnel (ANPDP), the competent Algerian authority.`,
      },
      {
        heading: "Cookies and trackers",
        paragraphs: [
          "The Site uses no advertising cookies, no audience-measurement cookies and no third-party trackers. Only technical elements strictly necessary to the operation of the service may be set by the host; they do not identify you. The content administration area, reserved for the publisher, uses its own authentication cookies and is not accessible to the public.",
        ],
      },
      {
        heading: "Minors",
        paragraphs: [
          "The Site is intended for professionals and project owners. We do not knowingly collect data relating to minors. If you believe a minor has sent us data, contact us and it will be deleted.",
        ],
      },
      {
        heading: "Changes to this policy",
        paragraphs: [
          "This policy may be updated to reflect regulatory, technical or organisational changes. The version in force is the one published on this page, with its update date. In the event of a substantial change affecting your rights, we will indicate it visibly on the Site.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [`For any question regarding the protection of your data: ${email}.`],
      },
    ],
  },
};

/** Consent wording shown next to the contact-form checkbox (Law No. 18-07). */
export const CONSENT_LABEL: Record<Locale, string> = {
  fr: "J'accepte que mes données soient utilisées pour répondre à ma demande, dans les conditions décrites dans la politique de confidentialité.",
  ar: "أوافق على استعمال بياناتي للرد على طلبي، وفق الشروط المبيّنة في سياسة الخصوصية.",
  en: "I agree that my data may be used to answer my request, under the conditions described in the privacy policy.",
};

export const legalPages = {
  mentions: MENTIONS,
  privacy: PRIVACY,
} as const;

export type LegalPageKey = keyof typeof legalPages;

/** The page for a locale, with French typographic spacing applied. */
export function getLegalPage(key: LegalPageKey, lang: Locale): LegalPage {
  const page = legalPages[key][lang];
  return lang === "fr" ? frenchPunctuationDeep(page) : page;
}

/** Consent wording for a locale, typeset the same way. */
export function getConsentLabel(lang: Locale): string {
  return lang === "fr" ? frenchPunctuationDeep(CONSENT_LABEL[lang]) : CONSENT_LABEL[lang];
}
