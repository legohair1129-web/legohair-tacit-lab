"use client";

import { StepShell } from "@/components/ui/StepShell";
import { RadioCards } from "@/components/ui/RadioCards";
import type { CaseFormState } from "@/components/case-form/types";

export type CustomerPickerItem = {
  id: string;
  ageGroup: string | null;
  store: string | null;
  lastVisitLabel: string;
  lastMenu: string | null;
};

export function CustomerSelectStep({
  value,
  onPatch,
  onBack,
  onNext,
  stepIndex,
  totalSteps,
  existingCustomers,
  loadingCustomers,
}: {
  value: CaseFormState;
  onPatch: (patch: Partial<CaseFormState>) => void;
  onBack?: () => void;
  onNext: () => void;
  stepIndex: number;
  totalSteps: number;
  existingCustomers: CustomerPickerItem[];
  loadingCustomers: boolean;
}) {
  const canProceed =
    value.customerMode === "new" ? true : value.existingCustomerId !== null;

  return (
    <StepShell
      eyebrow="PHASE 1 / お客様を知る"
      title="今日のお客様について教えてください"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!canProceed}
    >
      <div className="space-y-6">
        <RadioCards
          columns={2}
          options={[
            { value: "new", label: "はじめて記録する" },
            { value: "existing", label: "以前記録したお客様" },
          ]}
          value={value.customerMode}
          onChange={(v) => {
            const customerMode = v as CaseFormState["customerMode"];
            onPatch(
              customerMode === "new"
                ? { customerMode, existingCustomerId: null }
                : { customerMode }
            );
          }}
        />

        {value.customerMode === "existing" && (
          <div>
            <p className="mb-2 text-sm text-muted">お客様を選択</p>
            {loadingCustomers ? (
              <p className="text-sm text-muted-2">読み込み中…</p>
            ) : existingCustomers.length === 0 ? (
              <p className="text-sm text-muted-2">
                まだ記録したお客様がいません。「はじめて記録する」を選んでください。
              </p>
            ) : (
              <div className="space-y-2">
                {existingCustomers.map((c) => {
                  const active = value.existingCustomerId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() =>
                        onPatch({
                          existingCustomerId: c.id,
                          ageGroup: c.ageGroup ?? value.ageGroup,
                          store: c.store ?? value.store,
                        })
                      }
                      className={`w-full rounded-xl border px-4 py-3 text-left ${
                        active ? "border-foreground bg-foreground text-background" : "border-border bg-surface"
                      }`}
                    >
                      <div className="text-sm font-semibold">
                        {c.ageGroup ?? "年代未設定"}
                        {c.store ? ` ・ ${c.store}` : ""}
                      </div>
                      <div className={`mt-0.5 text-xs ${active ? "text-background/70" : "text-muted"}`}>
                        前回 {c.lastVisitLabel}
                        {c.lastMenu ? ` ・ ${c.lastMenu}` : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </StepShell>
  );
}
