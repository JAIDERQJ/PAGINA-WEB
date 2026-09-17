"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface CarouselSlide {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaHref: string;
}

const AUTO_ADVANCE_MS = 5000;

export default function HeroCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, slides.length]);

  return (
    <section
      className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative w-full h-full shrink-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-14 text-white">
              <p className="text-xs uppercase tracking-widest mb-2 text-white/80">
                {slide.eyebrow}
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight max-w-[16ch]">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base text-white/85 mb-5 max-w-[36ch]">
                {slide.subtitle}
              </p>
              <Link
                href={slide.ctaHref}
                className="font-pixel-ui text-xs bg-rust text-white px-5 py-3 rounded-[6px] hover:brightness-95 transition"
              >
                Ver más
              </Link>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-ink flex items-center justify-center"
          >
            ‹
          </button>
          <button
            aria-label="Siguiente"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-ink flex items-center justify-center"
          >
            ›
          </button>

          <div className="absolute bottom-4 right-4 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === index ? "bg-rust" : "bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}