"use client";

import { StepShell } from "@/components/ui/StepShell";
import { TextArea } from "@/components/ui/TextArea";
import type { CaseFormState } from "@/components/case-form/types";

export function ForecastStep({
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
      eyebrow="STEP 12 / 予測"
      title="次回来店時、このお客様はどうなっていると思いますか？"
      subtitle="すべて埋める必要はありません。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-6">
        <Field label="髪の状態">
          <TextArea rows={2} value={value.forecastHairState} onChange={(e) => onPatch({ forecastHairState: e.target.value })} />
        </Field>
        <Field label="気持ち">
          <TextArea rows={2} value={value.forecastFeeling} onChange={(e) => onPatch({ forecastFeeling: e.target.value })} />
        </Field>
        <Field label="次にしたくなりそうなスタイル">
          <TextArea rows={2} value={value.forecastNextStyle} onChange={(e) => onPatch({ forecastNextStyle: e.target.value })} />
        </Field>
        <Field label="必要になりそうな施術">
          <TextArea rows={2} value={value.forecastNextTreatment} onChange={(e) => onPatch({ forecastNextTreatment: e.target.value })} />
        </Field>
        <Field label="おおよその来店時期">
          <input
            type="text"
            value={value.forecastNextVisitTiming}
            onChange={(e) => onPatch({ forecastNextVisitTiming: e.target.value })}
            placeholder="例：2ヶ月後"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base outline-none focus:border-foreground"
          />
        </Field>
        <Field label="次回、どんな状態で来店してくれたら今回の仕事は成功だと思いますか？">
          <TextArea
            rows={3}
            value={value.forecastSuccessState}
            onChange={(e) => onPatch({ forecastSuccessState: e.target.value })}
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
