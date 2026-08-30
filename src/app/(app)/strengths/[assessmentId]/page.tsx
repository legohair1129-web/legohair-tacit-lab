import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StrengthQuizClient } from "@/components/strengths/StrengthQuizClient";
import type { StrengthTypeKey } from "@/lib/types/database";

export default async function StrengthQuizPage({ params }: PageProps<"/strengths/[assessmentId]">) {
  const { assessmentId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: assessment } = await supabase
    .from("strength_assessments")
    .select("id,status")
    .eq("id", assessmentId)
    .single();
  if (!assessment) notFound();
  if (assessment.status === "completed") redirect(`/strengths/${assessmentId}/result`);

  const [
    { data: questionRows },
    { data: optionRows },
    { data: scoreRows },
    { data: existingAnswers },
  ] = await Promise.all([
    supabase.from("strength_questions").select("id,number,scenario_text,weight,sort_order").order("sort_order"),
    supabase.from("strength_options").select("id,question_id,option_key,option_text"),
    supabase.from("strength_option_scores").select("option_id,strength_type_key,score"),
    supabase.from("strength_assessment_answers").select("question_id,option_id").eq("assessment_id", assessmentId),
  ]);

  const scoresByOption = new Map<string, { strength_type_key: StrengthTypeKey; score: number }[]>();
  for (const s of scoreRows ?? []) {
    const list = scoresByOption.get(s.option_id) ?? [];
    list.push({ strength_type_key: s.strength_type_key, score: s.score });
    scoresByOption.set(s.option_id, list);
  }

  const optionsByQuestion = new Map<
    string,
    { id: string; option_key: string; option_text: string; scores: { strength_type_key: StrengthTypeKey; score: number }[] }[]
  >();
  for (const o of optionRows ?? []) {
    const list = optionsByQuestion.get(o.question_id) ?? [];
    list.push({ id: o.id, option_key: o.option_key, option_text: o.option_text, scores: scoresByOption.get(o.id) ?? [] });
    optionsByQuestion.set(o.question_id, list);
  }

  const questions = (questionRows ?? []).map((q) => ({
    ...q,
    options: (optionsByQuestion.get(q.id) ?? []).sort((a, b) => a.option_key.localeCompare(b.option_key)),
  }));

  return (
    <StrengthQuizClient
      assessmentId={assessmentId}
      userId={user.id}
      questions={questions}
      initialAnswers={Object.fromEntries((existingAnswers ?? []).map((a) => [a.question_id, a.option_id]))}
    />
  );
}
