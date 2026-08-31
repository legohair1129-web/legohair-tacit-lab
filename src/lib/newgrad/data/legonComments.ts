/**
 * Fixed text for "レゴン" (Legon), the guide character.
 *
 * Version 1 uses static copy only - no OpenAI / LLM connection. Every
 * comment is keyed so a future version can swap this lookup for an async
 * AI-generated comment without changing how sections call it (see
 * `getLegonComment` in ../legon.ts).
 *
 * v2 note: Legon reads as a minimal mark ("N") with one short line, never
 * a chat bubble - copy here is intentionally terse.
 */
export const LEGON_COMMENTS = {
  diagnosisIntro: "正解はないよ。",
  produceStep3: "でも、写真だけで決めていい？",
  goodImpression: "思っていたより、考える仕事でしょ？",
  growthIntro: "最初から、全部できなくていい。",
  growth1monthA: "最初は誰でも不安だよ。だから、少しずつでいい。",
  growth1monthB: "うまく話せなくても大丈夫。聞くことから始めよう。",
  growth1monthC: "先輩も、最初はあなたと同じだったよ。",
  growth1monthD: "向いてるかどうかは、今すぐ決めなくていい。",
  growthTroubleResolved: "また少し、できるようになる。",
  realBeautifulReveal: "ちょっと、見方が変わった？",
  futureCard: "これは、未来を考えるヒント。",
} as const;

export type LegonCommentKey = keyof typeof LEGON_COMMENTS;
