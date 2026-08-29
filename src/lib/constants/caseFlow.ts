import type { Option } from "@/lib/constants/options";

// Tap-first replacements for the free-text visit_cycle field — value IS the
// Japanese label since visit_cycle stays a plain text column; "その他" reveals
// a free-text fallback in the step UI instead of adding a new option here.
export const VISIT_CYCLE_OPTIONS: Option[] = [
  { value: "1ヶ月以内", label: "1ヶ月以内" },
  { value: "1〜1.5ヶ月", label: "1〜1.5ヶ月" },
  { value: "2ヶ月", label: "2ヶ月" },
  { value: "2.5ヶ月", label: "2.5ヶ月" },
  { value: "3ヶ月", label: "3ヶ月" },
  { value: "4ヶ月以上", label: "4ヶ月以上" },
  { value: "わからない", label: "わからない" },
];

export const MENU_OPTIONS: Option[] = [
  { value: "cut", label: "カット" },
  { value: "color", label: "カラー" },
  { value: "perm", label: "パーマ" },
  { value: "straight", label: "縮毛矯正 / ストレート" },
  { value: "treatment", label: "トリートメント" },
  { value: "head_spa", label: "ヘッドスパ" },
  { value: "other", label: "その他" },
];

export const DISCOVERY_OPTIONS: Option[] = [
  { value: "suits_them", label: "似合うものが分かった" },
  { value: "real_concern", label: "本当の悩みが分かった" },
  { value: "new_preference", label: "新しい好みを発見した" },
  { value: "life_background", label: "生活背景が分かった" },
  { value: "desired_impression", label: "なりたい印象が分かった" },
  { value: "care_concern", label: "お手入れの悩みが分かった" },
  { value: "unspoken_wish", label: "言葉にしていない希望を感じた" },
  { value: "unclear", label: "まだよく分からなかった" },
];

export const CUSTOMER_PRIORITY_OPTIONS: Option[] = [
  { value: "looks_good", label: "似合う" },
  { value: "youthful", label: "若々しさ" },
  { value: "easy_care", label: "扱いやすさ" },
  { value: "less_damage", label: "ダメージを減らす" },
  { value: "time_saving", label: "時間をかけたくない" },
  { value: "wants_change", label: "変化したい" },
  { value: "reassurance", label: "安心したい" },
  { value: "self_identity", label: "自分らしさ" },
  { value: "leave_it_to_you", label: "お任せしたい" },
  { value: "other", label: "その他" },
];

// Same underlying values as case_reviews.forecast_accuracy ('hit'/'partial'/
// 'miss'/'unknown'), but framed as a quick self-grade rather than "was my
// prediction right" — different question, same stored enum.
export const ANSWER_CHECK_OPTIONS: Option[] = [
  { value: "hit", label: "◎ できた" },
  { value: "partial", label: "○ まあまあ" },
  { value: "miss", label: "△ できなかった" },
  { value: "unknown", label: "？ まだ分からない" },
];

export const DECISION_CATEGORY_OPTIONS: Option[] = [
  { value: "design", label: "デザイン" },
  { value: "face_line", label: "顔まわり" },
  { value: "color", label: "カラー" },
  { value: "hair_quality", label: "髪質" },
  { value: "volume", label: "ボリューム" },
  { value: "damage", label: "ダメージ" },
  { value: "home_care", label: "お手入れ" },
  { value: "technique", label: "施術方法" },
  { value: "home_care_guidance", label: "ホームケア" },
  { value: "mood", label: "気持ち / 印象" },
  { value: "other", label: "その他" },
];
