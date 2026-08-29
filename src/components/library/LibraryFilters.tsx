"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  STATE_OPTIONS,
  BEAUTY_NEED_OPTIONS,
  RELATIONSHIP_LEVEL_OPTIONS,
  FORECAST_ACCURACY_OPTIONS,
  type Option,
} from "@/lib/constants/options";

export type LibrarySearchParams = {
  state?: string;
  need?: string;
  issue?: string;
  relationship?: string;
  store?: string;
  group?: string;
  forecast?: string;
  missed?: string;
  pickup?: string;
};

const FIELDS: { key: keyof LibrarySearchParams; label: string; options: Option[] }[] = [
  { key: "state", label: "状態", options: STATE_OPTIONS },
  { key: "need", label: "ニーズ", options: BEAUTY_NEED_OPTIONS },
  { key: "relationship", label: "関係性", options: RELATIONSHIP_LEVEL_OPTIONS },
  { key: "forecast", label: "予測結果", options: FORECAST_ACCURACY_OPTIONS },
];

export function LibraryFilters({
  issueOptions,
  researchGroupOptions,
}: {
  issueOptions: Option[];
  researchGroupOptions: Option[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/library?${params.toString()}`);
  }

  function toggleMissed() {
    setParam("missed", searchParams.get("missed") === "1" ? "" : "1");
  }

  const hasFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <div className="mt-5 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={toggleMissed}
          className={`rounded-full border px-4 py-2 text-sm ${
            searchParams.get("missed") === "1"
              ? "border-danger bg-danger text-white"
              : "border-border bg-surface"
          }`}
        >
          読みが外れたカルテ
        </button>
        <button
          type="button"
          onClick={() => setParam("pickup", searchParams.get("pickup") === "1" ? "" : "1")}
          className={`rounded-full border px-4 py-2 text-sm ${
            searchParams.get("pickup") === "1"
              ? "border-accent bg-accent text-white"
              : "border-border bg-surface"
          }`}
        >
          ピックアップカルテ
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push("/library")}
            className="rounded-full px-4 py-2 text-sm text-muted underline underline-offset-2"
          >
            フィルターをクリア
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {FIELDS.map((f) => (
          <select
            key={f.key}
            value={searchParams.get(f.key) ?? ""}
            onChange={(e) => setParam(f.key, e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}

        <select
          value={searchParams.get("issue") ?? ""}
          onChange={(e) => setParam("issue", e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">気になる項目</option>
          {issueOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("group") ?? ""}
          onChange={(e) => setParam("group", e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">経験レベル</option>
          {researchGroupOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
