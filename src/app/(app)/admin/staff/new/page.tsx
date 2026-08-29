import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewStaffForm } from "@/components/admin/NewStaffForm";

export default async function NewStaffPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/home");

  const { data: stores } = await supabase
    .from("profiles")
    .select("store")
    .not("store", "is", null)
    .order("store");
  const storeOptions = [...new Set((stores ?? []).map((s) => s.store).filter(Boolean))] as string[];

  return (
    <div className="px-6 py-8 pb-28">
      <p className="text-xs tracking-[0.2em] text-muted">ADMIN</p>
      <h1 className="mt-1 text-xl font-medium">スタッフを追加</h1>

      <NewStaffForm storeOptions={storeOptions} />
    </div>
  );
}
