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
  relationship_level: "R0" | "R1" | "R2" | "R3" | "R4" | null;

  state: "KEEP" | "CHANGE" | "FEAR" | "LOST" | "IDEAL" | "PROBLEM" | "TRUST" | "TRANSITION" | null;
  state_note: string | null;
  beauty_needs: string[];
  issues: string[];

  memory_note: string | null;

  notice_items: string[];
  notice_note: string | null;

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
