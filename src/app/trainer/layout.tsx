"use client";

import { TrainerSidebar } from "@/components/layout/trainer-sidebar";
import { TrainerTopbar } from "@/components/layout/trainer-topbar";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function TrainerLayout({
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

    // Only allow trainer users to access trainer pages
    if (user.role !== 'trainer') {
      // Redirect based on role
      if (user.role === 'admin') {
        router.push("/dashboard");
      } else if (user.role === 'member') {
        router.push("/trainee/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [router]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) return null;

  const user = getUser();
  if (!user || user.role !== 'trainer') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <TrainerSidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex flex-1 flex-col lg:pl-0">
          <TrainerTopbar onToggleSidebar={() => setOpen(true)} />
          <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

