import Image from "next/image";
import type { ImageSlot } from "@/lib/newgrad/data/images";

interface PhotoProps {
  slot: ImageSlot;
  aspect?: string; // Tailwind aspect-ratio class, e.g. "aspect-[4/5]"
  rounded?: string; // Tailwind rounding class
  className?: string;
  sizes?: string;
}

/**
 * Renders a real photo once `slot.src` is set (production assets land
 * end of September), and a warm, magazine-style placeholder until then -
 * never a plain grey box. Reserves its aspect ratio either way so nothing
 * shifts (CLS) when photos are swapped in.
 *
 * object-position can differ from the md: breakpoint up via
 * `objectPositionMd`, per slot, for art-directing crops separately on
 * mobile vs. desktop once real photography exists.
 */
export function Photo({
  slot,
  aspect = "aspect-[4/5]",
  // Phase 4 (mode refinement): a small hint of softness, not a rounded
  // "card" - the site reads rectangular/editorial rather than soft/app-like.
  rounded = "rounded-[4px]",
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
}: PhotoProps) {
  const style = {
    "--ng-op": slot.objectPosition ?? "center",
    "--ng-op-md": slot.objectPositionMd ?? slot.objectPosition ?? "center",
  } as React.CSSProperties;

  if (slot.src) {
    return (
      <div
        className={`relative overflow-hidden ${aspect} ${rounded} ${className}`}
        style={style}
      >
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          className="object-cover [object-position:var(--ng-op)] md:[object-position:var(--ng-op-md)]"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={slot.alt}
      style={style}
      className={`relative overflow-hidden ${aspect} ${rounded} ${className} bg-gradient-to-br from-[var(--ng-pink-tint)] via-[var(--ng-ivory-2)] to-[var(--ng-ivory)]`}
    >
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--ng-ink)]/15 text-sm opacity-40"
      >
        ◎
      </span>
      <span className="ng-sans-en absolute bottom-3 left-3 text-[10px] font-medium tracking-[0.14em] uppercase opacity-40">
        photo
      </span>
    </div>
  );
}
