"use client";

import { useEffect, useRef } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import { TYPE_PROFILES } from "@/lib/newgrad/data/typeProfiles";
import { SENPAI_LIST } from "@/lib/newgrad/data/senpai";
import { getLegonComment } from "@/lib/newgrad/legon";
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
      <Section id="my-future-card" index="16" title="MY FUTURE CARD">
        <p className="text-sm text-[var(--ng-muted)]">
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
      ? state.strengths.map((s) => `${s}力`).join(" × ")
      : "-";
  const interestText = `${state.focusArea ?? "似合わせ"}・カウンセリング`;

  return (
    <Section id="my-future-card" index="16" title="MY FUTURE CARD">
      <div
        ref={cardRef}
        className="ng-animate-in aspect-[3/5] w-full overflow-y-auto rounded-3xl p-6 text-white shadow-xl"
        style={{
          background: `linear-gradient(160deg, ${primary.color}, ${secondary.color})`,
        }}
      >
        <div className="mb-6 text-center text-xs tracking-[0.25em] opacity-90">
          LEGOHAIR FUTURE EXPERIENCE
        </div>

        <CardRow label="YOUR TYPE" value={`${primary.nameEn} × ${secondary.nameEn}`} />
        <CardRow label="YOUR STRENGTH" value={strengthText} />
        <CardRow label="YOU CARE ABOUT" value={state.jobPriority ?? "-"} />
        <CardRow label="YOUR INTEREST" value={interestText} />
        <CardRow label="SENPAI MATCH" value={senpai ? senpai.name : "-"} />

        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed">
          {primary.headline}
        </p>
        <p className="mt-3 text-xs italic opacity-90">「{primary.quote}」</p>
      </div>

      <Legon text={getLegonComment("futureCard")} className="mt-6" />
    </Section>
  );
}

function CardRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4 border-b border-white/25 pb-2">
      <div className="text-[0.65rem] tracking-widest opacity-70">{label}</div>
      <div className="text-base font-bold">{value}</div>
    </div>
  );
}
