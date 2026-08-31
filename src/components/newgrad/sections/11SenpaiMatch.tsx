"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import {
  SENPAI_TAG_OPTIONS,
  MAX_SENPAI_TAGS,
  SENPAI_VIDEO_QUESTIONS,
  matchSenpai,
} from "@/lib/newgrad/data/senpai";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { toggleWithMax } from "@/lib/newgrad/selection";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import { Photo } from "../ui/Photo";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";

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

      <div className="flex flex-col gap-20">
        {ranked.map(({ senpai, percent }) => (
          <div key={senpai.id} className="border-t border-[var(--ng-line)] pt-8">
            <Photo slot={NEWGRAD_IMAGES.staff} aspect="aspect-[4/5]" className="mb-6" />

            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">{senpai.name}</p>
                <p className="text-xs opacity-55">
                  {senpai.school} / {senpai.joinedYear}
                </p>
              </div>
              <span className="ng-sans-en shrink-0 pt-1 text-xs tracking-widest text-[var(--ng-hotpink)]">
                MATCH {percent}%
              </span>
            </div>

            <blockquote className="ng-serif mb-6 text-xl leading-relaxed italic opacity-90">
              「{senpai.story}」
            </blockquote>

            <div className="mb-6 -mx-6 flex gap-3 overflow-x-auto px-6 pb-1">
              {SENPAI_VIDEO_QUESTIONS.map((q) => (
                <div key={q.key} className="w-28 shrink-0">
                  <MediaPlaceholder label="STAFF VIDEO" kind="video" aspect="portrait" />
                  <p className="mt-2 text-[11px] leading-tight opacity-55">
                    {q.question}
                  </p>
                </div>
              ))}
            </div>

            <Button
              variant={state.matchedSenpai === senpai.id ? "pink" : "pink-outline"}
              onClick={() => chooseSenpai(senpai.id)}
            >
              この先輩に聞いてみたい
            </Button>
          </div>
        ))}
      </div>
    </Section>
  );
}
