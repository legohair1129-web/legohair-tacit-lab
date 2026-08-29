"use client";

import { StepShell } from "@/components/ui/StepShell";
import { ChipMultiSelect } from "@/components/ui/ChipMultiSelect";
import { RadioCards } from "@/components/ui/RadioCards";
import { TextArea } from "@/components/ui/TextArea";
import { DISCOVERY_OPTIONS, CUSTOMER_PRIORITY_OPTIONS } from "@/lib/constants/caseFlow";
import type { CaseFormState } from "@/components/case-form/types";

export function DiscoverStep({
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
      eyebrow="PHASE 2 / 気づく"
      title="今日、一番気づいたことは？"
      subtitle="複数選択できます。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-8">
        <ChipMultiSelect
          options={DISCOVERY_OPTIONS}
          value={value.discoveries}
          onChange={(v) => onPatch({ discoveries: v })}
        />

        <div>
          <p className="mb-2 text-sm text-muted">お客様が一番大切にしていたのは？</p>
          <RadioCards
            columns={2}
            options={CUSTOMER_PRIORITY_OPTIONS}
            value={value.customerPriority || null}
            onChange={(v) => onPatch({ customerPriority: v })}
          />
        </div>

        <TextArea
          rows={2}
          placeholder={"もう少し残しておきたいことはありますか？（任意）\n例：朝はアイロンする時間がほとんどない"}
          value={value.observationNote}
          onChange={(e) => onPatch({ observationNote: e.target.value })}
        />
      </div>
    </StepShell>
  );
}
