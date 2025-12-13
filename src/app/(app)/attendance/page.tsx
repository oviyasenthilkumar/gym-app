 "use client";

import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import { attendanceDays, attendanceSummary } from "@/data/attendance";
import { classes } from "@/data/classes";
import { membersApi, Member } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

export default function AttendancePage() {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id);
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
  const [participants, setParticipants] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId) ?? classes[0],
    [selectedClassId]
  );

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setLoading(true);
        const [traineesRes, trainersRes] = await Promise.all([
          membersApi.getAll(undefined, undefined, "member"),
          membersApi.getAll(undefined, undefined, "trainer"),
        ]);

        const trainees = traineesRes.success && traineesRes.data ? traineesRes.data : [];
        const trainers = trainersRes.success && trainersRes.data ? trainersRes.data : [];

        setParticipants([
          ...trainees.map((t) => ({ ...t, role: "member" as const })),
          ...trainers.map((t) => ({ ...t, role: "trainer" as const })),
        ]);
      } catch (err) {
        console.error("Error loading participants:", err);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, []);

  const activeParticipants = useMemo(
    () =>
      participants.filter((p) => {
        if (p.role === "member") {
          return p.status?.toLowerCase() !== "inactive" && p.isActive !== false;
        }
        // Keep trainers always visible
        return true;
      }),
    [participants]
  );

  const presentCount = presentIds.size;
  const totalCount = activeParticipants.length;
  const attendancePercent = totalCount
    ? Math.round((presentCount / totalCount) * 100)
    : 0;

  const togglePresent = (id: string) => {
    setPresentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
                value={selectedClass?.id}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-inner outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.title} — {cls.time}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Mark attendance
              </p>
              <p className="text-xs text-slate-500">
                Trainees and trainers are listed. Tap to toggle present (client-side).
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {loading ? (
                  <p className="text-sm text-slate-500">Loading attendees...</p>
                ) : activeParticipants.length === 0 ? (
                  <p className="text-sm text-slate-500">No trainees or trainers found.</p>
                ) : (
                  activeParticipants.map((person) => (
                    <button
                      key={person._id}
                      onClick={() => togglePresent(person._id)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                        presentIds.has(person._id)
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{person.name}</span>
                        <span className="text-xs text-slate-500">
                          {person.role === "trainer" ? "Trainer" : "Trainee"}
                        </span>
                      </div>
                      <span className="text-xs">
                        {presentIds.has(person._id) ? "Present" : "Tap to mark"}
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
                  {selectedClass?.title}
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
                Coach {selectedClass?.coach} · {selectedClass?.time}
              </p>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Capacity</span>
                  <span className="font-semibold">
                    {selectedClass?.capacity} spots
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Currently booked</span>
                  <span className="font-semibold text-blue-700">
                    {selectedClass?.booked}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Daily activity">
        <div className="space-y-2">
          <TableRow
            header
            cells={[
              "Date",
              "Total check-ins",
              "New members",
              "Peak hour",
              "Notes",
            ]}
            className="grid-cols-[0.8fr,1fr,1fr,0.8fr,1.4fr]"
          />
          {attendanceDays.map((day) => (
            <TableRow
              key={day.date}
              cells={[
                <span key="date" className="font-semibold text-slate-900">
                  {formatDate(day.date)}
                </span>,
                <span key="checkins" className="text-sm font-semibold">
                  {day.checkIns}
                </span>,
                <span key="new" className="text-sm text-slate-600">
                  +{day.newMembers}
                </span>,
                <span key="peak" className="text-sm text-slate-600">
                  {day.peakHour}
                </span>,
                <span key="notes" className="text-sm text-slate-600">
                  {day.notes ?? "—"}
                </span>,
              ]}
              className="grid-cols-[0.8fr,1fr,1fr,0.8fr,1.4fr]"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

