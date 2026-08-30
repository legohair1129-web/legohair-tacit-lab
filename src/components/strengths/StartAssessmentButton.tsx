"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { startOrResumeAssessment } from "@/lib/strengths/startAssessment";

export function StartAssessmentButton({ userId, label }: { userId: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    const supabase = createClient();
    try {
      const assessmentId = await startOrResumeAssessment(supabase, userId);
      router.push(`/strengths/${assessmentId}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? "準備中…" : label}
    </Button>
  );
}
