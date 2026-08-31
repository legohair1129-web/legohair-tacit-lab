"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { STRENGTH_OPTIONS, MAX_STRENGTHS } from "@/lib/newgrad/data/strengths";
import { toggleWithMax } from "@/lib/newgrad/selection";
import { Section } from "../ui/Section";
import { ChoiceCard } from "../ui/ChoiceCard";

export function MyStrength() {
  const { state, update } = useNewGradState();

  function toggle(value: (typeof STRENGTH_OPTIONS)[number]) {
    update({ strengths: toggleWithMax(state.strengths, value, MAX_STRENGTHS) });
  }

  return (
    <Section
      id="my-strength"
      index="05"
      title={"あなたが“自分らしい”と思うものを\n2つ選んでください。"}
    >
      <div className="grid grid-cols-2 gap-3">
        {STRENGTH_OPTIONS.map((option) => (
          <ChoiceCard
            key={option}
            label={option}
            selected={state.strengths.includes(option)}
            onClick={() => toggle(option)}
          />
        ))}
      </div>

      {state.strengths.length > 0 && (
        <p className="ng-animate-in mt-6 text-sm">
          あなたの強み：
          <span className="font-bold text-[var(--ng-pop)]">
            {" "}
            {state.strengths.join(" × ")}
          </span>
        </p>
      )}

      <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-[var(--ng-muted)]">
        {"LEGOHAIRでは、\n強みを直すのではなく、\n伸ばす教育を考えます。"}
      </p>
    </Section>
  );
}
