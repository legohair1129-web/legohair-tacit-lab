"use client";

import { StepShell } from "@/components/ui/StepShell";
import { TextArea } from "@/components/ui/TextArea";
import type { CaseFormState } from "@/components/case-form/types";

export function NextBeforeStep({
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
      eyebrow="PHASE 4 / 次をつくる"
      title="次回来店時、どんなBEFOREなら成功？"
      subtitle="今日の仕上がりではなく、次回来店された時の状態を想像してください。"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={onNext}
      nextLabel="CASEを保存する"
      nextLoading={saving}
      nextDisabled={value.nextBefore.trim() === ""}
    >
      <div className="space-y-6">
        <TextArea
          rows={6}
          autoFocus
          placeholder={
            "例：朝のスタイリングが楽になっている\n" +
            "カラーが抜けても黄味が少ない\n" +
            "前髪が扱いやすい\n" +
            "ダメージが進んでいない\n" +
            "自分に似合うものが前回より分かっている"
          }
          value={value.nextBefore}
          onChange={(e) => onPatch({ nextBefore: e.target.value })}
        />

        <label className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <input
            type="checkbox"
            checked={value.isShared}
            onChange={(e) => onPatch({ isShared: e.target.checked })}
            className="mt-0.5 h-5 w-5 accent-foreground"
          />
          <span className="text-sm leading-relaxed">
            このCASEを「学び」で他スタッフと共有する
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
