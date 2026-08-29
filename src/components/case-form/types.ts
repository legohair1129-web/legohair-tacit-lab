import type { DecisionOption } from "@/lib/types/database";

export type CaseFormState = {
  // CUSTOMER
  customerMode: "new" | "existing";
  existingCustomerId: string | null;
  store: string;
  ageGroup: string;
  visitType: "new" | "existing" | "";
  visitCycle: string;
  menu: string;
  relationshipLevel: "R0" | "R1" | "R2" | "R3" | "R4" | "";
  state: string;
  stateNote: string;
  beautyNeeds: string[];
  issues: string[];

  // MEMORY
  memoryNote: string;

  // NOTICE
  noticeItems: string[];
  noticeNote: string;

  // INTUITION
  intuitionText: string;
  intuitionCueItems: string[];
  intuitionCueNote: string;

  // DISCOVER
  discoverAsked: string;
  discoverFound: string;
  discoverCustomerWish: string;
  discoverRealIssue: string;
  discoverAlignment: string;

  // DECISION
  decisionOptions: DecisionOption[];
  decisionFinal: string;
  decisionReason: string;
  decisionNotChosen: string;
  decisionNotChosenReason: string;

  // FORECAST
  forecastHairState: string;
  forecastFeeling: string;
  forecastNextStyle: string;
  forecastNextTreatment: string;
  forecastNextVisitTiming: string;
  forecastSuccessState: string;

  // BEST BEFORE
  bestBeforeItems: string[];
  bestBeforeActions: string[];
  bestBeforeNote: string;

  isShared: boolean;
};

export const INITIAL_CASE_FORM_STATE: CaseFormState = {
  customerMode: "new",
  existingCustomerId: null,
  store: "",
  ageGroup: "",
  visitType: "",
  visitCycle: "",
  menu: "",
  relationshipLevel: "",
  state: "",
  stateNote: "",
  beautyNeeds: [],
  issues: [],

  memoryNote: "",

  noticeItems: [],
  noticeNote: "",

  intuitionText: "",
  intuitionCueItems: [],
  intuitionCueNote: "",

  discoverAsked: "",
  discoverFound: "",
  discoverCustomerWish: "",
  discoverRealIssue: "",
  discoverAlignment: "",

  decisionOptions: [],
  decisionFinal: "",
  decisionReason: "",
  decisionNotChosen: "",
  decisionNotChosenReason: "",

  forecastHairState: "",
  forecastFeeling: "",
  forecastNextStyle: "",
  forecastNextTreatment: "",
  forecastNextVisitTiming: "",
  forecastSuccessState: "",

  bestBeforeItems: [],
  bestBeforeActions: [],
  bestBeforeNote: "",

  isShared: true,
};

// One theme per screen (per the design spec's "1画面1テーマ" rule) — the
// CUSTOMER node in the macro flow (CUSTOMER→MEMORY→…) expands into five
// single-topic screens (basic info / state / need / issue / relationship).
export const CASE_FORM_STEPS = [
  "CUSTOMER_BASIC",
  "CUSTOMER_STATE",
  "BEAUTY_NEED",
  "ISSUE",
  "RELATIONSHIP",
  "MEMORY",
  "NOTICE",
  "INTUITION",
  "INTUITION_CUE",
  "DISCOVER",
  "DECISION",
  "FORECAST",
  "BEST_BEFORE",
] as const;

export type CaseFormStep = (typeof CASE_FORM_STEPS)[number];
