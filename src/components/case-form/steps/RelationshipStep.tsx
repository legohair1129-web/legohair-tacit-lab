"use client";

import { StepShell } from "@/components/ui/StepShell";
import { RadioCards } from "@/components/ui/RadioCards";
import { RELATIONSHIP_LEVEL_OPTIONS } from "@/lib/constants/options";
import type { CaseFormState } from "@/components/case-form/types";

export function RelationshipStep({
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
      eyebrow="STEP 5 / 関係性"
      title="今のこのお客様との関係性は？"
      subtitle="能力評価ではなく、現在の関係性の記録です。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <RadioCards
        options={RELATIONSHIP_LEVEL_OPTIONS}
        value={value.relationshipLevel || null}
        onChange={(v) => onPatch({ relationshipLevel: v as CaseFormState["relationshipLevel"] })}
      />
    </StepShell>
  );
}
