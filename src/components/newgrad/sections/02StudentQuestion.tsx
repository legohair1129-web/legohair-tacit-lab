"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { IDEAL_DAY_OPTIONS } from "@/lib/newgrad/data/studentQuestion";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Section } from "../ui/Section";
import { PhotoCard } from "../ui/PhotoCard";

export function StudentQuestion() {
  const { state, update } = useNewGradState();

  return (
    <Section
      id="student-question"
      index="02"
      accentIndex
      topLine
      tone="beige-tint"
      pad="l"
      kicker="question"
      title={
        <>
          美容師になったら、
          <br />
          どんな毎日を送りたい？
        </>
      }
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-7">
        {IDEAL_DAY_OPTIONS.map((option, i) => {
          const isFeature = i === IDEAL_DAY_OPTIONS.length - 1;
          return (
            <PhotoCard
              key={option}
              slot={NEWGRAD_IMAGES.question[i] ?? NEWGRAD_IMAGES.question[0]}
              index={String(i + 1).padStart(2, "0")}
              label={option}
              selected={state.idealDay === option}
              aspect={isFeature ? "aspect-[16/10]" : "aspect-[4/5]"}
              className={isFeature ? "col-span-2" : undefined}
              onClick={() =>
                update({ idealDay: state.idealDay === option ? null : option })
              }
            />
          );
        })}
      </div>
      <p className="mt-12 max-w-[30ch] text-sm leading-relaxed opacity-55">
        まだ答えが決まっていなくても大丈夫。
        <br />
        ここから一緒に考えてみよう。
      </p>
    </Section>
  );
}
