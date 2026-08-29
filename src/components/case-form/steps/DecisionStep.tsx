"use client";

import { StepShell } from "@/components/ui/StepShell";
import { TextArea } from "@/components/ui/TextArea";
import type { CaseFormState } from "@/components/case-form/types";
import type { DecisionOption } from "@/lib/types/database";

const OPTION_LABELS = ["案A", "案B", "案C"];

export function DecisionStep({
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
  const options = value.decisionOptions;

  function updateOption(index: number, text: string) {
    const next: DecisionOption[] = [...options];
    if (!next[index]) next[index] = { label: OPTION_LABELS[index], text: "" };
    next[index] = { ...next[index], text };
    onPatch({ decisionOptions: next.filter((o) => o.text.trim() !== "") });
  }

  function optionText(index: number) {
    return options[index]?.text ?? "";
  }

  return (
    <StepShell
      eyebrow="STEP 11 / 決断"
      title="どんな選択肢を考えましたか？"
      subtitle="最大3案まで（任意）。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-6">
        {OPTION_LABELS.map((label, i) => (
          <Field key={label} label={label}>
            <TextArea rows={2} value={optionText(i)} onChange={(e) => updateOption(i, e.target.value)} />
          </Field>
        ))}

        <Field label="最終的に何を提案しましたか？">
          <TextArea
            rows={2}
            value={value.decisionFinal}
            onChange={(e) => onPatch({ decisionFinal: e.target.value })}
          />
        </Field>

        <Field label="なぜそれを選びましたか？">
          <TextArea
            rows={3}
            value={value.decisionReason}
            onChange={(e) => onPatch({ decisionReason: e.target.value })}
          />
        </Field>

        <Field label="やらなかった提案は？（任意）">
          <TextArea
            rows={2}
            value={value.decisionNotChosen}
            onChange={(e) => onPatch({ decisionNotChosen: e.target.value })}
          />
        </Field>

        <Field label="なぜ、やらなかったのですか？（任意）">
          <TextArea
            rows={2}
            value={value.decisionNotChosenReason}
            onChange={(e) => onPatch({ decisionNotChosenReason: e.target.value })}
          />
        </Field>
      </div>
    </StepShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm text-muted">{label}</p>
      {children}
    </div>
  );
}
