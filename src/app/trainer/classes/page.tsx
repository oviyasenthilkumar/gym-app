"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableRow } from "@/components/ui/table-row";
import { sessionsApi, Session, getUser } from "@/lib/api";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const filters = ["All", "Today", "This week"] as const;

export default function TrainerClassesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    startTime: "",
    capacity: 0,
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const user = getUser();
      const trainerId = user?.id;
      // Pass undefined for date/status filters, and trainerId as the 4th argument
      const response = await sessionsApi.getAll(undefined, undefined, undefined, trainerId);
      if (response.success && response.data) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await sessionsApi.delete(id);
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Failed to delete session", error);
      alert("Failed to delete session");
    }
  };

  const startEdit = (session: Session) => {
    setEditingSession(session);
    setEditForm({
      date: session.date.split('T')[0], // Extract YYYY-MM-DD
      startTime: session.startTime,
      capacity: session.capacity,
    });
  };

  const handleEditSubmit = async () => {
    if (!editingSession) return;
    try {
      const response = await sessionsApi.update(editingSession._id, {
        date: editForm.date,
        startTime: editForm.startTime,
        capacity: editForm.capacity,
      });
      if (response.success && response.data) {
        setSessions((prev) =>
          prev.map((s) => (s._id === editingSession._id ? response.data! : s))
        );
        setEditingSession(null);
      }
    } catch (error) {
      console.error("Failed to update session", error);
      alert("Failed to update session");
    }
  };

  const filtered = useMemo(() => {
    const now = new Date();
    return sessions.filter((cls) => {
      const matchesQuery = cls.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const clsDate = new Date(cls.date);
      const diffDays =
        (clsDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      const isToday = clsDate.toDateString() === now.toDateString();
      const isWeek = diffDays >= 0 && diffDays <= 7;

      if (filter === "Today" && !isToday) return false;
      if (filter === "This week" && !isWeek) return false;
      return matchesQuery;
    });
  }, [query, filter, sessions]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">My Classes</p>
          <h1 className="text-xl font-semibold text-slate-900">
            Sessions assigned to you
          </h1>
        </div>
        <Input
          placeholder="Search class name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leading="🔎"
          className="sm:max-w-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            variant={filter === f ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md space-y-4 p-6">
            <h2 className="text-lg font-semibold">Edit Class</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={editForm.startTime}
                  onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Capacity</label>
                <Input
                  type="number"
                  value={editForm.capacity}
                  onChange={(e) => setEditForm({ ...editForm, capacity: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditingSession(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Save Changes</Button>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <div className="space-y-2">
          <TableRow
            header
            cells={["Class", "Date & time", "Capacity", "Actions"]}
            className="grid-cols-[1.5fr,1.5fr,0.8fr,1fr]"
          />
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Loading sessions...</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No sessions found.</div>
          ) : (
            filtered.map((cls) => (
              <TableRow
                key={cls._id}
                cells={[
                  <div key="title">
                    <p className="font-semibold text-slate-900">{cls.name}</p>
                    <p className="text-xs text-slate-500">{cls.location || 'N/A'}</p>
                  </div>,
                  <span key="time" className="text-sm text-slate-600">
                    {new Date(cls.date).toLocaleDateString()} · {cls.startTime}
                  </span>,
                  <span key="cap" className="text-sm font-semibold">
                    {cls.capacity}
                  </span>,
                  <div key="actions" className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(cls)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(cls._id)}>
                      Delete
                    </Button>
                  </div>,
                ]}
                className="grid-cols-[1.5fr,1.5fr,0.8fr,1fr]"
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

