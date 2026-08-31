"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { STRENGTH_OPTIONS, STRENGTH_EN, MAX_STRENGTHS } from "@/lib/newgrad/data/strengths";
import { toggleWithMax } from "@/lib/newgrad/selection";
import { Section } from "../ui/Section";
import { WordSelect } from "../ui/WordSelect";

export function MyStrength() {
  const { state, update } = useNewGradState();

  function toggle(value: (typeof STRENGTH_OPTIONS)[number]) {
    update({ strengths: toggleWithMax(state.strengths, value, MAX_STRENGTHS) });
  }

  return (
    <Section
      id="my-strength"
      index="05"
      title={
        <>
          あなたが“自分らしい”と思うものを
          <br />2つ選んでください。
        </>
      }
    >
      <div>
        {STRENGTH_OPTIONS.map((option) => (
          <WordSelect
            key={option}
            word={STRENGTH_EN[option]}
            caption={option}
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
