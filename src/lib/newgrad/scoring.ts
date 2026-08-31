import { TYPE_KEYS, type TypeKey } from "./types";

export interface DiagnosisResult {
  primaryType: TypeKey;
  secondaryType: TypeKey;
  counts: Record<TypeKey, number>;
}

/**
 * Scores the 6 diagnosis answers into primary/secondary types.
 *
 * Tie-break rule (simple + reproducible): when two types have the same
 * score, the type that was chosen more recently (higher question index)
 * wins. This always produces a deterministic primary/secondary pair for
 * the same set of answers.
 */
export function scoreDiagnosis(answers: TypeKey[]): DiagnosisResult {
  const counts = Object.fromEntries(TYPE_KEYS.map((t) => [t, 0])) as Record<
    TypeKey,
    number
  >;
  const lastChosenAt = Object.fromEntries(
    TYPE_KEYS.map((t) => [t, -1])
  ) as Record<TypeKey, number>;

  answers.forEach((type, index) => {
    counts[type] += 1;
    lastChosenAt[type] = index;
  });

  const ranked = [...TYPE_KEYS].sort((a, b) => {
    if (counts[b] !== counts[a]) return counts[b] - counts[a];
    return lastChosenAt[b] - lastChosenAt[a];
  });

  return {
    primaryType: ranked[0],
    secondaryType: ranked[1],
    counts,
  };
}
