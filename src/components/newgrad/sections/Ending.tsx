import { Section } from "../ui/Section";

export function Ending() {
  return (
    <Section id="ending" tone="ink" className="text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-xs tracking-[0.3em] opacity-70">LEGOHAIR</div>
        <p className="whitespace-pre-line text-base leading-relaxed">
          {"人の魅力を引き出し、\n自信を創る。"}
        </p>
        <p className="text-3xl font-bold">次は、あなたの番。</p>
        <div className="mt-4 text-xs tracking-[0.3em] opacity-70">
          LEGOHAIR NEW GRAD
        </div>
      </div>
    </Section>
  );
}
