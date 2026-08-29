"use client";

import { StepShell } from "@/components/ui/StepShell";
import { ChipMultiSelect } from "@/components/ui/ChipMultiSelect";
import type { Option } from "@/lib/constants/options";
import type { CaseFormState } from "@/components/case-form/types";

export function IssueStep({
  value,
  onPatch,
  onBack,
  onNext,
  stepIndex,
  totalSteps,
  issueOptions,
}: {
  value: CaseFormState;
  onPatch: (patch: Partial<CaseFormState>) => void;
  onBack?: () => void;
  onNext: () => void;
  stepIndex: number;
  totalSteps: number;
  issueOptions: Option[];
}) {
  return (
    <StepShell
      eyebrow="STEP 4 / ISSUE"
      title="今回扱った・気になった項目は？"
      subtitle="複数選択できます。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <ChipMultiSelect
        options={issueOptions}
        value={value.issues}
        onChange={(v) => onPatch({ issues: v })}
      />
    </StepShell>
  );
}
