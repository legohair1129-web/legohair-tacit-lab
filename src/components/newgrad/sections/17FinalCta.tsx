"use client";

import { useRef } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { LINE_URL } from "@/lib/newgrad/data/config";
import { SENPAI_LIST } from "@/lib/newgrad/data/senpai";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { ChoiceRow } from "../ui/ChoiceRow";
import { Button } from "../ui/Button";
import { useReveal } from "../hooks/useReveal";

const FINAL_INTEREST_OPTIONS = [
  "ちょっと気になる",
  "もっと知りたい",
  "実際に見てみたい",
] as const;

const isRealLineUrl = LINE_URL.startsWith("http");

export function FinalCta() {
  const { state, update } = useNewGradState();
  const senpai = SENPAI_LIST.find((s) => s.id === state.matchedSenpai);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useReveal(ctaRef, 0.2);

  function pickInterest(option: string) {
    update({ finalInterest: option });
  }

  function handleLineClick(e: React.MouseEvent) {
    trackEvent("line_click", {
      section: "final-cta",
      matchedSenpai: state.matchedSenpai,
    });
    if (!isRealLineUrl) e.preventDefault();
  }

  function handleVisitClick() {
    trackEvent("salon_visit_click", {
      section: "final-cta",
      primaryType: state.primaryType,
      secondaryType: state.secondaryType,
    });
  }

  return (
    <Section
      id="final-cta"
      index="17"
      accentIndex
      topLine
      tone="ivory"
      pad="l"
      kicker="salon visit"
      title={
        <>
          ここまで見て、
          <br />
          LEGOHAIRをどう感じましたか？
        </>
      }
    >
      <div className="mb-20">
        {FINAL_INTEREST_OPTIONS.map((option, i) => (
          <ChoiceRow
            key={option}
            index={String(i + 1).padStart(2, "0")}
            label={option}
            accent="pink"
            selected={state.finalInterest === option}
            onClick={() => pickInterest(option)}
          />
        ))}
      </div>

      <div className="ng-reveal">
        <p className="ng-serif text-[1.9rem] leading-[1.2] font-medium">
          YOU DON&apos;T
          <br />
          HAVE TO DECIDE
          <br />
          TODAY.
        </p>

        <p className="mt-8 text-sm leading-relaxed opacity-70">
          就職先は、
          <br />
          画面だけで決めなくていい。
        </p>
        <p className="mt-4 text-sm leading-relaxed opacity-55">
          写真では分からない空気がある。
          <br />
          会わないと分からない人がいる。
        </p>
        <p className="mt-8 text-xl leading-snug font-medium">
          だから、
          <br />
          まず見に来てください。
        </p>
      </div>

      <div ref={ctaRef}>
        {/* Layer: one short HOT PINK line right before the CTA - not
            another paragraph, a single beat. */}
        <p
          className={`ng-hand mb-6 -rotate-1 text-xl ng-io-mask ${ctaInView ? "ng-in" : ""}`}
        >
          まずは、覗いてみるだけでも。
        </p>

        <div className="flex flex-col gap-4">
          <Button variant="pink" onClick={handleVisitClick}>
            SALON TOUR
          </Button>
        <a
          href={isRealLineUrl ? LINE_URL : "#final-cta"}
          onClick={handleLineClick}
          target={isRealLineUrl ? "_blank" : undefined}
          rel={isRealLineUrl ? "noopener noreferrer" : undefined}
          className="ng-sans-en flex w-full items-center justify-between border border-[var(--ng-hotpink)] px-6 py-4 text-xs font-semibold tracking-[0.18em] text-[var(--ng-ink)] uppercase"
        >
          <span>LINEで質問してみる</span>
          <span aria-hidden className="text-[var(--ng-hotpink)]">→</span>
        </a>

        {senpai && (
          <a
            href={isRealLineUrl ? LINE_URL : "#final-cta"}
            onClick={handleLineClick}
            target={isRealLineUrl ? "_blank" : undefined}
            rel={isRealLineUrl ? "noopener noreferrer" : undefined}
            className="ng-sans-en flex w-full items-center justify-between px-1 py-2 text-xs tracking-[0.14em] text-[var(--ng-hotpink)] uppercase underline underline-offset-4"
          >
            <span>{senpai.name}さんについて聞いてみる</span>
            <span aria-hidden>→</span>
          </a>
        )}
        </div>
      </div>

      <p className="mt-10 text-xs leading-relaxed opacity-45">
        LINE追加だけでは応募になりません。
        <br />
        質問・見学だけでも大丈夫です。
        <br />
        <br />
        まだ就職先を決めていなくても大丈夫です。
      </p>
    </Section>
  );
}
