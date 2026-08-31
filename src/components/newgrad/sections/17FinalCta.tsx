"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { LINE_URL } from "@/lib/newgrad/data/config";
import { SENPAI_LIST } from "@/lib/newgrad/data/senpai";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { ChoiceCard } from "../ui/ChoiceCard";
import { Button } from "../ui/Button";

const FINAL_INTEREST_OPTIONS = [
  "ちょっと気になる",
  "もっと知りたい",
  "実際に見てみたい",
] as const;

const isRealLineUrl = LINE_URL.startsWith("http");

export function FinalCta() {
  const { state, update } = useNewGradState();
  const senpai = SENPAI_LIST.find((s) => s.id === state.matchedSenpai);

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
    <Section id="final-cta" index="17" title={"ここまで見て、\nLEGOHAIRをどう感じましたか？"}>
      <div className="mb-12 flex flex-col gap-3">
        {FINAL_INTEREST_OPTIONS.map((option) => (
          <ChoiceCard
            key={option}
            label={option}
            selected={state.finalInterest === option}
            onClick={() => pickInterest(option)}
          />
        ))}
      </div>

      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <p className="text-sm leading-relaxed">
          就職先は、
          <br />
          画面だけで決めなくていい。
        </p>
        <p className="text-sm leading-relaxed text-[var(--ng-muted)]">
          写真では分からない空気がある。
          <br />
          会わないと分からない人がいる。
        </p>
        <p className="text-2xl font-bold leading-snug">
          だから、
          <br />
          まず見に来てください。
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={handleVisitClick}>サロン見学してみる</Button>
        <a
          href={isRealLineUrl ? LINE_URL : "#final-cta"}
          onClick={handleLineClick}
          target={isRealLineUrl ? "_blank" : undefined}
          rel={isRealLineUrl ? "noopener noreferrer" : undefined}
          className="w-full rounded-full border border-[var(--ng-ink)] px-6 py-4 text-center text-sm font-bold tracking-wide"
        >
          LINEで質問してみる
        </a>

        {senpai && (
          <a
            href={isRealLineUrl ? LINE_URL : "#final-cta"}
            onClick={handleLineClick}
            target={isRealLineUrl ? "_blank" : undefined}
            rel={isRealLineUrl ? "noopener noreferrer" : undefined}
            className="w-full rounded-full bg-[var(--ng-accent-soft)] px-6 py-4 text-center text-sm font-bold tracking-wide text-[var(--ng-ink)]"
          >
            {senpai.name}さんについて聞いてみる
          </a>
        )}
      </div>

      <p className="mt-8 whitespace-pre-line text-center text-xs leading-relaxed text-[var(--ng-muted)]">
        {"LINE追加だけでは応募になりません。\n質問・見学だけでも大丈夫です。\n\nまだ就職先を決めていなくても大丈夫です。"}
      </p>
    </Section>
  );
}
