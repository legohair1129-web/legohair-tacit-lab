"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";
import type { MasterKnowledge, StrengthTypeKey } from "@/lib/types/database";

type OtherView = { id: string; response_text: string };

export function LearnArticleClient({
  article,
  strengthTypeNames,
  initialResponseText,
  initialReflectionText,
  userId,
}: {
  article: MasterKnowledge;
  strengthTypeNames: Partial<Record<StrengthTypeKey, string>>;
  initialResponseText: string | null;
  initialReflectionText: string | null;
  userId: string;
}) {
  const [draft, setDraft] = useState(initialResponseText ?? "");
  const [revealed, setRevealed] = useState(initialResponseText !== null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otherViews, setOtherViews] = useState<OtherView[] | null>(null);

  const [reflectionDraft, setReflectionDraft] = useState(initialReflectionText ?? "");
  const [reflectionSaved, setReflectionSaved] = useState(initialReflectionText !== null);
  const [reflectionSaving, setReflectionSaving] = useState(false);
  const [reflectionError, setReflectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!revealed) return;
    let cancelled = false;
    async function loadOtherViews() {
      const supabase = createClient();
      const { data } = await supabase
        .from("master_knowledge_responses")
        .select("id,response_text")
        .eq("master_knowledge_id", article.id)
        .neq("staff_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (!cancelled) setOtherViews(data ?? []);
    }
    loadOtherViews();
    return () => {
      cancelled = true;
    };
  }, [revealed, article.id, userId]);

  async function handleSubmit() {
    if (!draft.trim()) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: submitError } = await supabase.from("master_knowledge_responses").upsert(
      {
        master_knowledge_id: article.id,
        staff_id: userId,
        response_text: draft.trim(),
      },
      { onConflict: "master_knowledge_id,staff_id" }
    );
    setSaving(false);
    if (submitError) {
      setError("保存に失敗しました。もう一度お試しください。");
      return;
    }
    setRevealed(true);
  }

  async function handleSaveReflection() {
    if (!reflectionDraft.trim()) return;
    setReflectionSaving(true);
    setReflectionError(null);
    const supabase = createClient();
    const { error: submitError } = await supabase
      .from("master_knowledge_responses")
      .update({
        reflection_text: reflectionDraft.trim(),
        reflection_at: new Date().toISOString(),
      })
      .eq("master_knowledge_id", article.id)
      .eq("staff_id", userId);
    setReflectionSaving(false);
    if (submitError) {
      setReflectionError("保存に失敗しました。もう一度お試しください。");
      return;
    }
    setReflectionSaved(true);
  }

  return (
    <div className="px-6 py-8" style={{ paddingBottom: "calc(2rem + var(--bottom-nav-total))" }}>
      <p className="text-xs tracking-[0.2em] text-muted">
        MASTER KNOWLEDGE #{String(article.number).padStart(2, "0")}
      </p>
      <h1 className="mt-2 text-xl font-medium leading-snug">{article.title}</h1>

      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-medium tracking-[0.15em] text-muted">CASE</p>
        <p className="mt-2 text-sm leading-relaxed">{article.case_text}</p>
      </div>

      <div className="mt-4">
        <p className="text-base font-medium leading-snug">{article.question}</p>
        {revealed && <p className="mt-3 text-xs font-medium tracking-[0.15em] text-muted">あなたが見たもの</p>}
        <div className="mt-3">
          <TextArea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={article.answer_placeholder ?? "あなたが見えたことを書いてください"}
            disabled={revealed}
          />
        </div>
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        {!revealed && (
          <div className="mt-3">
            <Button onClick={handleSubmit} disabled={saving || !draft.trim()}>
              {saving ? "送信中…" : "回答する"}
            </Button>
          </div>
        )}
      </div>

      {revealed && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-accent-soft bg-accent-soft/30 p-4">
            <p className="text-xs font-medium tracking-[0.15em] text-accent">MASTER&apos;S VIEW</p>
            <p className="mt-2 text-sm leading-relaxed">{article.master_view}</p>
          </div>

          {article.observation_points.length > 0 && (
            <div>
              <p className="text-xs font-medium tracking-[0.15em] text-muted">観察のポイント</p>
              <ul className="mt-2 space-y-1.5">
                {article.observation_points.map((point) => (
                  <li key={point} className="text-sm text-muted">
                    ・{point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-xs font-medium tracking-[0.15em] text-muted">KEY INSIGHT</p>
            <p className="mt-2 text-sm font-medium leading-relaxed">{article.key_insight}</p>
          </div>

          <div>
            <p className="text-xs font-medium tracking-[0.15em] text-muted">LEGOHAIRの解釈</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{article.legohair_interpretation}</p>
          </div>

          {article.related_strength_keys.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.related_strength_keys.map((key) => (
                <span key={key} className="rounded-full bg-border px-2.5 py-0.5 text-[11px]">
                  {strengthTypeNames[key] ?? key}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium tracking-[0.15em] text-muted">もう一度、CASEを見る</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              MASTER&apos;S VIEWを知った今、最初には見えていなかったものはありますか？
            </p>
            {reflectionSaved ? (
              <p className="mt-3 text-sm leading-relaxed">{reflectionDraft}</p>
            ) : (
              <>
                <div className="mt-3">
                  <TextArea
                    value={reflectionDraft}
                    onChange={(e) => setReflectionDraft(e.target.value)}
                    placeholder="新しく見えたこと、気づいたことを書いてください"
                  />
                </div>
                {reflectionError && <p className="mt-2 text-sm text-danger">{reflectionError}</p>}
                <div className="mt-3">
                  <Button
                    variant="secondary"
                    onClick={handleSaveReflection}
                    disabled={reflectionSaving || !reflectionDraft.trim()}
                  >
                    {reflectionSaving ? "保存中…" : "気づきを残す"}
                  </Button>
                </div>
              </>
            )}
          </div>

          <div>
            <p className="text-xs font-medium tracking-[0.15em] text-muted">他の美容師には、何が見えていた？</p>
            {otherViews === null && <p className="mt-2 text-sm text-muted-2">読み込み中…</p>}
            {otherViews !== null && otherViews.length === 0 && (
              <p className="mt-2 text-sm text-muted-2">まだ他のスタッフの回答はありません。</p>
            )}
            {otherViews !== null && otherViews.length > 0 && (
              <div className="mt-2 space-y-2">
                {otherViews.map((view) => (
                  <div key={view.id} className="rounded-xl border border-border bg-surface px-4 py-3">
                    <p className="text-xs text-muted-2">あるスタッフの視点</p>
                    <p className="mt-1 text-sm leading-relaxed">{view.response_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/learn" className="block text-center text-sm text-muted underline">
            一覧に戻る
          </Link>
        </div>
      )}
    </div>
  );
}
