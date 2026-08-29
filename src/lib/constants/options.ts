// Fixed option sets from the LEGOHAIR TACIT LAB spec.
// ISSUE is intentionally NOT here — it lives in the `categories` table
// (field_key = 'issue') so admins can extend it without a code change.

export type Option = { value: string; label: string };

export const STATE_OPTIONS: (Option & { description: string })[] = [
  { value: "KEEP", label: "KEEP", description: "今を守りたい" },
  { value: "CHANGE", label: "CHANGE", description: "変わりたい" },
  { value: "FEAR", label: "FEAR", description: "変わりたいけど怖い" },
  { value: "LOST", label: "LOST", description: "自分でも分からない" },
  { value: "IDEAL", label: "IDEAL", description: "なりたい像が明確" },
  { value: "PROBLEM", label: "PROBLEM", description: "問題を解決したい" },
  { value: "TRUST", label: "TRUST", description: "任せたい" },
  { value: "TRANSITION", label: "TRANSITION", description: "生活・人生・気分が動いている" },
];

export const BEAUTY_NEED_OPTIONS: (Option & { description: string })[] = [
  { value: "DESIGN", label: "DESIGN", description: "似合う・可愛く・かっこよくなりたい" },
  { value: "CHANGE", label: "CHANGE", description: "イメチェン・気分を変えたい" },
  { value: "MAINTENANCE", label: "MAINTENANCE", description: "綺麗な状態を維持したい" },
  { value: "PROBLEM_SOLVING", label: "PROBLEM SOLVING", description: "白髪・クセ・ダメージ等を解決したい" },
  { value: "EASY_LIFE", label: "EASY LIFE", description: "朝を楽に・手入れを簡単にしたい" },
  { value: "SELF_IMAGE", label: "SELF IMAGE", description: "若く見られたい・好印象・自信を持ちたい" },
];

export const RELATIONSHIP_LEVEL_OPTIONS: (Option & { description: string })[] = [
  { value: "R0", label: "R0", description: "初回・関係性なし" },
  { value: "R1", label: "R1", description: "理解形成中" },
  { value: "R2", label: "R2", description: "信頼形成" },
  { value: "R3", label: "R3", description: "委任 — ある程度提案を任せてもらえる" },
  { value: "R4", label: "R4", description: "共創 — 美容師とお客様が一緒に未来を考えられる" },
];

export const VISIT_TYPE_OPTIONS: Option[] = [
  { value: "new", label: "新規" },
  { value: "existing", label: "既存" },
];

export const NOTICE_ITEM_OPTIONS: Option[] = [
  { value: "hair", label: "髪" },
  { value: "face", label: "顔" },
  { value: "expression", label: "表情" },
  { value: "clothes", label: "服装" },
  { value: "makeup", label: "メイク" },
  { value: "gesture", label: "仕草" },
  { value: "hair_touch", label: "髪の触り方" },
  { value: "eye_contact", label: "視線" },
  { value: "voice", label: "声" },
  { value: "words", label: "言葉" },
  { value: "pause", label: "言葉の間" },
  { value: "tension", label: "テンション" },
  { value: "visit_cycle", label: "来店周期" },
  { value: "menu", label: "予約メニュー" },
  { value: "diff_from_last", label: "前回との違い" },
  { value: "other", label: "その他" },
];

export const INTUITION_CUE_OPTIONS: Option[] = [
  { value: "last_conversation", label: "前回の会話" },
  { value: "older_conversation", label: "前々回以前の会話" },
  { value: "past_treatment", label: "過去の施術" },
  { value: "past_reaction", label: "過去の反応" },
  { value: "hair", label: "髪" },
  { value: "face", label: "顔" },
  { value: "expression", label: "表情" },
  { value: "clothes", label: "服装" },
  { value: "makeup", label: "メイク" },
  { value: "gesture", label: "仕草" },
  { value: "hair_touch", label: "髪の触り方" },
  { value: "voice", label: "声" },
  { value: "words", label: "言葉" },
  { value: "pause", label: "言葉の間" },
  { value: "tension", label: "テンション" },
  { value: "work", label: "仕事" },
  { value: "family", label: "家族" },
  { value: "event", label: "イベント" },
  { value: "season", label: "季節" },
  { value: "visit_cycle", label: "来店周期" },
  { value: "menu", label: "予約メニュー" },
  { value: "other", label: "その他" },
];

export const DISCOVER_ALIGNMENT_OPTIONS: Option[] = [
  { value: "same", label: "同じ" },
  { value: "slightly_different", label: "少し違った" },
  { value: "very_different", label: "大きく違った" },
  { value: "unknown", label: "まだ分からない" },
];

export const BEST_BEFORE_ITEM_OPTIONS: Option[] = [
  { value: "color_fade_ok", label: "色落ちしても綺麗" },
  { value: "form_kept", label: "カットフォルムが保たれている" },
  { value: "easy_morning_styling", label: "朝のスタイリングが楽" },
  { value: "damage_not_progressed", label: "ダメージが進んでいない" },
  { value: "hair_quality_improved", label: "髪質が改善している" },
  { value: "home_care_continued", label: "ホームケアを続けられている" },
  { value: "understands_what_suits", label: "自分に似合うものを理解している" },
  { value: "next_want_is_clear", label: "次にやりたいことが見えている" },
  { value: "satisfaction_higher", label: "前回より髪への満足度が高い" },
  { value: "trust_deepened", label: "美容師への信頼が深まっている" },
  { value: "other", label: "その他" },
];

export const BEST_BEFORE_ACTION_OPTIONS: Option[] = [
  { value: "pre_counseling", label: "プレカウンセリング" },
  { value: "technique", label: "技術" },
  { value: "on_counseling", label: "オンカウンセリング" },
  { value: "hospitality", label: "接客" },
  { value: "home_care_explanation", label: "ホームケア説明" },
  { value: "retail_suggestion", label: "店販提案" },
  { value: "styling_guidance", label: "スタイリング指導" },
  { value: "after_counseling", label: "アフターカウンセリング" },
  { value: "next_suggestion", label: "次回提案" },
  { value: "next_reservation", label: "次回予約" },
  { value: "other", label: "その他" },
];

export const FORECAST_ACCURACY_OPTIONS: Option[] = [
  { value: "hit", label: "当たった" },
  { value: "partial", label: "一部当たった" },
  { value: "miss", label: "外れた" },
  { value: "unknown", label: "判断できない" },
];

export const BEFORE_CONNECTION_OPTIONS: Option[] = [
  { value: "very_connected", label: "非常につながった" },
  { value: "connected", label: "つながった" },
  { value: "neutral", label: "どちらとも言えない" },
  { value: "little_connected", label: "あまりつながらなかった" },
  { value: "not_connected", label: "つながらなかった" },
];

export const AGE_GROUP_OPTIONS: Option[] = [
  { value: "10s", label: "10代" },
  { value: "20s", label: "20代" },
  { value: "30s", label: "30代" },
  { value: "40s", label: "40代" },
  { value: "50s", label: "50代" },
  { value: "60s+", label: "60代以上" },
];

export const RESEARCH_GROUP_OPTIONS: Option[] = [
  { value: "top_stylist", label: "トップスタイリスト" },
  { value: "stylist", label: "スタイリスト" },
  { value: "junior_stylist", label: "ジュニアスタイリスト" },
];

export function labelFor(options: Option[], value: string | null | undefined): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}
