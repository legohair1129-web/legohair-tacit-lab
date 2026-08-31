"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import {
  ONE_DAY_TIMELINE,
  ONE_DAY_GROWTH_RESULT,
  ONE_DAY_FAVORITE_OPTIONS,
} from "@/lib/newgrad/data/oneDay";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { ChoiceRow } from "../ui/ChoiceRow";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";

export function OneDayExperience() {
  const { state, update } = useNewGradState();

  function pickFavorite(option: string) {
    update({ oneDayFavorite: option });
    trackEvent("one_day_complete", { section: "one-day-experience", oneDayFavorite: option });
  }

  return (
    <Section
      id="one-day-experience"
      index="10"
      kicker="a day at legohair"
      title={
        <>
          美容師の1日って、
          <br />
          実際どんな感じ？
        </>
      }
    >
      <ol>
        {ONE_DAY_TIMELINE.map((moment, i) => (
          <li
            key={moment.time}
            className="border-t border-[var(--ng-line)] py-6 last:border-b"
          >
            <div className="flex items-baseline gap-4">
              <span className="ng-sans-en text-2xl font-semibold tracking-tight">
                {moment.time}
              </span>
              <span className="text-sm opacity-60">{moment.label}</span>
            </div>
            {i % 2 === 0 && (
              <MediaPlaceholder
                label="ONE DAY VIDEO"
                kind="video"
                aspect="wide"
                className="mt-4"
              />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-16 border-t border-b border-[var(--ng-ink)] py-6">
        <div className="ng-sans-en mb-4 text-xs font-semibold tracking-[0.2em] uppercase opacity-50">
          today&apos;s growth
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {ONE_DAY_GROWTH_RESULT.map((r) => (
            <div key={r.key} className="ng-sans-en text-sm">
              <span className="opacity-55">{r.key}</span>{" "}
              <span className="font-semibold">{r.delta}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <p className="mb-6 text-sm font-medium">
          今日、何が一番印象に残った？
        </p>
        <div>
          {ONE_DAY_FAVORITE_OPTIONS.map((option, i) => (
            <ChoiceRow
              key={option}
              index={String(i + 1).padStart(2, "0")}
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
