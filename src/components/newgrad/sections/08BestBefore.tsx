"use client";

import { useRef } from "react";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Section } from "../ui/Section";
import { Photo } from "../ui/Photo";
import { useReveal } from "../hooks/useReveal";

const PROCESS = ["BEFORE", "DESIGN / CARE / COUNSELING", "NEXT BEFORE"];

export function BestBefore() {
  const photosRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const photosInView = useReveal(photosRef, 0.15);
  const processInView = useReveal(processRef, 0.2);
  const headlineInView = useReveal(headlineRef, 0.3);

  return (
    <Section
      id="best-before"
      index="08"
      accentIndex
      topLine
      tone="pink-tint"
      pad="l"
      align="center"
    >
      <div className="ng-reveal flex flex-col items-center gap-10">
        <p className="text-lg leading-relaxed opacity-80">
          今日、
          <br />
          きれいにする。
          <br />
          だけじゃない。
        </p>
        <p className="text-lg text-[var(--ng-hotpink)]">↓</p>
        <p className="text-lg leading-relaxed opacity-80">
          次に会う日まで、
          <br />
          デザインする。
        </p>

        <div
          ref={photosRef}
          className={`relative w-full py-6 ng-io-scale ${photosInView ? "ng-in" : ""}`}
        >
          <Photo
            slot={NEWGRAD_IMAGES.bestBefore}
            aspect="aspect-[4/5]"
            className="mx-auto w-[74%] -rotate-2"
          />
          <div className="absolute right-[8%] bottom-0 w-[38%] rotate-3">
            <Photo
              slot={NEWGRAD_IMAGES.bestBeforeDetail}
              aspect="aspect-square"
              rounded="rounded-[4px]"
              className="shadow-[0_0_0_5px_var(--ng-pink-tint)]"
            />
          </div>
        </div>

        {/* Layer: the process reads like typeset stages of a printed page -
            each word steps in a beat after the last. */}
        <div
          ref={processRef}
          className="ng-sans-en flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] text-[var(--ng-ink)] opacity-45 uppercase"
        >
          {PROCESS.map((step, i) => (
            <span
              key={step}
              className={`ng-io-fade flex items-center gap-2 ${
                i === 1 ? "ng-io-d2" : i === 2 ? "ng-io-d4" : ""
              } ${processInView ? "ng-in" : ""}`}
            >
              {i > 0 && <span className="text-[var(--ng-hotpink)] opacity-100">→</span>}
              {step}
            </span>
          ))}
        </div>

        <div ref={headlineRef} className="flex flex-col items-center">
          <p className="ng-serif max-w-[16ch] text-4xl leading-[1.2] font-medium">
            最高のビフォーを
            <br />
            つくる。
          </p>
          {/* HOT PINK handwritten underline draw - one of the three
              sections (01/08/17) that carries this emphasis. */}
          <span
            className={`ng-hand mt-1 ng-io-line-h h-[3px] -rotate-1 rounded-full bg-[var(--ng-hotpink)] ${headlineInView ? "ng-in" : ""}`}
            style={{ ["--ng-line-w" as string]: "5rem" }}
            aria-hidden
          />
          <p className="mt-4 max-w-[30ch] text-xs leading-relaxed opacity-45">
            LEGOHAIRでは、次回来店した時の髪まで考えて技術・提案・ホームケアを組み立てます。
          </p>
        </div>
      </div>
    </Section>
  );
}
