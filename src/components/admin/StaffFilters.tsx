"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function StaffFilters({ storeOptions }: { storeOptions: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin/staff?${params.toString()}`);
  }

  return (
    <div className="mt-5 flex gap-2">
      <input
        type="text"
        defaultValue={searchParams.get("q") ?? ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") setParam("q", e.currentTarget.value);
        }}
        onBlur={(e) => setParam("q", e.currentTarget.value)}
        placeholder="氏名・メールアドレスで検索"
        className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
      />
      <select
        value={searchParams.get("store") ?? ""}
        onChange={(e) => setParam("store", e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
      >
        <option value="">全店舗</option>
        {storeOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
