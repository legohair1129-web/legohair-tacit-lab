"use client";

import { useState } from "react";
import { StepShell } from "@/components/ui/StepShell";
import { RadioCards } from "@/components/ui/RadioCards";
import { TextArea } from "@/components/ui/TextArea";
import { ANSWER_CHECK_OPTIONS } from "@/lib/constants/caseFlow";

export function AnswerCheckStep({
  onBack,
  onSave,
  stepIndex,
  totalSteps,
  targetText,
}: {
  onBack?: () => void;
  onSave: (accuracy: string, note: string) => Promise<void>;
  stepIndex: number;
  totalSteps: number;
  targetText: string;
}) {
  const [accuracy, setAccuracy] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <StepShell
      eyebrow="PHASE 1 / お客様を知る"
      title="前回決めた「最高のビフォー」、実際どうでしたか？"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onBack={onBack}
      onNext={() => {
        if (!accuracy) return;
        setSaving(true);
        onSave(accuracy, note);
      }}
      nextDisabled={!accuracy}
      nextLoading={saving}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-accent-soft bg-accent-soft/40 p-4">
          <p className="text-xs text-accent">前回あなたが決めた「最高のビフォー」</p>
          <p className="mt-1 text-sm leading-relaxed">{targetText}</p>
        </div>

        <RadioCards columns={2} options={ANSWER_CHECK_OPTIONS} value={accuracy} onChange={setAccuracy} />

        <TextArea
          rows={2}
          placeholder="そう判断した理由（任意）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </StepShell>
  );
}
