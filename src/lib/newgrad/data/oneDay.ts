export interface OneDayMoment {
  time: string;
  label: string;
}

export const ONE_DAY_TIMELINE: OneDayMoment[] = [
  { time: "08:45", label: "出勤・準備" },
  { time: "09:00", label: "OPEN" },
  { time: "09:30", label: "先輩の仕事を見る" },
  { time: "10:30", label: "COLOR" },
  { time: "12:30", label: "LUNCH" },
  { time: "13:00", label: "午後スタート" },
  { time: "14:30", label: "先輩に質問" },
  { time: "15:30", label: "小さな失敗" },
  { time: "16:30", label: "できた" },
  { time: "17:00", label: "LAST GUEST" },
  { time: "18:00", label: "CLOSE" },
  { time: "18:15〜18:30", label: "退勤" },
];

export const ONE_DAY_GROWTH_RESULT = [
  { key: "COLOR", delta: "+1" },
  { key: "COMMUNICATION", delta: "+1" },
  { key: "OBSERVATION", delta: "+1" },
  { key: "CONFIDENCE", delta: "+1" },
] as const;

export const ONE_DAY_FAVORITE_OPTIONS = [
  "技術",
  "お客様との時間",
  "先輩との関係",
  "少し成長できたこと",
] as const;
