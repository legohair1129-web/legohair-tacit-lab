"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { WORK_STYLE_FACTS, JOB_PRIORITY_OPTIONS } from "@/lib/newgrad/data/workStyle";
import { Section } from "../ui/Section";
import { ChoiceRow } from "../ui/ChoiceRow";

// The two numbers most likely to matter to a student, called out bigger.
const FEATURED_KEYS = ["holidays", "startingSalary"];

export function WorkStyleExperience() {
  const { state, update } = useNewGradState();

  return (
    <Section
      id="work-style"
      index="14"
      accentIndex
      topLine
      tone="ivory"
      pad="l"
      kicker="work style"
      title={
        <>
          美容師を、
          <br />
          長く続けるために。
        </>
      }
    >
      <div className="mb-16">
        <div className="mb-10 grid grid-cols-2 gap-x-6">
          {WORK_STYLE_FACTS.filter((f) => FEATURED_KEYS.includes(f.key)).map(
            (fact) => (
              <div key={fact.key}>
                <p className="ng-sans-en text-4xl leading-none font-bold tracking-tight text-[var(--ng-hotpink)]">
                  {fact.value}
                  {fact.unit && (
                    <span className="ml-0.5 text-base font-normal opacity-60">
                      {fact.unit}
                    </span>
                  )}
                </p>
                <p className="ng-sans-en mt-3 text-[11px] font-semibold tracking-[0.14em] uppercase opacity-55">
                  {fact.label}
                </p>
                <p className="text-[11px] opacity-35">{fact.note}</p>
              </div>
            )
          )}
        </div>

        <div className="mb-10 h-px w-full bg-[var(--ng-hotpink)]" aria-hidden />

        <div className="grid grid-cols-2 gap-x-6 gap-y-9">
          {WORK_STYLE_FACTS.filter((f) => !FEATURED_KEYS.includes(f.key)).map(
            (fact) => (
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
            )
          )}
        </div>
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
            accent="pink"
            selected={state.jobPriority === option}
            onClick={() => update({ jobPriority: option })}
          />
        ))}
      </div>
    </Section>
  );
}
