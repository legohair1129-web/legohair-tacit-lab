"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import {
  SALON_TOUR_SPOTS,
  SALON_NAMES,
  SALON_INTEREST_OPTIONS,
} from "@/lib/newgrad/data/salonTour";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { ChoiceCard } from "../ui/ChoiceCard";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";

export function SalonTour() {
  const { state, update } = useNewGradState();

  function pickInterest(option: string) {
    update({ salonInterest: option });
    trackEvent("salon_tour_complete", { section: "salon-tour", salonInterest: option });
  }

  return (
    <Section id="salon-tour" index="13" title={"30秒で、\nLEGOHAIRを歩いてみる。"}>
      <div className="mb-6 flex flex-wrap gap-2">
        {SALON_NAMES.map((name) => (
          <span
            key={name}
            className="rounded-full border border-[var(--ng-border)] bg-[var(--ng-surface)] px-3 py-1 text-xs text-[var(--ng-muted)]"
          >
            {name}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SALON_TOUR_SPOTS.map((spot) => (
          <div key={spot}>
            <MediaPlaceholder label="SALON TOUR VIDEO" />
            <p className="mt-1 text-center text-xs text-[var(--ng-muted)]">{spot}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <p className="mb-4 text-sm font-bold">
          もし働くなら、
          <br />
          どんな場所が気になる？
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SALON_INTEREST_OPTIONS.map((option) => (
            <ChoiceCard
              key={option}
              label={option}
              selected={state.salonInterest === option}
              onClick={() => pickInterest(option)}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
