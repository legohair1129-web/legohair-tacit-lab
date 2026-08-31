"use client";

import { useEffect, useRef } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { TYPE_PROFILES } from "@/lib/newgrad/data/typeProfiles";
import { STRENGTH_EN } from "@/lib/newgrad/data/strengths";
import { SENPAI_LIST } from "@/lib/newgrad/data/senpai";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { getLegonComment } from "@/lib/newgrad/legon";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { Legon } from "../ui/Legon";
import { Photo } from "../ui/Photo";
import { useReveal } from "../hooks/useReveal";

export function MyFutureCard() {
  const { state } = useNewGradState();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);
  // A second, purely visual observer - the "completing" build-up below is
  // independent of the analytics-only observer above.
  const buildRef = useRef<HTMLDivElement | null>(null);
  const buildInView = useReveal(buildRef, 0.2);

  useEffect(() => {
    if (!state.diagnosisCompleted || !cardRef.current) return;
    const el = cardRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          trackEvent("future_card_view", {
            section: "my-future-card",
            primaryType: state.primaryType,
            secondaryType: state.secondaryType,
          });
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [state.diagnosisCompleted, state.primaryType, state.secondaryType]);

  if (!state.diagnosisCompleted || !state.primaryType || !state.secondaryType) {
    return (
      <Section
        id="my-future-card"
        index="16"
        accentIndex
        topLine
        tone="pink-tint"
        pad="l"
        kicker="future id"
        title="MY FUTURE CARD"
      >
        <p className="text-sm opacity-55">
          診断に答えると、あなただけの FUTURE CARD が生成されます。
        </p>
      </Section>
    );
  }

  const primary = TYPE_PROFILES[state.primaryType];
  const secondary = TYPE_PROFILES[state.secondaryType];
  const senpai = SENPAI_LIST.find((s) => s.id === state.matchedSenpai);
  const strengthText =
    state.strengths.length > 0
      ? state.strengths.map((s) => STRENGTH_EN[s]).join(" / ")
      : "-";
  const interestText = state.focusArea ?? "TOTAL";

  return (
    <Section
      id="my-future-card"
      index="16"
      accentIndex
      topLine
      tone="pink-tint"
      pad="l"
      kicker="future id"
      title="MY FUTURE CARD"
    >
      <div
        ref={(el) => {
          cardRef.current = el;
          buildRef.current = el;
        }}
        className="ng-reveal border border-[var(--ng-line)] bg-[var(--ng-white)]"
      >
        <div className={`ng-io-clip ${buildInView ? "ng-in" : ""}`}>
          <Photo
            slot={NEWGRAD_IMAGES.futureCardAccent}
            aspect="aspect-[3/1]"
            rounded="rounded-none"
          />
        </div>

        <div className="px-7 py-8">
          <div className="flex items-baseline justify-between">
            <span className="ng-sans-en text-xs font-bold tracking-[0.2em]">
              LEGOHAIR
            </span>
            <span className="ng-sans-en text-[10px] tracking-[0.2em] opacity-45">
              FUTURE ID
            </span>
          </div>

          <div className="my-6 h-[2px] w-10 bg-[var(--ng-hotpink)]" aria-hidden />

          <p className="ng-serif text-3xl leading-[1.2] font-medium break-words">
            {primary.nameEn}{" "}
            <span className="mx-1 text-lg opacity-40">×</span> {secondary.nameEn}
          </p>

          <div className="mt-8 flex flex-col">
            <CardRow
              label="YOUR STRENGTH"
              value={strengthText}
              className={buildInView ? "ng-in" : ""}
            />
            <CardRow
              label="YOU CARE ABOUT"
              value={state.jobPriority ?? "-"}
              className={`ng-io-d1 ${buildInView ? "ng-in" : ""}`}
            />
            <CardRow
              label="INTEREST"
              value={interestText}
              className={`ng-io-d2 ${buildInView ? "ng-in" : ""}`}
            />
            <CardRow
              label="SENPAI"
              value={senpai ? senpai.name : "-"}
              last
              className={`ng-io-d3 ${buildInView ? "ng-in" : ""}`}
            />
          </div>

          <p className="mt-8 text-sm leading-relaxed opacity-70">
            {primary.headline}
          </p>
        </div>
      </div>

      <Legon text={getLegonComment("futureCard")} className="mt-8" />
    </Section>
  );
}

function CardRow({
  label,
  value,
  last = false,
  className = "",
}: {
  label: string;
  value: string;
  last?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`ng-io-fade flex items-baseline justify-between border-t border-[var(--ng-line)] py-3 ${
        last ? "border-b" : ""
      } ${className}`}
    >
      <span className="ng-sans-en text-[10px] tracking-[0.14em] uppercase opacity-45">
        {label}
      </span>
      <span className="ng-sans-en text-sm font-semibold">{value}</span>
    </div>
  );
}
