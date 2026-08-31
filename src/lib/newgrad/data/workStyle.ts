/**
 * All work-condition numbers live here, in one place, so they can be
 * updated without touching any section markup. Nothing in the LP hard
 * codes these values directly.
 */
export const WORK_STYLE_FACTS = [
  { label: "営業時間", value: "9:00〜18:00" },
  { label: "平均退社", value: "18:30頃" },
  { label: "昼休憩", value: "30分" },
  { label: "休憩", value: "15分 × 2" },
  { label: "年間休日", value: "110日" },
  { label: "有給", value: "5日完全消化" },
  { label: "アシスタント基本給", value: "230,000円" },
  { label: "一人暮らし手当", value: "10,000円" },
  { label: "引越し支援", value: "50,000円" },
  { label: "交通費", value: "上限20,000円" },
] as const;

export const JOB_PRIORITY_OPTIONS = [
  "成長",
  "人間関係",
  "働く時間",
  "休日",
  "給与",
  "美容の内容",
] as const;
