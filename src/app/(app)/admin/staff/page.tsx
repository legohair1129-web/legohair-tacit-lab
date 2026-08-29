import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StaffGroupRow } from "@/components/admin/StaffGroupRow";

export default async function AdminStaffPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/home");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id,display_name,store,role,research_group")
    .order("display_name");

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">ADMIN</p>
      <h1 className="mt-1 text-xl font-medium">スタッフgroup管理</h1>
      <p className="mt-2 text-sm text-muted">
        RESEARCHでの集計に使う研究用groupです。人事評価には使用しません。
      </p>

      <div className="mt-6 space-y-2">
        {(profiles ?? []).map((p) => (
          <StaffGroupRow key={p.id} profile={p} />
        ))}
      </div>
    </div>
  );
}
