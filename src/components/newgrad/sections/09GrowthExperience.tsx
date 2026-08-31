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
import { ChoiceCard } from "../ui/ChoiceCard";
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
    <Section id="growth-experience" index="09" title={"入社したら、\nどんなふうに成長する？"}>
      <Legon text={getLegonComment("growthIntro")} className="mb-10" />

      <SubHeading>入社1ヶ月</SubHeading>
      <p className="mb-4 text-sm font-bold">最初に不安なのは？</p>
      <div className="flex flex-col gap-3">
        {GROWTH_CONCERN_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.key}
            label={`${option.key}　${option.text}`}
            selected={state.growthConcern === option.key}
            onClick={() => pickConcern(option.key)}
          />
        ))}
      </div>
      {pickedOption && (
        <Legon
          text={getLegonComment(pickedOption.legonKey)}
          className="ng-animate-in mt-4"
        />
      )}

      <SubHeading className="mt-12">学ぶ4要素</SubHeading>
      <div className="grid grid-cols-2 gap-3">
        {GROWTH_ELEMENTS.map((el) => (
          <div
            key={el.key}
            className="rounded-2xl border border-[var(--ng-border)] bg-[var(--ng-surface)] px-4 py-3 text-center"
          >
            <div className="text-xs tracking-widest text-[var(--ng-accent)]">
              {el.label}
            </div>
            <div className="text-sm font-bold">{el.ja}</div>
          </div>
        ))}
      </div>

      <SubHeading className="mt-12">半年後</SubHeading>
      <div className="flex flex-col gap-4">
        {GROWTH_METER.map((meter) => (
          <div key={meter.key}>
            <div className="mb-1 flex justify-between text-xs text-[var(--ng-muted)]">
              <span>{meter.label}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: meter.max }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < meter.level ? "bg-[var(--ng-pop)]" : "bg-[var(--ng-border)]"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <SubHeading className="mt-12">うまくいかない日</SubHeading>
      <ul className="mb-4 flex flex-col gap-1 text-sm text-[var(--ng-muted)]">
        {GROWTH_TROUBLES.map((t) => (
          <li key={t}>・{t}</li>
        ))}
      </ul>
      <p className="mb-3 text-center text-lg opacity-40">↓</p>
      <div className="mb-4 grid grid-cols-2 gap-3">
        {GROWTH_TROUBLE_ACTIONS.map((action) => (
          <ChoiceCard
            key={action}
            label={action}
            selected={troubleAction === action}
            onClick={() => setTroubleAction(action)}
          />
        ))}
      </div>
      {troubleAction && (
        <p className="ng-animate-in text-center text-sm font-bold text-[var(--ng-pop)]">
          {getLegonComment("growthTroubleResolved")}
        </p>
      )}

      <SubHeading className="mt-12">その先</SubHeading>
      <div className="flex flex-col gap-4">
        {GROWTH_TIMELINE.map((item) => (
          <div
            key={item.year}
            className="rounded-2xl border border-[var(--ng-border)] p-4"
          >
            <div className="mb-2 text-xs tracking-widest text-[var(--ng-accent)]">
              {item.year}
            </div>
            {item.lines.map((line, i) => (
              <p key={i} className="whitespace-pre-line text-sm leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}

function SubHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`mb-4 text-sm font-bold tracking-wide ${className}`}>
      【{children}】
    </h3>
  );
}
