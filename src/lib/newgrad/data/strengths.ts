import type { StrengthKey } from "../types";

export const STRENGTH_OPTIONS: StrengthKey[] = [
  "つくる",
  "話す",
  "気づく",
  "考える",
  "挑戦する",
  "支える",
];

/** Display-only EN word shown big above each JP strength (v2 typography). */
export const STRENGTH_EN: Record<StrengthKey, string> = {
  つくる: "CREATE",
  話す: "TALK",
  気づく: "NOTICE",
  考える: "THINK",
  挑戦する: "CHALLENGE",
  支える: "SUPPORT",
};

export const MAX_STRENGTHS = 2;
