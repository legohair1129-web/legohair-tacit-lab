/**
 * Fixed text for "レゴン" (Legon), the guide character.
 *
 * Version 1 uses static copy only - no OpenAI / LLM connection. Every
 * comment is keyed so a future version can swap this lookup for an async
 * AI-generated comment without changing how sections call it (see
 * `getLegonComment` in ../legon.ts).
 */
export const LEGON_COMMENTS = {
  diagnosisIntro:
    "はじめまして。レゴンです。\nまだどんな美容師になりたいか決まってなくても大丈夫。\n6つだけ質問するね。\n\n今のあなたの中にある、\n美容師としての“強みの芽”を一緒に探してみよう。",
  produceStep3:
    "でも、写真だけで決めてもいいのかな？",
  goodImpression:
    "美容師って、\n思っていたより考える仕事でしょ？",
  growthIntro:
    "最初から全部できる人はいないよ。\nだから、ひとつずついこう。",
  growth1monthA: "最初は誰でも不安だよ。だから、少しずつでいい。",
  growth1monthB: "うまく話せなくても大丈夫。聞くことから始めよう。",
  growth1monthC: "先輩も、最初はあなたと同じだったよ。",
  growth1monthD: "向いてるかどうかは、今すぐ決めなくていい。",
  growthTroubleResolved: "また少し、できるようになる。",
  futureCard:
    "これは採用結果じゃない。\n今のあなたが見つけた、\n未来を考えるヒント。",
} as const;

export type LegonCommentKey = keyof typeof LEGON_COMMENTS;
