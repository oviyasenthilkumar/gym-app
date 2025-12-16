"use client";

import { attendanceApi, authApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, XCircle, Calendar } from "lucide-react";

export default function TraineeAttendanceOverview() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, profileRes] = await Promise.all([
          attendanceApi.getMemberHistory(),
          authApi.getProfile()
        ]);

        if (attendanceRes.success && attendanceRes.data) {
          setAttendance(attendanceRes.data);
        }

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data.memberDetails);
        }
      } catch (err) {
        setError("Failed to load attendance data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPresent = attendance.filter(
    (h) => h.isPresent
  ).length;
  const totalAbsent = attendance.filter(
    (h) => !h.isPresent
  ).length;

  // Calculate percentage from history
  const totalSessions = totalPresent + totalAbsent;
  const attendancePercent = totalSessions > 0
    ? Math.round((totalPresent / totalSessions) * 100)
    : 0;

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading attendance...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
          Attendance
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Overview & History
        </h1>
        <p className="text-slate-500">
          Track your consistency and class participation.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Attendance Rate */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-50 opacity-50 blur-2xl" />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Attendance Rate</p>
              <h3 className="text-2xl font-bold text-slate-900">{attendancePercent}%</h3>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${attendancePercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">Based on total scheduled classes</p>
          </div>
        </div>

        {/* Present */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-50 opacity-50 blur-2xl" />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Classes Attended</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalPresent}</h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">Keep up the great work!</p>
        </div>

        {/* Absent */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-rose-50 opacity-50 blur-2xl" />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Classes Missed</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalAbsent}</h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">Try to minimize missed sessions</p>
        </div>
      </div>

      {/* History List */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-semibold text-slate-900">Attendance History</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {attendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-slate-50 p-4 rounded-full mb-3">
                <Calendar className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-900 font-medium">No records found</p>
              <p className="text-sm text-slate-500">Your attendance history will appear here.</p>
            </div>
          ) : (
            attendance.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.isPresent ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                    {item.isPresent ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.sessionId?.name || 'Unknown Class'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(item.dateAttended)}</span>
                    </div>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.isPresent
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                  {item.isPresent ? 'Present' : 'Absent'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

