import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { labelFor, STATE_OPTIONS } from "@/lib/constants/options";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

export default async function CaseListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: cases } = await supabase
    .from("cases")
    .select("id,created_at,menu,age_group,state,intuition_text")
    .eq("staff_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">カルテ</p>
      <h1 className="mt-1 text-xl font-medium">自分のカルテ</h1>

      <Link
        href="/case/new"
        className="mt-6 block rounded-lg bg-foreground py-3.5 text-center text-base font-medium text-background"
      >
        ＋ 今日のカルテを記録する
      </Link>

      <div className="mt-8 space-y-3">
        {!cases || cases.length === 0 ? (
          <p className="text-sm text-muted-2">まだカルテがありません。</p>
        ) : (
          cases.map((c) => (
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
              {c.intuition_text && (
                <p className="mt-1 truncate text-sm text-muted-2">{c.intuition_text}</p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
