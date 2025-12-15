"use client";

import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import { attendanceDays, attendanceSummary } from "@/data/attendance";
import { membersApi, Member, attendanceApi, sessionsApi, Session } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

export default function AttendancePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
  const [participants, setParticipants] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedSession = useMemo(
    () => sessions.find((s) => s._id === selectedSessionId) ?? sessions[0],
    [sessions, selectedSessionId]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [traineesRes, trainersRes, sessionsRes] = await Promise.all([
          membersApi.getAll(undefined, undefined, "member"),
          membersApi.getAll(undefined, undefined, "trainer"),
          sessionsApi.getAll(),
        ]);

        const trainees = traineesRes.success && traineesRes.data ? traineesRes.data : [];
        const trainers = trainersRes.success && trainersRes.data ? trainersRes.data : [];
        const fetchedSessions = sessionsRes.success && sessionsRes.data ? sessionsRes.data : [];

        setParticipants([
          ...trainees.map((t) => ({ ...t, role: "member" as const })),
          ...trainers.map((t) => ({ ...t, role: "trainer" as const })),
        ]);

        setSessions(fetchedSessions);

        if (fetchedSessions.length > 0) {
          // Find today's session or the next upcoming one
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const upcomingSession = fetchedSessions.find(s => {
            const sessionDate = new Date(s.date);
            sessionDate.setHours(0, 0, 0, 0);
            return sessionDate.getTime() >= today.getTime();
          });

          // If no upcoming session, use the last one (most recent past)
          // If upcoming found, use that.
          // Otherwise default to first (oldest) as fallback
          const defaultSession = upcomingSession || fetchedSessions[fetchedSessions.length - 1] || fetchedSessions[0];

          setSelectedSessionId(defaultSession._id);
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!selectedSessionId) return;

      try {
        // Don't set global loading here to avoid flickering the whole list
        // just for attendance update, or handle it gracefully
        const attendanceRes = await attendanceApi.getBySession(selectedSessionId);
        if (attendanceRes.success && attendanceRes.data) {
          const present = new Set<string>();
          attendanceRes.data.forEach((record: any) => {
            if (record.isPresent && record.memberId) {
              present.add(record.memberId._id || record.memberId);
            }
          });
          setPresentIds(present);
        } else {
          setPresentIds(new Set());
        }
      } catch (err) {
        console.error("Error loading attendance:", err);
      }
    };

    loadAttendance();
  }, [selectedSessionId]);

  const activeParticipants = useMemo(
    () =>
      participants.filter((p) => {
        if (p.role === "member") {
          return p.status?.toLowerCase() !== "inactive" && p.isActive !== false;
        }
        // Only show members (trainees)
        return false;
      }),
    [participants]
  );

  const presentCount = presentIds.size;
  const totalCount = activeParticipants.length;
  const attendancePercent = totalCount
    ? Math.round((presentCount / totalCount) * 100)
    : 0;

  const togglePresent = async (id: string) => {
    if (!selectedSessionId) return;

    const isPresent = !presentIds.has(id);

    // Optimistic update
    setPresentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      await attendanceApi.mark(selectedSessionId, id, isPresent);
    } catch (error) {
      console.error("Error marking attendance:", error);
      // Revert on error
      setPresentIds((prev) => {
        const next = new Set(prev);
        if (isPresent) next.delete(id);
        else next.add(id);
        return next;
      });
      alert("Failed to save attendance");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-blue-700">Attendance</p>
        <h2 className="text-xl font-semibold text-slate-900">
          Weekly check-ins & peaks
        </h2>
      </div>

      <Card>
        <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
          <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  Select class
                </p>
                <p className="text-sm text-slate-500">
                  Mark present members and see live stats.
                </p>
              </div>
              <select
                value={selectedSession?._id || ""}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-inner outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {sessions.length === 0 && <option value="">No sessions found</option>}
                {sessions.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} — {new Date(cls.date).toLocaleDateString()} {cls.startTime}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Mark attendance
              </p>
              <p className="text-xs text-slate-500">
                Trainees are listed. Tap to toggle present (saved to DB).
              </p>

              {sessions.length === 0 && (
                <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 border border-amber-200">
                  No classes found. Please create a class in the dashboard or database to mark attendance.
                </div>
              )}

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {loading ? (
                  <p className="text-sm text-slate-500">Loading attendees...</p>
                ) : activeParticipants.length === 0 ? (
                  <p className="text-sm text-slate-500">No trainees found.</p>
                ) : (
                  activeParticipants.map((person) => (
                    <button
                      key={person._id}
                      onClick={() => togglePresent(person._id)}
                      disabled={!selectedSessionId}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${presentIds.has(person._id)
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : !selectedSessionId
                          ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                        }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{person.name}</span>
                        <span className="text-xs opacity-80">
                          {person.role === "trainer" ? "Trainer" : "Trainee"}
                        </span>
                      </div>
                      <span className="text-xs font-medium">
                        {presentIds.has(person._id)
                          ? "Present"
                          : !selectedSessionId
                            ? "No Class"
                            : "Tap to mark"}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">
                  Attendance stats
                </p>
                <span className="badge bg-indigo-50 text-indigo-700">
                  {selectedSession?.name || "No Session"}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Present</span>
                  <span className="font-semibold text-slate-900">
                    {presentCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Absent</span>
                  <span className="font-semibold text-slate-900">
                    {totalCount - presentCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Attendance %</span>
                  <span className="font-semibold text-indigo-700">
                    {attendancePercent}%
                  </span>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <span
                  className="block h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${attendancePercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {attendanceSummary.weeklyAverage} weekly avg check-ins · Peak at{" "}
                {attendanceSummary.peakUtilization}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Quick class info
              </p>
              <p className="text-xs text-slate-500">
                Coach {typeof selectedSession?.trainer === 'object' ? (selectedSession.trainer as any).name : selectedSession?.trainer || "Unknown"} · {selectedSession?.startTime || "N/A"}
              </p>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Capacity</span>
                  <span className="font-semibold">
                    {selectedSession?.capacity || 0} spots
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Currently booked</span>
                  <span className="font-semibold text-blue-700">
                    {presentCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
