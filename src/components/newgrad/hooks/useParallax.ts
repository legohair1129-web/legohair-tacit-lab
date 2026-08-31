"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Very small scroll-linked offset (a few px), for the "2-6px layer shift"
 * effect - not a scroll-jacking parallax library. transform-only, rAF
 * throttled, passive listener, and fully inert under
 * prefers-reduced-motion (returns offset 0 and never attaches a listener).
 *
 * The ref is created by the caller with a plain `useRef()` and passed in -
 * see useReveal() for why this hook never owns or returns a ref itself.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T | null>,
  maxOffsetPx = 6
): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let ticking = false;

    function update() {
      ticking = false;
      const rect = el!.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (element top at viewport bottom) .. 1 (element bottom at viewport top)
      const progress = 1 - (rect.top + rect.height / 2) / vh;
      const clamped = Math.max(-1, Math.min(1, progress));
      setOffset(clamped * maxOffsetPx);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, maxOffsetPx]);

  return offset;
}
