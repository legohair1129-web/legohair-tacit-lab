"use client";

import { StepShell } from "@/components/ui/StepShell";
import { ChipMultiSelect } from "@/components/ui/ChipMultiSelect";
import { BEAUTY_NEED_OPTIONS } from "@/lib/constants/options";
import type { CaseFormState } from "@/components/case-form/types";

export function BeautyNeedStep({
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
      eyebrow="STEP 3 / 美容ニーズ"
      title="どんなニーズがありそうですか？"
      subtitle="複数選択できます。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <ChipMultiSelect
        options={BEAUTY_NEED_OPTIONS}
        value={value.beautyNeeds}
        onChange={(v) => onPatch({ beautyNeeds: v })}
      />
    </StepShell>
  );
}
