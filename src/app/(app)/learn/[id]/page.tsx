import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LearnArticleClient } from "@/components/learn/LearnArticleClient";

export default async function LearnArticlePage({ params }: PageProps<"/learn/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: article }, { data: strengthTypes }, { data: ownResponse }] = await Promise.all([
    supabase.from("master_knowledge").select("*").eq("id", id).single(),
    supabase.from("strength_types").select("key,name_ja"),
    supabase
      .from("master_knowledge_responses")
      .select("response_text,reflection_text")
      .eq("master_knowledge_id", id)
      .eq("staff_id", user.id)
      .maybeSingle(),
  ]);

  if (!article) notFound();

  return (
    <LearnArticleClient
      article={article}
      strengthTypeNames={Object.fromEntries((strengthTypes ?? []).map((t) => [t.key, t.name_ja]))}
      initialResponseText={ownResponse?.response_text ?? null}
      initialReflectionText={ownResponse?.reflection_text ?? null}
      userId={user.id}
    />
  );
}
