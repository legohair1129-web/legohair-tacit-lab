import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./newgrad.css";
import { NewGradProvider } from "@/lib/newgrad/StateProvider";
import { ScrollSmooth } from "@/components/newgrad/ui/ScrollSmooth";

// Editorial serif for large English headline words (WHO WILL YOU BECOME?).
const fraunces = Fraunces({
  variable: "--ng-font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Helvetica/Arial-adjacent grotesk for English labels, kickers and numerals.
const inter = Inter({
  variable: "--ng-font-sans-en",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    <div className={`ng-scope ${fraunces.variable} ${inter.variable}`}>
      <ScrollSmooth />
      <NewGradProvider>{children}</NewGradProvider>
    </div>
  );
}
