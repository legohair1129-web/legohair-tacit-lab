"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCaseFormDraft } from "@/components/case-form/useCaseFormDraft";
import { CASE_FORM_STEPS } from "@/components/case-form/types";
import type { Option } from "@/lib/constants/options";
import type { Case } from "@/lib/types/database";
import { CustomerBasicStep, type CustomerPickerItem } from "@/components/case-form/steps/CustomerBasicStep";
import { CustomerStateStep } from "@/components/case-form/steps/CustomerStateStep";
import { BeautyNeedStep } from "@/components/case-form/steps/BeautyNeedStep";
import { IssueStep } from "@/components/case-form/steps/IssueStep";
import { RelationshipStep } from "@/components/case-form/steps/RelationshipStep";
import { MemoryStep } from "@/components/case-form/steps/MemoryStep";
import { NoticeStep } from "@/components/case-form/steps/NoticeStep";
import { IntuitionStep } from "@/components/case-form/steps/IntuitionStep";
import { IntuitionCueStep } from "@/components/case-form/steps/IntuitionCueStep";
import { DiscoverStep } from "@/components/case-form/steps/DiscoverStep";
import { DecisionStep } from "@/components/case-form/steps/DecisionStep";
import { ForecastStep } from "@/components/case-form/steps/ForecastStep";
import { BestBeforeStep } from "@/components/case-form/steps/BestBeforeStep";
import { SaveSummary } from "@/components/case-form/SaveSummary";

const TOTAL_STEPS = CASE_FORM_STEPS.length;

export default function NewCasePage() {
  const supabase = useMemo(() => createClient(), []);
  const { state, patch, clearDraft, hydrated } = useCaseFormDraft();

  const [stepIndex, setStepIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [issueOptions, setIssueOptions] = useState<Option[]>([]);
  const [customers, setCustomers] = useState<CustomerPickerItem[]>([]);
  const [latestCaseByCustomer, setLatestCaseByCustomer] = useState<Record<string, string>>({});
  const [previousReviewLearning, setPreviousReviewLearning] = useState<string | null>(null);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [{ data: categories }, { data: customerRows }, { data: caseRows }, { data: profile }] =
        await Promise.all([
          supabase
            .from("categories")
            .select("value,label")
            .eq("field_key", "issue")
            .eq("is_active", true)
            .order("sort_order"),
          supabase
            .from("customers")
            .select("id,age_group,store,created_at")
            .eq("created_by", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("cases")
            .select("id,customer_key,menu,created_at")
            .eq("staff_id", user.id)
            .order("created_at", { ascending: false }),
          supabase.from("profiles").select("store").eq("id", user.id).single(),
        ]);

      if (categories) setIssueOptions(categories);

      if (profile?.store && !state.store) patch({ store: profile.store });

      const latestByCustomer: Record<string, string> = {};
      const latestCaseFullByCustomer: Record<
        string,
        { id: string; menu: string | null; created_at: string }
      > = {};
      for (const c of caseRows ?? []) {
        if (!latestByCustomer[c.customer_key]) {
          latestByCustomer[c.customer_key] = c.id;
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
    async function loadPreviousReview() {
      if (state.customerMode !== "existing" || !state.existingCustomerId) {
        setPreviousReviewLearning(null);
        return;
      }
      const previousCaseId = latestCaseByCustomer[state.existingCustomerId];
      if (!previousCaseId) return;
      const { data } = await supabase
        .from("case_reviews")
        .select("learning")
        .eq("case_id", previousCaseId)
        .maybeSingle();
      setPreviousReviewLearning(data?.learning ?? null);
    }
    loadPreviousReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.customerMode, state.existingCustomerId]);

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, TOTAL_STEPS - 1));
  }
  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
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
        state.customerMode === "existing" ? latestCaseByCustomer[customerId] ?? null : null;

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
          menu: state.menu || null,
          relationship_level: state.relationshipLevel || null,
          state: (state.state || null) as Case["state"],
          state_note: state.stateNote || null,
          beauty_needs: state.beautyNeeds,
          issues: state.issues,
          memory_note: state.memoryNote || null,
          notice_items: state.noticeItems,
          notice_note: state.noticeNote || null,
          intuition_text: state.intuitionText || null,
          intuition_cue_items: state.intuitionCueItems,
          intuition_cue_note: state.intuitionCueNote || null,
          discover_asked: state.discoverAsked || null,
          discover_found: state.discoverFound || null,
          discover_customer_wish: state.discoverCustomerWish || null,
          discover_real_issue: state.discoverRealIssue || null,
          discover_alignment: (state.discoverAlignment || null) as Case["discover_alignment"],
          decision_options: state.decisionOptions,
          decision_final: state.decisionFinal || null,
          decision_reason: state.decisionReason || null,
          decision_not_chosen: state.decisionNotChosen || null,
          decision_not_chosen_reason: state.decisionNotChosenReason || null,
          forecast_hair_state: state.forecastHairState || null,
          forecast_feeling: state.forecastFeeling || null,
          forecast_next_style: state.forecastNextStyle || null,
          forecast_next_treatment: state.forecastNextTreatment || null,
          forecast_next_visit_timing: state.forecastNextVisitTiming || null,
          forecast_success_state: state.forecastSuccessState || null,
          best_before_items: state.bestBeforeItems,
          best_before_actions: state.bestBeforeActions,
          best_before_note: state.bestBeforeNote || null,
          is_shared: state.isShared,
        })
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

      {step === "CUSTOMER_BASIC" && (
        <CustomerBasicStep
          value={state}
          onPatch={patch}
          onNext={goNext}
          existingCustomers={customers}
          loadingCustomers={loadingCustomers}
          {...shared}
        />
      )}
      {step === "CUSTOMER_STATE" && <CustomerStateStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "BEAUTY_NEED" && <BeautyNeedStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "ISSUE" && (
        <IssueStep value={state} onPatch={patch} onNext={goNext} issueOptions={issueOptions} {...shared} />
      )}
      {step === "RELATIONSHIP" && <RelationshipStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "MEMORY" && (
        <MemoryStep
          value={state}
          onPatch={patch}
          onNext={goNext}
          previousReviewLearning={previousReviewLearning}
          {...shared}
        />
      )}
      {step === "NOTICE" && <NoticeStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "INTUITION" && <IntuitionStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "INTUITION_CUE" && <IntuitionCueStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "DISCOVER" && <DiscoverStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "DECISION" && <DecisionStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "FORECAST" && <ForecastStep value={state} onPatch={patch} onNext={goNext} {...shared} />}
      {step === "BEST_BEFORE" && (
        <BestBeforeStep value={state} onPatch={patch} onNext={handleSave} saving={saving} {...shared} />
      )}
    </>
  );
}
