"use client";

import { StepShell } from "@/components/ui/StepShell";
import { RadioCards } from "@/components/ui/RadioCards";
import { TextArea } from "@/components/ui/TextArea";
import { STATE_OPTIONS } from "@/lib/constants/options";
import type { CaseFormState } from "@/components/case-form/types";

export function CustomerStateStep({
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
      eyebrow="STEP 2 / 状態"
      title="今日、このお客様はどんな状態でしたか？"
      subtitle="「この人はどんな人か」ではなく、今日の状態を選んでください。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-6">
        <RadioCards
          options={STATE_OPTIONS}
          value={value.state || null}
          onChange={(v) => onPatch({ state: v })}
        />
        <TextArea
          placeholder="補足（任意）"
          value={value.stateNote}
          onChange={(e) => onPatch({ stateNote: e.target.value })}
          hint="迷う場合は空欄のままで構いません。"
        />
      </div>
    </StepShell>
  );
}
