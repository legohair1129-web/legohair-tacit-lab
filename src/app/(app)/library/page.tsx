import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { labelFor, STATE_OPTIONS, RELATIONSHIP_LEVEL_OPTIONS, RESEARCH_GROUP_OPTIONS } from "@/lib/constants/options";
import { LibraryFilters, type LibrarySearchParams } from "@/components/library/LibraryFilters";
import type { Case } from "@/lib/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

export default async function LibraryPage({ searchParams }: PageProps<"/library">) {
  const sp = (await searchParams) as LibrarySearchParams;
  const supabase = await createClient();

  const { data: issueOptions } = await supabase
    .from("categories")
    .select("value,label")
    .eq("field_key", "issue")
    .order("sort_order");

  let query = supabase
    .from("cases")
    .select(
      "id,created_at,store,age_group,menu,state,relationship_level,intuition_text,is_pickup,pickup_comment,staff_id"
    )
    .eq("is_shared", true)
    .order("created_at", { ascending: false })
    .limit(60);

  if (sp.state) query = query.eq("state", sp.state as Case["state"] & string);
  if (sp.relationship)
    query = query.eq("relationship_level", sp.relationship as Case["relationship_level"] & string);
  if (sp.store) query = query.eq("store", sp.store);
  if (sp.need) query = query.contains("beauty_needs", [sp.need]);
  if (sp.issue) query = query.contains("issues", [sp.issue]);
  if (sp.pickup === "1") query = query.eq("is_pickup", true);

  const { data: cases } = await query;

  let filteredCases = cases ?? [];

  // "予測結果" / "読みが外れたCASE" filters need the linked review outcome.
  if ((sp.forecast || sp.missed === "1") && filteredCases.length > 0) {
    const { data: reviews } = await supabase
      .from("case_reviews")
      .select("case_id,forecast_accuracy")
      .in(
        "case_id",
        filteredCases.map((c) => c.id)
      );
    const accuracyByCase = new Map((reviews ?? []).map((r) => [r.case_id, r.forecast_accuracy]));

    if (sp.missed === "1") {
      filteredCases = filteredCases.filter((c) => accuracyByCase.get(c.id) === "miss");
    } else if (sp.forecast) {
      filteredCases = filteredCases.filter((c) => accuracyByCase.get(c.id) === sp.forecast);
    }
  }

  // "経験レベル" filters by the case's own staff's research_group.
  if (sp.group && filteredCases.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,research_group")
      .in(
        "id",
        filteredCases.map((c) => c.staff_id)
      );
    const groupByStaff = new Map((profiles ?? []).map((p) => [p.id, p.research_group]));
    filteredCases = filteredCases.filter((c) => groupByStaff.get(c.staff_id) === sp.group);
  }

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">ライブラリ</p>
      <h1 className="mt-1 text-xl font-medium">他スタッフのカルテから学ぶ</h1>

      <LibraryFilters issueOptions={issueOptions ?? []} researchGroupOptions={RESEARCH_GROUP_OPTIONS} />

      <div className="mt-6 space-y-3">
        {filteredCases.length === 0 ? (
          <p className="text-sm text-muted-2">条件に合うカルテがありません。</p>
        ) : (
          filteredCases.map((c) => (
            <Link
              key={c.id}
              href={`/case/${c.id}`}
              className={`block rounded-xl border px-4 py-3 ${
                c.is_pickup ? "border-accent-soft bg-accent-soft/30" : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {c.age_group ?? "年代未設定"}
                  {c.menu ? ` ・ ${c.menu}` : ""}
                </span>
                <span className="text-xs text-muted-2">{formatDate(c.created_at)}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted">
                {c.state && <span>{labelFor(STATE_OPTIONS, c.state)}</span>}
                {c.relationship_level && <span>・ {labelFor(RELATIONSHIP_LEVEL_OPTIONS, c.relationship_level)}</span>}
                {c.is_pickup && <span className="text-accent">・ ピックアップ</span>}
              </div>
              {c.intuition_text && (
                <p className="mt-1.5 truncate text-sm text-muted-2">{c.intuition_text}</p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
