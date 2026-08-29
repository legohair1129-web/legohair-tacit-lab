import type { Option } from "@/lib/constants/options";

// Free-text `position` column — extend this list any time, no migration needed.
export const POSITION_OPTIONS: Option[] = [
  { value: "代表", label: "代表" },
  { value: "マネージャー", label: "マネージャー" },
  { value: "ディレクター", label: "ディレクター" },
  { value: "店長", label: "店長" },
  { value: "副店長", label: "副店長" },
  { value: "人事", label: "人事" },
  { value: "スタッフ", label: "スタッフ" },
];

// Positions that get admin (role='admin') access on creation. Everything
// else is created as role='staff'. Uses the existing profiles.role column —
// no separate permission system.
const ADMIN_POSITIONS = new Set(["代表", "マネージャー", "ディレクター", "人事"]);

export function roleForPosition(position: string): "admin" | "staff" {
  return ADMIN_POSITIONS.has(position) ? "admin" : "staff";
}

export const STATUS_OPTIONS: Option[] = [
  { value: "active", label: "在籍中" },
  { value: "inactive", label: "退職済み" },
];
