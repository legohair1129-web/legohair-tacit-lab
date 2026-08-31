export function Hero() {
  return (
    <section id="hero" data-section="hero" className="relative">
      <div
        className="absolute inset-0 bg-[var(--ng-ink)]"
        role="img"
        aria-label="HERO VIDEO PLACEHOLDER"
      >
        <span className="ng-sans-en absolute top-6 right-6 text-[10px] tracking-[0.2em] text-white/30 uppercase">
          video — hero
        </span>
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="relative flex min-h-[100svh] flex-col justify-between px-6 py-10 text-white">
        <div className="ng-sans-en text-[11px] tracking-[0.28em] text-white/70 uppercase">
          LEGOHAIR — NEW GRAD 2027 — OSAKA
        </div>

        <div className="ng-reveal mb-2">
          <h1 className="mb-6 text-[2.15rem] leading-[1.25] font-medium tracking-tight">
            美容師になる。
            <br />
            で、終わらせない。
          </h1>
          <p className="max-w-[30ch] text-sm leading-relaxed text-white/75">
            技術を覚えるだけじゃない。
            <br />
            人の魅力を見つけ、
            <br />
            自分らしい美容師になろう。
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <a
            href="#diagnosis"
            className="ng-sans-en flex items-center justify-between border-b border-white/70 pb-3 text-xs font-semibold tracking-[0.18em] uppercase"
          >
            未来の美容師タイプを見つける
            <span aria-hidden>→</span>
          </a>
          <a
            href="#salon-tour"
            className="ng-sans-en text-xs tracking-[0.18em] text-white/60 uppercase underline underline-offset-4"
          >
            LEGOHAIRを知る
          </a>
        </div>
      </div>
    </section>
  );
}
