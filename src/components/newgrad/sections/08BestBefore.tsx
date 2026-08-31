import { Section } from "../ui/Section";

export function BestBefore() {
  return (
    <Section id="best-before" index="08" tone="ink" pad="l" align="center">
      <div className="ng-reveal flex flex-col items-center gap-8">
        <p className="text-lg leading-relaxed opacity-80">
          今日、
          <br />
          きれいにする。
          <br />
          だけじゃない。
        </p>
        <p className="ng-sans-en text-lg opacity-30">↓</p>
        <p className="text-lg leading-relaxed opacity-80">
          次に会う日まで、
          <br />
          デザインする。
        </p>
        <p className="ng-sans-en text-lg opacity-30">↓</p>
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
