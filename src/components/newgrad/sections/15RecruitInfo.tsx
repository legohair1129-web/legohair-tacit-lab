"use client";

import { useRef, useState } from "react";
import { RECRUIT_INFO_ITEMS } from "@/lib/newgrad/data/recruitInfo";
import { Section } from "../ui/Section";
import { IndexRow } from "../ui/IndexRow";
import { useReveal } from "../hooks/useReveal";

export function RecruitInfo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Deliberately restrained here per brief - a single quiet fade, no
  // stagger or background layer, so the information itself reads plainly.
  const listRef = useRef<HTMLDivElement>(null);
  const listInView = useReveal(listRef, 0.1);

  return (
    <Section
      id="recruit-info"
      index="15"
      accentIndex
      topLine
      tone="beige-tint"
      pad="l"
      kicker="recruit info"
      title="採用情報"
    >
      <div ref={listRef} className={`ng-io-fade ${listInView ? "ng-in" : ""}`}>
        {RECRUIT_INFO_ITEMS.map((item, i) => (
          <IndexRow
            key={item.title}
            index={String(i + 1).padStart(2, "0")}
            label={item.title}
            detail={item.body}
            accent
            open={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </Section>
  );
}
