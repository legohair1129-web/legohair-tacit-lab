import type { TypeKey } from "../types";

export interface DiagnosisOption {
  key: TypeKey; // A=CREATOR, B=CONNECTOR, C=PRODUCER, D=CHALLENGER (fixed mapping)
  label: string; // "A" / "B" / "C" / "D"
  text: string;
}

export interface DiagnosisQuestion {
  id: string;
  index: number; // 1-6
  question: string;
  options: DiagnosisOption[];
}

/**
 * A/B/C/D always map to the same type across every question:
 * A = CREATOR, B = CONNECTOR, C = PRODUCER, D = CHALLENGER
 */
export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: "q1",
    index: 1,
    question: "学校で一番楽しい時間は？",
    options: [
      { key: "CREATOR", label: "A", text: "作品やスタイルをつくっている時" },
      { key: "CONNECTOR", label: "B", text: "友達と話したり、一緒に過ごしている時" },
      { key: "PRODUCER", label: "C", text: "人の髪型やファッションを見ている時" },
      { key: "CHALLENGER", label: "D", text: "コンテストやテストに向かって頑張っている時" },
    ],
  },
  {
    id: "q2",
    index: 2,
    question: "友達から相談された時、あなたは？",
    options: [
      { key: "CREATOR", label: "A", text: "もっと良くなるアイデアを考える" },
      { key: "CONNECTOR", label: "B", text: "まずじっくり話を聞く" },
      { key: "PRODUCER", label: "C", text: "その人に一番合いそうな答えを考える" },
      { key: "CHALLENGER", label: "D", text: "「やってみよう」と背中を押す" },
    ],
  },
  {
    id: "q3",
    index: 3,
    question: "美容学校で、つい夢中になるのは？",
    options: [
      { key: "CREATOR", label: "A", text: "作品づくり・デザイン" },
      { key: "CONNECTOR", label: "B", text: "友達やモデルと一緒に行う実習" },
      { key: "PRODUCER", label: "C", text: "カラー・メイク・似合わせを考える時間" },
      { key: "CHALLENGER", label: "D", text: "技術テストやタイムを縮める練習" },
    ],
  },
  {
    id: "q4",
    index: 4,
    question: "SNSでつい見てしまう美容系投稿は？",
    options: [
      { key: "CREATOR", label: "A", text: "ヘアデザイン・撮影作品" },
      { key: "CONNECTOR", label: "B", text: "美容師の日常・スタッフ動画" },
      { key: "PRODUCER", label: "C", text: "Before→After・似合わせ解説" },
      { key: "CHALLENGER", label: "D", text: "成長ストーリー・活躍している美容師" },
    ],
  },
  {
    id: "q5",
    index: 5,
    question: "就職先を選ぶなら、一番ワクワクするのは？",
    options: [
      { key: "CREATOR", label: "A", text: "自分のセンスをもっと磨けそう" },
      { key: "CONNECTOR", label: "B", text: "好きな人たちと楽しく働けそう" },
      { key: "PRODUCER", label: "C", text: "似合うを考える力が身につきそう" },
      { key: "CHALLENGER", label: "D", text: "どんどん成長して活躍できそう" },
    ],
  },
  {
    id: "q6",
    index: 6,
    question: "3年後、友達から何と言われたら一番嬉しい？",
    options: [
      { key: "CREATOR", label: "A", text: "めっちゃセンス良い美容師になったな" },
      { key: "CONNECTOR", label: "B", text: "お客様にめっちゃ愛されてるな" },
      { key: "PRODUCER", label: "C", text: "似合う髪型考えるの上手いな" },
      { key: "CHALLENGER", label: "D", text: "めっちゃ成長したな" },
    ],
  },
];
