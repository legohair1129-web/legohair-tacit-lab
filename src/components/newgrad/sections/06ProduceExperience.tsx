"use client";

import { useState } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import {
  FIRST_IMPRESSION_OPTIONS,
  FOCUS_AREA_OPTIONS,
  MODEL_CONTEXT,
  COLOR_OPTIONS,
  FACE_DESIGN_OPTIONS,
  faceDesignSummary,
} from "@/lib/newgrad/data/produce";
import { getLegonComment } from "@/lib/newgrad/legon";
import { trackEvent } from "@/lib/newgrad/track";
import type { ColorChoice, FaceChoice } from "@/lib/newgrad/types";
import { Section } from "../ui/Section";
import { ChoiceCard } from "../ui/ChoiceCard";
import { Button } from "../ui/Button";
import { Legon } from "../ui/Legon";
import { ProgressDots } from "../ui/ProgressDots";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";

const STEP_COUNT = 6;

export function ProduceExperience() {
  const { state, update } = useNewGradState();
  const [step, setStep] = useState(0); // 0 = intro, 1-6 = STEP 1-6
  const [revealed, setRevealed] = useState(false);

  function beginProduce() {
    trackEvent("produce_start", { section: "produce-experience" });
    setStep(1);
  }

  function finish() {
    update({ produceCompleted: true });
    trackEvent("produce_complete", {
      section: "produce-experience",
      firstImpression: state.firstImpression,
      focusArea: state.focusArea,
      colorChoice: state.colorChoice,
      faceChoice: state.faceChoice,
    });
    setRevealed(true);
  }

  return (
    <Section
      id="produce-experience"
      index="06"
      title={"あなたなら、\nこの人の魅力をどう引き出す？"}
    >
      <MediaPlaceholder label="BEFORE MODEL" className="mb-8" />

      {step === 0 && (
        <Button onClick={beginProduce}>プロデュースをはじめる</Button>
      )}

      {step >= 1 && step <= 6 && (
        <div className="mb-6">
          <ProgressDots total={STEP_COUNT} current={step - 1} />
        </div>
      )}

      {step === 1 && (
        <StepBlock title="STEP 1　第一印象" subtitle="第一印象は？">
          <div className="grid grid-cols-2 gap-3">
            {FIRST_IMPRESSION_OPTIONS.map((option) => (
              <ChoiceCard
                key={option}
                label={option}
                selected={state.firstImpression === option}
                onClick={() => update({ firstImpression: option })}
              />
            ))}
          </div>
          <Button
            className="mt-6"
            disabled={!state.firstImpression}
            onClick={() => setStep(2)}
          >
            次へ
          </Button>
        </StepBlock>
      )}

      {step === 2 && (
        <StepBlock title="STEP 2　何を変える？">
          <div className="grid grid-cols-2 gap-3">
            {FOCUS_AREA_OPTIONS.map((option) => (
              <ChoiceCard
                key={option}
                label={option}
                selected={state.focusArea === option}
                onClick={() => update({ focusArea: option })}
              />
            ))}
          </div>
          <Button
            className="mt-6"
            disabled={!state.focusArea}
            onClick={() => setStep(3)}
          >
            次へ
          </Button>
        </StepBlock>
      )}

      {step === 3 && (
        <StepBlock title="STEP 3　情報開示">
          <ul className="flex flex-col gap-2 rounded-2xl border border-[var(--ng-border)] bg-[var(--ng-surface)] p-4 text-sm">
            {MODEL_CONTEXT.map((item) => (
              <li key={item.label} className="flex justify-between gap-4">
                <span className="text-[var(--ng-muted)]">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </li>
            ))}
          </ul>
          <Legon text={getLegonComment("produceStep3")} className="mt-6" />
          <div className="mt-6 flex flex-col gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                update({ changedAfterContext: "keep" });
                setStep(4);
              }}
            >
              このままでいく
            </Button>
            <Button
              onClick={() => {
                update({ changedAfterContext: "change" });
                setStep(4);
              }}
            >
              別の提案に変える
            </Button>
          </div>
        </StepBlock>
      )}

      {step === 4 && (
        <StepBlock title="STEP 4　COLOR">
          <div className="flex flex-col gap-3">
            {COLOR_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.key}
                label={`${option.key}　${option.label}`}
                selected={state.colorChoice === option.key}
                onClick={() =>
                  update({ colorChoice: option.key as ColorChoice })
                }
              />
            ))}
          </div>
          {state.colorChoice && (
            <ul className="ng-animate-in mt-4 flex flex-col gap-2 rounded-2xl border border-[var(--ng-border)] bg-[var(--ng-surface)] p-4 text-sm">
              {COLOR_OPTIONS.find((c) => c.key === state.colorChoice)!.hints.map(
                (hint) => (
                  <li key={hint.label} className="flex justify-between gap-4">
                    <span className="text-[var(--ng-muted)]">{hint.label}</span>
                    <span className="font-medium">{hint.value}</span>
                  </li>
                )
              )}
            </ul>
          )}
          <Button
            className="mt-6"
            disabled={!state.colorChoice}
            onClick={() => setStep(5)}
          >
            次へ
          </Button>
        </StepBlock>
      )}

      {step === 5 && (
        <StepBlock title="STEP 5　FACE DESIGN">
          <div className="flex flex-col gap-3">
            {FACE_DESIGN_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.key}
                label={`${option.key}　${option.label}`}
                selected={state.faceChoice === option.key}
                onClick={() => update({ faceChoice: option.key as FaceChoice })}
              />
            ))}
          </div>
          <Button
            className="mt-6"
            disabled={!state.faceChoice}
            onClick={() => setStep(6)}
          >
            次へ
          </Button>
        </StepBlock>
      )}

      {step === 6 && (
        <StepBlock title="STEP 6　最終提案">
          <ul className="flex flex-col gap-2 rounded-2xl border border-[var(--ng-border)] bg-[var(--ng-surface)] p-4 text-sm">
            <li className="flex justify-between gap-4">
              <span className="text-[var(--ng-muted)]">前髪</span>
              <span className="font-medium">
                {faceDesignSummary(state.faceChoice)}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-[var(--ng-muted)]">顔周り</span>
              <span className="font-medium">
                {state.focusArea ? `${state.focusArea}を意識` : "軽く"}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-[var(--ng-muted)]">カラー</span>
              <span className="font-medium">
                {state.colorChoice
                  ? COLOR_OPTIONS.find((c) => c.key === state.colorChoice)!.label
                  : "-"}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-[var(--ng-muted)]">印象</span>
              <span className="font-medium">
                {state.firstImpression ? `${state.firstImpression}に` : "あなたらしく"}
              </span>
            </li>
          </ul>

          {!revealed && (
            <Button className="mt-6" onClick={finish}>
              この提案で完成を見る
            </Button>
          )}

          {revealed && (
            <div className="ng-animate-in mt-8">
              <div className="mb-2 text-xs tracking-widest text-[var(--ng-muted)]">
                BEFORE / AFTER
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MediaPlaceholder label="BEFORE MODEL" />
                <MediaPlaceholder label="AFTER MODEL" />
              </div>
            </div>
          )}
        </StepBlock>
      )}
    </Section>
  );
}

function StepBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ng-animate-in">
      <div className="mb-1 text-xs tracking-widest text-[var(--ng-accent)]">
        {title}
      </div>
      {subtitle && <h3 className="mb-4 text-base font-bold">{subtitle}</h3>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  );
}
