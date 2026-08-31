"use client";

import { useRef } from "react";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Photo } from "../ui/Photo";
import { useReveal } from "../hooks/useReveal";

export function Hero() {
  const photoRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const photoInView = useReveal(photoRef, 0.1);
  const copyInView = useReveal(copyRef, 0.1);
  const lineInView = useReveal(lineRef, 0.2);

  return (
    <section id="hero" data-section="hero" className="bg-[var(--ng-ivory)] px-6 pt-8 pb-20">
      <div className="mx-auto max-w-md">
        <div className="ng-sans-en mb-5 text-[11px] tracking-[0.24em] opacity-55 uppercase">
          LEGOHAIR — NEW GRAD 2027 — OSAKA
        </div>

        <div
          ref={photoRef}
          className={`ng-io-clip relative ${photoInView ? "ng-in" : ""}`}
        >
          <Photo slot={NEWGRAD_IMAGES.hero} aspect="aspect-[4/5]" />
          {/* Layer: a large handwritten HOT PINK phrase sits on the photo
              and spills past its bottom-left edge. */}
          <span
            aria-hidden
            className="ng-hand pointer-events-none absolute -bottom-3 -left-2 -rotate-2 text-[2.1rem] leading-none whitespace-nowrap text-[var(--ng-hotpink)]"
          >
            で、終わらせない。
          </span>
        </div>

        <div ref={copyRef} className={`mt-14 ng-io-mask ${copyInView ? "ng-in" : ""}`}>
          <h1 className="text-[2.15rem] leading-[1.25] font-bold tracking-tight">
            美容師になる。
          </h1>
          <p className="mt-5 max-w-[30ch] text-sm leading-relaxed opacity-65">
            技術を覚えるだけじゃない。
            <br />
            人の魅力を見つけ、
            <br />
            自分らしい美容師になろう。
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <a
            href="#diagnosis"
            className="ng-sans-en flex w-full items-center justify-between border border-[var(--ng-hotpink)] bg-[var(--ng-hotpink)] px-6 py-4 text-sm font-bold tracking-wide text-white hover:opacity-85"
          >
            未来の美容師タイプを見つける
            <span aria-hidden>→</span>
          </a>
          <a
            href="#salon-tour"
            className="text-center text-xs font-semibold tracking-wide text-[var(--ng-hotpink)] underline underline-offset-4"
          >
            LEGOHAIRを知る
          </a>
        </div>

        <div ref={lineRef} className="mt-16 flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ng-hotpink)]" />
          <span className="ng-sans-en text-[13px] font-medium tracking-[0.3em] opacity-45">
            01
          </span>
          <span
            className={`ng-io-line-h h-px flex-1 bg-[var(--ng-line)] opacity-45 ${lineInView ? "ng-in" : ""}`}
          />
        </div>
      </div>
    </section>
  );
}
