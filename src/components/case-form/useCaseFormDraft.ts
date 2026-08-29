"use client";

import { useEffect, useState } from "react";
import { INITIAL_CASE_FORM_STATE, type CaseFormState } from "@/components/case-form/types";

const DRAFT_KEY = "legohair-tacit-lab:case-draft:v1";

// Persists the in-progress CASE form to sessionStorage so an iPhone Safari
// tab suspend (staff switching apps mid-shift) doesn't lose the draft.
export function useCaseFormDraft() {
  const [state, setState] = useState<CaseFormState>(INITIAL_CASE_FORM_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time read of client-only storage to hydrate past what SSR could
    // render; the `hydrated` gate keeps the caller from rendering
    // pre-hydration content that would mismatch this update.
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState({ ...INITIAL_CASE_FORM_STATE, ...JSON.parse(raw) });
    } catch {
      // ignore malformed/blocked storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch {
      // ignore quota/blocked storage
    }
  }, [state, hydrated]);

  function patch(update: Partial<CaseFormState>) {
    setState((prev) => ({ ...prev, ...update }));
  }

  function clearDraft() {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    setState(INITIAL_CASE_FORM_STATE);
  }

  return { state, patch, clearDraft, hydrated };
}
