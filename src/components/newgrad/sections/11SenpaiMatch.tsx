"use client";

import { useNewGradState } from "@/lib/newgrad/StateProvider";
import {
  SENPAI_TAG_OPTIONS,
  MAX_SENPAI_TAGS,
  SENPAI_VIDEO_QUESTIONS,
  matchSenpai,
} from "@/lib/newgrad/data/senpai";
import { toggleWithMax } from "@/lib/newgrad/selection";
import { trackEvent } from "@/lib/newgrad/track";
import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";

const DISPLAY_COUNT = 3;

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
    <Section id="senpai-match" index="11" title="あなたに近い先輩は、誰？">
      <p className="mb-4 text-sm font-bold">
        気になるものを最大{MAX_SENPAI_TAGS}つ選んでください。
      </p>
      <div className="mb-10 flex flex-wrap gap-2">
        {SENPAI_TAG_OPTIONS.map((tag) => {
          const selected = state.senpaiPreferences.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              aria-pressed={selected}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                selected
                  ? "border-[var(--ng-pop)] bg-[var(--ng-pop-soft)]"
                  : "border-[var(--ng-border)] bg-white hover:border-[var(--ng-accent)]"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-8">
        {ranked.map(({ senpai, percent }) => (
          <div
            key={senpai.id}
            className="rounded-2xl border border-[var(--ng-border)] p-5"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="w-20 shrink-0">
                <MediaPlaceholder label="STAFF PHOTO" aspect="square" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{senpai.name}</span>
                  <span className="rounded-full bg-[var(--ng-pop)] px-2 py-1 text-xs font-bold text-white">
                    MATCH {percent}%
                  </span>
                </div>
                <p className="text-xs text-[var(--ng-muted)]">
                  {senpai.joinedYear} / {senpai.school}
                </p>
                <p className="text-xs text-[var(--ng-accent)]">{senpai.type}</p>
              </div>
            </div>

            <p className="mb-4 text-sm leading-relaxed">{senpai.story}</p>

            <div className="mb-4 grid grid-cols-2 gap-2">
              {SENPAI_VIDEO_QUESTIONS.map((q) => (
                <div key={q.key}>
                  <MediaPlaceholder label="STAFF VIDEO" aspect="portrait" />
                  <p className="mt-1 text-[0.65rem] leading-tight text-[var(--ng-muted)]">
                    {q.question}
                  </p>
                </div>
              ))}
            </div>

            <Button
              variant={state.matchedSenpai === senpai.id ? "primary" : "secondary"}
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
