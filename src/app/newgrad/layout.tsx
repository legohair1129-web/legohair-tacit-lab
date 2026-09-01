import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Yomogi } from "next/font/google";
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

// Casual JP handwriting face for Phase 1's HOT PINK emphasis words (01-04).
const yomogi = Yomogi({
  variable: "--ng-font-hand",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "LEGOHAIR NEW GRAD | FUTURE EXPERIENCE",
  description: "就職先を探すページではない。未来の自分を見つけるページ。",
};

// Scoped to this route segment only (never touches the root layout, so
// TACIT LAB's own viewport is unaffected). viewportFit: "cover" lets this
// page draw its own background under the iOS status bar/notch instead of
// the OS drawing a separate blank bar there - Hero (which sits at the very
// top of the page) adds its own env(safe-area-inset-top) padding so its
// content still clears the notch, keeping the "Add to Home Screen"
// standalone launch and a normal Safari tab visually aligned.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
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
    <div className={`ng-scope ${fraunces.variable} ${inter.variable} ${yomogi.variable}`}>
      <ScrollSmooth />
      <NewGradProvider>{children}</NewGradProvider>
    </div>
  );
}
