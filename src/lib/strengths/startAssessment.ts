import type { createClient } from "@/lib/supabase/client";

type BrowserSupabase = ReturnType<typeof createClient>;

// Reuses an in-progress assessment if one exists, otherwise starts a new
// one. Shared by the onboarding CTA and the standalone /strengths entry
// point so "start" always means the same thing in both places.
export async function startOrResumeAssessment(
  supabase: BrowserSupabase,
  userId: string
): Promise<string> {
  const { data: existing } = await supabase
    .from("strength_assessments")
    .select("id")
    .eq("staff_id", userId)
    .eq("status", "in_progress")
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data: created, error } = await supabase
    .from("strength_assessments")
    .insert({ staff_id: userId })
    .select("id")
    .single();

  if (error || !created) throw error ?? new Error("診断の開始に失敗しました。");
  return created.id;
}
