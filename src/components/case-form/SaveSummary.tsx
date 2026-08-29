"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { CaseFormState } from "@/components/case-form/types";

export function SaveSummary({ value, caseId }: { value: CaseFormState; caseId: string }) {
  return (
    <div className="flex min-h-dvh flex-col px-6 pb-10 pt-10">
      <p className="text-xs tracking-[0.2em] text-muted">記録完了</p>
      <h1 className="mt-2 text-xl font-medium leading-snug">CASEを記録しました。</h1>

      <div className="mt-8 space-y-5">
        {value.nextBefore && (
          <div className="rounded-lg border border-accent bg-accent-soft/40 p-4">
            <p className="text-xs font-medium tracking-wide text-accent">次回来店時の目標</p>
            <p className="mt-1 text-base leading-relaxed">{value.nextBefore}</p>
          </div>
        )}
        {value.finalProposal && <SummaryBlock label="今日の提案" text={value.finalProposal} />}
      </div>

      <p className="mt-10 text-sm leading-relaxed text-muted">
        次回来店時に、この答え合わせをしましょう。
      </p>

      <div className="mt-6 space-y-3">
        <Link href="/home">
          <Button variant="secondary">ホームへ</Button>
        </Link>
        <Link href={`/case/${caseId}`}>
          <Button>CASEを見る</Button>
        </Link>
      </div>
    </div>
  );
}

function SummaryBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-accent">{label}</p>
      <p className="mt-1 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
