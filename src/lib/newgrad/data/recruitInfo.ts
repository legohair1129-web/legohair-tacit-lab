import { WORK_STYLE_FACTS } from "./workStyle";

function fact(label: string): string {
  return (
    WORK_STYLE_FACTS.find((f) => f.label === label)?.value ?? "-"
  );
}

export interface RecruitInfoItem {
  title: string;
  body: string;
}

/** Detail values are sourced from the shared work-style config where they overlap. */
export const RECRUIT_INFO_ITEMS: RecruitInfoItem[] = [
  { title: "初任給", body: `アシスタント基本給 ${fact("アシスタント基本給")}` },
  { title: "勤務時間", body: `${fact("営業時間")}（平均退社 ${fact("平均退社")}）` },
  { title: "休日", body: `年間休日 ${fact("年間休日")}` },
  { title: "有給", body: fact("有給") },
  {
    title: "手当",
    body: `一人暮らし手当 ${fact("一人暮らし手当")} / 引越し支援 ${fact(
      "引越し支援"
    )} / 交通費 ${fact("交通費")}`,
  },
  { title: "勤務地", body: "大阪府内 各店舗（配属は面談の上で決定）" },
  { title: "応募資格", body: "美容専門学校卒業見込みの方" },
  { title: "選考方法", body: "エントリー → サロン見学 → 面談 → 内定" },
];
