"use client";

import { useRef } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { WORK_STYLE_FACTS, JOB_PRIORITY_OPTIONS } from "@/lib/newgrad/data/workStyle";
import { Section } from "../ui/Section";
import { ChoiceRow } from "../ui/ChoiceRow";
import { useReveal } from "../hooks/useReveal";

// The two numbers most likely to matter to a student, called out bigger.
const FEATURED_KEYS = ["holidays", "startingSalary"];

export function WorkStyleExperience() {
  const { state, update } = useNewGradState();
  const featuredRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const featuredInView = useReveal(featuredRef, 0.15);
  const restInView = useReveal(restRef, 0.1);

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
      <div className="relative mb-16">
        {/* Layer: the section's own numeral sits huge and faint behind the
            featured facts, reinforcing "big numbers" without adding ink. */}
        <span
          aria-hidden
          className="ng-sans-en pointer-events-none absolute -top-10 right-0 text-[9rem] leading-none font-bold text-[var(--ng-hotpink)]/[0.06] select-none"
        >
          14
        </span>

        <div
          ref={featuredRef}
          className={`relative mb-10 grid grid-cols-2 gap-x-6 ng-io-fade ${featuredInView ? "ng-in" : ""}`}
        >
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

        <div
          className={`ng-io-line-h relative mb-10 h-px bg-[var(--ng-hotpink)] ${featuredInView ? "ng-in" : ""}`}
          aria-hidden
        />

        <div
          ref={restRef}
          className={`relative grid grid-cols-2 gap-x-6 gap-y-9 ng-io-fade ${restInView ? "ng-in" : ""}`}
        >
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
