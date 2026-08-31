import { getLegonComment } from "@/lib/newgrad/legon";
import { Section } from "../ui/Section";
import { Legon } from "../ui/Legon";

const ELEMENTS = ["FACE", "COLOR", "BONE", "HAIR", "LIFESTYLE"];

export function GoodImpression() {
  return (
    <Section id="good-impression" index="07" title="似合うには、理由がある。">
      <div className="mb-8 flex flex-wrap gap-2">
        {ELEMENTS.map((el) => (
          <span
            key={el}
            className="rounded-full border border-[var(--ng-border)] bg-[var(--ng-surface)] px-4 py-2 text-xs font-bold tracking-wide"
          >
            {el}
          </span>
        ))}
      </div>

      <p className="mb-2 text-sm leading-relaxed">
        髪だけを見るのではなく、人を見る。
      </p>
      <p className="mb-8 text-sm leading-relaxed">
        感覚だけではなく、
        <br />
        “なぜ似合うのか”を学ぶ。
      </p>

      <Legon text={getLegonComment("goodImpression")} />
    </Section>
  );
}
