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
    <section
      id="hero"
      data-section="hero"
      className="bg-[var(--ng-ivory)] px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-20"
    >
      <div className="mx-auto max-w-md">
        {/* Masthead - stacked like a magazine cover, not a one-line kicker. */}
        <div className="ng-sans-en mb-6 flex flex-col gap-0.5 text-[11px] tracking-[0.24em] text-[var(--ng-ink)] opacity-45 uppercase">
          <span>LEGOHAIR</span>
          <span>NEW GRAD 2027</span>
          <span>OSAKA</span>
        </div>

        {/* Full-bleed cover photo - the single dominant element, no text
            layered on top of it, so the photo and the copy below read as
            one quiet editorial spread rather than an ad banner. */}
        <div
          ref={photoRef}
          className={`-mx-6 ng-io-clip ${photoInView ? "ng-in" : ""}`}
        >
          <Photo slot={NEWGRAD_IMAGES.hero} aspect="aspect-[4/5]" rounded="rounded-none" />
        </div>

        <div ref={copyRef} className={`mt-9 ng-io-mask ${copyInView ? "ng-in" : ""}`}>
          <h1 className="text-[1.85rem] leading-[1.35] font-semibold tracking-tight text-[var(--ng-ink)]">
            自分の魅力を知る。
            <br />
            人の魅力を引き出す。
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-[var(--ng-ink)] opacity-65">
            LEGOHAIRで、
            <br />
            自分らしい美容師になる。
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <a
            href="#diagnosis"
            className="ng-sans-en flex w-full items-center justify-between border border-[var(--ng-hotpink)] bg-[var(--ng-white)] px-6 py-4 text-sm font-semibold tracking-wide text-[var(--ng-ink)] hover:bg-[var(--ng-hotpink)] hover:text-white"
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
