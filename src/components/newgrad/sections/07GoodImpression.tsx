"use client";

import { useRef } from "react";
import { getLegonComment } from "@/lib/newgrad/legon";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Section } from "../ui/Section";
import { Legon } from "../ui/Legon";
import { Photo } from "../ui/Photo";
import { useReveal } from "../hooks/useReveal";

const ELEMENTS = [
  { label: "FACE", pos: "top-4 left-6", delay: "" },
  { label: "COLOR", pos: "top-4 right-6 text-right", delay: "ng-io-d1" },
  { label: "BONE", pos: "top-[38%] left-6", delay: "ng-io-d2" },
  { label: "HAIR", pos: "top-[38%] right-6 text-right", delay: "ng-io-d3" },
  { label: "LIFESTYLE", pos: "bottom-12 left-6", delay: "ng-io-d4" },
] as const;

export function GoodImpression() {
  const photoRef = useRef<HTMLDivElement>(null);
  const photoInView = useReveal(photoRef, 0.1);

  return (
    <Section id="good-impression" index="07" accentIndex topLine tone="ivory" pad="l">
      <div
        ref={photoRef}
        className={`-mx-6 relative ng-io-clip ${photoInView ? "ng-in" : ""}`}
      >
        <Photo
          slot={NEWGRAD_IMAGES.goodImpression}
          aspect="aspect-[3/4]"
          rounded="rounded-none"
        />
        {ELEMENTS.map((el, i) => (
          <span
            key={el.label}
            className={`ng-sans-en absolute ${el.pos} flex flex-col gap-1 ng-io-fade ${el.delay} ${photoInView ? "ng-in" : ""}`}
          >
            <span className="bg-[var(--ng-white)]/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-[var(--ng-hotpink)] uppercase">
              {String(i + 1).padStart(2, "0")} {el.label}
            </span>
          </span>
        ))}
      </div>

      <h2 className="ng-reveal mt-8 mb-6 text-[2rem] leading-[1.15] font-medium tracking-tight">
        似合うには、理由がある。
      </h2>

      <p className="mb-2 text-sm leading-relaxed opacity-70">
        髪だけを見るのではなく、人を見る。
      </p>
      <p className="mb-10 text-sm leading-relaxed opacity-70">
        感覚だけではなく、
        <br />
        “なぜ似合うのか”を学ぶ。
      </p>

      <Legon text={getLegonComment("goodImpression")} />
    </Section>
  );
}
