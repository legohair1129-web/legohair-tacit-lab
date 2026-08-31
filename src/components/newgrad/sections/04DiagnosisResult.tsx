"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { TYPE_PROFILES, getCombinationMessage } from "@/lib/newgrad/data/typeProfiles";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Section } from "../ui/Section";
import { Photo } from "../ui/Photo";

export function DiagnosisResult() {
  const { state } = useNewGradState();

  if (!state.diagnosisCompleted || !state.primaryType || !state.secondaryType) {
    return (
      <Section id="diagnosis-result" index="04" kicker="診断結果">
        <p className="text-sm opacity-55">
          上の診断に答えると、ここにあなたの結果が表示されます。
        </p>
      </Section>
    );
  }

  const primary = TYPE_PROFILES[state.primaryType];
  const secondary = TYPE_PROFILES[state.secondaryType];
  const combination = getCombinationMessage(state.primaryType, state.secondaryType);

  return (
    <Section
      id="diagnosis-result"
      index="04"
      accentIndex
      tone="pink-tint"
      pad="l"
      kicker="診断結果"
    >
      <div className="ng-reveal">
        <p className="text-2xl leading-[1.4] font-bold break-words">
          {primary.nameJa}{" "}
          <span className="ng-hand mx-0.5 inline-block -rotate-2 align-middle text-3xl text-[var(--ng-hotpink)]">
            ×
          </span>{" "}
          {secondary.nameJa}
        </p>
        <p className="ng-sans-en mt-2 text-xs font-medium tracking-[0.16em] opacity-45 uppercase">
          {primary.nameEn} × {secondary.nameEn}
        </p>

        <div className="mt-8 w-[78%] rotate-1">
          <Photo
            slot={NEWGRAD_IMAGES.strength}
            aspect="aspect-[4/5]"
            className="shadow-[0_10px_28px_rgba(22,22,22,0.12)]"
          />
        </div>

        <p className="mt-10 text-xl leading-relaxed font-bold">
          {primary.headline}
        </p>

        <div className="mt-8 border-l-4 border-[var(--ng-hotpink)] py-1 pl-5">
          <p className="text-lg leading-relaxed font-medium italic">
            「{primary.quote}」
          </p>
        </div>

        <p className="mt-8 max-w-[34ch] text-sm leading-relaxed opacity-65">
          {primary.description}
        </p>

        <div className="mt-14 border-t border-[var(--ng-line)] pt-6">
          <p className="text-xs font-semibold tracking-[0.1em] opacity-45">
            もう一つの強み — {secondary.nameJa}
          </p>
          <p className="mt-3 text-sm leading-relaxed opacity-70">{combination}</p>
        </div>
      </div>
    </Section>
  );
}
