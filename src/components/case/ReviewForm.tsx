"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RadioCards } from "@/components/ui/RadioCards";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { ANSWER_CHECK_OPTIONS } from "@/lib/constants/caseFlow";
import type { Case, CaseReview } from "@/lib/types/database";

export function ReviewForm({ caseRow }: { caseRow: Case }) {
  const router = useRouter();
  const supabase = createClient();

  const [accuracy, setAccuracy] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!accuracy) return;
    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("case_reviews").insert({
      case_id: caseRow.id,
      reviewed_by: user.id,
      forecast_accuracy: accuracy as CaseReview["forecast_accuracy"],
      actual_result: note || null,
    });

    setSaving(false);

    if (error) {
      setError("保存に失敗しました。もう一度お試しください。");
      return;
    }

    router.push(`/case/${caseRow.id}`);
    router.refresh();
  }

  return (
    <div
      className="px-6 py-8"
      style={{ paddingBottom: "calc(var(--footer-h) + var(--bottom-nav-total))" }}
    >
      <p className="text-xs tracking-[0.2em] text-muted">振り返り</p>
      <h1 className="mt-2 text-xl font-medium leading-snug">
        前回決めた「最高のビフォー」、実際どうでしたか？
      </h1>

      {caseRow.forecast_success_state && (
        <div className="mt-6 rounded-lg border border-accent-soft bg-accent-soft/40 p-4">
          <p className="text-xs text-accent">前回あなたが決めた「最高のビフォー」</p>
          <p className="mt-1 text-sm leading-relaxed">{caseRow.forecast_success_state}</p>
        </div>
      )}

      <div className="mt-8 space-y-6">
        <RadioCards columns={2} options={ANSWER_CHECK_OPTIONS} value={accuracy} onChange={setAccuracy} />

        <TextArea
          rows={2}
          placeholder="そう判断した理由（任意）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div
        className="fixed inset-x-0 z-30 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur"
        style={{ height: "var(--footer-h)", bottom: "var(--bottom-nav-total)" }}
      >
        <div className="mx-auto max-w-lg">
          <Button type="button" onClick={handleSubmit} disabled={saving || !accuracy}>
            {saving ? "保存中…" : "答え合わせを記録する"}
          </Button>
        </div>
      </div>
    </div>
  );
}
