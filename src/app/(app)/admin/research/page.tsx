import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  STATE_OPTIONS,
  BEAUTY_NEED_OPTIONS,
  INTUITION_CUE_OPTIONS,
  BEST_BEFORE_ITEM_OPTIONS,
  FORECAST_ACCURACY_OPTIONS,
  labelFor,
  type Option,
} from "@/lib/constants/options";

function distribution(values: string[], options: Option[]) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ label: labelFor(options, value), count }));
}

export default async function ResearchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/home");

  const [{ data: cases }, { data: profiles }, { data: reviews }] = await Promise.all([
    supabase
      .from("cases")
      .select("id,staff_id,state,beauty_needs,intuition_cue_items,best_before_items")
      .limit(1000),
    supabase.from("profiles").select("id,display_name,store,research_group"),
    supabase.from("case_reviews").select("case_id,forecast_accuracy"),
  ]);

  const allCases = cases ?? [];
  const allProfiles = profiles ?? [];
  const profileById = new Map(allProfiles.map((p) => [p.id, p]));

  const staffCounts = new Map<string, number>();
  for (const c of allCases) staffCounts.set(c.staff_id, (staffCounts.get(c.staff_id) ?? 0) + 1);
  const staffRows = [...staffCounts.entries()]
    .map(([staffId, count]) => ({
      label: profileById.get(staffId)?.display_name ?? "不明",
      store: profileById.get(staffId)?.store ?? null,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const stateDist = distribution(
    allCases.map((c) => c.state).filter((v): v is NonNullable<typeof v> => !!v),
    STATE_OPTIONS
  );
  const needDist = distribution(allCases.flatMap((c) => c.beauty_needs), BEAUTY_NEED_OPTIONS);
  const cueDist = distribution(allCases.flatMap((c) => c.intuition_cue_items), INTUITION_CUE_OPTIONS);
  const bestBeforeDist = distribution(allCases.flatMap((c) => c.best_before_items), BEST_BEFORE_ITEM_OPTIONS);
  const forecastDist = distribution(
    (reviews ?? []).map((r) => r.forecast_accuracy).filter((v): v is NonNullable<typeof v> => !!v),
    FORECAST_ACCURACY_OPTIONS
  );

  const topStylistCases = allCases.filter((c) => profileById.get(c.staff_id)?.research_group === "top_stylist");
  const otherCases = allCases.filter((c) => profileById.get(c.staff_id)?.research_group !== "top_stylist");
  const topStylistCueDist = distribution(topStylistCases.flatMap((c) => c.intuition_cue_items), INTUITION_CUE_OPTIONS).slice(0, 5);
  const otherCueDist = distribution(otherCases.flatMap((c) => c.intuition_cue_items), INTUITION_CUE_OPTIONS).slice(0, 5);

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">リサーチ</p>
      <h1 className="mt-1 text-xl font-medium">LEGOHAIRの美容師は何を見ているのか</h1>
      <p className="mt-2 text-sm text-muted">
        実データの観察です。特定の傾向を「正しい」と決めつけるものではありません。
      </p>

      <div className="mt-3 flex gap-4">
        <Link href="/admin/staff" className="text-xs text-muted underline underline-offset-2">
          スタッフグループ管理へ
        </Link>
        <Link href="/admin/categories" className="text-xs text-muted underline underline-offset-2">
          カテゴリ管理へ
        </Link>
      </div>

      <div className="mt-6">
        <Stat label="カルテ総数" value={allCases.length} />
      </div>

      <DistBlock title="スタッフ別カルテ数" items={staffRows.map((s) => ({ label: `${s.label}${s.store ? ` (${s.store})` : ""}`, count: s.count }))} />
      <DistBlock title="状態分布" items={stateDist} />
      <DistBlock title="ニーズ分布" items={needDist} />
      <DistBlock title="直感のきっかけ分布" items={cueDist} />
      <DistBlock title="予測結果分布" items={forecastDist} />
      <DistBlock title="最高のビフォー項目分布" items={bestBeforeDist} />

      <div className="mt-10">
        <h2 className="text-xs font-medium tracking-[0.15em] text-muted">
          トップスタイリスト群 と その他スタッフ群 の比較（直感のきっかけ）
        </h2>
        <p className="mt-1 text-xs text-muted-2">
          トップスタイリスト {topStylistCases.length}件 ／ その他 {otherCases.length}件
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="mb-2 text-xs text-muted">トップスタイリスト</p>
            <div className="space-y-2">
              {topStylistCueDist.map((item) => (
                <Row key={item.label} label={item.label} count={item.count} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-muted">その他</p>
            <div className="space-y-2">
              {otherCueDist.map((item) => (
                <Row key={item.label} label={item.label} count={item.count} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="inline-block rounded-xl border border-border bg-surface px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-medium">{value}</p>
    </div>
  );
}

function DistBlock({ title, items }: { title: string; items: { label: string; count: number }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-10">
      <h2 className="text-xs font-medium tracking-[0.15em] text-muted">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <Row key={item.label} label={item.label} count={item.count} />
        ))}
      </div>
    </div>
  );
}

function Row({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-muted-2">{count}</span>
    </div>
  );
}
