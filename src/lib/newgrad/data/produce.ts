export const FIRST_IMPRESSION_OPTIONS = [
  "やわらかい",
  "大人っぽい",
  "かわいい",
  "カッコいい",
  "ナチュラル",
  "華やか",
] as const;

export const FOCUS_AREA_OPTIONS = [
  "前髪",
  "顔周り",
  "カラー",
  "シルエット",
  "質感",
  "トータルバランス",
] as const;

/** STEP 3: information revealed about the model before the "keep / change" decision. */
export const MODEL_CONTEXT = [
  { label: "普段の服装", value: "カジュアル多め、たまにきれいめ" },
  { label: "仕事／学校", value: "大学生・接客のアルバイト中" },
  { label: "朝のセット時間", value: "10分くらい" },
  { label: "なりたい印象", value: "頑張りすぎてない、大人な感じ" },
  { label: "苦手なこと", value: "セットに時間をかけること" },
] as const;

export interface ColorOption {
  key: "A" | "B";
  label: string;
  hints: { label: string; value: string }[];
}

export const COLOR_OPTIONS: ColorOption[] = [
  {
    key: "A",
    label: "柔らかいベージュ系",
    hints: [
      { label: "肌色", value: "明るめのイエローベース" },
      { label: "瞳", value: "ライトブラウン" },
      { label: "血色", value: "ほんのりピンク寄り" },
      { label: "全体の雰囲気", value: "やわらかく、抜け感がある" },
    ],
  },
  {
    key: "B",
    label: "深みのあるブラウン系",
    hints: [
      { label: "肌色", value: "ブルーベース寄り" },
      { label: "瞳", value: "ダークブラウン" },
      { label: "血色", value: "少しクールなトーン" },
      { label: "全体の雰囲気", value: "落ち着きがあり、大人っぽい" },
    ],
  },
];

export interface FaceDesignOption {
  key: "A" | "B" | "C";
  label: string;
}

export const FACE_DESIGN_OPTIONS: FaceDesignOption[] = [
  { key: "A", label: "前髪あり" },
  { key: "B", label: "流し前髪" },
  { key: "C", label: "前髪なし" },
];

export function faceDesignSummary(choice: "A" | "B" | "C" | null): string {
  if (choice === "A") return "つくる";
  if (choice === "B") return "流す";
  if (choice === "C") return "つくらない";
  return "-";
}
