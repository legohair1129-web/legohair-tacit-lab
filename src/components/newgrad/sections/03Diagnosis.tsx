"use client";

import { useState } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { DIAGNOSIS_QUESTIONS } from "@/lib/newgrad/data/diagnosisQuestions";
import { scoreDiagnosis } from "@/lib/newgrad/scoring";
import { getLegonComment } from "@/lib/newgrad/legon";
import { trackEvent } from "@/lib/newgrad/track";
import type { TypeKey } from "@/lib/newgrad/types";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Section } from "../ui/Section";
import { ChoiceRow } from "../ui/ChoiceRow";
import { ProgressLine } from "../ui/ProgressLine";
import { Photo } from "../ui/Photo";

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
    <Section
      id="diagnosis"
      index="03"
      accentIndex
      pad={typeof phase === "number" ? "s" : "l"}
    >
      {phase === "intro" && (
        <div>
          <div className="ng-sans-en mb-5 text-xs font-semibold tracking-[0.22em] uppercase opacity-55">
            30秒診断
          </div>
          <h2 className="ng-reveal mb-4 text-[2rem] leading-[1.15] font-bold tracking-tight">
            自分を知る。
          </h2>
          <p className="mb-10 text-sm leading-relaxed opacity-65">
            30秒で、
            <br />
            あなたの中にある
            <br />
            美容師としての強みを探す。
          </p>

          <Photo
            slot={NEWGRAD_IMAGES.diagnosis}
            aspect="aspect-[4/3]"
            className="mb-10"
          />

          <p className="mb-10 text-sm font-medium text-[var(--ng-hotpink)]">
            {getLegonComment("diagnosisIntro")}
          </p>
          <button
            type="button"
            onClick={start}
            className="w-full rounded-full bg-[var(--ng-hotpink)] px-6 py-4 text-sm font-bold text-white"
          >
            {alreadyDone ? "もう一度診断する" : "診断スタート！"}
          </button>
          {alreadyDone && (
            <a
              href="#diagnosis-result"
              className="ng-sans-en mt-4 block text-center text-xs tracking-widest opacity-55 underline underline-offset-4"
            >
              診断結果を見る
            </a>
          )}
        </div>
      )}

      {typeof phase === "number" && (
        <div key={phase} className="ng-reveal">
          <div className="mb-12">
            <ProgressLine total={DIAGNOSIS_QUESTIONS.length} current={phase} accent="pink" />
          </div>
          <h3 className="mb-10 text-2xl leading-snug font-bold">
            {DIAGNOSIS_QUESTIONS[phase].question}
          </h3>
          <div>
            {DIAGNOSIS_QUESTIONS[phase].options.map((option) => (
              <ChoiceRow
                key={option.label}
                index={option.label}
                label={option.text}
                size="lg"
                accent="pink"
                onClick={() => answer(option.key)}
              />
            ))}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="ng-reveal">
          <p className="mb-8 text-sm opacity-65">診断が完了しました。</p>
          <a
            href="#diagnosis-result"
            className="ng-sans-en flex items-center justify-between border-b border-[var(--ng-hotpink)] pb-3 text-xs font-semibold tracking-[0.18em] text-[var(--ng-hotpink)] uppercase"
          >
            結果を見る
            <span aria-hidden>→</span>
          </a>
        </div>
      )}
    </Section>
  );
}
