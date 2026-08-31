import { redirect } from "next/navigation";

// This branch (claude/legohair-newgrad-lp-c3mv8k) exists only to power a
// dedicated newgrad-preview Vercel Project, whose Production Branch is
// pointed here instead of main - so "/" landing on the new-grad LP is
// scoped to that separate deployment and never reaches TACIT LAB's real
// production (main keeps its own unmodified redirect("/home") on "/").
export default function RootPage() {
  redirect("/newgrad");
}
