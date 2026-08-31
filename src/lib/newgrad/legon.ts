import { LEGON_COMMENTS, type LegonCommentKey } from "./data/legonComments";

/**
 * Accessor for Legon's comments. V1 just reads the static map by key, so a
 * future version can replace the body with an API call (e.g. to generate a
 * personalized comment) without changing any call site.
 */
export function getLegonComment(key: LegonCommentKey): string {
  return LEGON_COMMENTS[key];
}
