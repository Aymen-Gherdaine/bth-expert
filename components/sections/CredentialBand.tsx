import { Container } from "@/components/layout/Container";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

export function CredentialBand() {
  return (
    <section className="bg-cream-warm">
      <Container>
        <div className="py-24 lg:py-32 max-w-2xl">
          <FadeInStagger>
            <FadeInItem>
              <span
                className="block font-sans uppercase text-gold mb-8"
                style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
              >
                Bureau d&apos;études agréé
              </span>
            </FadeInItem>

            <FadeInItem>
              <h2
                className="font-display font-light text-ink tracking-[-0.03em] leading-[1.1] mb-8"
                style={{ fontSize: "var(--text-h2)" }}
              >
                Des études rigoureuses, des livrables conformes.
              </h2>
            </FadeInItem>

            <FadeInItem>
              <p
                className="font-sans text-ink-soft leading-[1.75] max-w-lg"
                style={{ fontSize: "var(--text-body)" }}
              >
                Agréé par le Ministère de l&apos;Environnement et de la Qualité
                de la Vie, BTH Expert intervient dans l&apos;ouest algérien pour
                accompagner les industriels dans la mise en conformité de leurs
                projets — études d&apos;impact, audits HSE, plans de gestion :
                des livrables prêts à déposer.
              </p>
            </FadeInItem>
          </FadeInStagger>
        </div>
      </Container>
    </section>
  );
}
