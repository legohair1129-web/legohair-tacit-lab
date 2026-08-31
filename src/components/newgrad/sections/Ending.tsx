import { Section } from "../ui/Section";

export function Ending() {
  return (
    <Section id="ending" tone="ink" pad="l" align="center">
      <div className="ng-reveal flex flex-col items-center gap-8">
        <div className="ng-sans-en text-xs tracking-[0.3em] opacity-55">
          LEGOHAIR
        </div>
        <p className="text-base leading-relaxed opacity-80">
          人の魅力を引き出し、
          <br />
          自信を創る。
        </p>
        <p className="ng-serif max-w-[16ch] text-3xl leading-[1.25] font-medium">
          NEXT,
          <br />
          IT&apos;S YOUR TURN.
        </p>
        <div className="ng-sans-en mt-4 text-[11px] tracking-[0.3em] opacity-40">
          LEGOHAIR NEW GRAD
        </div>
      </div>
    </Section>
  );
}
