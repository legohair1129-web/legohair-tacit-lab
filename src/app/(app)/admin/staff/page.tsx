import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StaffGroupRow } from "@/components/admin/StaffGroupRow";
import { StaffFilters } from "@/components/admin/StaffFilters";

type StaffSearchParams = { q?: string; store?: string; created?: string };

export default async function AdminStaffPage({ searchParams }: PageProps<"/admin/staff">) {
  const sp = (await searchParams) as StaffSearchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/home");

  const { data: storeRows } = await supabase
    .from("profiles")
    .select("store")
    .not("store", "is", null)
    .order("store");
  const storeOptions = [...new Set((storeRows ?? []).map((s) => s.store).filter(Boolean))] as string[];

  let query = supabase
    .from("profiles")
    .select("id,display_name,email,store,position,role,research_group,status,created_at")
    .order("display_name");

  if (sp.q) query = query.or(`display_name.ilike.%${sp.q}%,email.ilike.%${sp.q}%`);
  if (sp.store) query = query.eq("store", sp.store);

  const { data: profiles } = await query;

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">管理者</p>
      <h1 className="mt-1 text-xl font-medium">スタッフ管理</h1>

      {sp.created === "1" && (
        <p className="mt-4 rounded-lg bg-accent-soft px-4 py-3 text-sm text-accent">
          スタッフを登録しました。
        </p>
      )}

      <Link
        href="/admin/staff/new"
        className="mt-6 block rounded-lg bg-foreground py-3.5 text-center text-base font-medium text-background"
      >
        ＋ スタッフを追加
      </Link>

      <StaffFilters storeOptions={storeOptions} />

      <div className="mt-6 space-y-2">
        {!profiles || profiles.length === 0 ? (
          <p className="text-sm text-muted-2">該当するスタッフがいません。</p>
        ) : (
          profiles.map((p) => <StaffGroupRow key={p.id} profile={p} />)
        )}
      </div>
    </div>
  );
}
