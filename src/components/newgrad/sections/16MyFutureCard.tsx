"use client";

import { useEffect, useRef } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { TYPE_PROFILES } from "@/lib/newgrad/data/typeProfiles";
import { STRENGTH_EN } from "@/lib/newgrad/data/strengths";
import { SENPAI_LIST } from "@/lib/newgrad/data/senpai";
import { getLegonComment } from "@/lib/newgrad/legon";
import { typeColorVar } from "@/lib/newgrad/typeColor";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { Legon } from "../ui/Legon";

export function MyFutureCard() {
  const { state } = useNewGradState();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);

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
      <Section id="my-future-card" index="16" kicker="future id" title="MY FUTURE CARD">
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
  const accent = typeColorVar(state.primaryType);

  return (
    <Section id="my-future-card" index="16" kicker="future id" title="MY FUTURE CARD">
      <div
        ref={cardRef}
        className="ng-reveal border border-[var(--ng-ink)] bg-[var(--ng-white)] px-7 py-8"
      >
        <div className="flex items-baseline justify-between">
          <span className="ng-sans-en text-xs font-bold tracking-[0.2em]">
            LEGOHAIR
          </span>
          <span className="ng-sans-en text-[10px] tracking-[0.2em] opacity-45">
            FUTURE ID
          </span>
        </div>

        <div
          className="my-6 h-[2px] w-10"
          style={{ background: accent }}
          aria-hidden
        />

        <p className="ng-serif text-3xl leading-[1.2] font-medium break-words">
          {primary.nameEn}{" "}
          <span className="mx-1 text-lg opacity-40">×</span> {secondary.nameEn}
        </p>

        <div className="mt-8 flex flex-col">
          <CardRow label="YOUR STRENGTH" value={strengthText} />
          <CardRow label="YOU CARE ABOUT" value={state.jobPriority ?? "-"} />
          <CardRow label="INTEREST" value={interestText} />
          <CardRow label="SENPAI" value={senpai ? senpai.name : "-"} last />
        </div>

        <p className="mt-8 text-sm leading-relaxed opacity-70">
          {primary.headline}
        </p>
      </div>

      <Legon text={getLegonComment("futureCard")} className="mt-8" />
    </Section>
  );
}

function CardRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between border-t border-[var(--ng-line)] py-3 ${
        last ? "border-b" : ""
      }`}
    >
      <span className="ng-sans-en text-[10px] tracking-[0.14em] uppercase opacity-45">
        {label}
      </span>
      <span className="ng-sans-en text-sm font-semibold">{value}</span>
    </div>
  );
}
