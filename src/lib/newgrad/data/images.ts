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
  staff: ImageSlot;
  salon: ImageSlot;
  education: ImageSlot;
  oneDay: ImageSlot;
  senpai: ImageSlot;
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
  staff: { src: null, alt: "LEGOHAIRスタッフ", objectPosition: "top" },
  salon: { src: null, alt: "LEGOHAIRの店舗", objectPosition: "center" },
  education: { src: null, alt: "教育・研修の様子", objectPosition: "center" },
  oneDay: { src: null, alt: "1日の働き方の一場面", objectPosition: "center" },
  senpai: { src: null, alt: "先輩スタッフ", objectPosition: "top" },
};
