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
    <Section
      id="real-beautiful"
      index="12"
      accentIndex
      topLine
      pad="l"
      // The two "pages" get their own quiet background, so switching sides
      // reads as turning to a different spread, not just swapping a grid.
      tone={side === "beautiful" ? "pink-tint" : "beige-tint"}
      title="美容師の、ふたつの顔。"
    >
      <div className="mb-10 flex gap-8 border-b border-[var(--ng-line)]">
        <button
          type="button"
          onClick={() => select("beautiful")}
          aria-pressed={side === "beautiful"}
          className={`ng-sans-en border-b-2 pb-4 text-xs font-semibold tracking-[0.16em] uppercase transition-colors ${
            side === "beautiful"
              ? "border-[var(--ng-hotpink)] text-[var(--ng-hotpink)] opacity-100"
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
              ? "border-[var(--ng-hotpink)] text-[var(--ng-hotpink)] opacity-100"
              : "border-transparent opacity-40"
          }`}
        >
          Real side
        </button>
      </div>

      <div key={side} className="ng-reveal">
        <div className="-mx-6 relative mb-6">
          {/* Layer: a ghost of the other side peeks out behind the current
              photo - a quiet visual tension between REAL and BEAUTIFUL. */}
          <div
            aria-hidden
            className="absolute top-3 right-3 left-3 -z-10 rotate-1 opacity-35"
          >
            <MediaPlaceholder
              label={side === "beautiful" ? REAL_SIDE_ITEMS[0] : BEAUTIFUL_SIDE_ITEMS[0]}
              kind={side === "beautiful" ? "video" : "photo"}
              aspect="editorial"
              className="border-x-0"
            />
          </div>
          <MediaPlaceholder
            label={items[0]}
            kind={side === "beautiful" ? "photo" : "video"}
            aspect="editorial"
            className="border-x-0"
          />
        </div>

        <div>
          {items.slice(1).map((item, i) => (
            <div
              key={item}
              className="flex items-baseline gap-4 border-t border-[var(--ng-line)] py-4 text-sm last:border-b"
            >
              <span className="ng-sans-en w-6 shrink-0 text-xs opacity-40">
                {String(i + 2).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
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
                <span className="ng-sans-en w-6 shrink-0 text-xs font-semibold tracking-widest text-[var(--ng-hotpink)]">
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
