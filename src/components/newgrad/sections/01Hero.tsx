export function Hero() {
  return (
    <section id="hero" data-section="hero" className="relative">
      <div
        className="absolute inset-0 flex items-center justify-center bg-[var(--ng-ink)]"
        role="img"
        aria-label="HERO MOVIE"
      >
        <span className="text-xs tracking-widest text-white/50">
          [ HERO MOVIE ]
        </span>
      </div>
      <div className="relative flex min-h-[100dvh] flex-col justify-between px-6 py-10 text-white">
        <div className="text-xs tracking-[0.2em]">LEGO HAIR GROUP / OSAKA</div>

        <div className="ng-animate-in rounded-2xl bg-black/35 p-5 backdrop-blur-sm">
          <h1 className="whitespace-pre-line text-3xl font-bold leading-snug drop-shadow">
            {"美容師になる。\nで、終わらせない。"}
          </h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed opacity-90">
            {"技術を覚えるだけじゃない。\n人の魅力を見つけ、\n自分らしい美容師になろう。"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="#diagnosis"
            className="w-full rounded-full bg-[var(--ng-pop)] px-6 py-4 text-center text-sm font-bold tracking-wide text-white shadow-lg"
          >
            30秒で未来の美容師タイプを診断する
          </a>
          <a
            href="#salon-tour"
            className="w-full rounded-full border border-white/70 px-6 py-4 text-center text-sm font-bold tracking-wide text-white"
          >
            LEGOHAIRを見てみる
          </a>
        </div>
      </div>
    </section>
  );
}
