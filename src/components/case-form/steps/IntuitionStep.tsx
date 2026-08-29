"use client";

import { StepShell } from "@/components/ui/StepShell";
import { TextArea } from "@/components/ui/TextArea";
import type { CaseFormState } from "@/components/case-form/types";

export function IntuitionStep({
  value,
  onPatch,
  onBack,
  onNext,
  stepIndex,
  totalSteps,
}: {
  value: CaseFormState;
  onPatch: (patch: Partial<CaseFormState>) => void;
  onBack?: () => void;
  onNext: () => void;
  stepIndex: number;
  totalSteps: number;
}) {
  return (
    <StepShell
      eyebrow="STEP 8 / 直感"
      title="その瞬間、なんとなく何を感じましたか？"
      subtitle="理由はまだ考えなくて大丈夫です。感じたことをそのまま書いてください。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
      nextDisabled={value.intuitionText.trim() === ""}
    >
      <TextArea
        rows={6}
        autoFocus
        placeholder="例：今日は切りそう／色を変えそう／今日はあまり話したくなさそう"
        value={value.intuitionText}
        onChange={(e) => onPatch({ intuitionText: e.target.value })}
      />
    </StepShell>
  );
}
