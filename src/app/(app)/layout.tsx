"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Only allow admin users to access admin pages
    if (user.role !== 'admin') {
      // Redirect based on role
      if (user.role === 'trainer') {
        router.push("/trainer/dashboard");
      } else if (user.role === 'member') {
        router.push("/trainee/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [router]);

  if (!mounted) return null;

  const user = getUser();
  if (!user || user.role !== 'admin') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex flex-1 flex-col lg:pl-0">
          <Topbar onToggleSidebar={() => setOpen(true)} />
          <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

