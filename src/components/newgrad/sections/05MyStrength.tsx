"use client";

import { useRef } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { STRENGTH_OPTIONS, STRENGTH_EN, MAX_STRENGTHS } from "@/lib/newgrad/data/strengths";
import { toggleWithMax } from "@/lib/newgrad/selection";
import { Section } from "../ui/Section";
import { WordSelect } from "../ui/WordSelect";
import { useReveal } from "../hooks/useReveal";

// Unselected rows "float" at slightly different sizes so the list reads as
// scattered keywords, not a uniform menu - varied by index, not by data.
const SIZE_CYCLE = ["text-2xl", "text-3xl", "text-xl", "text-3xl", "text-2xl", "text-xl"];

export function MyStrength() {
  const { state, update } = useNewGradState();
  const listRef = useRef<HTMLDivElement>(null);
  const listInView = useReveal(listRef, 0.1);

  function toggle(value: (typeof STRENGTH_OPTIONS)[number]) {
    update({ strengths: toggleWithMax(state.strengths, value, MAX_STRENGTHS) });
  }

  return (
    <Section
      id="my-strength"
      index="05"
      accentIndex
      topLine
      tone="ivory"
      pad="l"
      kicker="my strength"
      title={
        <>
          あなたが“自分らしい”と思うものを
          <br />2つ選んでください。
        </>
      }
    >
      <div ref={listRef} className={`ng-io-fade ${listInView ? "ng-in" : ""}`}>
        {STRENGTH_OPTIONS.map((option, i) => (
          <WordSelect
            key={option}
            word={STRENGTH_EN[option]}
            caption={option}
            baseSize={SIZE_CYCLE[i % SIZE_CYCLE.length]}
            selected={state.strengths.includes(option)}
            onClick={() => toggle(option)}
          />
        ))}
      </div>

      {state.strengths.length > 0 && (
        <p className="ng-reveal mt-10 text-sm opacity-70">
          あなたの強み — {state.strengths.map((s) => STRENGTH_EN[s]).join(" × ")}
        </p>
      )}

      <p className="mt-10 max-w-[32ch] text-sm leading-relaxed opacity-55">
        LEGOHAIRでは、
        <br />
        強みを直すのではなく、
        <br />
        伸ばす教育を考えます。
      </p>
    </Section>
  );
}
