"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { startOrResumeAssessment } from "@/lib/strengths/startAssessment";

// First-login welcome (spec section 20). Shown once, gated by
// profiles.tacit_lab_intro_seen_at — never forces the diagnosis.
export function OnboardingIntro({ userId }: { userId: string }) {
  const [loading, setLoading] = useState<"start" | "skip" | null>(null);
  const router = useRouter();

  async function markSeen() {
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ tacit_lab_intro_seen_at: new Date().toISOString() })
      .eq("id", userId);
  }

  async function handleStart() {
    setLoading("start");
    const supabase = createClient();
    await markSeen();

    try {
      const assessmentId = await startOrResumeAssessment(supabase, userId);
      router.push(`/strengths/${assessmentId}`);
    } catch {
      setLoading(null);
    }
  }

  async function handleSkip() {
    setLoading("skip");
    await markSeen();
    router.refresh();
  }

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">WELCOME</p>
      <h1 className="mt-2 text-2xl font-medium leading-snug">TACIT LABへようこそ。</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        ここは弱点を探す場所ではありません。
        <br />
        あなたが自然に見ているもの、気づいているものを、
        <br />
        一緒に発見していく場所です。
      </p>

      <div className="mt-8 rounded-xl border border-accent-soft bg-accent-soft/30 px-5 py-5">
        <p className="text-lg font-medium leading-snug">あなたには、何が見えていますか？</p>
      </div>

      <div className="mt-8 space-y-3">
        <Button onClick={handleStart} disabled={loading !== null}>
          {loading === "start" ? "準備中…" : "TACIT STRENGTHSを受ける"}
        </Button>
        <Button variant="ghost" onClick={handleSkip} disabled={loading !== null}>
          {loading === "skip" ? "…" : "後で受ける"}
        </Button>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted-2">
        この診断に優劣はありません。査定・給与・順位には一切使用されません。
      </p>
    </div>
  );
}
