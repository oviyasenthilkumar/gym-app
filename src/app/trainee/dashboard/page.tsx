"use client";

import { useEffect, useState, useMemo } from "react";
import { membersApi, sessionsApi, attendanceApi, Member, getUser } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  Activity, Calendar, Clock, CreditCard, TrendingUp,
  MapPin, User, ArrowRight, CheckCircle, XCircle, AlertTriangle
} from "lucide-react";

export default function TraineeDashboardPage() {
  const [memberProfile, setMemberProfile] = useState<Member | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useMemo(() => getUser(), []);
  const [attendancePercent, setAttendancePercent] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [profileRes, sessionsRes, attendanceRes] = await Promise.all([
          membersApi.getProfile(),
          sessionsApi.getAll(new Date().toISOString()), // Fetch future sessions
          attendanceApi.getMemberHistory()
        ]);

        if (profileRes.success && profileRes.data) {
          setMemberProfile(profileRes.data);
        }

        if (sessionsRes.success && sessionsRes.data) {
          // Filter for upcoming sessions and sort by date
          const upcoming = sessionsRes.data
            .filter(s => new Date(s.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3);
          setUpcomingClasses(upcoming);
        }

        if (attendanceRes.success && attendanceRes.data) {
          const history = attendanceRes.data;
          const total = history.length;
          const present = history.filter((h: any) => h.isPresent).length;
          const percent = total > 0 ? Math.round((present / total) * 100) : 0;

          setAttendancePercent(percent);
          setRecentAttendance(history.slice(0, 3));
        }

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Check if membership is expiring in 7 days
  const isExpiringSoon = () => {
    if (!memberProfile?.membershipEndDate) return false;
    const endDate = new Date(memberProfile.membershipEndDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {memberProfile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || "Trainee"}! 👋
        </h1>
        <p className="text-slate-500">
          Here's what's happening with your training today.
        </p>
      </div>

      {/* Expiring Warning */}
      {isExpiringSoon() && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">Membership Expiring Soon</h3>
            <p className="text-sm text-amber-800 mt-1">
              Your membership is expiring in less than 7 days. Please renew to continue accessing classes and facilities.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Active Plan */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 group hover:border-emerald-200 transition-all">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-50 opacity-50 blur-2xl group-hover:bg-emerald-100 transition-all" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Plan</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{memberProfile?.plan || "No Plan"}</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {memberProfile?.membershipEndDate
              ? `Expires ${formatDate(new Date(memberProfile.membershipEndDate).toISOString().slice(0, 10))}`
              : "No expiry date"}
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 group hover:border-blue-200 transition-all">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-50 opacity-50 blur-2xl group-hover:bg-blue-100 transition-all" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Attendance Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{attendancePercent}%</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-blue-500"
                style={{ width: `${attendancePercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">Keep up the consistency!</p>
          </div>
        </div>

        {/* Next Billing */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 group hover:border-purple-200 transition-all">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-purple-50 opacity-50 blur-2xl group-hover:bg-purple-100 transition-all" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Next Billing</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {memberProfile?.nextBillingDate
                  ? formatDate(new Date(memberProfile.nextBillingDate).toISOString().slice(0, 10))
                  : "N/A"}
              </h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            {memberProfile?.nextBillingDate ? "Upcoming renewal" : "No billing scheduled"}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upcoming Classes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Classes</h2>
            <Link href="/trainee/schedule" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingClasses.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No upcoming classes scheduled.</p>
                <Link href="/trainee/schedule" className="text-sm font-medium text-emerald-600 mt-2 inline-block">
                  Browse Schedule
                </Link>
              </div>
            ) : (
              upcomingClasses.map((cls) => (
                <div key={cls._id} className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm flex-col leading-none">
                    <span>{new Date(cls.date).getDate()}</span>
                    <span className="text-[10px] uppercase mt-0.5">{new Date(cls.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-slate-900">{cls.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {cls.startTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {typeof cls.trainer === 'string' ? 'Trainer' : cls.trainer.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {cls.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Attendance</h2>
            <Link href="/trainee/attendance" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View History <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentAttendance.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <Activity className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No attendance records yet.</p>
              </div>
            ) : (
              recentAttendance.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.isPresent ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                      {item.isPresent ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.sessionId?.name || 'Unknown Class'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(item.dateAttended)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isPresent
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                    }`}>
                    {item.isPresent ? 'Present' : 'Absent'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
