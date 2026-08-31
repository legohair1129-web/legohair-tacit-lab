"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import {
  ONE_DAY_TIMELINE,
  ONE_DAY_GROWTH_RESULT,
  ONE_DAY_FAVORITE_OPTIONS,
} from "@/lib/newgrad/data/oneDay";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { ChoiceCard } from "../ui/ChoiceCard";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";

export function OneDayExperience() {
  const { state, update } = useNewGradState();

  function pickFavorite(option: string) {
    update({ oneDayFavorite: option });
    trackEvent("one_day_complete", { section: "one-day-experience", oneDayFavorite: option });
  }

  return (
    <Section id="one-day-experience" index="10" title={"美容師の1日って、\n実際どんな感じ？"}>
      <ol className="flex flex-col gap-6">
        {ONE_DAY_TIMELINE.map((moment) => (
          <li key={moment.time} className="flex gap-4">
            <div className="w-16 shrink-0 pt-2 text-xs font-bold tracking-wide text-[var(--ng-accent)]">
              {moment.time}
            </div>
            <div className="flex-1">
              <div className="mb-2 text-sm font-bold">{moment.label}</div>
              <MediaPlaceholder label="VIDEO PLACEHOLDER" aspect="wide" />
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl bg-[var(--ng-ink)] p-6 text-center text-white">
        <div className="mb-4 text-xs tracking-[0.3em] opacity-70">
          TODAY&apos;S GROWTH
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ONE_DAY_GROWTH_RESULT.map((r) => (
            <div
              key={r.key}
              className="rounded-xl border border-white/20 px-3 py-3"
            >
              <div className="text-[0.65rem] tracking-widest opacity-70">
                {r.key}
              </div>
              <div className="text-lg font-bold text-[var(--ng-pop)]">
                {r.delta}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <p className="mb-4 text-sm font-bold">
          今日、何が一番印象に残った？
        </p>
        <div className="flex flex-col gap-3">
          {ONE_DAY_FAVORITE_OPTIONS.map((option) => (
            <ChoiceCard
              key={option}
              label={option}
              selected={state.oneDayFavorite === option}
              onClick={() => pickFavorite(option)}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
