"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types/database";

function slugify(label: string) {
  return (
    label
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "_")
      .replace(/^_+|_+$/g, "") || `item_${Date.now()}`
  );
}

export function CategoryManager({ fieldKey, initialItems }: { fieldKey: string; initialItems: Category[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [newLabel, setNewLabel] = useState("");
  const [saving, setSaving] = useState(false);

  async function addItem() {
    if (!newLabel.trim()) return;
    setSaving(true);
    await supabase.from("categories").insert({
      field_key: fieldKey,
      value: slugify(newLabel),
      label: newLabel.trim(),
      sort_order: (initialItems.at(-1)?.sort_order ?? 0) + 10,
    });
    setNewLabel("");
    setSaving(false);
    router.refresh();
  }

  async function toggleActive(item: Category) {
    await supabase.from("categories").update({ is_active: !item.is_active }).eq("id", item.id);
    router.refresh();
  }

  return (
    <div className="mt-4 space-y-2">
      {initialItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
        >
          <span className={`text-sm ${item.is_active ? "" : "text-muted-2 line-through"}`}>{item.label}</span>
          <button
            type="button"
            onClick={() => toggleActive(item)}
            className="text-xs text-muted underline underline-offset-2"
          >
            {item.is_active ? "非表示にする" : "表示する"}
          </button>
        </div>
      ))}

      <div className="flex gap-2 pt-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="新しい項目名"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
        />
        <button
          type="button"
          onClick={addItem}
          disabled={saving}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          追加
        </button>
      </div>
    </div>
  );
}
