"use client";

import { StepShell } from "@/components/ui/StepShell";
import { ChipMultiSelect } from "@/components/ui/ChipMultiSelect";
import { TextArea } from "@/components/ui/TextArea";
import { NOTICE_ITEM_OPTIONS } from "@/lib/constants/options";
import type { CaseFormState } from "@/components/case-form/types";

export function NoticeStep({
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
      eyebrow="STEP 7 / NOTICE"
      title="今日、最初に何に気づきましたか？"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-6">
        <ChipMultiSelect
          options={NOTICE_ITEM_OPTIONS}
          value={value.noticeItems}
          onChange={(v) => onPatch({ noticeItems: v })}
        />
        <TextArea
          placeholder="気づいたことを、そのまま書いてください。"
          value={value.noticeNote}
          onChange={(e) => onPatch({ noticeNote: e.target.value })}
        />
      </div>
    </StepShell>
  );
}
