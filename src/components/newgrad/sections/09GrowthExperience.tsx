"use client";

import { useRef, useState } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import {
  GROWTH_CONCERN_OPTIONS,
  GROWTH_ELEMENTS,
  GROWTH_METER,
  GROWTH_TROUBLES,
  GROWTH_TROUBLE_ACTIONS,
  GROWTH_TIMELINE,
} from "@/lib/newgrad/data/growth";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { getLegonComment } from "@/lib/newgrad/legon";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { ChoiceRow } from "../ui/ChoiceRow";
import { Legon } from "../ui/Legon";
import { Photo } from "../ui/Photo";
import { useReveal } from "../hooks/useReveal";
import { useParallax } from "../hooks/useParallax";

export function GrowthExperience() {
  const { state, update } = useNewGradState();
  const [troubleAction, setTroubleAction] = useState<string | null>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const photoInView = useReveal(photoRef, 0.15);
  const learnInView = useReveal(learnRef, 0.15);

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
      accentIndex
      topLine
      tone="beige-tint"
      pad="l"
      kicker="growth experience"
      title={
        <>
          入社したら、
          <br />
          どんなふうに成長する？
        </>
      }
    >
      <div
        ref={photoRef}
        className={`mb-10 ng-io-clip ${photoInView ? "ng-in" : ""}`}
      >
        <Photo slot={NEWGRAD_IMAGES.education} aspect="aspect-video" />
      </div>

      <Legon text={getLegonComment("growthIntro")} className="mb-14" />

      <div className="mb-16 rounded-[4px] border border-[var(--ng-line)] p-5">
        <SubKicker>MONTH 01 — 最初に不安なのは？</SubKicker>
        <div>
          {GROWTH_CONCERN_OPTIONS.map((option) => (
            <ChoiceRow
              key={option.key}
              index={option.key}
              label={option.text}
              accent="pink"
              selected={state.growthConcern === option.key}
              onClick={() => pickConcern(option.key)}
            />
          ))}
        </div>
        {pickedOption && (
          <Legon text={getLegonComment(pickedOption.legonKey)} className="ng-reveal mt-5" />
        )}
      </div>

      <SubKicker>WHAT YOU LEARN</SubKicker>
      <div
        ref={learnRef}
        className="mb-16 grid grid-cols-2 gap-3"
      >
        {GROWTH_ELEMENTS.map((el, i) => (
          <div
            key={el.key}
            className={`ng-io-fade rounded-[4px] border border-[var(--ng-line)] p-4 ${
              i % 2 === 1 ? "ng-io-d1" : ""
            } ${learnInView ? "ng-in" : ""}`}
          >
            <span className="ng-sans-en text-[10px] font-semibold tracking-widest text-[var(--ng-hotpink)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="ng-sans-en mt-1 text-sm font-semibold tracking-wide">
              {el.label}
            </p>
            <p className="mt-1 text-xs opacity-55">{el.ja}</p>
          </div>
        ))}
      </div>

      <div className="mb-16 rounded-[4px] border border-[var(--ng-line)] p-5">
        <SubKicker>SIX MONTHS IN</SubKicker>
        <div className="flex flex-col gap-5">
          {GROWTH_METER.map((meter) => (
            <div key={meter.key} className="flex items-center gap-4">
              <span className="w-14 shrink-0 text-xs opacity-55">{meter.label}</span>
              <span className="flex flex-1 gap-1">
                {Array.from({ length: meter.max }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-px flex-1 ${
                      i < meter.level ? "bg-[var(--ng-hotpink)]" : "bg-[var(--ng-line)]"
                    }`}
                  />
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <SubKicker>A DIFFICULT DAY</SubKicker>
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
            className={`text-sm underline underline-offset-4 transition-colors ${
              troubleAction === action
                ? "text-[var(--ng-hotpink)] opacity-100"
                : "opacity-45 hover:opacity-70"
            }`}
          >
            {action}
          </button>
        ))}
      </div>
      {troubleAction && (
        <Legon text={getLegonComment("growthTroubleResolved")} className="ng-reveal" />
      )}

      <div className="mt-20 flex flex-col gap-16">
        {GROWTH_TIMELINE.map((item, i) => (
          <YearRow key={item.year} item={item} index={i} />
        ))}
      </div>
    </Section>
  );
}

function YearRow({
  item,
  index: i,
}: {
  item: (typeof GROWTH_TIMELINE)[number];
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);
  const rowInView = useReveal(rowRef, 0.2);
  const bgOffset = useParallax(bgRef, 6);

  return (
    <div ref={rowRef} className="relative overflow-hidden">
      {/* Layer: a giant, near-invisible numeral sits behind the row as a
          quiet background instead of only living in the small timeline
          text - drifts a few px on scroll. */}
      <span
        ref={bgRef}
        aria-hidden
        className={`ng-sans-en pointer-events-none absolute top-1/2 text-[7rem] leading-none font-bold text-[var(--ng-ink)]/5 select-none ${
          i % 2 === 1 ? "right-0" : "left-0"
        }`}
        style={{ transform: `translateY(calc(-50% + ${bgOffset}px))` }}
      >
        {item.year}
      </span>

      <div
        className={`ng-io-fade relative flex items-center gap-5 ${
          i % 2 === 1 ? "flex-row-reverse" : ""
        } ${rowInView ? "ng-in" : ""}`}
      >
        <Photo
          slot={NEWGRAD_IMAGES.growthMilestones[i % NEWGRAD_IMAGES.growthMilestones.length]}
          aspect="aspect-square"
          rounded="rounded-[4px]"
          className="w-[34%] shrink-0"
        />
        <div className={i % 2 === 1 ? "text-right" : ""}>
          <div
            className={`flex items-baseline gap-3 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}
          >
            <span className="ng-serif text-5xl font-medium opacity-90">
              {item.year}
            </span>
            <span className="ng-sans-en text-xs tracking-[0.2em] uppercase opacity-40">
              year
            </span>
          </div>
          <p className="mt-3 text-lg leading-relaxed">{item.line}</p>
        </div>
      </div>
    </div>
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
