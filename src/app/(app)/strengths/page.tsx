import { createClient } from "@/lib/supabase/server";
import { StartAssessmentButton } from "@/components/strengths/StartAssessmentButton";

export default async function StrengthsIntroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("tacit_profiles")
    .select("staff_id")
    .eq("staff_id", user.id)
    .maybeSingle();

  const alreadyTaken = !!profile;

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">TACIT STRENGTHS</p>
      <h1 className="mt-2 text-2xl font-medium leading-snug">あなたには、何が見えていますか？</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        ここは弱点を探す場所ではありません。
        <br />
        25の場面を通して、あなたが自然に見ているもの・考えていることを発見します。
      </p>

      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <p className="text-sm leading-relaxed text-muted">
          この診断に優劣はありません。
          <br />
          査定・給与・順位には一切使用されません。
        </p>
      </div>

      <div className="mt-8">
        <StartAssessmentButton userId={user.id} label={alreadyTaken ? "もう一度診断する" : "診断をはじめる（約10分）"} />
      </div>
    </div>
  );
}
