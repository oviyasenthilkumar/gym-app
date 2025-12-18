"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Members", href: "/members" },
  { label: "Classes", href: "/classes" },
  { label: "Attendance", href: "/attendance" },
  { label: "Settings", href: "/settings" },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 translate-x-0 bg-white px-5 py-6 shadow-xl transition-transform lg:static lg:block lg:translate-x-0",
          "lg:sticky lg:top-0 lg:h-screen",
          !open && "hidden lg:block"
        )}
      >
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-300 text-white font-semibold">
              GM
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Gym Mini</p>
              <p className="text-xs text-slate-500">Micro-SaaS Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-700",
                  isActive
                    ? "bg-blue-300 text-white shadow-sm"
                    : "text-slate-700"
                )}
                onClick={onClose}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg text-sm font-bold",
                    isActive ? "bg-white/20" : "bg-slate-100 text-slate-500"
                  )}
                  aria-hidden
                >
                  {item.label.charAt(0)}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Quick Help Center
          </p>
          <p className="mt-1 text-xs text-slate-500">
            View member onboarding, billing tips, and reports in seconds.
          </p>
          <Link
            href="/guide"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
          >
            Open guide →
          </Link>
        </div>
      </aside>
    </>
  );
}

