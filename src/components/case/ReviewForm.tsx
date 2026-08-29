"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RadioCards } from "@/components/ui/RadioCards";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { FORECAST_ACCURACY_OPTIONS, BEFORE_CONNECTION_OPTIONS } from "@/lib/constants/options";
import type { Case, CaseReview } from "@/lib/types/database";

export function ReviewForm({ caseRow }: { caseRow: Case }) {
  const router = useRouter();
  const supabase = createClient();

  const [forecastAccuracy, setForecastAccuracy] = useState<string | null>(null);
  const [beforeConnection, setBeforeConnection] = useState<string | null>(null);
  const [actualResult, setActualResult] = useState("");
  const [whatWasRight, setWhatWasRight] = useState("");
  const [whatWasMissed, setWhatWasMissed] = useState("");
  const [newNotice, setNewNotice] = useState("");
  const [nextWatchPoint, setNextWatchPoint] = useState("");
  const [learning, setLearning] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("case_reviews").insert({
      case_id: caseRow.id,
      reviewed_by: user.id,
      forecast_accuracy: forecastAccuracy as CaseReview["forecast_accuracy"],
      before_connection: beforeConnection as CaseReview["before_connection"],
      actual_result: actualResult || null,
      what_was_right: whatWasRight || null,
      what_was_missed: whatWasMissed || null,
      new_notice: newNotice || null,
      next_watch_point: nextWatchPoint || null,
      learning: learning || null,
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
    <div className="px-6 py-8 pb-32">
      <p className="text-xs tracking-[0.2em] text-muted">ANSWER</p>
      <h1 className="mt-2 text-xl font-medium leading-snug">答え合わせ</h1>

      <div className="mt-6 space-y-4">
        {caseRow.intuition_text && (
          <RefBlock label="前回のINTUITION" text={caseRow.intuition_text} />
        )}
        {caseRow.forecast_success_state && (
          <RefBlock label="前回のFORECAST（成功の定義）" text={caseRow.forecast_success_state} />
        )}
        {caseRow.best_before_note && <RefBlock label="前回のBEST BEFORE" text={caseRow.best_before_note} />}
      </div>

      <div className="mt-8 space-y-6">
        <Field label="前回の予測はどうでしたか？">
          <RadioCards
            columns={2}
            options={FORECAST_ACCURACY_OPTIONS}
            value={forecastAccuracy}
            onChange={setForecastAccuracy}
          />
        </Field>

        <Field label="前回のAFTERは、今回の良いBEFOREにつながりましたか？">
          <RadioCards options={BEFORE_CONNECTION_OPTIONS} value={beforeConnection} onChange={setBeforeConnection} />
        </Field>

        <Field label="実際にはどうなりましたか？">
          <TextArea rows={3} value={actualResult} onChange={(e) => setActualResult(e.target.value)} />
        </Field>

        <Field label="何が当たっていましたか？">
          <TextArea rows={2} value={whatWasRight} onChange={(e) => setWhatWasRight(e.target.value)} />
        </Field>

        <Field label="何を読み違えましたか？">
          <TextArea rows={2} value={whatWasMissed} onChange={(e) => setWhatWasMissed(e.target.value)} />
        </Field>

        <Field label="今回、新しく気づいたことは？">
          <TextArea rows={2} value={newNotice} onChange={(e) => setNewNotice(e.target.value)} />
        </Field>

        <Field label="次回来店では何を見ますか？">
          <TextArea rows={2} value={nextWatchPoint} onChange={(e) => setNextWatchPoint(e.target.value)} />
        </Field>

        <Field label="今回のお客様から学んだ、次にも使える気づきは？">
          <TextArea rows={3} value={learning} onChange={(e) => setLearning(e.target.value)} />
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto max-w-lg">
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            {saving ? "保存中…" : "答え合わせを記録する"}
          </Button>
        </div>
      </div>
    </div>
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

function RefBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
