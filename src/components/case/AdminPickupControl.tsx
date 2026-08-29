"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminPickupControl({
  caseId,
  initialIsPickup,
  initialComment,
}: {
  caseId: string;
  initialIsPickup: boolean;
  initialComment: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [isPickup, setIsPickup] = useState(initialIsPickup);
  const [comment, setComment] = useState(initialComment ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await supabase.rpc("admin_set_pickup", {
      p_case_id: caseId,
      p_is_pickup: isPickup,
      p_pickup_comment: comment || null,
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="mt-6 rounded-lg border border-accent-soft bg-accent-soft/30 p-4">
      <p className="text-xs font-medium tracking-wide text-accent">ADMIN / PICKUP CASE</p>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPickup}
          onChange={(e) => setIsPickup(e.target.checked)}
          className="h-5 w-5 accent-foreground"
        />
        PICKUP CASEに指定する
      </label>

      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="考える価値のあるポイントを一言（任意）"
        className="mt-3 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-3 rounded-lg bg-foreground px-5 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {saving ? "保存中…" : "保存"}
      </button>
    </div>
  );
}
