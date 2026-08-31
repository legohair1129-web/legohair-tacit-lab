"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { TYPE_PROFILES, getCombinationMessage } from "@/lib/newgrad/data/typeProfiles";
import { typeColorVar } from "@/lib/newgrad/typeColor";
import { Section } from "../ui/Section";

export function DiagnosisResult() {
  const { state } = useNewGradState();

  if (!state.diagnosisCompleted || !state.primaryType || !state.secondaryType) {
    return (
      <Section id="diagnosis-result" index="04" kicker="your type">
        <p className="text-sm opacity-55">
          上の診断に答えると、ここにあなたの結果が表示されます。
        </p>
      </Section>
    );
  }

  const primary = TYPE_PROFILES[state.primaryType];
  const secondary = TYPE_PROFILES[state.secondaryType];
  const combination = getCombinationMessage(state.primaryType, state.secondaryType);
  const accent = typeColorVar(state.primaryType);

  return (
    <Section id="diagnosis-result" index="04" kicker="your type">
      <div className="ng-reveal">
        <p className="ng-serif text-[2.2rem] leading-[1.2] font-medium tracking-tight break-words">
          {primary.nameEn}{" "}
          <span className="mx-1 align-middle text-lg opacity-40">×</span>{" "}
          {secondary.nameEn}
        </p>
        <p className="mt-3 text-base opacity-60">
          {primary.nameJa} × {secondary.nameJa}
        </p>

        <p className="mt-10 text-lg leading-relaxed font-medium">
          {primary.headline}
        </p>

        <blockquote
          className="ng-serif mt-8 border-l pl-5 text-lg leading-relaxed italic"
          style={{ borderColor: accent }}
        >
          「{primary.quote}」
        </blockquote>

        <p className="mt-8 max-w-[34ch] text-sm leading-relaxed opacity-65">
          {primary.description}
        </p>

        <div className="mt-14 border-t border-[var(--ng-line)] pt-6">
          <p className="ng-sans-en text-xs font-semibold tracking-[0.2em] uppercase opacity-45">
            secondary — {secondary.nameEn}
          </p>
          <p className="mt-3 text-sm leading-relaxed opacity-70">{combination}</p>
        </div>
      </div>
    </Section>
  );
}
