/**
 * Central image registry for the new-grad LP.
 *
 * Every photo/video slot on the page is a key here, not a path hardcoded
 * into a component. All current values are `src: null` (temporary assets
 * are still being shot - real photos land end of September) - components
 * fall back to a styled placeholder whenever `src` is null. Swapping to
 * production photography is then a one-line edit per key, here only.
 */
export interface ImageSlot {
  src: string | null;
  alt: string;
  /** CSS object-position, mobile-first. */
  objectPosition?: string;
  /** CSS object-position override from the md: breakpoint up. */
  objectPositionMd?: string;
}

export interface NewGradImageConfig {
  hero: ImageSlot;
  /** One photo per 02 QUESTION choice card, in option order. */
  question: ImageSlot[];
  diagnosis: ImageSlot;
  strength: ImageSlot;
  /** 06 PRODUCE EXPERIENCE - model before the produce flow. */
  beforeModel: ImageSlot;
  /** 06 PRODUCE EXPERIENCE - model after the produce flow. */
  afterModel: ImageSlot;
  /** 07 - a person, for "似合うには理由がある" (a viewpoint, not a menu). */
  goodImpression: ImageSlot;
  /** 08 最高のビフォー - a counseling/design moment, not a before/after ad shot. */
  bestBefore: ImageSlot;
  /** 08 最高のビフォー - a small second photo overlapping the first, for the collage. */
  bestBeforeDetail: ImageSlot;
  staff: ImageSlot;
  salon: ImageSlot;
  education: ImageSlot;
  /** One photo per 09 GROWTH EXPERIENCE year milestone, in order. */
  growthMilestones: ImageSlot[];
  /** One photo per alternating 10 ONE DAY EXPERIENCE timeline moment. */
  oneDay: ImageSlot[];
  senpai: ImageSlot;
  /** One photo per displayed 11 SENPAI MATCH card, cycled by rank position. */
  senpaiPhotos: ImageSlot[];
  /** ENDING - a single quiet photo, not a call-to-action visual. */
  ending: ImageSlot;
}

export const NEWGRAD_IMAGES: NewGradImageConfig = {
  hero: { src: null, alt: "LEGOHAIRのサロンで働くスタッフ", objectPosition: "center" },
  question: [
    { src: null, alt: "好きなデザインをつくる美容師のイメージ写真", objectPosition: "center" },
    { src: null, alt: "お客様に接客する美容師のイメージ写真", objectPosition: "center" },
    { src: null, alt: "センスを磨く美容師のイメージ写真", objectPosition: "center" },
    { src: null, alt: "仲間と働く美容師のイメージ写真", objectPosition: "center" },
    { src: null, alt: "お客様に必要とされる美容師のイメージ写真", objectPosition: "center" },
  ],
  diagnosis: { src: null, alt: "診断イメージ写真", objectPosition: "center" },
  strength: { src: null, alt: "スタッフの自然な表情", objectPosition: "center" },
  beforeModel: { src: null, alt: "プロデュース前のモデル写真", objectPosition: "center" },
  afterModel: { src: null, alt: "プロデュース後のモデル写真", objectPosition: "center" },
  goodImpression: { src: null, alt: "カウンセリングをする美容師のイメージ写真", objectPosition: "center" },
  bestBefore: { src: null, alt: "デザイン・ケアを考える美容師のイメージ写真", objectPosition: "center" },
  bestBeforeDetail: { src: null, alt: "デザインを施す手元のクローズアップ", objectPosition: "center" },
  staff: { src: null, alt: "LEGOHAIRスタッフ", objectPosition: "top" },
  salon: { src: null, alt: "LEGOHAIRの店舗", objectPosition: "center" },
  education: { src: null, alt: "教育・研修の様子", objectPosition: "center" },
  growthMilestones: [
    { src: null, alt: "1年目、できないことを知る様子", objectPosition: "center" },
    { src: null, alt: "2年目、得意を見つける様子", objectPosition: "center" },
    { src: null, alt: "3年目、自分らしく働く様子", objectPosition: "center" },
  ],
  oneDay: [
    { src: null, alt: "出勤・準備の様子", objectPosition: "center" },
    { src: null, alt: "カラー施術の様子", objectPosition: "center" },
    { src: null, alt: "先輩に質問する様子", objectPosition: "center" },
  ],
  senpai: { src: null, alt: "先輩スタッフ", objectPosition: "top" },
  senpaiPhotos: [
    { src: null, alt: "先輩スタッフのポートレート", objectPosition: "top" },
    { src: null, alt: "先輩スタッフのポートレート", objectPosition: "top" },
    { src: null, alt: "先輩スタッフのポートレート", objectPosition: "top" },
  ],
  ending: { src: null, alt: "落ち着いた雰囲気のサロンスタッフ", objectPosition: "center" },
};
