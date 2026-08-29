"use client";

import { StepShell } from "@/components/ui/StepShell";
import { ChipMultiSelect } from "@/components/ui/ChipMultiSelect";
import { TextArea } from "@/components/ui/TextArea";
import { BEST_BEFORE_ITEM_OPTIONS, BEST_BEFORE_ACTION_OPTIONS } from "@/lib/constants/options";
import type { CaseFormState } from "@/components/case-form/types";

export function BestBeforeStep({
  value,
  onPatch,
  onBack,
  onNext,
  stepIndex,
  totalSteps,
  saving,
}: {
  value: CaseFormState;
  onPatch: (patch: Partial<CaseFormState>) => void;
  onBack?: () => void;
  onNext: () => void;
  stepIndex: number;
  totalSteps: number;
  saving: boolean;
}) {
  return (
    <StepShell
      eyebrow="STEP 13 / 最高のビフォー"
      title="最高のビフォーを設計する"
      subtitle="次回来店時、どんな状態なら今回の仕事は成功ですか？"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
      nextLabel="記録する"
      nextLoading={saving}
    >
      <div className="space-y-6">
        <ChipMultiSelect
          options={BEST_BEFORE_ITEM_OPTIONS}
          value={value.bestBeforeItems}
          onChange={(v) => onPatch({ bestBeforeItems: v })}
        />

        <div>
          <p className="mb-2 text-sm text-muted">そのビフォーをつくるため、今日何をしましたか？</p>
          <ChipMultiSelect
            options={BEST_BEFORE_ACTION_OPTIONS}
            value={value.bestBeforeActions}
            onChange={(v) => onPatch({ bestBeforeActions: v })}
          />
        </div>

        <TextArea
          placeholder="補足（任意）"
          value={value.bestBeforeNote}
          onChange={(e) => onPatch({ bestBeforeNote: e.target.value })}
        />

        <label className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <input
            type="checkbox"
            checked={value.isShared}
            onChange={(e) => onPatch({ isShared: e.target.checked })}
            className="mt-0.5 h-5 w-5 accent-foreground"
          />
          <span className="text-sm leading-relaxed">
            このカルテをライブラリで他スタッフと共有する
            <br />
            <span className="text-xs text-muted-2">
              顧客を特定できる情報は保存されません。あとから変更できます。
            </span>
          </span>
        </label>
      </div>
    </StepShell>
  );
}
