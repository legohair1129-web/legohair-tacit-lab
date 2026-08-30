"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type JoinState = {
  error: string | null;
  confirmationRequired: boolean;
};

export async function joinAction(_prevState: JoinState, formData: FormData): Promise<JoinState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const inviteCode = String(formData.get("invite_code") ?? "").trim();

  if (!name || !email || !password || !inviteCode) {
    return { error: "すべての項目を入力してください。", confirmationRequired: false };
  }
  if (password.length < 8) {
    return { error: "パスワードは8文字以上にしてください。", confirmationRequired: false };
  }

  // Invite code is compared server-side only, against an env var — never
  // shipped to the client, never hardcoded.
  const expectedCode = process.env.TACIT_INVITE_CODE;
  if (!expectedCode) {
    return {
      error: "招待コードが設定されていません。管理者に連絡してください。",
      confirmationRequired: false,
    };
  }
  if (inviteCode !== expectedCode) {
    return { error: "招待コードが正しくありません。", confirmationRequired: false };
  }

  const supabase = await createClient();
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: name } },
  });

  if (signUpError || !data.user) {
    const message = signUpError?.message ?? "";
    if (message.toLowerCase().includes("already") || message.toLowerCase().includes("registered")) {
      return {
        error: "このメールアドレスは既に登録されています。ログインしてください。",
        confirmationRequired: false,
      };
    }
    if (message.toLowerCase().includes("password")) {
      return {
        error: "パスワードの強度が不足しています。別のパスワードを試してください。",
        confirmationRequired: false,
      };
    }
    return { error: `登録に失敗しました（${message || "不明なエラー"}）。`, confirmationRequired: false };
  }

  // The on_auth_user_created trigger already inserted a bare profiles row
  // (id, display_name=email, role='staff' by column default). Backfill the
  // real name/email via the service-role client so this works the same way
  // whether or not email confirmation is required — in the confirmation-
  // required case there's no user session yet to satisfy the normal
  // "auth.uid() = id" RLS policy on profiles. role is never touched here,
  // so it stays at its schema default of 'staff' no matter what.
  try {
    const admin = createAdminClient();
    await admin.from("profiles").update({ display_name: name, email }).eq("id", data.user.id);
  } catch {
    // Non-fatal — the account is fully usable even if this cosmetic
    // backfill didn't run.
  }

  if (!data.session) {
    return { error: null, confirmationRequired: true };
  }

  redirect("/home");
}
