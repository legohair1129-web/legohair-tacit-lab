"use client";

import { useActionState } from "react";
import Link from "next/link";
import { joinAction, type JoinState } from "@/app/(auth)/join/actions";

const initialState: JoinState = { error: null, confirmationRequired: false };

export function JoinForm() {
  const [state, formAction, pending] = useActionState(joinAction, initialState);

  if (state.confirmationRequired) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-xs tracking-[0.2em] text-muted">LEGOHAIR TACIT LAB</p>
        <h1 className="mt-3 text-2xl font-medium">確認メールを送信しました。</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          メールを確認して、
          <br />
          TACIT LABを開始してください。
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-10 text-center">
        <p className="text-xs tracking-[0.2em] text-muted">LEGOHAIR TACIT LAB</p>
        <h1 className="mt-3 text-2xl font-medium">TEAM INVITATION</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          一緒に、
          <br />
          「見る力」を育てよう。
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
            氏名
          </label>
          <input id="name" name="name" required autoComplete="name" className={inputClass} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-muted">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="invite_code" className="mb-1.5 block text-sm text-muted">
            招待コード
          </label>
          <input
            id="invite_code"
            name="invite_code"
            required
            autoComplete="off"
            className={inputClass}
          />
        </div>

        {state.error && <p className="text-sm text-danger">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-foreground py-3.5 text-base font-medium text-background disabled:opacity-50"
        >
          {pending ? "登録中…" : "TACIT LABに参加する"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-muted-2">
        すでにアカウントをお持ちの方 →{" "}
        <Link href="/login" className="underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-3 text-base outline-none focus:border-foreground";
