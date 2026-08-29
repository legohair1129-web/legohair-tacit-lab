"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createStaffAction, type CreateStaffState } from "@/app/(app)/admin/staff/new/actions";
import { Button } from "@/components/ui/Button";
import { POSITION_OPTIONS } from "@/lib/constants/staff";

const initialState: CreateStaffState = { error: null };

export function NewStaffForm({ storeOptions }: { storeOptions: string[] }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createStaffAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <Field label="氏名">
        <input name="display_name" required className={inputClass} />
      </Field>

      <Field label="メールアドレス">
        <input name="email" type="email" required className={inputClass} />
      </Field>

      <Field label="初期パスワード" hint="8文字以上。ログイン後、本人が変更できます。">
        <input name="password" type="password" required minLength={8} className={inputClass} />
      </Field>

      <Field label="所属店舗">
        <input name="store" required list="store-options" className={inputClass} />
        <datalist id="store-options">
          {storeOptions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </Field>

      <Field label="役職">
        <RadioCardsField name="position" options={POSITION_OPTIONS} columns={2} />
      </Field>

      <div className="border-t border-border pt-6">
        <p className="mb-4 text-xs text-muted">以下は任意です</p>

        <div className="space-y-6">
          <Field label="社員番号">
            <input name="employee_number" className={inputClass} />
          </Field>

          <Field label="入社日">
            <input name="joined_at" type="date" className={inputClass} />
          </Field>

          <Field label="備考">
            <textarea name="notes" rows={3} className={inputClass} />
          </Field>
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{state.error}</p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-lg gap-3">
          <Button type="button" variant="secondary" className="w-auto px-6" onClick={() => router.back()}>
            戻る
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "登録中…" : "登録する"}
          </Button>
        </div>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-3 text-base outline-none focus:border-foreground";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-muted">{label}</p>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-2">{hint}</p>}
    </div>
  );
}

// Native radio inputs (not buttons) so the value participates in the plain
// <form action> submission without any client-side state wiring.
function RadioCardsField({
  name,
  options,
  columns,
}: {
  name: string;
  options: { value: string; label: string }[];
  columns: 1 | 2;
}) {
  return (
    <div className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {options.map((opt, i) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={i === options.length - 1}
            className="accent-foreground"
          />
          <span className="text-sm font-medium">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
