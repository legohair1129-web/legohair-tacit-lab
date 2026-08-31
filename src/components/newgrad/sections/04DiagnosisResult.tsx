"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { TYPE_PROFILES, getCombinationMessage } from "@/lib/newgrad/data/typeProfiles";
import { Section } from "../ui/Section";

export function DiagnosisResult() {
  const { state } = useNewGradState();

  if (!state.diagnosisCompleted || !state.primaryType || !state.secondaryType) {
    return (
      <Section id="diagnosis-result" index="04" title="診断結果">
        <p className="text-sm text-[var(--ng-muted)]">
          上の診断に答えると、ここにあなたの結果が表示されます。
        </p>
      </Section>
    );
  }

  const primary = TYPE_PROFILES[state.primaryType];
  const secondary = TYPE_PROFILES[state.secondaryType];
  const combination = getCombinationMessage(state.primaryType, state.secondaryType);

  return (
    <Section id="diagnosis-result" index="04" title="診断結果">
      <div className="flex flex-col gap-6">
        <p className="text-sm leading-relaxed">
          今のあなたには、
          <span className="font-bold" style={{ color: primary.color }}>
            {primary.nameEn}
          </span>
          の強みが少し強く出ているみたい。
        </p>

        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: primary.color, background: `${primary.color}0f` }}
        >
          <div
            className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: primary.color }}
          >
            {primary.nameEn}｜{primary.nameJa}
          </div>
          <h3 className="mb-3 text-lg font-bold leading-snug">{primary.headline}</h3>
          <p className="mb-4 text-sm leading-relaxed text-[var(--ng-muted)]">
            {primary.description}
          </p>
          <p className="text-sm font-bold">「{primary.quote}」</p>
        </div>

        <div className="rounded-2xl border border-[var(--ng-border)] bg-[var(--ng-surface)] p-5">
          <div className="mb-2 text-xs tracking-widest text-[var(--ng-muted)]">
            SECONDARY
          </div>
          <div
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: secondary.color }}
          >
            {secondary.nameEn}｜{secondary.nameJa}
          </div>
          <p className="mb-2 text-sm font-bold">
            {primary.nameEn} × {secondary.nameEn}
          </p>
          <p className="text-sm leading-relaxed text-[var(--ng-muted)]">
            「{combination}」
          </p>
        </div>
      </div>
    </Section>
  );
}
