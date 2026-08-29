export type CaseFormState = {
  // customer selection
  customerMode: "new" | "existing";
  existingCustomerId: string | null;

  // customer basics
  store: string;
  ageGroup: string;
  visitType: "new" | "existing" | "";
  visitCycle: string;
  menuItems: string[];

  // discover
  discoveries: string[];
  customerPriority: string;
  observationNote: string;

  // design
  decisionCategories: string[];
  finalProposal: string;
  proposalReason: string;

  // next before
  nextBefore: string;

  isShared: boolean;
};

export const INITIAL_CASE_FORM_STATE: CaseFormState = {
  customerMode: "new",
  existingCustomerId: null,

  store: "",
  ageGroup: "",
  visitType: "",
  visitCycle: "",
  menuItems: [],

  discoveries: [],
  customerPriority: "",
  observationNote: "",

  decisionCategories: [],
  finalProposal: "",
  proposalReason: "",

  nextBefore: "",

  isShared: true,
};

// One theme per screen, grouped by PHASE (KNOW / DISCOVER / DESIGN / NEXT
// BEFORE). ANSWER_CHECK is conditional — case/new/page.tsx skips it when
// there's nothing to review.
export const CASE_FORM_STEPS = [
  "CUSTOMER_SELECT",
  "ANSWER_CHECK",
  "CUSTOMER_BASICS",
  "DISCOVER",
  "DESIGN",
  "NEXT_BEFORE",
] as const;

export type CaseFormStep = (typeof CASE_FORM_STEPS)[number];
