"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { INITIAL_STATE, type NewGradState } from "./types";

const STORAGE_KEY = "legohair_newgrad_state_v1";

interface NewGradContextValue {
  state: NewGradState;
  update: (patch: Partial<NewGradState>) => void;
  reset: () => void;
  hydrated: boolean;
}

const NewGradContext = createContext<NewGradContextValue | null>(null);

function loadState(): NewGradState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_STATE, ...parsed };
  } catch {
    return INITIAL_STATE;
  }
}

export function NewGradProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NewGradState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen after mount (it isn't available
    // during SSR); this is the one-time client hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Gate on the `hydrated` *state* (not a ref) so this never runs with a
    // stale `state` closure before the hydration effect's setState above
    // has actually been committed - otherwise it would overwrite the
    // just-loaded localStorage value with the still-initial state.
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage unavailable (private mode / quota) - experience still
      // works in-memory for the current page view.
    }
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<NewGradState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const value = useMemo(
    () => ({ state, update, reset, hydrated }),
    [state, update, reset, hydrated]
  );

  return (
    <NewGradContext.Provider value={value}>{children}</NewGradContext.Provider>
  );
}

export function useNewGradState(): NewGradContextValue {
  const ctx = useContext(NewGradContext);
  if (!ctx) {
    throw new Error("useNewGradState must be used within NewGradProvider");
  }
  return ctx;
}
