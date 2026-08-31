"use client";

import { useState } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import {
  GROWTH_CONCERN_OPTIONS,
  GROWTH_ELEMENTS,
  GROWTH_METER,
  GROWTH_TROUBLES,
  GROWTH_TROUBLE_ACTIONS,
  GROWTH_TIMELINE,
} from "@/lib/newgrad/data/growth";
import { getLegonComment } from "@/lib/newgrad/legon";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { ChoiceRow } from "../ui/ChoiceRow";
import { IndexRow } from "../ui/IndexRow";
import { Legon } from "../ui/Legon";

export function GrowthExperience() {
  const { state, update } = useNewGradState();
  const [troubleAction, setTroubleAction] = useState<string | null>(null);

  const pickedOption = GROWTH_CONCERN_OPTIONS.find(
    (o) => o.key === state.growthConcern
  );

  function pickConcern(key: string) {
    update({ growthConcern: key });
    trackEvent("growth_complete", { section: "growth-experience", growthConcern: key });
  }

  return (
    <Section
      id="growth-experience"
      index="09"
      kicker="growth experience"
      title={
        <>
          入社したら、
          <br />
          どんなふうに成長する？
        </>
      }
    >
      <Legon text={getLegonComment("growthIntro")} className="mb-14" />

      <SubKicker>MONTH 01 — 最初に不安なのは？</SubKicker>
      <div className="mb-6">
        {GROWTH_CONCERN_OPTIONS.map((option) => (
          <ChoiceRow
            key={option.key}
            index={option.key}
            label={option.text}
            selected={state.growthConcern === option.key}
            onClick={() => pickConcern(option.key)}
          />
        ))}
      </div>
      {pickedOption && (
        <Legon text={getLegonComment(pickedOption.legonKey)} className="ng-reveal" />
      )}

      <SubKicker className="mt-16">WHAT YOU LEARN</SubKicker>
      <div>
        {GROWTH_ELEMENTS.map((el, i) => (
          <IndexRow
            key={el.key}
            index={String(i + 1).padStart(2, "0")}
            label={el.label}
            detail={el.ja}
          />
        ))}
      </div>

      <SubKicker className="mt-16">SIX MONTHS IN</SubKicker>
      <div className="flex flex-col gap-5">
        {GROWTH_METER.map((meter) => (
          <div key={meter.key} className="flex items-center gap-4">
            <span className="w-14 shrink-0 text-xs opacity-55">{meter.label}</span>
            <span className="flex flex-1 gap-1">
              {Array.from({ length: meter.max }).map((_, i) => (
                <span
                  key={i}
                  className={`h-px flex-1 ${
                    i < meter.level ? "bg-[var(--ng-ink)]" : "bg-[var(--ng-line)]"
                  }`}
                />
              ))}
            </span>
          </div>
        ))}
      </div>

      <SubKicker className="mt-16">A DIFFICULT DAY</SubKicker>
      <ul className="mb-6 flex flex-col gap-1 text-sm opacity-55">
        {GROWTH_TROUBLES.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
        {GROWTH_TROUBLE_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => setTroubleAction(action)}
            aria-pressed={troubleAction === action}
            className={`text-sm underline underline-offset-4 transition-opacity ${
              troubleAction === action ? "opacity-100" : "opacity-45 hover:opacity-70"
            }`}
          >
            {action}
          </button>
        ))}
      </div>
      {troubleAction && (
        <Legon text={getLegonComment("growthTroubleResolved")} className="ng-reveal" />
      )}

      <div className="mt-20 flex flex-col">
        {GROWTH_TIMELINE.map((item) => (
          <div
            key={item.year}
            className="border-t border-[var(--ng-line)] py-10 first:border-t"
          >
            <div className="flex items-baseline gap-4">
              <span className="ng-serif text-5xl font-medium opacity-90">
                {item.year}
              </span>
              <span className="ng-sans-en text-xs tracking-[0.2em] uppercase opacity-40">
                year
              </span>
            </div>
            <p className="mt-3 text-lg leading-relaxed">{item.line}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SubKicker({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`ng-sans-en mb-5 text-xs font-semibold tracking-[0.18em] uppercase opacity-45 ${className}`}
    >
      {children}
    </div>
  );
}
