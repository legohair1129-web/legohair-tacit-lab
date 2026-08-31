"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import {
  SALON_TOUR_SPOTS,
  SALON_NAMES,
  SALON_INTEREST_OPTIONS,
} from "@/lib/newgrad/data/salonTour";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { ChoiceRow } from "../ui/ChoiceRow";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";

export function SalonTour() {
  const { state, update } = useNewGradState();

  function pickInterest(option: string) {
    update({ salonInterest: option });
    trackEvent("salon_tour_complete", { section: "salon-tour", salonInterest: option });
  }

  return (
    <Section
      id="salon-tour"
      index="13"
      accentIndex
      topLine
      tone="beige-tint"
      pad="l"
      kicker="30 sec salon walk"
      title={
        <>
          30秒で、
          <br />
          LEGOHAIRを歩いてみる。
        </>
      }
    >
      <div className="-mx-6 mb-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
        {SALON_TOUR_SPOTS.map((spot, i) => (
          <div key={spot} className="w-[78%] shrink-0 snap-start">
            <MediaPlaceholder label="SALON TOUR VIDEO" kind="video" aspect="portrait" />
            <p className="mt-3 flex items-baseline gap-3">
              <span className="ng-sans-en text-xs opacity-40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium">{spot}</span>
            </p>
          </div>
        ))}
      </div>
      <p className="ng-sans-en mb-14 text-[11px] tracking-widest opacity-35">
        swipe →
      </p>

      <div className="mb-16 flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-45">
        {SALON_NAMES.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>

      <p className="mb-6 text-sm font-medium">
        もし働くなら、
        <br />
        どんな場所が気になる？
      </p>
      <div>
        {SALON_INTEREST_OPTIONS.map((option, i) => (
          <ChoiceRow
            key={option}
            index={String(i + 1).padStart(2, "0")}
            label={option}
            accent="pink"
            selected={state.salonInterest === option}
            onClick={() => pickInterest(option)}
          />
        ))}
      </div>
    </Section>
  );
}
