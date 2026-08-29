"use client";

import { StepShell } from "@/components/ui/StepShell";
import { ChipMultiSelect } from "@/components/ui/ChipMultiSelect";
import { TextArea } from "@/components/ui/TextArea";
import { DECISION_CATEGORY_OPTIONS } from "@/lib/constants/caseFlow";
import type { CaseFormState } from "@/components/case-form/types";

export function DesignStep({
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
      eyebrow="PHASE 3 / 今日を決める"
      title="今日は何を変えましたか？"
      subtitle="複数選択できます。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-8">
        <ChipMultiSelect
          options={DECISION_CATEGORY_OPTIONS}
          value={value.decisionCategories}
          onChange={(v) => onPatch({ decisionCategories: v })}
        />

        <div>
          <p className="mb-2 text-sm text-muted">今日の提案は？</p>
          <TextArea
            rows={3}
            placeholder="例：顔まわりを短くし、乾かすだけでも形になるようにした"
            value={value.finalProposal}
            onChange={(e) => onPatch({ finalProposal: e.target.value })}
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-muted">なぜ、この提案にしましたか？</p>
          <TextArea
            rows={3}
            placeholder="例：朝のスタイリング時間を減らしたいという希望があったため"
            value={value.proposalReason}
            onChange={(e) => onPatch({ proposalReason: e.target.value })}
          />
        </div>
      </div>
    </StepShell>
  );
}
