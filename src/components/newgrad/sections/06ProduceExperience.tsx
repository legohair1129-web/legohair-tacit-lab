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
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { getLegonComment } from "@/lib/newgrad/legon";
import { trackEvent } from "@/lib/newgrad/track";
import type { ColorChoice, FaceChoice } from "@/lib/newgrad/types";
import { Section } from "../ui/Section";
import { ChoiceRow } from "../ui/ChoiceRow";
import { Button } from "../ui/Button";
import { Legon } from "../ui/Legon";
import { ProgressLine } from "../ui/ProgressLine";
import { Photo } from "../ui/Photo";

const STEP_COUNT = 6;

// The thought process this section makes visible, one verb per step.
const STEP_VERBS = ["見る", "気づく", "考える", "考える", "考える", "提案する"];

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
      accentIndex
      topLine
      tone="beige-tint"
      pad="l"
      kicker="produce experience"
      title={
        <>
          あなたなら、
          <br />
          この人の魅力をどう引き出す？
        </>
      }
    >
      <Photo slot={NEWGRAD_IMAGES.beforeModel} className="mb-10" />

      {step === 0 && (
        <Button variant="pink" onClick={beginProduce}>
          プロデュースをはじめる
        </Button>
      )}

      {step >= 1 && step <= 6 && (
        <div className="mb-10">
          <ProgressLine total={STEP_COUNT} current={step - 1} accent="pink" />
        </div>
      )}

      {step === 1 && (
        <StepBlock verb={STEP_VERBS[0]} kicker="STEP 01" title="WHAT DO YOU SEE?" subtitle="第一印象は？">
          <div>
            {FIRST_IMPRESSION_OPTIONS.map((option, i) => (
              <ChoiceRow
                key={option}
                index={String(i + 1).padStart(2, "0")}
                label={option}
                accent="pink"
                selected={state.firstImpression === option}
                onClick={() => update({ firstImpression: option })}
              />
            ))}
          </div>
          <Button
            className="mt-8"
            variant="text"
            fullWidth={false}
            disabled={!state.firstImpression}
            onClick={() => setStep(2)}
          >
            次へ
          </Button>
        </StepBlock>
      )}

      {step === 2 && (
        <StepBlock verb={STEP_VERBS[1]} kicker="STEP 02" title="WHAT WOULD YOU CHANGE?">
          <div>
            {FOCUS_AREA_OPTIONS.map((option, i) => (
              <ChoiceRow
                key={option}
                index={String(i + 1).padStart(2, "0")}
                label={option}
                accent="pink"
                selected={state.focusArea === option}
                onClick={() => update({ focusArea: option })}
              />
            ))}
          </div>
          <Button
            className="mt-8"
            variant="text"
            fullWidth={false}
            disabled={!state.focusArea}
            onClick={() => setStep(3)}
          >
            次へ
          </Button>
        </StepBlock>
      )}

      {step === 3 && (
        <StepBlock verb={STEP_VERBS[2]} kicker="STEP 03" title="WHO IS SHE?">
          <div>
            {MODEL_CONTEXT.map((item) => (
              <div
                key={item.label}
                className="flex justify-between gap-4 border-b border-[var(--ng-line)] py-3 text-sm first:border-t"
              >
                <span className="opacity-55">{item.label}</span>
                <span className="text-right font-medium">{item.value}</span>
              </div>
            ))}
          </div>
          <Legon text={getLegonComment("produceStep3")} className="mt-8" />
          <div className="mt-8 flex gap-6">
            <Button
              variant="text"
              fullWidth={false}
              onClick={() => {
                update({ changedAfterContext: "keep" });
                setStep(4);
              }}
            >
              このままでいく
            </Button>
            <Button
              variant="text"
              fullWidth={false}
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
        <StepBlock verb={STEP_VERBS[3]} kicker="STEP 04" title="COLOR">
          <div>
            {COLOR_OPTIONS.map((option) => (
              <ChoiceRow
                key={option.key}
                index={option.key}
                label={option.label}
                accent="pink"
                selected={state.colorChoice === option.key}
                onClick={() => update({ colorChoice: option.key as ColorChoice })}
              />
            ))}
          </div>
          {state.colorChoice && (
            <div className="ng-reveal mt-6">
              {COLOR_OPTIONS.find((c) => c.key === state.colorChoice)!.hints.map(
                (hint) => (
                  <div
                    key={hint.label}
                    className="flex justify-between gap-4 border-b border-[var(--ng-line)] py-3 text-sm first:border-t"
                  >
                    <span className="opacity-55">{hint.label}</span>
                    <span className="text-right font-medium">{hint.value}</span>
                  </div>
                )
              )}
            </div>
          )}
          <Button
            className="mt-8"
            variant="text"
            fullWidth={false}
            disabled={!state.colorChoice}
            onClick={() => setStep(5)}
          >
            次へ
          </Button>
        </StepBlock>
      )}

      {step === 5 && (
        <StepBlock verb={STEP_VERBS[4]} kicker="STEP 05" title="FACE DESIGN">
          <div>
            {FACE_DESIGN_OPTIONS.map((option) => (
              <ChoiceRow
                key={option.key}
                index={option.key}
                label={option.label}
                accent="pink"
                selected={state.faceChoice === option.key}
                onClick={() => update({ faceChoice: option.key as FaceChoice })}
              />
            ))}
          </div>
          <Button
            className="mt-8"
            variant="text"
            fullWidth={false}
            disabled={!state.faceChoice}
            onClick={() => setStep(6)}
          >
            次へ
          </Button>
        </StepBlock>
      )}

      {step === 6 && (
        <StepBlock verb={STEP_VERBS[5]} kicker="STEP 06" title="FINAL PROPOSAL">
          <div>
            <Row label="前髪" value={faceDesignSummary(state.faceChoice)} />
            <Row
              label="顔周り"
              value={state.focusArea ? `${state.focusArea}を意識` : "軽く"}
            />
            <Row
              label="カラー"
              value={
                state.colorChoice
                  ? COLOR_OPTIONS.find((c) => c.key === state.colorChoice)!.label
                  : "-"
              }
            />
            <Row
              label="印象"
              value={state.firstImpression ? `${state.firstImpression}に` : "あなたらしく"}
            />
          </div>

          {!revealed && (
            <Button variant="pink" className="mt-8" onClick={finish}>
              この提案で完成を見る
            </Button>
          )}

          {revealed && (
            <div className="ng-reveal mt-10">
              <div className="ng-sans-en mb-3 text-xs font-semibold tracking-[0.2em] uppercase opacity-45">
                before / after
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Photo slot={NEWGRAD_IMAGES.beforeModel} aspect="aspect-[3/4]" />
                <Photo slot={NEWGRAD_IMAGES.afterModel} aspect="aspect-[3/4]" />
              </div>
            </div>
          )}
        </StepBlock>
      )}
    </Section>
  );
}

function StepBlock({
  verb,
  kicker,
  title,
  subtitle,
  children,
}: {
  verb: string;
  kicker: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ng-reveal">
      <div className="mb-2 flex items-center gap-3">
        <span className="ng-sans-en text-xs font-semibold tracking-[0.2em] uppercase opacity-45">
          {kicker}
        </span>
        <span className="rounded-full bg-[var(--ng-hotpink-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ng-hotpink)]">
          {verb}
        </span>
      </div>
      <h3 className="ng-serif mb-6 text-2xl font-medium">
        {title}
        {subtitle && (
          <span className="mt-1 block text-base font-normal opacity-60">
            {subtitle}
          </span>
        )}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[var(--ng-line)] py-3 text-sm first:border-t">
      <span className="opacity-55">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
