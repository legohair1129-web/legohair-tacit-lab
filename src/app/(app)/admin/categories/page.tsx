import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/home");

  const { data: issueItems } = await supabase
    .from("categories")
    .select("*")
    .eq("field_key", "issue")
    .order("sort_order");

  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">管理者</p>
      <h1 className="mt-1 text-xl font-medium">カテゴリ管理</h1>
      <p className="mt-2 text-sm text-muted">
        カルテ入力の「気になる項目」選択肢です。非表示にした項目は新規入力では選べなくなりますが、過去のカルテには残ります。
      </p>

      <CategoryManager fieldKey="issue" initialItems={issueItems ?? []} />
    </div>
  );
}
