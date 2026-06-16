"use client";

import Image from "next/image";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

interface Member {
  name: string;
  role: string;
  credentials: string[];
  bio: string;
}

interface EquipeMembersProps {
  members: Member[];
  partner: { heading: string; description: string };
}

/**
 * Editorial roster for the team page. Each member is a two-column band:
 * a portrait (real photo when we have one, else an elegant initial block)
 * on one side, name / role / credentials and bio on the other, the columns
 * alternating left↔right down the page for rhythm. A gold numeral and filet
 * anchor each entry; credentials reveal as a stagger. The partner block
 * closes the section. All copy comes from the dictionary.
 */

/** Map a member name to one of the existing portraits, like the contact page. */
function photoFor(name: string): string | null {
  if (name === "Amine Lahmer") return "/amine.jpg";
  if (name.startsWith("Abdellah")) return "/abdellah.jpg";
  return null;
}

export function EquipeMembers({ members, partner }: EquipeMembersProps) {
  return (
    <section className="bg-cream-soft">
      <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        {members.map((member, index) => {
          const photo = photoFor(member.name);
          const reversed = index % 2 === 1;

          return (
            <article
              key={member.name}
              className="border-t border-line py-16 lg:py-24 lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-center"
            >
              {/* Portrait */}
              <FadeIn
                className={`mb-10 lg:mb-0 lg:col-span-5 ${
                  reversed ? "lg:order-2 lg:col-start-8" : "lg:order-1"
                }`}
              >
                <div className="relative aspect-[4/5] max-h-[32rem] w-full max-w-md overflow-hidden rounded-sm bg-cream-deep">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-gold/10 to-brand/20 ring-1 ring-inset ring-line/60">
                      <span className="font-display font-light text-muted/70 leading-none text-[clamp(4rem,8vw,7rem)]">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Text rail */}
              <div
                className={`lg:col-span-6 ${
                  reversed ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-7"
                }`}
              >
                <FadeIn>
                  <div className="flex items-baseline gap-4 mb-6">
                    <span
                      aria-hidden
                      className="font-display text-gold tracking-[0.02em] leading-none"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px w-12 bg-gold" />
                  </div>
                  <h2
                    className="font-display font-light text-ink tracking-[-0.02em] leading-[1.1] mb-2"
                    style={{ fontSize: "var(--text-h2)" }}
                  >
                    {member.name}
                  </h2>
                  <p className="font-sans text-muted text-[length:var(--text-small)] mb-7">
                    {member.role}
                  </p>
                </FadeIn>

                <FadeInStagger className="flex flex-wrap gap-x-3 gap-y-2.5 mb-8">
                  {member.credentials.map((cred) => (
                    <FadeInItem key={cred}>
                      <span className="inline-block rounded-full border border-line ps-3 pe-3.5 py-1.5 font-sans uppercase tracking-[0.14em] text-muted text-[length:var(--text-caption)]">
                        {cred}
                      </span>
                    </FadeInItem>
                  ))}
                </FadeInStagger>

                <FadeIn delay={0.05}>
                  <p className="font-sans text-ink-soft leading-[1.8] max-w-xl text-[length:var(--text-body)]">
                    {member.bio}
                  </p>
                </FadeIn>
              </div>
            </article>
          );
        })}

        {/* Partner — editorial close on the same canvas */}
        <div className="border-t border-line py-16 lg:py-24 lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-4 mb-6 lg:mb-0">
            <FadeIn>
              <span aria-hidden className="block w-12 h-px bg-gold mb-7" />
              <h2
                className="font-display font-light text-ink tracking-[-0.02em] leading-[1.15]"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {partner.heading}
              </h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FadeIn delay={0.1}>
              <p className="font-sans text-ink-soft leading-[1.8] text-[length:var(--text-body)]">
                {partner.description}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
