/**
 * LEGOHAIR NEW GRAD - FUTURE EXPERIENCE
 * Shared type definitions for the new-grad recruiting LP.
 *
 * This project is fully independent from the existing (app)/(auth) TACIT LAB
 * product. Nothing here is imported by, or imports from, that codebase.
 */

export type TypeKey = "CREATOR" | "CONNECTOR" | "PRODUCER" | "CHALLENGER";

export const TYPE_KEYS: TypeKey[] = [
  "CREATOR",
  "CONNECTOR",
  "PRODUCER",
  "CHALLENGER",
];

export type StrengthKey =
  | "つくる"
  | "話す"
  | "気づく"
  | "考える"
  | "挑戦する"
  | "支える";

export type ColorChoice = "A" | "B";
export type FaceChoice = "A" | "B" | "C";
export type ChangeDecision = "keep" | "change";

/**
 * The single persisted state object for the whole experience.
 * No personal information is stored here - only choice keys / free-form
 * tag strings the student selected while moving through the LP.
 */
export interface NewGradState {
  // 02 STUDENT QUESTION (kept for continuity, not required by spec list)
  idealDay: string | null;

  // 03 / 04 - 30 second diagnosis
  answers: TypeKey[]; // one TypeKey per question, in question order
  diagnosisCompleted: boolean;
  primaryType: TypeKey | null;
  secondaryType: TypeKey | null;

  // 05 MY STRENGTH
  strengths: StrengthKey[]; // max 2

  // 06 PRODUCE EXPERIENCE
  firstImpression: string | null;
  focusArea: string | null;
  changedAfterContext: ChangeDecision | null;
  colorChoice: ColorChoice | null;
  faceChoice: FaceChoice | null;
  produceCompleted: boolean;

  // 09 GROWTH EXPERIENCE
  growthConcern: string | null;

  // 10 ONE DAY EXPERIENCE
  oneDayFavorite: string | null;

  // 11 SENPAI MATCH
  senpaiPreferences: string[]; // max 2
  matchedSenpai: string | null; // senpai id

  // 13 SALON TOUR
  salonInterest: string | null;

  // 14 WORK STYLE EXPERIENCE
  jobPriority: string | null;

  // 17 FINAL CTA
  finalInterest: string | null;
}

export const INITIAL_STATE: NewGradState = {
  idealDay: null,
  answers: [],
  diagnosisCompleted: false,
  primaryType: null,
  secondaryType: null,
  strengths: [],
  firstImpression: null,
  focusArea: null,
  changedAfterContext: null,
  colorChoice: null,
  faceChoice: null,
  produceCompleted: false,
  growthConcern: null,
  oneDayFavorite: null,
  senpaiPreferences: [],
  matchedSenpai: null,
  salonInterest: null,
  jobPriority: null,
  finalInterest: null,
};
