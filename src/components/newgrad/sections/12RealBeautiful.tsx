"use client";

import { useState } from "react";
import {
  BEAUTIFUL_SIDE_ITEMS,
  REAL_SIDE_ITEMS,
  REAL_BEAUTIFUL_CARDS,
} from "@/lib/newgrad/data/realBeautiful";
import { Section } from "../ui/Section";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";

type Side = "beautiful" | "real";

export function RealBeautiful() {
  const [side, setSide] = useState<Side>("beautiful");
  const [viewed, setViewed] = useState<Set<Side>>(new Set(["beautiful"]));

  function select(next: Side) {
    setSide(next);
    setViewed((prev) => new Set(prev).add(next));
  }

  const items = side === "beautiful" ? BEAUTIFUL_SIDE_ITEMS : REAL_SIDE_ITEMS;
  const bothViewed = viewed.has("beautiful") && viewed.has("real");

  return (
    <Section id="real-beautiful" index="12" title="美容師の、ふたつの顔。">
      <div className="mb-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => select("beautiful")}
          aria-pressed={side === "beautiful"}
          className={`rounded-full py-3 text-xs font-bold tracking-wide ${
            side === "beautiful"
              ? "bg-[var(--ng-ink)] text-white"
              : "border border-[var(--ng-border)] text-[var(--ng-muted)]"
          }`}
        >
          BEAUTIFUL SIDE｜キラキラを見る
        </button>
        <button
          type="button"
          onClick={() => select("real")}
          aria-pressed={side === "real"}
          className={`rounded-full py-3 text-xs font-bold tracking-wide ${
            side === "real"
              ? "bg-[var(--ng-ink)] text-white"
              : "border border-[var(--ng-border)] text-[var(--ng-muted)]"
          }`}
        >
          REAL SIDE｜リアルを見る
        </button>
      </div>

      <div key={side} className="ng-animate-in grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item}>
            <MediaPlaceholder label={side === "beautiful" ? "STAFF PHOTO" : "STAFF VIDEO"} aspect="square" />
            <p className="mt-1 text-center text-xs text-[var(--ng-muted)]">{item}</p>
          </div>
        ))}
      </div>

      {bothViewed && (
        <div className="ng-animate-in mt-12 flex flex-col items-center gap-6 text-center">
          <p className="text-2xl font-bold">どちらも、美容師。</p>
          <p className="text-2xl font-bold text-[var(--ng-pop)]">だから、面白い。</p>

          <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--ng-muted)]">
            {"LEGOHAIRは、\n楽しいことしかありません、とは言いません。\n\nでも、\n一人にしない。"}
          </p>

          <div className="grid w-full grid-cols-3 gap-2">
            {REAL_BEAUTIFUL_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-[var(--ng-border)] p-3"
              >
                <div className="mb-1 text-xs font-bold tracking-wide text-[var(--ng-accent)]">
                  {card.title}
                </div>
                <p className="text-[0.7rem] leading-snug">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
