"use client";

import { useRef } from "react";
import { useNewGradState } from "@/lib/newgrad/StateProvider";
import {
  SENPAI_TAG_OPTIONS,
  MAX_SENPAI_TAGS,
  SENPAI_VIDEO_QUESTIONS,
  matchSenpai,
  type Senpai,
} from "@/lib/newgrad/data/senpai";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { toggleWithMax } from "@/lib/newgrad/selection";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import { Photo } from "../ui/Photo";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";
import { useReveal } from "../hooks/useReveal";

const DISPLAY_COUNT = 2;

export function SenpaiMatch() {
  const { state, update } = useNewGradState();

  const ranked = matchSenpai(
    state.senpaiPreferences,
    state.primaryType,
    state.secondaryType
  ).slice(0, DISPLAY_COUNT);

  function toggleTag(tag: string) {
    update({
      senpaiPreferences: toggleWithMax(state.senpaiPreferences, tag, MAX_SENPAI_TAGS),
    });
  }

  function chooseSenpai(id: string) {
    update({ matchedSenpai: id });
    trackEvent("senpai_match", { section: "senpai-match", matchedSenpai: id });
  }

  return (
    <Section
      id="senpai-match"
      index="11"
      accentIndex
      topLine
      tone="beige-tint"
      pad="l"
      kicker="match with"
      title="あなたに近い先輩は、誰？"
    >
      <p className="mb-5 text-sm opacity-55">
        気になるものを最大{MAX_SENPAI_TAGS}つ選んでください。
      </p>
      <div className="mb-16 flex flex-wrap gap-x-5 gap-y-2">
        {SENPAI_TAG_OPTIONS.map((tag) => {
          const selected = state.senpaiPreferences.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              aria-pressed={selected}
              className={`text-xs underline underline-offset-4 transition-colors ${
                selected
                  ? "text-[var(--ng-hotpink)] opacity-100"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="-mx-6 flex flex-col gap-24">
        {ranked.map(({ senpai, percent }, rank) => (
          <SenpaiCard
            key={senpai.id}
            senpai={senpai}
            percent={percent}
            rank={rank}
            isChosen={state.matchedSenpai === senpai.id}
            onChoose={() => chooseSenpai(senpai.id)}
          />
        ))}
      </div>
    </Section>
  );
}

function SenpaiCard({
  senpai,
  percent,
  rank,
  isChosen,
  onChoose,
}: {
  senpai: Senpai;
  percent: number;
  rank: number;
  isChosen: boolean;
  onChoose: () => void;
}) {
  const revealRef = useRef<HTMLDivElement>(null);
  const revealInView = useReveal(revealRef, 0.15);

  return (
    <div ref={revealRef}>
      <div
        className={`relative ng-io-scale transition-[transform,box-shadow] duration-300 ease-out ${
          revealInView ? "ng-in" : ""
        } ${isChosen ? "scale-[1.02] shadow-[0_16px_36px_rgba(22,22,22,0.16)]" : ""}`}
      >
        <Photo
          slot={NEWGRAD_IMAGES.senpaiPhotos[rank % NEWGRAD_IMAGES.senpaiPhotos.length]}
          aspect="aspect-[4/5]"
          rounded="rounded-none"
        />
        <span className="ng-sans-en absolute top-5 right-6 bg-[var(--ng-hotpink)] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-[var(--ng-white)] uppercase">
          MATCH {percent}%
        </span>
      </div>

      <div className="px-6">
        <div className="mt-6 mb-4">
          <p className="ng-serif text-2xl font-semibold">{senpai.name}</p>
          <p className="text-xs opacity-55">
            {senpai.school} / {senpai.joinedYear}
          </p>
        </div>

        <blockquote className="ng-serif mb-6 text-xl leading-relaxed italic opacity-90">
          「{senpai.story}」
        </blockquote>

        <div className="mb-6 -mx-6 flex gap-3 overflow-x-auto px-6 pb-1">
          {SENPAI_VIDEO_QUESTIONS.map((q) => (
            <div key={q.key} className="w-28 shrink-0">
              <MediaPlaceholder label="STAFF VIDEO" kind="video" aspect="portrait" />
              <p className="mt-2 text-[11px] leading-tight opacity-55">{q.question}</p>
            </div>
          ))}
        </div>

        <Button variant={isChosen ? "pink" : "pink-outline"} onClick={onChoose}>
          この先輩に聞いてみたい
        </Button>
      </div>
    </div>
  );
}
