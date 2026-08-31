"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { IDEAL_DAY_OPTIONS } from "@/lib/newgrad/data/studentQuestion";
import { Section } from "../ui/Section";
import { ChoiceCard } from "../ui/ChoiceCard";

export function StudentQuestion() {
  const { state, update } = useNewGradState();

  return (
    <Section
      id="student-question"
      index="02"
      title={"美容師になったら、\nどんな毎日を送りたい？"}
    >
      <div className="flex flex-col gap-3">
        {IDEAL_DAY_OPTIONS.map((option) => (
          <ChoiceCard
            key={option}
            label={option}
            selected={state.idealDay === option}
            onClick={() =>
              update({ idealDay: state.idealDay === option ? null : option })
            }
          />
        ))}
      </div>
      <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-[var(--ng-muted)]">
        {"まだ答えが決まっていなくても大丈夫。\nここから一緒に考えてみよう。"}
      </p>
    </Section>
  );
}
