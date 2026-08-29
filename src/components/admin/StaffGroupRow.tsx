"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RESEARCH_GROUP_OPTIONS } from "@/lib/constants/options";
import { STATUS_OPTIONS } from "@/lib/constants/staff";
import type { Profile } from "@/lib/types/database";

type RowProfile = Pick<
  Profile,
  | "id"
  | "display_name"
  | "email"
  | "store"
  | "position"
  | "role"
  | "research_group"
  | "status"
  | "created_at"
>;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" });
}

export function StaffGroupRow({ profile }: { profile: RowProfile }) {
  const supabase = createClient();
  const [group, setGroup] = useState(profile.research_group ?? "");
  const [status, setStatus] = useState(profile.status);
  const [saving, setSaving] = useState(false);

  async function handleGroupChange(value: string) {
    setGroup(value);
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ research_group: (value || null) as Profile["research_group"] })
      .eq("id", profile.id);
    setSaving(false);
  }

  async function handleStatusChange(value: string) {
    setStatus(value as Profile["status"]);
    setSaving(true);
    await supabase.from("profiles").update({ status: value as Profile["status"] }).eq("id", profile.id);
    setSaving(false);
  }

  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{profile.display_name ?? "(氏名未設定)"}</p>
          <p className="mt-0.5 text-xs text-muted">{profile.email ?? "—"}</p>
          <p className="mt-1 text-xs text-muted-2">
            {profile.store ?? "店舗未設定"}
            {profile.position ? ` ・ ${profile.position}` : ""} ・ {profile.role}
          </p>
          <p className="mt-0.5 text-xs text-muted-2">登録日 {formatDate(profile.created_at)}</p>
        </div>

        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={saving}
          className="shrink-0 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <span className="text-xs text-muted">RESEARCH group</span>
        <select
          value={group}
          onChange={(e) => handleGroupChange(e.target.value)}
          disabled={saving}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs"
        >
          <option value="">未設定</option>
          {RESEARCH_GROUP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
