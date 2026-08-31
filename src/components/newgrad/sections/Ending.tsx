"use client";

import { useRef } from "react";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Section } from "../ui/Section";
import { Photo } from "../ui/Photo";
import { useReveal } from "../hooks/useReveal";

export function Ending() {
  const photoRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const photoInView = useReveal(photoRef, 0.15);
  const headlineInView = useReveal(headlineRef, 0.25);

  return (
    <Section id="ending" tone="pink-tint" pad="l" align="center" topLine>
      <div className="ng-reveal flex flex-col items-center gap-8">
        <div className="ng-sans-en text-xs tracking-[0.3em] opacity-50">
          LEGOHAIR
        </div>

        <div
          ref={photoRef}
          className={`w-[72%] ng-io-clip ${photoInView ? "ng-in" : ""}`}
        >
          <Photo slot={NEWGRAD_IMAGES.ending} aspect="aspect-[4/5]" />
        </div>

        <p className="text-base leading-relaxed opacity-75">
          人の魅力を引き出し、
          <br />
          自信を創る。
        </p>

        <div
          ref={headlineRef}
          className={`flex flex-col items-center ng-io-mask ${headlineInView ? "ng-in" : ""}`}
        >
          <p className="ng-serif max-w-[12ch] text-4xl leading-[1.3] font-medium">
            次は、
            <br />
            あなたの番。
          </p>
          {/* HOT PINK handwritten stroke - the closing "one stroke", the
              third of the three sections (01/08/17) carrying this emphasis. */}
          <span
            className={`ng-hand mt-2 ng-io-line-h h-[3px] -rotate-1 rounded-full bg-[var(--ng-hotpink)] ${headlineInView ? "ng-in" : ""}`}
            style={{ ["--ng-line-w" as string]: "3.5rem" }}
            aria-hidden
          />
        </div>

        <span className="ng-sans-en text-[11px] tracking-[0.25em] opacity-35">
          NEXT, IT&apos;S YOUR TURN.
        </span>
        <div className="ng-sans-en text-[11px] tracking-[0.3em] opacity-40">
          LEGOHAIR NEW GRAD
        </div>
      </div>
    </Section>
  );
}
