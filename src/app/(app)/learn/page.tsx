import Link from "next/link";

export default function LearnHomePage() {
  return (
    <div className="px-6 py-8">
      <p className="text-xs tracking-[0.2em] text-muted">学び</p>
      <h1 className="mt-2 text-2xl font-medium leading-snug">学びHOME</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        先輩の視点も、仲間の視点も、どちらも学びになります。
      </p>

      <div className="mt-6 space-y-3">
        <Link href="/learn/knowledge" className="block rounded-xl border border-border bg-surface p-5">
          <p className="text-xs tracking-[0.15em] text-accent">MASTER KNOWLEDGE</p>
          <p className="mt-2 text-lg font-medium leading-snug">先輩たちの「見る・考える・提案する」を学ぶ</p>
        </Link>
        <Link href="/library" className="block rounded-xl border border-border bg-surface p-5">
          <p className="text-xs tracking-[0.15em] text-accent">CASEから学ぶ</p>
          <p className="mt-2 text-lg font-medium leading-snug">他のスタッフには、何が見えていた？</p>
        </Link>
      </div>
    </div>
  );
}
