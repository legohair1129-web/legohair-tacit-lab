"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RESEARCH_GROUP_OPTIONS } from "@/lib/constants/options";
import type { Profile } from "@/lib/types/database";

export function StaffGroupRow({
  profile,
}: {
  profile: Pick<Profile, "id" | "display_name" | "store" | "role" | "research_group">;
}) {
  const supabase = createClient();
  const [group, setGroup] = useState(profile.research_group ?? "");
  const [saving, setSaving] = useState(false);

  async function handleChange(value: string) {
    setGroup(value);
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ research_group: (value || null) as Profile["research_group"] })
      .eq("id", profile.id);
    setSaving(false);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <div>
        <p className="text-sm font-medium">{profile.display_name ?? profile.id}</p>
        <p className="text-xs text-muted">
          {profile.store ?? "店舗未設定"} ・ {profile.role}
        </p>
      </div>
      <select
        value={group}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
      >
        <option value="">未設定</option>
        {RESEARCH_GROUP_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
