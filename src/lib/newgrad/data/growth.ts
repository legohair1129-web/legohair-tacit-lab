import type { LegonCommentKey } from "./legonComments";

export interface GrowthConcernOption {
  key: "A" | "B" | "C" | "D";
  text: string;
  legonKey: LegonCommentKey;
}

export const GROWTH_CONCERN_OPTIONS: GrowthConcernOption[] = [
  { key: "A", text: "技術についていけるか", legonKey: "growth1monthA" },
  { key: "B", text: "お客様とうまく話せるか", legonKey: "growth1monthB" },
  { key: "C", text: "先輩とうまくやれるか", legonKey: "growth1monthC" },
  { key: "D", text: "美容師に向いているか", legonKey: "growth1monthD" },
];

export const GROWTH_ELEMENTS = [
  { key: "TECHNIQUE", label: "TECHNIQUE", ja: "技術" },
  { key: "COMMUNICATION", label: "COMMUNICATION", ja: "接客" },
  { key: "OBSERVATION", label: "OBSERVATION", ja: "似合わせ" },
  { key: "TEAMWORK", label: "TEAMWORK", ja: "チームワーク" },
] as const;

/** Half-year growth meter - UI decoration only, not a real score. */
export const GROWTH_METER = [
  { key: "technique", label: "技術", level: 2, max: 4 },
  { key: "service", label: "接客", level: 3, max: 4 },
  { key: "matching", label: "似合わせ", level: 2, max: 4 },
  { key: "confidence", label: "自信", level: 3, max: 4 },
] as const;

export const GROWTH_TROUBLES = [
  "技術ができない",
  "モデルが見つからない",
  "接客で緊張する",
  "友達より遅れている気がする",
] as const;

export const GROWTH_TROUBLE_ACTIONS = [
  "相談する",
  "教えてもらう",
  "考える",
  "もう一度やる",
] as const;

/** Chapter-style year markers - large numerals, one line of copy each. */
export const GROWTH_TIMELINE = [
  { year: "01", line: "まず、できないことを知る。" },
  { year: "02", line: "得意を見つける。" },
  { year: "03", line: "自分らしい美容師になる。" },
] as const;
