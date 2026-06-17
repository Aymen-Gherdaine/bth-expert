import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    blog: collection({
      label: "Blog",
      path: "content/fr/blog/*",
      slugField: "title",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Titre" } }),
        description: fields.text({
          label: "Description (meta SEO)",
          multiline: true,
          validation: { isRequired: true },
        }),
        date: fields.date({ label: "Date de publication", validation: { isRequired: true } }),
        author: fields.text({ label: "Auteur", defaultValue: "BTH Expert" }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        faq: fields.array(
          fields.object({
            q: fields.text({ label: "Question" }),
            a: fields.text({ label: "Réponse", multiline: true }),
          }),
          {
            label: "FAQ",
            itemLabel: (props) => props.fields.q.value || "Question",
          }
        ),
        content: fields.document({
          label: "Contenu",
          formatting: true,
          links: true,
          dividers: true,
        }),
      },
    }),
  },
});
