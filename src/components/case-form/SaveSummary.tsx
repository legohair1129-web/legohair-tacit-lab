"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { CaseFormState } from "@/components/case-form/types";

export function SaveSummary({ value, caseId }: { value: CaseFormState; caseId: string }) {
  return (
    <div className="flex min-h-dvh flex-col px-6 pb-10 pt-10">
      <p className="text-xs tracking-[0.2em] text-muted">SAVE</p>
      <h1 className="mt-2 text-xl font-medium leading-snug">CASEを記録しました。</h1>

      <div className="mt-8 space-y-5">
        {value.intuitionText && (
          <SummaryBlock label="TODAY'S INTUITION" text={value.intuitionText} />
        )}
        {value.decisionFinal && (
          <SummaryBlock label="TODAY'S DECISION" text={value.decisionFinal} />
        )}
        {value.forecastNextStyle && <SummaryBlock label="FORECAST" text={value.forecastNextStyle} />}
        {value.forecastSuccessState && (
          <SummaryBlock label="BEST BEFORE" text={value.forecastSuccessState} />
        )}
      </div>

      <p className="mt-10 text-sm leading-relaxed text-muted">
        次回来店で、答え合わせをしましょう。
      </p>

      <div className="mt-6 space-y-3">
        <Link href="/home">
          <Button variant="secondary">HOMEへ</Button>
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
