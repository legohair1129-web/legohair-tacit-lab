/**
 * All work-condition numbers live here, in one place, so they can be
 * updated without touching any section markup. Nothing in the LP hard
 * codes these values directly - both the big-number WORK STYLE display and
 * the RECRUIT INFO accordion read from this one array (see recruitInfo.ts).
 */
export interface WorkStyleFact {
  key: string;
  value: string; // shown big
  unit?: string; // shown small, next to value
  label: string; // EN caption
  note: string; // JP context
}

export const WORK_STYLE_FACTS: WorkStyleFact[] = [
  { key: "open", value: "09:00", label: "OPEN", note: "営業開始" },
  { key: "close", value: "18:00", label: "CLOSE", note: "営業終了" },
  { key: "clockOut", value: "18:30", label: "AVG. CLOCK-OUT", note: "平均退社" },
  { key: "lunchBreak", value: "30", unit: "分", label: "LUNCH BREAK", note: "昼休憩" },
  { key: "shortBreaks", value: "15 × 2", unit: "分", label: "SHORT BREAKS", note: "休憩" },
  { key: "holidays", value: "110", unit: "日", label: "HOLIDAYS / YEAR", note: "年間休日" },
  { key: "paidLeave", value: "5", unit: "日", label: "PAID LEAVE", note: "完全消化" },
  {
    key: "startingSalary",
    value: "230,000",
    unit: "円",
    label: "STARTING SALARY",
    note: "アシスタント基本給",
  },
  {
    key: "livingAllowance",
    value: "10,000",
    unit: "円",
    label: "LIVING ALLOWANCE",
    note: "一人暮らし手当",
  },
  {
    key: "relocationSupport",
    value: "50,000",
    unit: "円",
    label: "RELOCATION SUPPORT",
    note: "引越し支援",
  },
  {
    key: "commuteAllowance",
    value: "20,000",
    unit: "円",
    label: "COMMUTE ALLOWANCE",
    note: "交通費上限",
  },
];

export function workStyleFact(key: string): WorkStyleFact | undefined {
  return WORK_STYLE_FACTS.find((f) => f.key === key);
}

export const JOB_PRIORITY_OPTIONS = [
  "成長",
  "人間関係",
  "働く時間",
  "休日",
  "給与",
  "美容の内容",
] as const;
