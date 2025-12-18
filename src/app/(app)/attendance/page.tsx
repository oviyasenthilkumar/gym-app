"use client";

import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import { attendanceDays, attendanceSummary } from "@/data/attendance";
import { membersApi, Member, attendanceApi, sessionsApi, Session, getUser } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

export default function AttendancePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
  const [participants, setParticipants] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const todaySessions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessions.filter(s => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });
  }, [sessions]);

  const pastSessions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessions.filter(s => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() < today.getTime();
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions]);

  const selectedSession = useMemo(
    () => sessions.find((s) => s._id === selectedSessionId) || todaySessions[0],
    [sessions, selectedSessionId, todaySessions]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [traineesRes, sessionsRes] = await Promise.all([
          membersApi.getAll(undefined, undefined, "member"),
          sessionsApi.getAll(),
        ]);

        const trainees = traineesRes.success && traineesRes.data ? traineesRes.data : [];
        // const trainers = trainersRes.success && trainersRes.data ? trainersRes.data : [];
        let fetchedSessions = sessionsRes.success && sessionsRes.data ? sessionsRes.data : [];

        // Filter sessions for trainer
        const user = getUser();
        if (user?.role === 'trainer') {
          fetchedSessions = fetchedSessions.filter(s => {
            if (s.trainer && typeof s.trainer === 'object' && s.trainer.email) {
              return s.trainer.email === user.email;
            }
            return false;
          });
        }

        setParticipants([
          ...trainees.map((t) => ({ ...t, role: "member" as const })),
        ]);

        setSessions(fetchedSessions);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaySession = fetchedSessions.find(s => {
          const sessionDate = new Date(s.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate.getTime() === today.getTime();
        });

        if (todaySession) {
          setSelectedSessionId(todaySession._id);
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
        return p.status?.toLowerCase() !== "inactive" && p.isActive !== false;
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
                  {selectedSession && !todaySessions.find(s => s._id === selectedSession._id)
                    ? "Viewing Past Record"
                    : "Select Today's Class"}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedSession && !todaySessions.find(s => s._id === selectedSession._id)
                    ? `Viewing attendance for ${new Date(selectedSession.date).toLocaleDateString()}.`
                    : "Mark present members and see live stats."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedSession && !todaySessions.find(s => s._id === selectedSession._id) && (
                  <button
                    onClick={() => setSelectedSessionId(todaySessions[0]?._id || "")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Back to Today
                  </button>
                )}
                <select
                  value={selectedSession?._id || ""}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-inner outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {todaySessions.length === 0 && !todaySessions.find(s => s._id === selectedSession?._id) && (
                    <option value="">No classes today</option>
                  )}
                  {todaySessions.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} — {cls.startTime}
                    </option>
                  ))}
                  {selectedSession && !todaySessions.find(s => s._id === selectedSession._id) && (
                    <option key={selectedSession._id} value={selectedSession._id}>
                      {selectedSession.name} — {new Date(selectedSession.date).toLocaleDateString()}
                    </option>
                  )}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Mark attendance
              </p>
              <p className="text-xs text-slate-500">
                Trainees are listed. Tap to toggle present (saved to DB).
              </p>

              {todaySessions.length === 0 && (
                <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 border border-amber-200">
                  No classes scheduled for today. Please check the history below for past records.
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
                Coach {selectedSession?.trainer && typeof selectedSession.trainer === 'object' ? (selectedSession.trainer as any).name : selectedSession?.trainer || "Unknown"} · {selectedSession?.startTime || "N/A"}
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

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Attendance History</h3>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="pb-3 pl-4 font-medium">Class Name</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Coach</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 pr-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pastSessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No past attendance records found.
                    </td>
                  </tr>
                ) : (
                  pastSessions.map((s) => (
                    <tr key={s._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pl-4 font-semibold text-slate-900">{s.name}</td>
                      <td className="py-4 text-slate-600">{new Date(s.date).toLocaleDateString()}</td>
                      <td className="py-4 text-slate-600">
                        {s.trainer && typeof s.trainer === 'object' ? (s.trainer as any).name : s.trainer || "Unknown"}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${s.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                          s.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <button
                          onClick={() => setSelectedSessionId(s._id)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
