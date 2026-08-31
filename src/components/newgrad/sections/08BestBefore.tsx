import { Section } from "../ui/Section";

export function BestBefore() {
  return (
    <Section id="best-before" index="08" tone="ink">
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-base leading-relaxed">
          お客様を綺麗にするのは、
          <br />
          今日だけじゃない。
        </p>
        <p className="text-2xl opacity-60">↓</p>
        <p className="text-base leading-relaxed">次に会う日まで考える。</p>
        <p className="text-2xl opacity-60">↓</p>
        <p className="text-sm leading-relaxed opacity-80">
          LEGOHAIRでは、
          <br />
          次回来店した時の髪まで考えて
          <br />
          技術・提案・ホームケアを組み立てます。
        </p>
        <p className="mt-4 text-3xl font-bold leading-snug">
          最高のビフォーを
          <br />
          つくる。
        </p>
      </div>
    </Section>
  );
}
