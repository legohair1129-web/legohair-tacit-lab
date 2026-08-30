// Hand-written types mirroring supabase/migrations/0001_init.sql.
// Kept intentionally simple (no codegen step) — update alongside migrations.

export type Role = "staff" | "admin";
export type ResearchGroup = "top_stylist" | "stylist" | "junior_stylist";
export type StaffStatus = "active" | "inactive";

export type Profile = {
  id: string;
  role: Role;
  display_name: string | null;
  store: string | null;
  position: string | null;
  stylist_years: number | null;
  research_group: ResearchGroup | null;
  email: string | null;
  employee_number: string | null;
  joined_at: string | null;
  notes: string | null;
  status: StaffStatus;
  tacit_lab_intro_seen_at: string | null;
  created_at: string;
};

export type Customer = {
  id: string;
  created_by: string;
  store: string | null;
  age_group: string | null;
  created_at: string;
};

export type DecisionOption = { label: string; text: string };

export type Case = {
  id: string;
  customer_key: string;
  staff_id: string;
  previous_case_id: string | null;

  store: string | null;
  age_group: string | null;
  visit_type: "new" | "existing" | null;
  visit_cycle: string | null;
  menu: string | null;
  menu_items: string[];
  relationship_level: "R0" | "R1" | "R2" | "R3" | "R4" | null;

  state: "KEEP" | "CHANGE" | "FEAR" | "LOST" | "IDEAL" | "PROBLEM" | "TRUST" | "TRANSITION" | null;
  state_note: string | null;
  beauty_needs: string[];
  issues: string[];

  memory_note: string | null;

  notice_items: string[];
  notice_note: string | null;

  discoveries: string[];
  customer_priority: string | null;
  decision_categories: string[];

  intuition_text: string | null;
  intuition_cue_items: string[];
  intuition_cue_note: string | null;

  discover_asked: string | null;
  discover_found: string | null;
  discover_customer_wish: string | null;
  discover_real_issue: string | null;
  discover_alignment: "same" | "slightly_different" | "very_different" | "unknown" | null;

  decision_options: DecisionOption[];
  decision_final: string | null;
  decision_reason: string | null;
  decision_not_chosen: string | null;
  decision_not_chosen_reason: string | null;

  forecast_hair_state: string | null;
  forecast_feeling: string | null;
  forecast_next_style: string | null;
  forecast_next_treatment: string | null;
  forecast_next_visit_timing: string | null;
  forecast_success_state: string | null;

  best_before_items: string[];
  best_before_actions: string[];
  best_before_note: string | null;

  is_shared: boolean;
  is_pickup: boolean;
  pickup_comment: string | null;

  created_at: string;
  updated_at: string;
};

export type CaseReview = {
  id: string;
  case_id: string;
  reviewed_by: string;

  forecast_accuracy: "hit" | "partial" | "miss" | "unknown" | null;
  before_connection:
    | "very_connected"
    | "connected"
    | "neutral"
    | "little_connected"
    | "not_connected"
    | null;
  actual_result: string | null;
  what_was_right: string | null;
  what_was_missed: string | null;
  new_notice: string | null;
  next_watch_point: string | null;
  learning: string | null;

  created_at: string;
};

export type Category = {
  id: string;
  field_key: string;
  value: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type StrengthTypeKey =
  | "observer"
  | "empathizer"
  | "insighter"
  | "designer"
  | "solver"
  | "connector"
  | "life_designer"
  | "developer";

export type StrengthType = {
  key: StrengthTypeKey;
  name_ja: string;
  name_en: string;
  description: string;
  gift_text: string;
  watch_out_text: string;
  sort_order: number;
};

export type StrengthCombinationType = {
  id: string;
  type_a_key: StrengthTypeKey;
  type_b_key: StrengthTypeKey;
  name_ja: string;
  description: string;
};

export type BenchmarkReference = {
  person: string;
  source: string;
  note: string;
};

export type MasterKnowledge = {
  id: string;
  number: number;
  title: string;
  principle: string;
  case_text: string;
  question: string;
  master_view: string;
  key_insight: string;
  observation_points: string[];
  benchmark_reference: BenchmarkReference[] | null;
  legohair_interpretation: string;
  related_strength_keys: StrengthTypeKey[];
  sort_order: number;
  created_at: string;
};

export type MasterKnowledgeResponse = {
  id: string;
  master_knowledge_id: string;
  staff_id: string;
  response_text: string;
  is_anonymous: boolean;
  created_at: string;
};

export type StrengthQuestion = {
  id: string;
  number: number;
  scenario_text: string;
  weight: number;
  sort_order: number;
};

export type StrengthOption = {
  id: string;
  question_id: string;
  option_key: "A" | "B" | "C" | "D";
  option_text: string;
};

export type StrengthOptionScore = {
  id: string;
  option_id: string;
  strength_type_key: StrengthTypeKey;
  score: number;
};

export type AssessmentStatus = "in_progress" | "completed";

export type StrengthAssessment = {
  id: string;
  staff_id: string;
  status: AssessmentStatus;
  started_at: string;
  completed_at: string | null;
};

export type StrengthAssessmentAnswer = {
  id: string;
  assessment_id: string;
  question_id: string;
  option_id: string;
  answered_at: string;
};

export type StrengthResult = {
  assessment_id: string;
  scores: Record<StrengthTypeKey, number>;
  core_type_key: StrengthTypeKey;
  support_type_key: StrengthTypeKey;
  emerging_type_key: StrengthTypeKey;
  is_dual_type: boolean;
  dual_partner_type_key: StrengthTypeKey | null;
  combination_type_id: string | null;
  computed_at: string;
};

export type TacitProfile = {
  staff_id: string;
  latest_assessment_id: string | null;
  core_type_key: StrengthTypeKey | null;
  support_type_key: StrengthTypeKey | null;
  emerging_type_key: StrengthTypeKey | null;
  is_dual_type: boolean;
  combination_type_id: string | null;
  updated_at: string;
};

type Table<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, Partial<Profile> & { id: string }>;
      customers: Table<Customer, Partial<Customer> & { created_by: string }>;
      cases: Table<Case, Partial<Case> & { customer_key: string; staff_id: string }>;
      case_reviews: Table<CaseReview, Partial<CaseReview> & { case_id: string; reviewed_by: string }>;
      categories: Table<Category, Partial<Category> & { field_key: string; value: string; label: string }>;
      strength_types: Table<StrengthType, StrengthType>;
      strength_combination_types: Table<StrengthCombinationType, Partial<StrengthCombinationType>>;
      master_knowledge: Table<MasterKnowledge, Partial<MasterKnowledge>>;
      master_knowledge_responses: Table<
        MasterKnowledgeResponse,
        Partial<MasterKnowledgeResponse> & { master_knowledge_id: string; staff_id: string; response_text: string }
      >;
      strength_questions: Table<StrengthQuestion, Partial<StrengthQuestion>>;
      strength_options: Table<StrengthOption, Partial<StrengthOption>>;
      strength_option_scores: Table<StrengthOptionScore, Partial<StrengthOptionScore>>;
      strength_assessments: Table<StrengthAssessment, Partial<StrengthAssessment> & { staff_id: string }>;
      strength_assessment_answers: Table<
        StrengthAssessmentAnswer,
        Partial<StrengthAssessmentAnswer> & { assessment_id: string; question_id: string; option_id: string }
      >;
      strength_results: Table<StrengthResult, Partial<StrengthResult> & { assessment_id: string }>;
      tacit_profiles: Table<TacitProfile, Partial<TacitProfile> & { staff_id: string }>;
    };
    Views: Record<string, never>;
    Functions: {
      admin_set_pickup: {
        Args: { p_case_id: string; p_is_pickup: boolean; p_pickup_comment: string | null };
        Returns: void;
      };
      is_admin: {
        Args: { uid: string };
        Returns: boolean;
      };
    };
  };
};
