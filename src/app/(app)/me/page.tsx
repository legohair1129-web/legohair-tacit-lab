import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { STRENGTH_TYPE_KEYS } from "@/lib/strengths/scoring";
import type { StrengthTypeKey } from "@/lib/types/database";

const MAP_LABEL = ["STRONG", "STRONG", "STRONG", "GROWING", "GROWING", "GROWING", "DISCOVERING", "DISCOVERING"];

export default async function MePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
  const { data: tacitProfile } = await supabase
    .from("tacit_profiles")
    .select("*")
    .eq("staff_id", user.id)
    .maybeSingle();

  if (!tacitProfile || !tacitProfile.core_type_key) {
    return (
      <div className="px-6 py-8">
        <p className="text-xs tracking-[0.2em] text-muted">ME</p>
        <h1 className="mt-2 text-2xl font-medium leading-snug">MY TACIT</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          まだ診断を受けていません。
          <br />
          あなたには、何が見えていますか？
        </p>
        <Link
          href="/strengths"
          className="mt-6 block rounded-lg bg-foreground py-3.5 text-center text-base font-medium text-background"
        >
          TACIT STRENGTHSを受ける
        </Link>
      </div>
    );
  }

  const [{ data: types }, { data: combination }, { data: results }] = await Promise.all([
    supabase.from("strength_types").select("key,name_ja,description").in("key", STRENGTH_TYPE_KEYS),
    tacitProfile.combination_type_id
      ? supabase.from("strength_combination_types").select("name_ja").eq("id", tacitProfile.combination_type_id).maybeSingle()
      : Promise.resolve({ data: null }),
    tacitProfile.latest_assessment_id
      ? supabase.from("strength_results").select("scores").eq("assessment_id", tacitProfile.latest_assessment_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const nameByKey = new Map((types ?? []).map((t) => [t.key, t.name_ja]));
  const scores = (results?.scores ?? {}) as Partial<Record<StrengthTypeKey, number>>;
  const ranked = [...STRENGTH_TYPE_KEYS].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">ME</p>
      <h1 className="mt-2 text-2xl font-medium leading-snug">
        {profile?.display_name ? `${profile.display_name}のTACIT PROFILE` : "MY TACIT PROFILE"}
      </h1>

      {tacitProfile.is_dual_type && combination && (
        <div className="mt-4 rounded-xl border border-accent-soft bg-accent-soft/30 p-4">
          <p className="text-xs font-medium tracking-[0.15em] text-accent">DUAL TYPE</p>
          <p className="mt-1 text-lg font-medium">{combination.name_ja}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-3 gap-2">
        {[
          { label: "CORE", key: tacitProfile.core_type_key },
          { label: "SUPPORT", key: tacitProfile.support_type_key },
          { label: "EMERGING", key: tacitProfile.emerging_type_key },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-[10px] tracking-[0.15em] text-accent">{item.label}</p>
            <p className="mt-1 text-sm font-medium leading-snug">
              {item.key ? nameByKey.get(item.key) ?? item.key : "-"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <p className="text-xs font-medium tracking-[0.15em] text-muted">TACIT MAP</p>
        <div className="mt-3 space-y-2">
          {ranked.map((key, i) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
              <span className="text-sm font-medium">{nameByKey.get(key) ?? key}</span>
              <span className="text-xs text-muted-2">{MAP_LABEL[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-2">
        この診断に優劣はありません。査定・給与・順位には一切使用されません。
      </p>

      <Link href="/strengths" className="mt-6 block rounded-lg border border-border bg-surface py-3.5 text-center text-base font-medium">
        もう一度診断する
      </Link>
    </div>
  );
}
