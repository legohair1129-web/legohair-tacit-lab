"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { WORK_STYLE_FACTS, JOB_PRIORITY_OPTIONS } from "@/lib/newgrad/data/workStyle";
import { Section } from "../ui/Section";
import { ChoiceCard } from "../ui/ChoiceCard";

export function WorkStyleExperience() {
  const { state, update } = useNewGradState();

  return (
    <Section id="work-style" index="14" title={"美容師を、\n長く続けるために。"}>
      <ul className="mb-10 flex flex-col divide-y divide-[var(--ng-border)] rounded-2xl border border-[var(--ng-border)]">
        {WORK_STYLE_FACTS.map((fact) => (
          <li key={fact.label} className="flex justify-between px-4 py-3 text-sm">
            <span className="text-[var(--ng-muted)]">{fact.label}</span>
            <span className="font-bold">{fact.value}</span>
          </li>
        ))}
      </ul>

      <p className="mb-4 text-sm font-bold">
        就職先を選ぶなら、
        <br />
        今のあなたが一番大切なのは？
      </p>
      <div className="grid grid-cols-2 gap-3">
        {JOB_PRIORITY_OPTIONS.map((option) => (
          <ChoiceCard
            key={option}
            label={option}
            selected={state.jobPriority === option}
            onClick={() => update({ jobPriority: option })}
          />
        ))}
      </div>
    </Section>
  );
}
