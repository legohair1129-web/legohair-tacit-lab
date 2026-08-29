"use client";

import { StepShell } from "@/components/ui/StepShell";
import { RadioCards } from "@/components/ui/RadioCards";
import { AGE_GROUP_OPTIONS, VISIT_TYPE_OPTIONS } from "@/lib/constants/options";
import type { CaseFormState } from "@/components/case-form/types";

export type CustomerPickerItem = {
  id: string;
  ageGroup: string | null;
  store: string | null;
  lastVisitLabel: string;
  lastMenu: string | null;
};

export function CustomerBasicStep({
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
    value.customerMode === "new"
      ? value.ageGroup !== "" && value.visitType !== ""
      : value.existingCustomerId !== null;

  return (
    <StepShell
      eyebrow="STEP 1 / CUSTOMER"
      title="今日のお客様について"
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
          <p className="mb-2 text-sm text-muted">来店周期（目安・任意）</p>
          <input
            type="text"
            value={value.visitCycle}
            onChange={(e) => onPatch({ visitCycle: e.target.value })}
            placeholder="例：2ヶ月に1回"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base outline-none focus:border-foreground"
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-muted">今回のメニュー</p>
          <input
            type="text"
            value={value.menu}
            onChange={(e) => onPatch({ menu: e.target.value })}
            placeholder="例：カット＋カラー"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base outline-none focus:border-foreground"
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-muted">店舗（任意）</p>
          <input
            type="text"
            value={value.store}
            onChange={(e) => onPatch({ store: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base outline-none focus:border-foreground"
          />
        </div>
      </div>
    </StepShell>
  );
}
