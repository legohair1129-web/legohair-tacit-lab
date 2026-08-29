"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { roleForPosition } from "@/lib/constants/staff";

export type CreateStaffState = {
  error: string | null;
};

export async function createStaffAction(
  _prevState: CreateStaffState,
  formData: FormData
): Promise<CreateStaffState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "セッションが切れています。再度ログインしてください。" };

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (callerProfile?.role !== "admin") {
    return { error: "権限がありません。" };
  }

  const displayName = String(formData.get("display_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const store = String(formData.get("store") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const employeeNumber = String(formData.get("employee_number") ?? "").trim();
  const joinedAt = String(formData.get("joined_at") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!displayName || !email || !password || !store || !position) {
    return { error: "氏名・メールアドレス・初期パスワード・所属店舗・役職は必須です。" };
  }
  if (password.length < 8) {
    return { error: "初期パスワードは8文字以上にしてください。" };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "サーバー側の設定エラーです。" };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created?.user) {
    const message = createError?.message ?? "";
    if (message.includes("already been registered") || message.includes("exists")) {
      return { error: "このメールアドレスはすでに登録されています。" };
    }
    if (message.toLowerCase().includes("password")) {
      return { error: "パスワードの強度が不足しています。別のパスワードを試してください。" };
    }
    return { error: `スタッフの作成に失敗しました（${message || "不明なエラー"}）。` };
  }

  const newUserId = created.user.id;

  // The on_auth_user_created trigger already inserted a bare profiles row
  // (id, display_name=email, role='staff') — fill it in with the real data.
  const { error: profileError } = await admin
    .from("profiles")
    .update({
      display_name: displayName,
      email,
      store,
      position,
      role: roleForPosition(position),
      employee_number: employeeNumber || null,
      joined_at: joinedAt || null,
      notes: notes || null,
      status: "active",
    })
    .eq("id", newUserId);

  if (profileError) {
    // Don't leave an auth-only account with no real profile behind.
    await admin.auth.admin.deleteUser(newUserId);
    return { error: `スタッフ情報の保存に失敗しました（${profileError.message}）。もう一度お試しください。` };
  }

  redirect("/admin/staff?created=1");
}
