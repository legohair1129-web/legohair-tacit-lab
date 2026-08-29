"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCaseFormDraft } from "@/components/case-form/useCaseFormDraft";
import { CASE_FORM_STEPS } from "@/components/case-form/types";
import { labelFor } from "@/lib/constants/options";
import { MENU_OPTIONS } from "@/lib/constants/caseFlow";
import type { Case, CaseReview } from "@/lib/types/database";
import { CustomerSelectStep, type CustomerPickerItem } from "@/components/case-form/steps/CustomerSelectStep";
import { AnswerCheckStep } from "@/components/case-form/steps/AnswerCheckStep";
import { CustomerBasicsStep } from "@/components/case-form/steps/CustomerBasicsStep";
import { DiscoverStep } from "@/components/case-form/steps/DiscoverStep";
import { DesignStep } from "@/components/case-form/steps/DesignStep";
import { NextBeforeStep } from "@/components/case-form/steps/NextBeforeStep";
import { SaveSummary } from "@/components/case-form/SaveSummary";

const TOTAL_STEPS = CASE_FORM_STEPS.length;

type LatestCase = { id: string; forecastSuccessState: string | null };

export default function NewCasePage() {
  const supabase = useMemo(() => createClient(), []);
  const { state, patch, clearDraft, hydrated } = useCaseFormDraft();

  const [stepIndex, setStepIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerPickerItem[]>([]);
  const [latestCaseByCustomer, setLatestCaseByCustomer] = useState<Record<string, LatestCase>>({});
  const [answerCheckTarget, setAnswerCheckTarget] = useState<{ caseId: string; text: string } | null>(
    null
  );
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);

  const answerCheckNeeded = answerCheckTarget !== null;

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [{ data: customerRows }, { data: caseRows }, { data: profile }] = await Promise.all([
        supabase
          .from("customers")
          .select("id,age_group,store,created_at")
          .eq("created_by", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("cases")
          .select("id,customer_key,menu,created_at,forecast_success_state")
          .eq("staff_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from("profiles").select("store").eq("id", user.id).single(),
      ]);

      if (profile?.store && !state.store) patch({ store: profile.store });

      const latestByCustomer: Record<string, LatestCase> = {};
      const latestCaseFullByCustomer: Record<
        string,
        { id: string; menu: string | null; created_at: string }
      > = {};
      for (const c of caseRows ?? []) {
        if (!latestByCustomer[c.customer_key]) {
          latestByCustomer[c.customer_key] = { id: c.id, forecastSuccessState: c.forecast_success_state };
          latestCaseFullByCustomer[c.customer_key] = c;
        }
      }
      setLatestCaseByCustomer(latestByCustomer);

      setCustomers(
        (customerRows ?? []).map((c) => {
          const latest = latestCaseFullByCustomer[c.id];
          return {
            id: c.id,
            ageGroup: c.age_group,
            store: c.store,
            lastMenu: latest?.menu ?? null,
            lastVisitLabel: latest
              ? new Date(latest.created_at).toLocaleDateString("ja-JP", {
                  month: "numeric",
                  day: "numeric",
                })
              : new Date(c.created_at).toLocaleDateString("ja-JP", {
                  month: "numeric",
                  day: "numeric",
                }),
          };
        })
      );
      setLoadingCustomers(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function loadAnswerCheck() {
      if (state.customerMode !== "existing" || !state.existingCustomerId) {
        setAnswerCheckTarget(null);
        return;
      }
      const previous = latestCaseByCustomer[state.existingCustomerId];
      if (!previous || !previous.forecastSuccessState) {
        setAnswerCheckTarget(null);
        return;
      }
      const { data: review } = await supabase
        .from("case_reviews")
        .select("id")
        .eq("case_id", previous.id)
        .maybeSingle<Pick<CaseReview, "id">>();
      setAnswerCheckTarget(review ? null : { caseId: previous.id, text: previous.forecastSuccessState });
    }
    loadAnswerCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.customerMode, state.existingCustomerId, latestCaseByCustomer]);

  function goNext() {
    setStepIndex((i) => {
      let next = i + 1;
      if (CASE_FORM_STEPS[next] === "ANSWER_CHECK" && !answerCheckNeeded) next += 1;
      return Math.min(next, TOTAL_STEPS - 1);
    });
  }
  function goBack() {
    setStepIndex((i) => {
      let prev = i - 1;
      if (CASE_FORM_STEPS[prev] === "ANSWER_CHECK" && !answerCheckNeeded) prev -= 1;
      return Math.max(prev, 0);
    });
  }

  async function handleAnswerCheckSave(accuracy: string, note: string) {
    if (!userId || !answerCheckTarget) return;
    setError(null);
    try {
      const { error } = await supabase.from("case_reviews").insert({
        case_id: answerCheckTarget.caseId,
        reviewed_by: userId,
        forecast_accuracy: accuracy as CaseReview["forecast_accuracy"],
        actual_result: note || null,
      });
      if (error) throw error;
      setAnswerCheckTarget(null);
      goNext();
    } catch (e) {
      setError(e instanceof Error ? e.message : "答え合わせの保存に失敗しました。");
    }
  }

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setError(null);

    try {
      let customerId = state.existingCustomerId;

      if (state.customerMode === "new") {
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .insert({ created_by: userId, store: state.store || null, age_group: state.ageGroup || null })
          .select("id")
          .single();
        if (customerError) throw customerError;
        customerId = customer.id;
      }

      if (!customerId) throw new Error("お客様が選択されていません。");

      const previousCaseId =
        state.customerMode === "existing" ? latestCaseByCustomer[customerId]?.id ?? null : null;

      const { data: newCase, error: caseError } = await supabase
        .from("cases")
        .insert({
          customer_key: customerId,
          staff_id: userId,
          previous_case_id: previousCaseId,
          store: state.store || null,
          age_group: state.ageGroup || null,
          visit_type: state.visitType || null,
          visit_cycle: state.visitCycle || null,
          menu:
            state.menuItems.length > 0
              ? state.menuItems.map((v) => labelFor(MENU_OPTIONS, v)).join("・")
              : null,
          menu_items: state.menuItems,
          discoveries: state.discoveries,
          customer_priority: state.customerPriority || null,
          notice_note: state.observationNote || null,
          decision_categories: state.decisionCategories,
          decision_final: state.finalProposal || null,
          decision_reason: state.proposalReason || null,
          forecast_success_state: state.nextBefore || null,
          is_shared: state.isShared,
        } satisfies Partial<Case>)
        .select("id")
        .single();

      if (caseError) throw caseError;

      clearDraft();
      setSavedCaseId(newCase.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  }

  if (!hydrated) return null;

  if (savedCaseId) {
    return <SaveSummary value={state} caseId={savedCaseId} />;
  }

  const step = CASE_FORM_STEPS[stepIndex];
  const shared = { stepIndex, totalSteps: TOTAL_STEPS, onBack: stepIndex > 0 ? goBack : undefined };

  return (
    <>
      {error && (
        <div className="fixed inset-x-0 top-0 z-50 bg-danger px-4 py-2 text-center text-sm text-white">
          {error}
        </div>
      )}

      {step === "CUSTOMER_SELECT" && (
        <CustomerSelectStep
          value={state}
          onPatch={patch}
          onNext={goNext}
          existingCustomers={customers}
          loadingCustomers={loadingCustomers}
          {...shared}
        />
      )}
      {step === "ANSWER_CHECK" && answerCheckTarget && (
        <AnswerCheckStep
          onBack={shared.onBack}
          onSave={handleAnswerCheckSave}
          stepIndex={stepIndex}
          totalSteps={TOTAL_STEPS}
          targetText={answerCheckTarget.text}
        />
      )}
      {step === "CUSTOMER_BASICS" && <CustomerBasicsStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "DISCOVER" && <DiscoverStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "DESIGN" && <DesignStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "NEXT_BEFORE" && (
        <NextBeforeStep value={state} onPatch={patch} onNext={handleSave} saving={saving} {...shared} />
      )}
    </>
  );
}
