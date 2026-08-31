import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Section } from "../ui/Section";
import { Photo } from "../ui/Photo";

export function Ending() {
  return (
    <Section id="ending" tone="ivory" pad="l" align="center" topLine>
      <div className="ng-reveal flex flex-col items-center gap-8">
        <div className="ng-sans-en text-xs tracking-[0.3em] opacity-50">
          LEGOHAIR
        </div>

        <Photo
          slot={NEWGRAD_IMAGES.ending}
          aspect="aspect-[4/5]"
          className="w-[72%]"
        />

        <p className="text-base leading-relaxed opacity-75">
          人の魅力を引き出し、
          <br />
          自信を創る。
        </p>
        <p className="ng-serif max-w-[16ch] text-3xl leading-[1.25] font-medium">
          NEXT,
          <br />
          IT&apos;S YOUR TURN.
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--ng-hotpink)]" aria-hidden />
        <div className="ng-sans-en text-[11px] tracking-[0.3em] opacity-40">
          LEGOHAIR NEW GRAD
        </div>
      </div>
    </Section>
  );
}
