"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { membersApi, Member, getUser } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function TraineeProfilePage() {
  const [memberProfile, setMemberProfile] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useMemo(() => getUser(), []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await membersApi.getProfile();
        if (response.success && response.data) {
          setMemberProfile(response.data);
        } else {
          console.error("Failed to load profile:", response);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!memberProfile && !loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-slate-600">Unable to load your profile. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const daysLeft = memberProfile?.membershipEndDate
    ? Math.ceil((new Date(memberProfile.membershipEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Profile</p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Your information
          </h1>
        </div>
        <Link href="/trainee/profile/edit" className="text-sm font-semibold text-emerald-800">
          Edit profile
        </Link>
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center">
            <span className="text-2xl font-semibold text-slate-600">
              {memberProfile?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700 flex-1">
            <Info label="Name" value={memberProfile?.name || "—"} />
            <Info label="Phone" value={memberProfile?.phone || "—"} />
            <Info label="Email" value={memberProfile?.email || "—"} />
            <Info label="Age" value={memberProfile?.age ? `${memberProfile.age}` : "—"} />
            <Info label="Weight" value={memberProfile?.weight ? `${memberProfile.weight} kg` : "—"} />
            <Info label="Membership plan" value={memberProfile?.plan || "—"} />
            <Info
              label="Expires"
              value={memberProfile?.membershipEndDate
                ? `${formatDate(new Date(memberProfile.membershipEndDate).toISOString().slice(0, 10))} • ${daysLeft} days left`
                : "—"}
            />
            <Info label="Class" value={memberProfile?.class || "—"} />
            <Info label="Class Type" value={memberProfile?.classType || "—"} />
            <Info label="Difficulty Level" value={memberProfile?.difficultyLevel || "—"} />
            <Info
              label="Next Billing"
              value={memberProfile?.nextBillingDate
                ? formatDate(new Date(memberProfile.nextBillingDate).toISOString().slice(0, 10))
                : "—"}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

