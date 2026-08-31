import { getLegonComment } from "@/lib/newgrad/legon";
import { Section } from "../ui/Section";
import { Legon } from "../ui/Legon";
import { IndexRow } from "../ui/IndexRow";

const ELEMENTS = ["FACE", "COLOR", "BONE", "HAIR", "LIFESTYLE"];

export function GoodImpression() {
  return (
    <Section
      id="good-impression"
      index="07"
      kicker="why does it suit you?"
      title="似合うには、理由がある。"
    >
      <div className="mb-10">
        {ELEMENTS.map((el, i) => (
          <IndexRow key={el} index={String(i + 1).padStart(2, "0")} label={el} />
        ))}
      </div>

      <p className="mb-2 text-sm leading-relaxed opacity-70">
        髪だけを見るのではなく、人を見る。
      </p>
      <p className="mb-10 text-sm leading-relaxed opacity-70">
        感覚だけではなく、
        <br />
        “なぜ似合うのか”を学ぶ。
      </p>

      <Legon text={getLegonComment("goodImpression")} />
    </Section>
  );
}
