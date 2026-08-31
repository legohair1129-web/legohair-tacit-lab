import type { TypeKey } from "./types";

/** Maps a diagnosis type to its v2 CSS custom property (display only). */
export function typeColorVar(type: TypeKey): string {
  return `var(--ng-type-${type.toLowerCase()})`;
}
