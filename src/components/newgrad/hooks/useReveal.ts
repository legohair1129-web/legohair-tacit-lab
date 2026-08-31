"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Scroll-triggered reveal, IntersectionObserver-driven, fires once.
 * The ref is created by the caller with a plain `useRef()` and passed in -
 * this hook only decides *when* the reveal plays via the returned boolean,
 * never owns or returns the ref itself (a hook returning a ref bundled
 * with other reactive state trips the React Compiler's ref-immutability
 * checks). Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   const inView = useReveal(ref);
 *   <div ref={ref} className={`ng-io-clip ${inView ? "ng-in" : ""}`}>
 *
 * Under `prefers-reduced-motion` the CSS never hides the element in the
 * first place, so a false `inView` before the observer fires is never
 * visible as a flash of missing content - this hook only decides *when*
 * the reveal plays, the stylesheet decides *whether* it plays at all.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T | null>,
  threshold = 0.15
): boolean {
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, inView]);

  return inView;
}
