"use client";

import { Input } from "@/components/ui/input";
import { sessionsApi, Session } from "@/lib/api";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, Search } from "lucide-react";

const filters = ["All", "Today", "Week"] as const;

export default function TraineeSchedulePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await sessionsApi.getAll();
        if (response.success && response.data) {
          setSessions(response.data);
        }
      } catch (err) {
        setError("Failed to load schedule");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    return sessions.filter((session) => {
      const trainerName = !session.trainer ? '' : (typeof session.trainer === 'string' ? session.trainer : session.trainer.name);

      const matchesQuery =
        session.name.toLowerCase().includes(query.toLowerCase()) ||
        trainerName.toLowerCase().includes(query.toLowerCase());

      const clsDate = new Date(session.date);
      const diffDays =
        (clsDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      const isToday = clsDate.toDateString() === now.toDateString();
      const isWeek = diffDays >= 0 && diffDays <= 7;

      if (filter === "Today" && !isToday) return false;
      if (filter === "Week" && !isWeek) return false;
      return matchesQuery;
    });
  }, [query, filter, sessions]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading schedule...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
            Schedule
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Upcoming Classes
          </h1>
          <p className="text-slate-500">
            Browse and join your favorite workout sessions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Input
              placeholder="Search classes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 w-full sm:w-[280px] transition-all focus:ring-emerald-500/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filter === f
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Calendar className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No classes found</h3>
          <p className="text-slate-500 max-w-xs mt-1">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cls) => (
            <div
              key={cls._id}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-emerald-200"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls.status === "Scheduled"
                  ? "bg-orange-200 text-slate-800"
                  : "bg-green-200 text-slate-800"
                  }`}>
                  {cls.status}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {cls.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <User className="h-4 w-4" />
                    <span>{cls.trainer ? (typeof cls.trainer === 'string' ? 'Trainer' : cls.trainer.name) : 'Unknown Trainer'}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {new Date(cls.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-500">Date</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {cls.startTime}
                      </p>
                      <p className="text-xs text-slate-500">Time</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {cls.location || 'Main Floor'}
                      </p>
                      <p className="text-xs text-slate-500">Location</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <Link
                    href={`/trainee/schedule/${cls._id}`}
                    className="flex items-center justify-center w-full py-2.5 px-4 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
