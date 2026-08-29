import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/case/ReviewForm";

export default async function CaseReviewPage({ params }: PageProps<"/case/[id]/review">) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: caseRow } = await supabase.from("cases").select("*").eq("id", id).single();
  if (!caseRow) notFound();
  if (caseRow.staff_id !== user.id) notFound();

  const { data: existingReview } = await supabase
    .from("case_reviews")
    .select("id")
    .eq("case_id", id)
    .maybeSingle();
  if (existingReview) redirect(`/case/${id}`);

  return <ReviewForm caseRow={caseRow} />;
}
