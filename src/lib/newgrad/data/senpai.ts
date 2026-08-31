import type { TypeKey } from "../types";

export const SENPAI_TAG_OPTIONS = [
  "人見知りする方",
  "技術に自信がない",
  "就職先選びで迷っている",
  "地方から大阪に出たい",
  "美容師に向いているか少し不安",
  "似合わせを学びたい",
  "好きなことを仕事にしたい",
  "成長できる環境を選びたい",
] as const;

export const MAX_SENPAI_TAGS = 2;

export interface SenpaiVideoQuestion {
  key: string;
  question: string;
}

export const SENPAI_VIDEO_QUESTIONS: SenpaiVideoQuestion[] = [
  { key: "worry", question: "美容学生の頃何に悩んでた？" },
  { key: "why", question: "LEGOHAIRを選んだ理由は？" },
  { key: "change", question: "入社して一番変わったことは？" },
  { key: "future", question: "今どんな美容師になりたい？" },
];

export interface Senpai {
  id: string;
  name: string;
  joinedYear: string;
  school: string;
  type: TypeKey;
  story: string;
  tags: string[]; // subset of SENPAI_TAG_OPTIONS this senpai resonates with
}

export const SENPAI_LIST: Senpai[] = [
  {
    id: "senpai-01",
    name: "STAFF A",
    joinedYear: "2023年入社",
    school: "大阪美容専門学校",
    type: "CONNECTOR",
    story: "人見知りだったけど、お客様との会話が好きになった。",
    tags: ["人見知りする方", "美容師に向いているか少し不安"],
  },
  {
    id: "senpai-02",
    name: "STAFF B",
    joinedYear: "2022年入社",
    school: "OSAKA BEAUTY ART",
    type: "PRODUCER",
    story: "似合わせを考えるのが好きで、日々研究中。",
    tags: ["似合わせを学びたい", "成長できる環境を選びたい"],
  },
  {
    id: "senpai-03",
    name: "STAFF C",
    joinedYear: "2021年入社",
    school: "近畿美容専門学校",
    type: "CREATOR",
    story: "作品づくりが好きで、コンテストにも挑戦中。",
    tags: ["好きなことを仕事にしたい", "技術に自信がない"],
  },
  {
    id: "senpai-04",
    name: "STAFF D",
    joinedYear: "2024年入社",
    school: "福岡ビューティー専門学校",
    type: "CHALLENGER",
    story: "地方から大阪に出て、毎日成長を感じている。",
    tags: ["地方から大阪に出たい", "成長できる環境を選びたい"],
  },
  {
    id: "senpai-05",
    name: "STAFF E",
    joinedYear: "2023年入社",
    school: "京都美容芸術専門学校",
    type: "PRODUCER",
    story: "就職先選びでかなり迷ったからこそ話せることがある。",
    tags: ["就職先選びで迷っている", "似合わせを学びたい"],
  },
  {
    id: "senpai-06",
    name: "STAFF F",
    joinedYear: "2020年入社",
    school: "大阪美容専門学校",
    type: "CONNECTOR",
    story: "技術に自信がなかったけど、支え合える環境で続けられた。",
    tags: ["技術に自信がない", "人見知りする方"],
  },
];

/**
 * Very simple, transparent match scoring:
 * - +2 for each selected preference tag the senpai also has
 * - +2 if the senpai's type matches the student's primaryType
 * - +1 if the senpai's type matches the student's secondaryType
 * Score is clamped and expressed as a percentage for display.
 */
export function matchSenpai(
  selectedTags: string[],
  primaryType: TypeKey | null,
  secondaryType: TypeKey | null
): { senpai: Senpai; percent: number }[] {
  const scored = SENPAI_LIST.map((senpai) => {
    let score = 0;
    const maxScore = selectedTags.length * 2 + 3;

    selectedTags.forEach((tag) => {
      if (senpai.tags.includes(tag)) score += 2;
    });
    if (primaryType && senpai.type === primaryType) score += 2;
    if (secondaryType && senpai.type === secondaryType) score += 1;

    const base = maxScore > 0 ? score / maxScore : 0;
    // Floor at 55% so every senpai still reads as an approachable match.
    const percent = Math.round(55 + base * 45);

    return { senpai, percent: Math.min(percent, 99) };
  });

  return scored.sort((a, b) => b.percent - a.percent);
}
