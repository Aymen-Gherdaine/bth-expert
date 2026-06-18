import { ImageResponse } from "next/og";
import { getDictionary, validateLocale } from "@/lib/i18n";

export const alt = "BTH Expert — Bureau d'études environnemental agréé";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = validateLocale(params.lang);
  const dict = await getDictionary(lang);

  const title = dict.metadata.homeTitle.split(" — ")[0] ?? "BTH Expert";
  const description = dict.metadata.homeDescription;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          backgroundColor: "#1a2e1e",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Gold eyebrow */}
        <div
          style={{
            color: "#c9a96e",
            fontSize: 13,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          Agréé Ministère de l&apos;Environnement · Oran, Algérie
        </div>

        {/* Main title */}
        <div
          style={{
            color: "#f5f0e8",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 28,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            color: "#8fa08e",
            fontSize: 20,
            lineHeight: 1.6,
            maxWidth: 780,
          }}
        >
          {description}
        </div>

        {/* Bottom right domain */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            color: "#3d4a40",
            fontSize: 14,
            letterSpacing: "0.05em",
          }}
        >
          bthexpert.com
        </div>

        {/* Vertical gold rule */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            backgroundColor: "#c9a96e",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
