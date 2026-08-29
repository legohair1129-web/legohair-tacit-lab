"use client";

import { useState } from "react";
import { StepShell } from "@/components/ui/StepShell";
import { RadioCards } from "@/components/ui/RadioCards";
import { ChipMultiSelect } from "@/components/ui/ChipMultiSelect";
import { AGE_GROUP_OPTIONS, VISIT_TYPE_OPTIONS } from "@/lib/constants/options";
import { VISIT_CYCLE_OPTIONS, MENU_OPTIONS } from "@/lib/constants/caseFlow";
import type { CaseFormState } from "@/components/case-form/types";

const OTHER_CYCLE = "__other__";

export function CustomerBasicsStep({
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
  const knownCycle = VISIT_CYCLE_OPTIONS.some((o) => o.value === value.visitCycle);
  const [otherMode, setOtherMode] = useState(value.visitCycle !== "" && !knownCycle);

  return (
    <StepShell
      eyebrow="PHASE 1 / お客様を知る"
      title="今日のお客様について教えてください"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-6">
        {value.customerMode === "new" && (
          <>
            <div>
              <p className="mb-2 text-sm text-muted">年代</p>
              <RadioCards
                columns={2}
                options={AGE_GROUP_OPTIONS}
                value={value.ageGroup || null}
                onChange={(v) => onPatch({ ageGroup: v })}
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-muted">新規 / 既存</p>
              <RadioCards
                columns={2}
                options={VISIT_TYPE_OPTIONS}
                value={value.visitType || null}
                onChange={(v) => onPatch({ visitType: v as CaseFormState["visitType"] })}
              />
            </div>
          </>
        )}

        <div>
          <p className="mb-2 text-sm text-muted">来店周期</p>
          <RadioCards
            columns={2}
            options={[...VISIT_CYCLE_OPTIONS, { value: OTHER_CYCLE, label: "その他" }]}
            value={otherMode ? OTHER_CYCLE : value.visitCycle || null}
            onChange={(v) => {
              if (v === OTHER_CYCLE) {
                setOtherMode(true);
                onPatch({ visitCycle: "" });
              } else {
                setOtherMode(false);
                onPatch({ visitCycle: v });
              }
            }}
          />
          {otherMode && (
            <input
              type="text"
              autoFocus
              value={value.visitCycle}
              onChange={(e) => onPatch({ visitCycle: e.target.value })}
              placeholder="例：半年に1回"
              className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-base outline-none focus:border-foreground"
            />
          )}
        </div>

        <div>
          <p className="mb-2 text-sm text-muted">今回のメニュー</p>
          <ChipMultiSelect
            options={MENU_OPTIONS}
            value={value.menuItems}
            onChange={(v) => onPatch({ menuItems: v })}
          />
        </div>

        {value.store && (
          <div>
            <p className="mb-2 text-sm text-muted">店舗</p>
            <p className="rounded-lg border border-border bg-surface px-4 py-3 text-base text-muted-2">
              {value.store}
            </p>
          </div>
        )}
      </div>
    </StepShell>
  );
}
