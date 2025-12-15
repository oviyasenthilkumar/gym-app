"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trainerProfile } from "@/data/trainer";
import { getUser } from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";

export function TrainerTopbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

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
          placeholder="Search classes or members"
          className="shadow-none"
          leading="🔎"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Button variant="secondary" size="sm" className="hidden md:inline-flex">
          Quick note
        </Button>
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={trainerProfile.avatar}
              alt={user?.name || trainerProfile.name}
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {user?.name || trainerProfile.name}
            </p>
            <p className="text-xs text-slate-500">Trainer</p>
          </div>
        </div>
      </div>
    </header>
  );
}

