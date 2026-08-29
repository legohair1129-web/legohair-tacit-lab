import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CaseDetail } from "@/components/case/CaseDetail";

export default async function CaseDetailPage({ params }: PageProps<"/case/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: caseRow } = await supabase.from("cases").select("*").eq("id", id).single();
  if (!caseRow) notFound();

  const [{ data: issueCategories }, { data: review }, { data: profile }] = await Promise.all([
    supabase.from("categories").select("value,label").eq("field_key", "issue").order("sort_order"),
    supabase.from("case_reviews").select("*").eq("case_id", id).maybeSingle(),
    supabase.from("profiles").select("role").eq("id", user.id).single(),
  ]);

  const isOwner = caseRow.staff_id === user.id;
  const isAdmin = profile?.role === "admin";
  const showOwner = isOwner || isAdmin;

  let ownerLabel: string | null = null;
  if (showOwner) {
    const { data: ownerProfile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", caseRow.staff_id)
      .single();
    ownerLabel = ownerProfile?.display_name ?? null;
  }

  const [{ data: previousCase }, { data: nextCase }] = await Promise.all([
    caseRow.previous_case_id
      ? supabase
          .from("cases")
          .select("id,created_at")
          .eq("id", caseRow.previous_case_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("cases")
      .select("id,created_at")
      .eq("previous_case_id", id)
      .maybeSingle(),
  ]);

  return (
    <CaseDetail
      caseRow={caseRow}
      issueOptions={issueCategories ?? []}
      review={review ?? null}
      showOwner={showOwner}
      ownerLabel={ownerLabel}
      isOwner={isOwner}
      isAdmin={isAdmin}
      previousCase={previousCase}
      nextCase={nextCase}
    />
  );
}
