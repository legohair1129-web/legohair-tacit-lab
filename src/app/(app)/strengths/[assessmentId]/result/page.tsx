import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { StrengthTypeKey } from "@/lib/types/database";

function StrengthCard({
  eyebrow,
  name,
  description,
  gift,
  watchOut,
}: {
  eyebrow: string;
  name: string;
  description: string;
  gift: string;
  watchOut: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-medium tracking-[0.15em] text-accent">{eyebrow}</p>
      <p className="mt-1 text-lg font-medium">{name}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      <div className="mt-3 border-t border-border pt-3">
        <p className="text-xs font-medium text-muted-2">YOUR GIFT</p>
        <p className="mt-1 text-sm leading-relaxed">{gift}</p>
      </div>
      <div className="mt-3">
        <p className="text-xs font-medium text-muted-2">WATCH OUT</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{watchOut}</p>
      </div>
    </div>
  );
}

export default async function StrengthResultPage({ params }: PageProps<"/strengths/[assessmentId]/result">) {
  const { assessmentId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: result } = await supabase
    .from("strength_results")
    .select("*")
    .eq("assessment_id", assessmentId)
    .maybeSingle();
  if (!result) redirect(`/strengths/${assessmentId}`);

  const typeKeys = [result.core_type_key, result.support_type_key, result.emerging_type_key] as StrengthTypeKey[];

  const [{ data: types }, { data: combination }, { data: recommended }] = await Promise.all([
    supabase.from("strength_types").select("*").in("key", typeKeys),
    result.combination_type_id
      ? supabase.from("strength_combination_types").select("name_ja,description").eq("id", result.combination_type_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("master_knowledge")
      .select("id,number,title")
      .contains("related_strength_keys", [result.core_type_key])
      .order("sort_order")
      .limit(3),
  ]);

  const typeByKey = new Map((types ?? []).map((t) => [t.key, t]));
  const core = typeByKey.get(result.core_type_key);
  const support = typeByKey.get(result.support_type_key);
  const emerging = typeByKey.get(result.emerging_type_key);
  if (!core || !support || !emerging) notFound();

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">YOUR TACIT STRENGTHS</p>
      <h1 className="mt-2 text-2xl font-medium leading-snug">
        {result.is_dual_type ? "あなたはデュアルタイプ" : "あなたの強みが見えてきました"}
      </h1>

      {result.is_dual_type && combination && (
        <div className="mt-4 rounded-xl border border-accent-soft bg-accent-soft/30 p-4">
          <p className="text-xs font-medium tracking-[0.15em] text-accent">DUAL TYPE</p>
          <p className="mt-1 text-lg font-medium">{combination.name_ja}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{combination.description}</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <StrengthCard
          eyebrow="CORE"
          name={core.name_ja}
          description={core.description}
          gift={core.gift_text}
          watchOut={core.watch_out_text}
        />
        <StrengthCard
          eyebrow="SUPPORT"
          name={support.name_ja}
          description={support.description}
          gift={support.gift_text}
          watchOut={support.watch_out_text}
        />
        <StrengthCard
          eyebrow="EMERGING"
          name={emerging.name_ja}
          description={emerging.description}
          gift={emerging.gift_text}
          watchOut={emerging.watch_out_text}
        />
      </div>

      {recommended && recommended.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-medium tracking-[0.15em] text-muted">あなたにおすすめのMASTER KNOWLEDGE</p>
          <div className="mt-3 space-y-2">
            {recommended.map((a) => (
              <Link key={a.id} href={`/learn/${a.id}`} className="block rounded-xl border border-border bg-surface px-4 py-3">
                <span className="text-xs text-muted-2">{String(a.number).padStart(2, "0")}</span>
                <p className="mt-1 text-sm font-medium leading-snug">{a.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-8 text-xs leading-relaxed text-muted-2">
        この診断に優劣はありません。査定・給与・順位には一切使用されません。
      </p>

      <Link href="/me" className="mt-6 block rounded-lg bg-foreground py-3.5 text-center text-base font-medium text-background">
        MY TACITへ
      </Link>
    </div>
  );
}
