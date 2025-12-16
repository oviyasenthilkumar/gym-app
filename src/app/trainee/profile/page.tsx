"use client";

import { useEffect, useState, useMemo } from "react";
import { membersApi, Member, getUser } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  User, Phone, Mail, Calendar, Weight, Activity,
  CreditCard, Clock, MapPin, Edit2, ShieldCheck
} from "lucide-react";

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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
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
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-emerald-500 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl" />

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="relative">
            <div className="h-28 w-28 rounded-full border-4 border-white/20 bg-slate-800 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
              {memberProfile?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div>
              <h1 className="text-3xl font-bold">{memberProfile?.name}</h1>
              <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {memberProfile?.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {memberProfile?.role || 'Member'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/10">
                <Activity className="h-4 w-4 text-blue-400" />
                Active Status
              </span>
            </div>
          </div>

          <Link
            href="/trainee/profile/edit"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-semibold hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            Personal Information
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              <InfoRow icon={User} label="Full Name" value={memberProfile?.name} />
              <InfoRow icon={Mail} label="Email Address" value={memberProfile?.email} />
              <InfoRow icon={Phone} label="Phone Number" value={memberProfile?.phone} />
              <InfoRow icon={Calendar} label="Age" value={memberProfile?.age ? `${memberProfile.age} years` : undefined} />
              <InfoRow icon={Weight} label="Weight" value={memberProfile?.weight ? `${memberProfile.weight} kg` : undefined} />
              <InfoRow
                icon={Clock}
                label="Member Since"
                value={memberProfile?.createdAt ? formatDate(memberProfile.createdAt) : undefined}
              />
            </div>
          </div>
        </div>

        {/* Membership Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Membership Details
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              <InfoRow icon={Activity} label="Current Plan" value={memberProfile?.plan} highlight />
              <InfoRow
                icon={Calendar}
                label="Expires On"
                value={memberProfile?.membershipEndDate ? formatDate(new Date(memberProfile.membershipEndDate).toISOString().slice(0, 10)) : undefined}
                subValue={daysLeft > 0 ? `${daysLeft} days remaining` : "Expired"}
                subValueColor={daysLeft > 7 ? "text-emerald-600" : "text-rose-600"}
              />
              <InfoRow
                icon={Clock}
                label="Next Billing"
                value={memberProfile?.nextBillingDate ? formatDate(new Date(memberProfile.nextBillingDate).toISOString().slice(0, 10)) : undefined}
              />
              <InfoRow icon={MapPin} label="Assigned Class" value={memberProfile?.class} />
              <InfoRow icon={Activity} label="Class Type" value={memberProfile?.classType} />
              <InfoRow icon={Activity} label="Difficulty" value={memberProfile?.difficultyLevel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  subValue,
  subValueColor = "text-slate-500",
  highlight = false
}: {
  icon: any,
  label: string,
  value?: string,
  subValue?: string,
  subValueColor?: string,
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${highlight ? 'text-emerald-700' : 'text-slate-900'}`}>
          {value || "—"}
        </p>
        {subValue && (
          <p className={`text-xs ${subValueColor} mt-0.5`}>{subValue}</p>
        )}
      </div>
    </div>
  );
}

