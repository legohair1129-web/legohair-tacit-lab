import type { StrengthTypeKey } from "@/lib/types/database";

export const STRENGTH_TYPE_KEYS: StrengthTypeKey[] = [
  "observer",
  "empathizer",
  "insighter",
  "designer",
  "solver",
  "connector",
  "life_designer",
  "developer",
];

// Below this normalized-score gap between 1st and 2nd place, the result is
// shown as a DUAL TYPE instead of a single CORE strength (spec section 16).
const DUAL_TYPE_THRESHOLD = 0.05;

export type ScoredOption = {
  id: string;
  scores: { strength_type_key: StrengthTypeKey; score: number }[];
};

export type ScoredQuestion = {
  id: string;
  weight: number;
  options: ScoredOption[];
};

export type StrengthResultComputation = {
  scores: Record<StrengthTypeKey, number>;
  coreTypeKey: StrengthTypeKey;
  supportTypeKey: StrengthTypeKey;
  emergingTypeKey: StrengthTypeKey;
  isDualType: boolean;
  dualPartnerTypeKey: StrengthTypeKey | null;
};

// Weighted, normalized scoring (spec section 15): for each type,
// earned = sum(option_score * question.weight) over answered questions;
// max_possible = sum(question.weight * best option_score for that type)
// over every question, computed from the same seed data so it's a fixed
// constant per type. normalized = earned / max_possible, in [0, 1].
export function computeStrengthResults(
  questions: ScoredQuestion[],
  answers: Record<string, string>
): StrengthResultComputation {
  const earned: Record<string, number> = {};
  const maxPossible: Record<string, number> = {};
  for (const key of STRENGTH_TYPE_KEYS) {
    earned[key] = 0;
    maxPossible[key] = 0;
  }

  for (const question of questions) {
    const bestPerType: Record<string, number> = {};
    for (const option of question.options) {
      for (const s of option.scores) {
        bestPerType[s.strength_type_key] = Math.max(bestPerType[s.strength_type_key] ?? 0, s.score);
      }
    }
    for (const key of STRENGTH_TYPE_KEYS) {
      maxPossible[key] += (bestPerType[key] ?? 0) * question.weight;
    }

    const chosenOptionId = answers[question.id];
    if (!chosenOptionId) continue;
    const chosenOption = question.options.find((o) => o.id === chosenOptionId);
    if (!chosenOption) continue;
    for (const s of chosenOption.scores) {
      earned[s.strength_type_key] = (earned[s.strength_type_key] ?? 0) + s.score * question.weight;
    }
  }

  const scores = {} as Record<StrengthTypeKey, number>;
  for (const key of STRENGTH_TYPE_KEYS) {
    scores[key] = maxPossible[key] > 0 ? earned[key] / maxPossible[key] : 0;
  }

  const ranked = [...STRENGTH_TYPE_KEYS].sort((a, b) => scores[b] - scores[a]);
  const [core, support, emerging] = ranked;
  const isDualType = scores[core] - scores[support] < DUAL_TYPE_THRESHOLD;

  return {
    scores,
    coreTypeKey: core,
    supportTypeKey: support,
    emergingTypeKey: emerging,
    isDualType,
    dualPartnerTypeKey: isDualType ? support : null,
  };
}
