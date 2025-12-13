"use client";

import { TraineeSidebar } from "@/components/layout/trainee-sidebar";
import { TraineeTopbar } from "@/components/layout/trainee-topbar";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

export default function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const user = useMemo(() => getUser(), []);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    // Only allow member users to access trainee pages
    if (user.role !== 'member') {
      // Redirect based on role
      if (user.role === 'admin') {
        router.push("/dashboard");
      } else if (user.role === 'trainer') {
        router.push("/trainer/dashboard");
      } else {
        router.push("/login");
      }
      return;
    }
    
    setIsChecking(false);
  }, [router, user]);

  // Show layout immediately to prevent flash, auth check happens in background
  if (isChecking && (!user || user.role !== 'member')) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen">
          <TraineeSidebar open={open} onClose={() => setOpen(false)} />
          <div className="flex flex-1 flex-col lg:pl-0">
            <TraineeTopbar onToggleSidebar={() => setOpen(true)} />
            <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <TraineeSidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex flex-1 flex-col lg:pl-0">
          <TraineeTopbar onToggleSidebar={() => setOpen(true)} />
          <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

