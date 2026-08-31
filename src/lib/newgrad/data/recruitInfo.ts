import { workStyleFact } from "./workStyle";

function fact(key: string): string {
  const f = workStyleFact(key);
  if (!f) return "-";
  return f.unit ? `${f.value}${f.unit}` : f.value;
}

export interface RecruitInfoItem {
  title: string;
  body: string;
}

/** Detail values are sourced from the shared work-style config where they overlap. */
export const RECRUIT_INFO_ITEMS: RecruitInfoItem[] = [
  { title: "初任給", body: `アシスタント基本給 ${fact("startingSalary")}` },
  {
    title: "勤務時間",
    body: `${fact("open")}〜${fact("close")}（平均退社 ${fact("clockOut")}頃）`,
  },
  { title: "休日", body: `年間休日 ${fact("holidays")}` },
  { title: "有給", body: `${fact("paidLeave")}完全消化` },
  {
    title: "手当",
    body: `一人暮らし手当 ${fact("livingAllowance")} / 引越し支援 ${fact(
      "relocationSupport"
    )} / 交通費 上限${fact("commuteAllowance")}`,
  },
  { title: "勤務地", body: "大阪府内 各店舗（配属は面談の上で決定）" },
  { title: "応募資格", body: "美容専門学校卒業見込みの方" },
  { title: "選考方法", body: "エントリー → サロン見学 → 面談 → 内定" },
];
