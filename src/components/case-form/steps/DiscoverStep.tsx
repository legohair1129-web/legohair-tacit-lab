"use client";

import { StepShell } from "@/components/ui/StepShell";
import { RadioCards } from "@/components/ui/RadioCards";
import { TextArea } from "@/components/ui/TextArea";
import { DISCOVER_ALIGNMENT_OPTIONS } from "@/lib/constants/options";
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
      eyebrow="STEP 10 / DISCOVER"
      title="話してみて、何が分かりましたか？"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-6">
        <Field label="実際に何を聞きましたか？">
          <TextArea
            rows={3}
            value={value.discoverAsked}
            onChange={(e) => onPatch({ discoverAsked: e.target.value })}
          />
        </Field>

        <Field label="何が分かりましたか？">
          <TextArea
            rows={3}
            value={value.discoverFound}
            onChange={(e) => onPatch({ discoverFound: e.target.value })}
          />
        </Field>

        <Field label="お客様が言った希望は？">
          <TextArea
            rows={3}
            value={value.discoverCustomerWish}
            onChange={(e) => onPatch({ discoverCustomerWish: e.target.value })}
          />
        </Field>

        <Field label="あなたが感じた、本当の課題は？">
          <TextArea
            rows={3}
            value={value.discoverRealIssue}
            onChange={(e) => onPatch({ discoverRealIssue: e.target.value })}
          />
        </Field>

        <Field label="お客様の言葉と本当の課題は同じでしたか？">
          <RadioCards
            columns={2}
            options={DISCOVER_ALIGNMENT_OPTIONS}
            value={value.discoverAlignment || null}
            onChange={(v) => onPatch({ discoverAlignment: v })}
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
