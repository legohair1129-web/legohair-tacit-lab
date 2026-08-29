"use client";

import { StepShell } from "@/components/ui/StepShell";
import { TextArea, PII_HINT } from "@/components/ui/TextArea";
import type { CaseFormState } from "@/components/case-form/types";

export function MemoryStep({
  value,
  onPatch,
  onBack,
  onNext,
  stepIndex,
  totalSteps,
  previousReviewLearning,
}: {
  value: CaseFormState;
  onPatch: (patch: Partial<CaseFormState>) => void;
  onBack?: () => void;
  onNext: () => void;
  stepIndex: number;
  totalSteps: number;
  previousReviewLearning?: string | null;
}) {
  return (
    <StepShell
      eyebrow="STEP 6 / MEMORY"
      title="前回以前、このお客様について覚えていることは？"
      subtitle="会話・出来事・好きなもの・前回の反応など。「特になし」で構いません。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-4">
        {previousReviewLearning && (
          <div className="rounded-lg border border-accent-soft bg-accent-soft/40 p-4">
            <p className="text-xs font-medium tracking-wide text-accent">前回の答え合わせでの学び</p>
            <p className="mt-1 text-sm leading-relaxed">{previousReviewLearning}</p>
          </div>
        )}

        <TextArea
          rows={6}
          placeholder="覚えていることを書いてください。「特になし」でも構いません。"
          value={value.memoryNote}
          onChange={(e) => onPatch({ memoryNote: e.target.value })}
          hint={PII_HINT}
        />

        <button
          type="button"
          onClick={() => onPatch({ memoryNote: "特になし" })}
          className="text-sm text-muted underline underline-offset-2"
        >
          特になし
        </button>
      </div>
    </StepShell>
  );
}
