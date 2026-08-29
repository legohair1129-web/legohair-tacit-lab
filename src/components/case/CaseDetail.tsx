import Link from "next/link";
import type { Case, CaseReview } from "@/lib/types/database";
import { AdminPickupControl } from "@/components/case/AdminPickupControl";
import {
  STATE_OPTIONS,
  BEAUTY_NEED_OPTIONS,
  RELATIONSHIP_LEVEL_OPTIONS,
  NOTICE_ITEM_OPTIONS,
  INTUITION_CUE_OPTIONS,
  DISCOVER_ALIGNMENT_OPTIONS,
  BEST_BEFORE_ITEM_OPTIONS,
  BEST_BEFORE_ACTION_OPTIONS,
  FORECAST_ACCURACY_OPTIONS,
  BEFORE_CONNECTION_OPTIONS,
  labelFor,
  type Option,
} from "@/lib/constants/options";
import {
  DISCOVERY_OPTIONS,
  CUSTOMER_PRIORITY_OPTIONS,
  DECISION_CATEGORY_OPTIONS,
} from "@/lib/constants/caseFlow";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-6 first:border-t-0 first:pt-0">
      <h2 className="text-xs font-medium tracking-[0.15em] text-accent">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}

function Chips({ values, options }: { values: string[]; options: Option[] }) {
  if (values.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <span key={v} className="rounded-full border border-border px-3 py-1 text-xs">
          {labelFor(options, v)}
        </span>
      ))}
    </div>
  );
}

export function CaseDetail({
  caseRow,
  issueOptions,
  review,
  showOwner,
  ownerLabel,
  isOwner,
  isAdmin,
  previousCase,
  nextCase,
}: {
  caseRow: Case;
  issueOptions: Option[];
  review: CaseReview | null;
  showOwner: boolean;
  ownerLabel: string | null;
  isOwner: boolean;
  isAdmin: boolean;
  previousCase: { id: string; created_at: string } | null;
  nextCase: { id: string; created_at: string } | null;
}) {
  const c = caseRow;

  return (
    <div className="px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted">CASE</p>
          <p className="mt-1 text-sm text-muted-2">{formatDate(c.created_at)}</p>
        </div>
        {c.is_pickup && (
          <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
            注目CASE
          </span>
        )}
      </div>

      {c.is_pickup && c.pickup_comment && (
        <div className="mt-4 rounded-lg border border-accent-soft bg-accent-soft/40 p-4 text-sm leading-relaxed">
          {c.pickup_comment}
        </div>
      )}

      {c.forecast_success_state && (
        <div className="mt-4 rounded-lg border border-accent bg-accent-soft/40 p-4">
          <p className="text-xs font-medium tracking-wide text-accent">次回来店時の目標</p>
          <p className="mt-1 text-base leading-relaxed">{c.forecast_success_state}</p>
        </div>
      )}

      {previousCase && (
        <Link
          href={`/case/${previousCase.id}`}
          className="mt-4 block rounded-lg border border-border px-4 py-2.5 text-sm text-muted"
        >
          ← 前回のCASE（{formatDate(previousCase.created_at)}）
        </Link>
      )}

      <Section title="お客様">
        <Row label="年代" value={c.age_group} />
        <Row label="新規 / 既存" value={c.visit_type === "new" ? "新規" : c.visit_type === "existing" ? "既存" : null} />
        <Row label="来店周期" value={c.visit_cycle} />
        <Row label="メニュー" value={c.menu} />
        {showOwner && ownerLabel && <Row label="担当" value={ownerLabel} />}
        <Row label="関係性" value={labelFor(RELATIONSHIP_LEVEL_OPTIONS, c.relationship_level)} />
        {c.state && (
          <div>
            <p className="text-xs text-muted">状態</p>
            <p className="mt-0.5">{labelFor(STATE_OPTIONS, c.state)}</p>
            {c.state_note && <p className="mt-1 text-muted-2">{c.state_note}</p>}
          </div>
        )}
        <Chips values={c.beauty_needs} options={BEAUTY_NEED_OPTIONS} />
        <Chips values={c.issues} options={issueOptions} />
      </Section>

      <Section title="記憶">
        <p>{c.memory_note || "—"}</p>
      </Section>

      <Section title="気づき">
        <Chips values={c.notice_items} options={NOTICE_ITEM_OPTIONS} />
        {c.notice_note && <p>{c.notice_note}</p>}
      </Section>

      <Section title="直感">
        <p className="italic">{c.intuition_text || "—"}</p>
      </Section>

      <Section title="直感のきっかけ">
        <Chips values={c.intuition_cue_items} options={INTUITION_CUE_OPTIONS} />
        {c.intuition_cue_note && <p>{c.intuition_cue_note}</p>}
      </Section>

      <Section title="発見">
        <Chips values={c.discoveries} options={DISCOVERY_OPTIONS} />
        <Row label="お客様が大切にしていたこと" value={labelFor(CUSTOMER_PRIORITY_OPTIONS, c.customer_priority)} />
        <Row label="実際に何を聞いたか" value={c.discover_asked} />
        <Row label="何が分かったか" value={c.discover_found} />
        <Row label="お客様が言った希望" value={c.discover_customer_wish} />
        <Row label="本当の課題" value={c.discover_real_issue} />
        <Row label="言葉と課題は同じだったか" value={labelFor(DISCOVER_ALIGNMENT_OPTIONS, c.discover_alignment)} />
      </Section>

      <Section title="決断">
        <Chips values={c.decision_categories} options={DECISION_CATEGORY_OPTIONS} />
        {c.decision_options.map((o, i) => (
          <Row key={i} label={o.label} value={o.text} />
        ))}
        <Row label="今日の提案" value={c.decision_final} />
        <Row label="理由" value={c.decision_reason} />
        <Row label="やらなかった提案" value={c.decision_not_chosen} />
        <Row label="やらなかった理由" value={c.decision_not_chosen_reason} />
      </Section>

      <Section title="予測">
        <Row label="髪の状態" value={c.forecast_hair_state} />
        <Row label="気持ち" value={c.forecast_feeling} />
        <Row label="次にしたくなりそうなスタイル" value={c.forecast_next_style} />
        <Row label="必要になりそうな施術" value={c.forecast_next_treatment} />
        <Row label="来店時期" value={c.forecast_next_visit_timing} />
        <Row label="成功の定義" value={c.forecast_success_state} />
      </Section>

      <Section title="最高のビフォー">
        <Chips values={c.best_before_items} options={BEST_BEFORE_ITEM_OPTIONS} />
        <Chips values={c.best_before_actions} options={BEST_BEFORE_ACTION_OPTIONS} />
        {c.best_before_note && <p>{c.best_before_note}</p>}
      </Section>

      {review && (
        <>
          <Section title="結果">
            <Row label="予測はどうだったか" value={labelFor(FORECAST_ACCURACY_OPTIONS, review.forecast_accuracy)} />
            <Row
              label="前回のアフターは良いビフォーにつながったか"
              value={labelFor(BEFORE_CONNECTION_OPTIONS, review.before_connection)}
            />
            <Row label="実際にはどうなったか" value={review.actual_result} />
            <Row label="何が当たっていたか" value={review.what_was_right} />
            <Row label="何を読み違えたか" value={review.what_was_missed} />
            <Row label="新しく気づいたこと" value={review.new_notice} />
            <Row label="次回何を見るか" value={review.next_watch_point} />
          </Section>
          {review.learning && (
            <Section title="学び">
              <p>{review.learning}</p>
            </Section>
          )}
        </>
      )}

      {nextCase && (
        <Link
          href={`/case/${nextCase.id}`}
          className="mt-4 block rounded-lg border border-border px-4 py-2.5 text-sm text-muted"
        >
          次回のCASE（{formatDate(nextCase.created_at)}）→
        </Link>
      )}

      {isOwner && !review && (
        <Link
          href={`/case/${c.id}/review`}
          className="mt-6 block rounded-lg bg-foreground py-3.5 text-center text-base font-medium text-background"
        >
          答え合わせをする
        </Link>
      )}

      {isAdmin && (
        <AdminPickupControl
          caseId={c.id}
          initialIsPickup={c.is_pickup}
          initialComment={c.pickup_comment}
        />
      )}
    </div>
  );
}
