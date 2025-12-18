"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import {
  trainerAttendance,
  trainerClasses,
  trainerMembers,
} from "@/data/trainer";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function TrainerAttendanceDetail() {
  const params = useParams();
  const router = useRouter();
  const classId = params?.id as string;
  const cls = trainerClasses.find((c) => c.id === classId);

  const initialStatuses = useMemo(() => {
    const rec = trainerAttendance.find((r) => r.classId === classId);
    return rec?.statuses ?? {};
  }, [classId]);

  const [statuses, setStatuses] = useState<Record<string, "present" | "absent">>(
    initialStatuses
  );
  const [saved, setSaved] = useState(false);

  if (!cls) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Class not found
        </h1>
        <Button variant="secondary" onClick={() => router.push("/trainer/attendance")}>
          Back to attendance
        </Button>
      </div>
    );
  }

  const members = trainerMembers.filter((m) => cls.members.includes(m.id));

  const toggle = (id: string) => {
    setStatuses((prev) => {
      const next = { ...prev };
      next[id] = next[id] === "present" ? "absent" : "present";
      return next;
    });
    setSaved(false);
  };

  const markAll = () => {
    const next: Record<string, "present" | "absent"> = {};
    members.forEach((m) => (next[m.id] = "present"));
    setStatuses(next);
    setSaved(false);
  };

  const submit = () => {
    setSaved(true); // mock save
  };

  const presentCount = Object.values(statuses).filter(
    (s) => s === "present"
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Mark attendance</p>
          <h1 className="text-2xl font-semibold text-slate-900">{cls.title}</h1>
          <p className="text-sm text-slate-600">
            {cls.date} · {cls.time} · {cls.location}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={markAll}>
            Mark all present
          </Button>
          <Button onClick={submit}>Submit attendance</Button>
        </div>
      </div>

      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Attendance saved. You can edit anytime.
        </div>
      ) : null}

      <Card>
        <div className="space-y-2">
          <TableRow
            header
            cells={["Member", "Phone", "Status", "Action"]}
            className="grid-cols-[1.3fr,1fr,0.8fr,0.8fr]"
          />
          {members.map((member) => {
            const status = statuses[member.id] ?? "absent";
            const isPresent = status === "present";
            return (
              <TableRow
                key={member.id}
                cells={[
                  <div key="name">
                    <p className="font-semibold text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">ID: {member.id}</p>
                  </div>,
                  <span key="phone" className="text-sm text-slate-600">
                    {member.phone}
                  </span>,
                  <span
                    key="status"
                    className={`badge ${isPresent
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {isPresent ? "Present" : "Absent"}
                  </span>,
                  <Button
                    key="toggle"
                    variant={isPresent ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => toggle(member.id)}
                  >
                    {isPresent ? "Mark absent" : "Mark present"}
                  </Button>,
                ]}
                className="grid-cols-[1.3fr,1fr,0.8fr,0.8fr]"
              />
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Present</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {presentCount}
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Absent</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {members.length - presentCount}
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Submitted</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {saved ? "Yes" : "Not yet"}
          </p>
        </Card>
      </div>
    </div>
  );
}

