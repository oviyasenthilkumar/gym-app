"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import { membersApi, Member, getUser } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { traineeClasses, attendanceHistory } from "@/data/trainee";

export default function TraineeDashboardPage() {
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
        // Get current user's member profile using profile endpoint
        const response = await membersApi.getProfile();
        if (response.success && response.data) {
          setMemberProfile(response.data);
        } else {
          console.error("Failed to load profile:", response);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        // Don't use slow fallback - just show error state
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Check if membership is expiring in 7 days
  const isExpiringSoon = () => {
    if (!memberProfile?.membershipEndDate) return false;
    const endDate = new Date(memberProfile.membershipEndDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };

  const upcoming = traineeClasses.filter((c) => c.status === "Upcoming").slice(0, 3);
  const lastAttendance = attendanceHistory.slice(0, 3);

  // Show skeleton/placeholder content instead of loading spinner to prevent flash
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {loading ? (
            <span className="inline-block h-7 w-48 bg-slate-200 rounded animate-pulse"></span>
          ) : (
            memberProfile?.name || user?.name || "Trainee Dashboard"
          )}
        </h1>
        <p className="text-sm text-slate-600">
          Track your membership, attendance, and next classes.
        </p>
      </div>

      {/* Expiring Warning */}
      {!loading && isExpiringSoon() && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-900 font-semibold">⚠️ Warning:</span>
            <span className="text-amber-800">
              Your membership is expiring in 7 days or less. Please renew to continue access.
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Active plan</p>
          {loading ? (
            <>
              <div className="mt-2 h-8 w-24 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-2 h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
            </>
          ) : (
            <>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {memberProfile?.plan || "N/A"}
              </p>
              <p className="text-sm text-slate-600">
                {memberProfile?.membershipEndDate
                  ? `Expires ${formatDate(new Date(memberProfile.membershipEndDate).toISOString().slice(0, 10))}`
                  : "No expiry date"}
              </p>
            </>
          )}
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Attendance summary
          </p>
          {loading ? (
            <>
              <div className="mt-2 h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-3 h-2 rounded-full bg-slate-200"></div>
              <div className="mt-1 h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
            </>
          ) : (
            <>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                88%
              </p>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <span
                  className="block h-full rounded-full bg-emerald-600"
                  style={{ width: `88%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Weekly trend improving
              </p>
            </>
          )}
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Next Billing</p>
          {loading ? (
            <>
              <div className="mt-2 h-8 w-32 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-2 h-4 w-40 bg-slate-200 rounded animate-pulse"></div>
            </>
          ) : (
            <>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {memberProfile?.nextBillingDate
                  ? formatDate(new Date(memberProfile.nextBillingDate).toISOString().slice(0, 10))
                  : "N/A"}
              </p>
              <p className="text-sm text-slate-600">
                {memberProfile?.nextBillingDate ? "30 days from start" : "No billing date"}
              </p>
            </>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Upcoming classes">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.map((cls) => (
                <TableRow
                  key={cls.id}
                  cells={[
                    <div key="title">
                      <p className="font-semibold text-slate-900">{cls.title}</p>
                      <p className="text-xs text-slate-500">
                        {cls.trainer} • {formatDate(cls.date)} • {cls.time}
                      </p>
                    </div>,
                    <span key="duration" className="text-sm text-slate-600">
                      {cls.duration}
                    </span>,
                  ]}
                  className="grid-cols-[1.6fr,0.8fr]"
                />
              ))}
            </div>
          )}
        </Card>

        <Card title="Recent attendance">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-20 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {lastAttendance.map((item) => (
                <TableRow
                  key={item.classId}
                  cells={[
                    <div key="name">
                      <p className="font-semibold text-slate-900">
                        {item.className}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(item.date)}
                      </p>
                    </div>,
                    <span
                      key="status"
                      className={`badge ${
                        item.status === "Present"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>,
                  ]}
                  className="grid-cols-[1.6fr,0.8fr]"
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
