import { getLegonComment } from "@/lib/newgrad/legon";
import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Section } from "../ui/Section";
import { Legon } from "../ui/Legon";
import { Photo } from "../ui/Photo";

const ELEMENTS = [
  { label: "FACE", pos: "top-4 left-6" },
  { label: "COLOR", pos: "top-4 right-6 text-right" },
  { label: "BONE", pos: "top-[38%] left-6" },
  { label: "HAIR", pos: "top-[38%] right-6 text-right" },
  { label: "LIFESTYLE", pos: "bottom-12 left-6" },
] as const;

export function GoodImpression() {
  return (
    <Section id="good-impression" index="07" accentIndex topLine tone="ivory" pad="l">
      <div className="-mx-6 relative">
        <Photo
          slot={NEWGRAD_IMAGES.goodImpression}
          aspect="aspect-[3/4]"
          rounded="rounded-none"
        />
        {ELEMENTS.map((el, i) => (
          <span
            key={el.label}
            className={`ng-sans-en absolute ${el.pos} flex flex-col gap-1`}
          >
            <span className="rounded-full bg-[var(--ng-white)]/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-[var(--ng-hotpink)] uppercase">
              {String(i + 1).padStart(2, "0")} {el.label}
            </span>
          </span>
        ))}
      </div>

      <h2 className="ng-reveal mt-8 mb-6 text-[2rem] leading-[1.15] font-medium tracking-tight">
        似合うには、理由がある。
      </h2>

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
