"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { WORK_STYLE_FACTS, JOB_PRIORITY_OPTIONS } from "@/lib/newgrad/data/workStyle";
import { Section } from "../ui/Section";
import { ChoiceRow } from "../ui/ChoiceRow";

export function WorkStyleExperience() {
  const { state, update } = useNewGradState();

  return (
    <Section
      id="work-style"
      index="14"
      title={
        <>
          美容師を、
          <br />
          長く続けるために。
        </>
      }
    >
      <div className="mb-16 grid grid-cols-2 gap-x-6 gap-y-10">
        {WORK_STYLE_FACTS.map((fact) => (
          <div key={fact.key}>
            <p className="ng-sans-en text-3xl leading-none font-semibold tracking-tight">
              {fact.value}
              {fact.unit && (
                <span className="ml-0.5 text-base font-normal opacity-50">
                  {fact.unit}
                </span>
              )}
            </p>
            <p className="ng-sans-en mt-2 text-[11px] font-semibold tracking-[0.14em] uppercase opacity-55">
              {fact.label}
            </p>
            <p className="text-[11px] opacity-35">{fact.note}</p>
          </div>
        ))}
      </div>

      <p className="mb-6 text-sm font-medium">
        就職先を選ぶなら、
        <br />
        今のあなたが一番大切なのは？
      </p>
      <div>
        {JOB_PRIORITY_OPTIONS.map((option, i) => (
          <ChoiceRow
            key={option}
            index={String(i + 1).padStart(2, "0")}
            label={option}
            selected={state.jobPriority === option}
            onClick={() => update({ jobPriority: option })}
          />
        ))}
      </div>
    </Section>
  );
}
