"use client";

import { useState } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { DIAGNOSIS_QUESTIONS } from "@/lib/newgrad/data/diagnosisQuestions";
import { scoreDiagnosis } from "@/lib/newgrad/scoring";
import { getLegonComment } from "@/lib/newgrad/legon";
import { trackEvent } from "@/lib/newgrad/track";
import type { TypeKey } from "@/lib/newgrad/types";
import { Section } from "../ui/Section";
import { ChoiceCard } from "../ui/ChoiceCard";
import { Button } from "../ui/Button";
import { Legon } from "../ui/Legon";
import { ProgressDots } from "../ui/ProgressDots";

type Phase = "intro" | number | "done";

export function Diagnosis() {
  const { state, update } = useNewGradState();
  const [phase, setPhase] = useState<Phase>("intro");
  const [localAnswers, setLocalAnswers] = useState<TypeKey[]>([]);

  const alreadyDone = state.diagnosisCompleted && phase === "intro";

  function start() {
    trackEvent("diagnosis_start", { section: "diagnosis" });
    setLocalAnswers([]);
    setPhase(0);
  }

  function answer(type: TypeKey) {
    const next = [...localAnswers, type];
    setLocalAnswers(next);

    if (next.length < DIAGNOSIS_QUESTIONS.length) {
      setPhase(next.length);
      return;
    }

    const result = scoreDiagnosis(next);
    update({
      answers: next,
      diagnosisCompleted: true,
      primaryType: result.primaryType,
      secondaryType: result.secondaryType,
    });
    trackEvent("diagnosis_complete", {
      primaryType: result.primaryType,
      secondaryType: result.secondaryType,
      section: "diagnosis",
    });
    setPhase("done");
  }

  return (
    <Section id="diagnosis" index="03" title="30秒美容師タイプ診断">
      {phase === "intro" && (
        <div className="flex flex-col gap-6">
          <Legon text={getLegonComment("diagnosisIntro")} />
          <div className="flex items-center justify-center gap-6 text-xs text-[var(--ng-muted)]">
            <span>約30秒</span>
            <span>正解・不正解はありません</span>
          </div>
          <Button onClick={start}>
            {alreadyDone ? "もう一度診断する" : "START"}
          </Button>
          {alreadyDone && (
            <a
              href="#diagnosis-result"
              className="text-center text-xs text-[var(--ng-muted)] underline underline-offset-4"
            >
              診断結果を見る
            </a>
          )}
        </div>
      )}

      {typeof phase === "number" && (
        <div key={phase} className="ng-animate-in flex flex-col gap-6">
          <ProgressDots total={DIAGNOSIS_QUESTIONS.length} current={phase} />
          <div className="text-xs tracking-widest text-[var(--ng-muted)]">
            QUESTION {phase + 1} / {DIAGNOSIS_QUESTIONS.length}
          </div>
          <h3 className="text-lg font-bold leading-snug">
            {DIAGNOSIS_QUESTIONS[phase].question}
          </h3>
          <div className="flex flex-col gap-3">
            {DIAGNOSIS_QUESTIONS[phase].options.map((option) => (
              <ChoiceCard
                key={option.label}
                label={`${option.label}　${option.text}`}
                onClick={() => answer(option.key)}
              />
            ))}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="ng-animate-in flex flex-col gap-4 text-center">
          <p className="text-sm leading-relaxed">診断が完了しました。</p>
          <a
            href="#diagnosis-result"
            className="rounded-full bg-[var(--ng-pop)] px-6 py-4 text-sm font-bold text-white"
          >
            結果を見る
          </a>
        </div>
      )}
    </Section>
  );
}
