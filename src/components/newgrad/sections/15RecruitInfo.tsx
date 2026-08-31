"use client";

import { useState } from "react";
import { RECRUIT_INFO_ITEMS } from "@/lib/newgrad/data/recruitInfo";
import { Section } from "../ui/Section";

export function RecruitInfo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section id="recruit-info" index="15" title="RECRUIT INFO">
      <div className="flex flex-col divide-y divide-[var(--ng-border)] rounded-2xl border border-[var(--ng-border)]">
        {RECRUIT_INFO_ITEMS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.title}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-bold"
              >
                {item.title}
                <span className="text-[var(--ng-muted)]">{open ? "−" : "+"}</span>
              </button>
              {open && (
                <p className="ng-animate-in px-4 pb-4 text-sm leading-relaxed text-[var(--ng-muted)]">
                  {item.body}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
