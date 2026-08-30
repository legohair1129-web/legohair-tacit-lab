import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function MasterKnowledgeListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: articles }, { data: strengthTypes }, { data: myResponses }] = await Promise.all([
    supabase
      .from("master_knowledge")
      .select("id,number,title,related_strength_keys")
      .order("sort_order"),
    supabase.from("strength_types").select("key,name_ja"),
    supabase.from("master_knowledge_responses").select("master_knowledge_id").eq("staff_id", user.id),
  ]);

  const nameByKey = new Map((strengthTypes ?? []).map((t) => [t.key, t.name_ja]));
  const answeredIds = new Set((myResponses ?? []).map((r) => r.master_knowledge_id));

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">
        <Link href="/learn" className="underline">
          学び
        </Link>
        {" / "}MASTER KNOWLEDGE
      </p>
      <h1 className="mt-2 text-2xl font-medium leading-snug">MASTER KNOWLEDGE</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        先輩たちの「見る・考える・提案する」を学ぶ。
        <br />
        正解を覚える場所ではありません。
      </p>

      <div className="mt-6 space-y-2">
        {(articles ?? []).map((a) => (
          <Link
            key={a.id}
            href={`/learn/${a.id}`}
            className="block rounded-xl border border-border bg-surface px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-2">
                {String(a.number).padStart(2, "0")}
              </span>
              {answeredIds.has(a.id) && <span className="text-xs text-accent">回答済み</span>}
            </div>
            <p className="mt-1 text-sm font-medium leading-snug">{a.title}</p>
            {a.related_strength_keys && a.related_strength_keys.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {a.related_strength_keys.map((key) => (
                  <span
                    key={key}
                    className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] text-accent"
                  >
                    {nameByKey.get(key) ?? key}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
