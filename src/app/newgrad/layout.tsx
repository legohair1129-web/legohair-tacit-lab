import type { Metadata } from "next";
import "./newgrad.css";
import { NewGradProvider } from "@/lib/newgrad/StateProvider";
import { ScrollSmooth } from "@/components/newgrad/ui/ScrollSmooth";

export const metadata: Metadata = {
  title: "LEGOHAIR NEW GRAD | FUTURE EXPERIENCE",
  description: "就職先を探すページではない。未来の自分を見つけるページ。",
};

/**
 * Fully independent from the (app)/(auth) TACIT LAB product: no shared
 * layout, no auth check, no shared nav. Only the document-level <html>/
 * <body> from the root layout is shared, as required by Next.js.
 */
export default function NewGradLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ng-scope">
      <ScrollSmooth />
      <NewGradProvider>{children}</NewGradProvider>
    </div>
  );
}
