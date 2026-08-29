"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STAFF_ITEMS = [
  { href: "/home", label: "HOME" },
  { href: "/case", label: "CASE" },
  { href: "/library", label: "LIBRARY" },
  { href: "/growth", label: "GROWTH" },
] as const;

const ADMIN_ITEM = { href: "/admin/research", label: "RESEARCH" } as const;

export function BottomNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? [...STAFF_ITEMS, ADMIN_ITEM] : STAFF_ITEMS;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 h-[var(--bottom-nav-h)] border-t border-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex h-full max-w-lg items-stretch justify-around">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className="flex h-full flex-col items-center justify-center gap-1.5 text-[11px] tracking-[0.12em]"
              >
                <span
                  className={
                    active ? "font-semibold text-foreground" : "text-muted-2"
                  }
                >
                  {item.label}
                </span>
                <span
                  className={`h-1 w-1 rounded-full ${
                    active ? "bg-accent" : "bg-transparent"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
