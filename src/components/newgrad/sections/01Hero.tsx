import { NEWGRAD_IMAGES } from "@/lib/newgrad/data/images";
import { Photo } from "../ui/Photo";

export function Hero() {
  return (
    <section id="hero" data-section="hero" className="bg-[var(--ng-ivory)] px-6 pt-8 pb-20">
      <div className="mx-auto max-w-md">
        <div className="ng-sans-en mb-5 text-[11px] tracking-[0.24em] opacity-55 uppercase">
          LEGOHAIR — NEW GRAD 2027 — OSAKA
        </div>

        <Photo
          slot={NEWGRAD_IMAGES.hero}
          aspect="aspect-[4/5]"
          className="ng-reveal"
        />

        <div className="mt-8">
          <h1 className="text-[2.15rem] leading-[1.25] font-bold tracking-tight">
            美容師になる。
            <br />
            <span className="ng-hand inline-block -rotate-1 text-[1.15em] leading-none">
              で、終わらせない。
            </span>
          </h1>
          <p className="mt-5 max-w-[30ch] text-sm leading-relaxed opacity-65">
            技術を覚えるだけじゃない。
            <br />
            人の魅力を見つけ、
            <br />
            自分らしい美容師になろう。
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <a
            href="#diagnosis"
            className="flex w-full items-center justify-between rounded-full bg-[var(--ng-hotpink)] px-6 py-4 text-sm font-bold text-white"
          >
            未来の美容師タイプを見つける
            <span aria-hidden>→</span>
          </a>
          <a
            href="#salon-tour"
            className="text-center text-xs font-semibold tracking-wide text-[var(--ng-hotpink)] underline underline-offset-4"
          >
            LEGOHAIRを知る
          </a>
        </div>

        <div className="mt-16 flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ng-hotpink)]" />
          <span className="ng-sans-en text-[13px] font-medium tracking-[0.3em] opacity-45">
            01
          </span>
          <span className="h-px flex-1 bg-[var(--ng-line)] opacity-45" />
        </div>
      </div>
    </section>
  );
}
