"use client";

import type { TextareaHTMLAttributes } from "react";

export function TextArea({
  hint,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { hint?: string }) {
  return (
    <div>
      <textarea
        rows={4}
        className={`w-full rounded-lg border border-border bg-surface px-4 py-3 text-base outline-none focus:border-foreground ${className}`}
        {...props}
      />
      {hint && <p className="mt-1.5 text-xs text-muted-2">{hint}</p>}
    </div>
  );
}

export const PII_HINT = "個人を特定できる情報（氏名・連絡先など）は入力しないでください。";
