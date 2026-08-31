"use client";

import { useState } from "react";
import { RECRUIT_INFO_ITEMS } from "@/lib/newgrad/data/recruitInfo";
import { Section } from "../ui/Section";
import { IndexRow } from "../ui/IndexRow";

export function RecruitInfo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section id="recruit-info" index="15" kicker="recruit info" title="採用情報">
      <div>
        {RECRUIT_INFO_ITEMS.map((item, i) => (
          <IndexRow
            key={item.title}
            index={String(i + 1).padStart(2, "0")}
            label={item.title}
            detail={item.body}
            open={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </Section>
  );
}
