"use client";

import { useState } from "react";
import {
  BEAUTIFUL_SIDE_ITEMS,
  REAL_SIDE_ITEMS,
  REAL_BEAUTIFUL_CARDS,
} from "@/lib/newgrad/data/realBeautiful";
import { getLegonComment } from "@/lib/newgrad/legon";
import { Section } from "../ui/Section";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";
import { Legon } from "../ui/Legon";

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
      <div className="mb-10 flex gap-8 border-b border-[var(--ng-line)]">
        <button
          type="button"
          onClick={() => select("beautiful")}
          aria-pressed={side === "beautiful"}
          className={`ng-sans-en border-b-2 pb-4 text-xs font-semibold tracking-[0.16em] uppercase transition-colors ${
            side === "beautiful"
              ? "border-[var(--ng-ink)] opacity-100"
              : "border-transparent opacity-40"
          }`}
        >
          Beautiful side
        </button>
        <button
          type="button"
          onClick={() => select("real")}
          aria-pressed={side === "real"}
          className={`ng-sans-en border-b-2 pb-4 text-xs font-semibold tracking-[0.16em] uppercase transition-colors ${
            side === "real"
              ? "border-[var(--ng-ink)] opacity-100"
              : "border-transparent opacity-40"
          }`}
        >
          Real side
        </button>
      </div>

      <div key={side} className="ng-reveal grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item}>
            <MediaPlaceholder
              label={side === "beautiful" ? "STAFF PHOTO" : "STAFF VIDEO"}
              kind={side === "beautiful" ? "photo" : "video"}
              aspect="square"
            />
            <p className="mt-2 text-xs opacity-55">{item}</p>
          </div>
        ))}
      </div>

      {bothViewed && (
        <div className="ng-reveal mt-20">
          <p className="ng-serif text-4xl leading-[1.2] font-medium">
            BOTH ARE
            <br />
            BEAUTY.
          </p>
          <p className="mt-4 text-base opacity-70">
            どちらも、美容師。
            <br />
            だから、面白い。
          </p>

          <p className="mt-10 max-w-[32ch] text-sm leading-relaxed opacity-55">
            LEGOHAIRは、楽しいことしかありません、とは言いません。でも、一人にしない。
          </p>

          <div className="mt-8">
            {REAL_BEAUTIFUL_CARDS.map((card, i) => (
              <div
                key={card.title}
                className="flex gap-4 border-t border-[var(--ng-line)] py-4 last:border-b"
              >
                <span className="ng-sans-en w-6 shrink-0 text-xs font-semibold tracking-widest opacity-45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="ng-sans-en text-sm font-semibold tracking-wide">
                    {card.title}
                  </p>
                  <p className="mt-1 text-sm opacity-60">{card.body}</p>
                </div>
              </div>
            ))}
          </div>

          <Legon text={getLegonComment("realBeautifulReveal")} className="mt-10" />
        </div>
      )}
    </Section>
  );
}
