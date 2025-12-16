"use client";

import { Input } from "@/components/ui/input";
import { attendanceApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useMemo, useState, useEffect } from "react";
import { Search, Calendar, Filter, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TraineeAttendanceHistory() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("All");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await attendanceApi.getMemberHistory();
        if (response.success && response.data) {
          setAttendance(response.data);
        }
      } catch (err) {
        setError("Failed to load attendance history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filtered = useMemo(() => {
    return attendance.filter((item) => {
      const className = item.sessionId?.name || 'Unknown Class';
      const matchesQuery = className
        .toLowerCase()
        .includes(query.toLowerCase());

      const itemDate = new Date(item.dateAttended);
      const itemMonth = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

      const matchesMonth = month === "All" || itemMonth === month;
      return matchesQuery && matchesMonth;
    });
  }, [query, month, attendance]);

  const months = useMemo(() => {
    const uniqueMonths = new Set(
      attendance.map((item) => {
        const d = new Date(item.dateAttended);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      })
    );
    return Array.from(uniqueMonths).sort().reverse();
  }, [attendance]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading history...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <Link href="/trainee/attendance" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Overview
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Attendance History
          </h1>
          <p className="text-slate-500">
            A complete log of all your class attendance.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Input
              placeholder="Search class..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 w-full sm:w-[280px] transition-all focus:ring-emerald-500/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mr-2 text-slate-400">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter by month:</span>
        </div>
        <button
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${month === "All"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-200 hover:text-emerald-700"
            }`}
          onClick={() => setMonth("All")}
        >
          All Months
        </button>
        {months.map((m) => {
          const [y, mn] = m.split('-');
          const date = new Date(parseInt(y), parseInt(mn) - 1);
          const label = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

          return (
            <button
              key={m}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${month === m
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-200 hover:text-emerald-700"
                }`}
              onClick={() => setMonth(m)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Calendar className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No records found</h3>
            <p className="text-slate-500 max-w-xs mt-1">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.isPresent ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                    {item.isPresent ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.sessionId?.name || 'Unknown Class'}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(item.dateAttended)}
                      </span>
                      {item.sessionId?.startTime && (
                        <span className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                          {item.sessionId.startTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isPresent
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                    {item.isPresent ? 'Present' : 'Absent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

