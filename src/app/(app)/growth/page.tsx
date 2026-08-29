import { createClient } from "@/lib/supabase/server";
import {
  STATE_OPTIONS,
  BEAUTY_NEED_OPTIONS,
  INTUITION_CUE_OPTIONS,
  labelFor,
  type Option,
} from "@/lib/constants/options";
import type { Case } from "@/lib/types/database";

function topCounts(values: string[], options: Option[], top = 3) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([value, count]) => ({ label: labelFor(options, value), count }));
}

const DEPTH_FIELDS: { key: keyof Case; label: string }[] = [
  { key: "memory_note", label: "記憶" },
  { key: "notice_note", label: "気づき" },
  { key: "intuition_cue_note", label: "直感のきっかけ" },
  { key: "forecast_next_style", label: "予測（次のスタイル）" },
  { key: "forecast_success_state", label: "予測（成功の定義）" },
  { key: "best_before_note", label: "最高のビフォー" },
];

export default async function GrowthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: cases } = await supabase
    .from("cases")
    .select("*")
    .eq("staff_id", user.id)
    .order("created_at", { ascending: true })
    .limit(300);

  const allCases = cases ?? [];
  const total = allCases.length;

  let reviewedCount = 0;
  if (total > 0) {
    const { data: reviews } = await supabase
      .from("case_reviews")
      .select("case_id")
      .in(
        "case_id",
        allCases.map((c) => c.id)
      );
    reviewedCount = reviews?.length ?? 0;
  }

  const stateCounts = topCounts(
    allCases.map((c) => c.state).filter((v): v is NonNullable<typeof v> => !!v),
    STATE_OPTIONS
  );
  const cueCounts = topCounts(allCases.flatMap((c) => c.intuition_cue_items), INTUITION_CUE_OPTIONS);
  const needCounts = topCounts(allCases.flatMap((c) => c.beauty_needs), BEAUTY_NEED_OPTIONS);

  let growingFields: { label: string; before: number; after: number }[] = [];
  if (total >= 8) {
    const mid = Math.floor(total / 2);
    const earlier = allCases.slice(0, mid);
    const later = allCases.slice(mid);
    const fillRate = (rows: typeof allCases, key: keyof Case) =>
      Math.round((rows.filter((r) => !!r[key]).length / rows.length) * 100);

    growingFields = DEPTH_FIELDS.map((f) => ({
      label: f.label,
      before: fillRate(earlier, f.key),
      after: fillRate(later, f.key),
    })).filter((f) => f.after - f.before >= 15);
  }

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">成長</p>
      <h1 className="mt-1 text-xl font-medium">記録の振り返り</h1>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="総カルテ数" value={total} />
        <Stat label="答え合わせ済み" value={reviewedCount} />
      </div>

      {stateCounts.length > 0 && <TopList title="よく記録している状態" items={stateCounts} />}
      {cueCounts.length > 0 && <TopList title="よく気づいているきっかけ" items={cueCounts} />}
      {needCounts.length > 0 && <TopList title="よく扱うニーズ" items={needCounts} />}

      {growingFields.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-medium tracking-[0.15em] text-muted">最近増えている観察項目</h2>
          <p className="mt-1 text-xs text-muted-2">記録の前半と後半で、記入率が上がった項目です。</p>
          <div className="mt-3 space-y-2">
            {growingFields.map((f) => (
              <div key={f.label} className="rounded-xl border border-border bg-surface px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{f.label}</span>
                  <span className="text-muted-2">
                    {f.before}% → {f.after}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <p className="mt-10 text-sm text-muted-2">カルテを記録すると、ここに振り返りが表示されます。</p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-medium">{value}</p>
    </div>
  );
}

function TopList({ title, items }: { title: string; items: { label: string; count: number }[] }) {
  return (
    <div className="mt-10">
      <h2 className="text-xs font-medium tracking-[0.15em] text-muted">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-sm text-muted-2">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
