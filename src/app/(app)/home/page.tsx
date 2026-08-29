import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { labelFor, STATE_OPTIONS } from "@/lib/constants/options";

function startOfWeek() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = day === 0 ? 6 : day - 1; // days since Monday
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
  return monday.toISOString();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const weekStart = startOfWeek();

  const [{ count: weekCaseCount }, { data: recentCases }, { data: myCaseIds }, { data: pickupCases }] =
    await Promise.all([
      supabase
        .from("cases")
        .select("id", { count: "exact", head: true })
        .eq("staff_id", user.id)
        .gte("created_at", weekStart),
      supabase
        .from("cases")
        .select("id,created_at,menu,age_group,state,intuition_text")
        .eq("staff_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase.from("cases").select("id").eq("staff_id", user.id),
      supabase
        .from("cases")
        .select("id,created_at,menu,age_group,intuition_text,forecast_success_state,pickup_comment")
        .eq("is_pickup", true)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  let awaitingReviewCount = 0;
  if (myCaseIds && myCaseIds.length > 0) {
    const { data: reviewed } = await supabase
      .from("case_reviews")
      .select("case_id")
      .in(
        "case_id",
        myCaseIds.map((c) => c.id)
      );
    const reviewedIds = new Set((reviewed ?? []).map((r) => r.case_id));
    awaitingReviewCount = myCaseIds.filter((c) => !reviewedIds.has(c.id)).length;
  }

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">LEGOHAIR TACIT LAB</p>
      <h1 className="mt-2 text-2xl font-medium leading-snug">最高のビフォーをつくる。</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        私たちの仕事は、
        <br />
        今日のアフターで終わらない。
        <br />
        次にお会いした時のビフォーまでが、
        <br />
        私たちの仕事。
      </p>

      <Link
        href="/case/new"
        className="mt-8 block rounded-lg bg-foreground py-4 text-center text-base font-medium text-background"
      >
        ＋ 今日のカルテを記録する
      </Link>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">今週</p>
          <p className="mt-1 text-2xl font-medium">
            {weekCaseCount ?? 0}
            <span className="ml-1 text-sm font-normal text-muted">件</span>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">答え合わせ待ち</p>
          <p className="mt-1 text-2xl font-medium">
            {awaitingReviewCount}
            <span className="ml-1 text-sm font-normal text-muted">件</span>
          </p>
        </div>
      </div>

      {recentCases && recentCases.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-medium tracking-[0.15em] text-muted">最近のカルテ</h2>
          <div className="mt-3 space-y-2">
            {recentCases.map((c) => (
              <Link
                key={c.id}
                href={`/case/${c.id}`}
                className="block rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {c.age_group ?? "年代未設定"}
                    {c.menu ? ` ・ ${c.menu}` : ""}
                  </span>
                  <span className="text-xs text-muted-2">{formatDate(c.created_at)}</span>
                </div>
                {c.state && <p className="mt-1 text-xs text-muted">{labelFor(STATE_OPTIONS, c.state)}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}

      {pickupCases && pickupCases.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-medium tracking-[0.15em] text-accent">ピックアップカルテ</h2>
          <div className="mt-3 space-y-2">
            {pickupCases.map((c) => (
              <Link
                key={c.id}
                href={`/case/${c.id}`}
                className="block rounded-xl border border-accent-soft bg-accent-soft/30 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {c.age_group ?? "年代未設定"}
                    {c.menu ? ` ・ ${c.menu}` : ""}
                  </span>
                  <span className="text-xs text-muted-2">{formatDate(c.created_at)}</span>
                </div>
                {c.pickup_comment && <p className="mt-1 text-sm text-muted-2">{c.pickup_comment}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
