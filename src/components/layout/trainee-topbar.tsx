"use client";

import { Input } from "@/components/ui/input";
import { membersApi, Member, getUser } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";

export function TraineeTopbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const user = useMemo(() => getUser(), []);
  const [memberProfile, setMemberProfile] = useState<Member | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const response = await membersApi.getProfile();
        if (response.success && response.data) {
          setMemberProfile(response.data);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, [user]);

  const displayName = memberProfile?.name || user?.name || "Trainee";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <button
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        onClick={onToggleSidebar}
        aria-label="Open navigation"
      >
        ☰
      </button>

      <div className="hidden w-full max-w-md lg:block">
        <Input
          placeholder="Search classes or attendance"
          className="shadow-none"
          leading="🔎"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100 flex items-center justify-center">
          {memberProfile ? (
            <span className="text-sm font-semibold text-slate-600">
              {initials}
            </span>
          ) : (
            <span className="text-sm font-semibold text-slate-600">U</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {displayName}
          </p>
          <p className="text-xs text-slate-500">Trainee</p>
        </div>
      </div>
    </header>
  );
}

