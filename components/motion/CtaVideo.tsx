"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface CtaVideoProps {
  src: string;
  poster: string;
}

/**
 * Deferred full-bleed background video.
 * - The poster (next/image, lazy) paints immediately; the <video> element is
 *   only mounted once the section nears the viewport (IntersectionObserver,
 *   50% root margin), so nothing video-related downloads on initial load.
 * - The video fades in over the poster once playback actually starts —
 *   no flash, no layout shift.
 * - prefers-reduced-motion: the video never mounts, the poster stays static.
 */
export function CtaVideo({ src, poster }: CtaVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "50% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    const onPlaying = () => setPlaying(true);
    video.addEventListener("playing", onPlaying);
    video.play().catch(() => {
      // Autoplay refused — the poster simply stays visible.
    });
    return () => video.removeEventListener("playing", onPlaying);
  }, [shouldLoad]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-brand-deep"
    >
      <Image
        src={poster}
        alt=""
        fill
        quality={70}
        sizes="100vw"
        className="object-cover"
      />
      {shouldLoad && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
