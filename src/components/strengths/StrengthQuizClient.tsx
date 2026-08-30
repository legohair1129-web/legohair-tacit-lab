"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StepShell } from "@/components/ui/StepShell";
import { RadioCards } from "@/components/ui/RadioCards";
import { computeStrengthResults, type ScoredQuestion } from "@/lib/strengths/scoring";
import type { StrengthTypeKey } from "@/lib/types/database";

type QuizOption = { id: string; option_key: string; option_text: string; scores: { strength_type_key: StrengthTypeKey; score: number }[] };
type QuizQuestion = { id: string; number: number; scenario_text: string; weight: number; options: QuizOption[] };

export function StrengthQuizClient({
  assessmentId,
  userId,
  questions,
  initialAnswers,
}: {
  assessmentId: string;
  userId: string;
  questions: QuizQuestion[];
  initialAnswers: Record<string, string>;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const question = questions[stepIndex];
  const selectedOptionId = answers[question?.id] ?? null;

  async function saveAnswer(questionId: string, optionId: string) {
    const supabase = createClient();
    await supabase.from("strength_assessment_answers").upsert(
      { assessment_id: assessmentId, question_id: questionId, option_id: optionId },
      { onConflict: "assessment_id,question_id" }
    );
  }

  async function finalizeAssessment(finalAnswers: Record<string, string>) {
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const scoredQuestions: ScoredQuestion[] = questions.map((q) => ({
      id: q.id,
      weight: q.weight,
      options: q.options.map((o) => ({ id: o.id, scores: o.scores })),
    }));
    const result = computeStrengthResults(scoredQuestions, finalAnswers);

    const { error: statusError } = await supabase
      .from("strength_assessments")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", assessmentId);
    if (statusError) {
      setError("診断の完了に失敗しました。もう一度お試しください。");
      setSaving(false);
      return;
    }

    let combinationTypeId: string | null = null;
    if (result.isDualType && result.dualPartnerTypeKey) {
      const { data: combo } = await supabase
        .from("strength_combination_types")
        .select("id")
        .or(
          `and(type_a_key.eq.${result.coreTypeKey},type_b_key.eq.${result.dualPartnerTypeKey}),and(type_a_key.eq.${result.dualPartnerTypeKey},type_b_key.eq.${result.coreTypeKey})`
        )
        .maybeSingle();
      combinationTypeId = combo?.id ?? null;
    }

    const { error: resultError } = await supabase.from("strength_results").insert({
      assessment_id: assessmentId,
      scores: result.scores,
      core_type_key: result.coreTypeKey,
      support_type_key: result.supportTypeKey,
      emerging_type_key: result.emergingTypeKey,
      is_dual_type: result.isDualType,
      dual_partner_type_key: result.dualPartnerTypeKey,
      combination_type_id: combinationTypeId,
    });
    if (resultError) {
      setError("結果の保存に失敗しました。もう一度お試しください。");
      setSaving(false);
      return;
    }

    await supabase.from("tacit_profiles").upsert(
      {
        staff_id: userId,
        latest_assessment_id: assessmentId,
        core_type_key: result.coreTypeKey,
        support_type_key: result.supportTypeKey,
        emerging_type_key: result.emergingTypeKey,
        is_dual_type: result.isDualType,
        combination_type_id: combinationTypeId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "staff_id" }
    );

    router.push(`/strengths/${assessmentId}/result`);
  }

  async function handleNext() {
    if (!question || !selectedOptionId) return;
    const nextAnswers = { ...answers, [question.id]: selectedOptionId };
    setAnswers(nextAnswers);
    await saveAnswer(question.id, selectedOptionId);

    if (stepIndex === questions.length - 1) {
      await finalizeAssessment(nextAnswers);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, questions.length - 1));
  }

  function handleBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  if (!question) return null;

  return (
    <>
      {error && (
        <div className="fixed inset-x-0 top-0 z-50 bg-danger px-4 py-2 text-center text-sm text-white">
          {error}
        </div>
      )}
      <StepShell
        eyebrow={`TACIT STRENGTHS Q${question.number}/${questions.length}`}
        title={question.scenario_text}
        stepIndex={stepIndex}
        totalSteps={questions.length}
        onBack={stepIndex > 0 ? handleBack : undefined}
        onNext={handleNext}
        nextLabel={stepIndex === questions.length - 1 ? "診断を終える" : "次へ"}
        nextDisabled={!selectedOptionId}
        nextLoading={saving}
      >
        <RadioCards
          options={question.options.map((o) => ({ value: o.id, label: o.option_text }))}
          value={selectedOptionId}
          onChange={(optionId) => setAnswers((prev) => ({ ...prev, [question.id]: optionId }))}
        />
      </StepShell>
    </>
  );
}
