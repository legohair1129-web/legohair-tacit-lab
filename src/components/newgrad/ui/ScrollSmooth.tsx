"use client";

import { useEffect } from "react";

/**
 * Enables smooth in-page anchor scrolling only while the new-grad LP is
 * mounted, and restores the previous behavior on unmount so nothing leaks
 * into other routes.
 */
export function ScrollSmooth() {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  return null;
}
