import { getLegonComment } from "@/lib/newgrad/legon";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Section } from "../ui/Section";
import { Legon } from "../ui/Legon";
import { IndexRow } from "../ui/IndexRow";
import { Photo } from "../ui/Photo";

const ELEMENTS = ["FACE", "COLOR", "BONE", "HAIR", "LIFESTYLE"];

export function GoodImpression() {
  return (
    <Section
      id="good-impression"
      index="07"
      accentIndex
      topLine
      tone="ivory"
      pad="l"
      kicker="why does it suit you?"
      title="似合うには、理由がある。"
    >
      <Photo slot={NEWGRAD_IMAGES.goodImpression} aspect="aspect-[4/5]" className="mb-10" />

      <p className="mb-2 text-sm leading-relaxed opacity-70">
        髪だけを見るのではなく、人を見る。
      </p>
      <p className="mb-10 text-sm leading-relaxed opacity-70">
        感覚だけではなく、
        <br />
        “なぜ似合うのか”を学ぶ。
      </p>

      <div className="mb-10">
        {ELEMENTS.map((el, i) => (
          <IndexRow
            key={el}
            index={String(i + 1).padStart(2, "0")}
            label={el}
            accent
          />
        ))}
      </div>

      <Legon text={getLegonComment("goodImpression")} />
    </Section>
  );
}
