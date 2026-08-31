import type { TypeKey } from "./types";

/**
 * Measurement event names for the FUTURE EXPERIENCE LP.
 * No Meta Pixel / analytics vendor is wired up yet - this is the seam a
 * future implementation hooks into. Until then, events are only logged in
 * development so section code already calls `trackEvent(...)` everywhere
 * a real conversion point exists.
 */
export type NewGradEventName =
  | "diagnosis_start"
  | "diagnosis_complete"
  | "produce_start"
  | "produce_complete"
  | "growth_complete"
  | "one_day_complete"
  | "senpai_match"
  | "salon_tour_complete"
  | "future_card_view"
  | "salon_visit_click"
  | "line_click";

export interface NewGradEventPayload {
  primaryType?: TypeKey | null;
  secondaryType?: TypeKey | null;
  section?: string;
  [key: string]: unknown;
}

export function trackEvent(
  name: NewGradEventName,
  payload: NewGradEventPayload = {}
): void {
  // TODO(meta-pixel): forward to Meta Pixel / GA once the production
  // measurement plan is ready, e.g. window.fbq?.('trackCustom', name, payload)
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[newgrad:event] ${name}`, payload);
  }
}
