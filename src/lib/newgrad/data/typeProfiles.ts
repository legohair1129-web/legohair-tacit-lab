import type { TypeKey } from "../types";

export interface TypeProfile {
  key: TypeKey;
  nameEn: string;
  nameJa: string; // "つくる人" etc.
  headline: string;
  description: string;
  quote: string;
}

export const TYPE_PROFILES: Record<TypeKey, TypeProfile> = {
  CREATOR: {
    key: "CREATOR",
    nameEn: "CREATOR",
    nameJa: "つくる人",
    headline: "あなたの中には、“つくる力”の芽があります。",
    description:
      "新しいものを見るとワクワクする。自分なりに考えたい。もっとカッコよく、もっと可愛くしたい。そんな感覚があなたの強みかもしれません。",
    quote: "センスは、才能だけじゃない。育てられる。",
  },
  CONNECTOR: {
    key: "CONNECTOR",
    nameEn: "CONNECTOR",
    nameJa: "つながる人",
    headline: "あなたの中には、“人とつながる力”の芽があります。",
    description:
      "話を聞く。相手の気持ちを考える。一緒にいる人を安心させる。",
    quote: "また会いたい、は美容師の技術になる。",
  },
  PRODUCER: {
    key: "PRODUCER",
    nameEn: "PRODUCER",
    nameJa: "見つける人",
    headline: "あなたの中には、“魅力を見つける力”の芽があります。",
    description:
      "人の変化によく気づく。こっちの方が似合いそう、と考える。相手に合うものを探すのが好き。",
    quote: "髪を切る前に、人を見る。",
  },
  CHALLENGER: {
    key: "CHALLENGER",
    nameEn: "CHALLENGER",
    nameJa: "伸びる人",
    headline: "あなたの中には、“伸びる力”の芽があります。",
    description:
      "目標があると燃える。昨日よりできるようになると嬉しい。やるならもっと上手くなりたい。",
    quote: "成長は、競争だけじゃない。",
  },
};

function combinationKey(a: TypeKey, b: TypeKey): string {
  return [a, b].sort().join("_");
}

/** All 6 unordered combinations of the 4 types. */
export const TYPE_COMBINATIONS: Record<string, string> = {
  [combinationKey("CREATOR", "CONNECTOR")]:
    "感性を人のために使えるタイプ。",
  [combinationKey("CREATOR", "PRODUCER")]:
    "センスと似合わせを両方使えるタイプ。",
  [combinationKey("CREATOR", "CHALLENGER")]:
    "つくることに熱中できるタイプ。",
  [combinationKey("CONNECTOR", "PRODUCER")]:
    "人をよく見て、気持ちまで考えられるタイプ。",
  [combinationKey("CONNECTOR", "CHALLENGER")]:
    "人と一緒に成長できるタイプ。",
  [combinationKey("PRODUCER", "CHALLENGER")]:
    "見つける力を、伸ばし続けられるタイプ。",
};

export function getCombinationMessage(a: TypeKey, b: TypeKey): string {
  return TYPE_COMBINATIONS[combinationKey(a, b)];
}
