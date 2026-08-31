import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Section } from "../ui/Section";
import { Photo } from "../ui/Photo";

const PROCESS = ["BEFORE", "DESIGN / CARE / COUNSELING", "NEXT BEFORE"];

export function BestBefore() {
  return (
    <Section
      id="best-before"
      index="08"
      accentIndex
      topLine
      tone="pink-tint"
      pad="l"
      align="center"
    >
      <div className="ng-reveal flex flex-col items-center gap-8">
        <p className="text-lg leading-relaxed opacity-80">
          今日、
          <br />
          きれいにする。
          <br />
          だけじゃない。
        </p>
        <p className="text-lg text-[var(--ng-hotpink)]">↓</p>
        <p className="text-lg leading-relaxed opacity-80">
          次に会う日まで、
          <br />
          デザインする。
        </p>

        <Photo
          slot={NEWGRAD_IMAGES.bestBefore}
          aspect="aspect-[4/5]"
          className="w-[80%] -rotate-1"
        />

        <div className="ng-sans-en flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] text-[var(--ng-ink)] opacity-45 uppercase">
          {PROCESS.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              {i > 0 && <span className="text-[var(--ng-hotpink)] opacity-100">→</span>}
              {step}
            </span>
          ))}
        </div>

        <p className="ng-serif max-w-[16ch] text-4xl leading-[1.2] font-medium">
          最高のビフォーを
          <br />
          つくる。
        </p>
        <p className="mt-4 max-w-[30ch] text-xs leading-relaxed opacity-45">
          LEGOHAIRでは、次回来店した時の髪まで考えて技術・提案・ホームケアを組み立てます。
        </p>
      </div>
    </Section>
  );
}
