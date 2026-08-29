"use client";

import { StepShell } from "@/components/ui/StepShell";
import { ChipMultiSelect } from "@/components/ui/ChipMultiSelect";
import { TextArea } from "@/components/ui/TextArea";
import { INTUITION_CUE_OPTIONS } from "@/lib/constants/options";
import type { CaseFormState } from "@/components/case-form/types";

export function IntuitionCueStep({
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
      eyebrow="STEP 9 / 直感のきっかけ"
      title="今振り返ると、何がそう感じさせたと思いますか？"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-muted">あなたが感じたこと</p>
          <p className="mt-1 text-sm leading-relaxed">{value.intuitionText}</p>
        </div>

        <ChipMultiSelect
          options={INTUITION_CUE_OPTIONS}
          value={value.intuitionCueItems}
          onChange={(v) => onPatch({ intuitionCueItems: v })}
        />
        <TextArea
          placeholder="補足（任意）"
          value={value.intuitionCueNote}
          onChange={(e) => onPatch({ intuitionCueNote: e.target.value })}
        />
      </div>
    </StepShell>
  );
}
