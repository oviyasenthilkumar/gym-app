"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ClassItem } from "@/data/classes";
import { sessionsApi, Session } from "@/lib/api";
import { useMemo, useState, useEffect } from "react";

const levelColors = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-blue-50 text-blue-700",
  Advanced: "bg-rose-50 text-rose-700",
};

export default function ClassesPage() {
  const [list, setList] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [form, setForm] = useState({
    name: "",
    trainer: "",
    capacity: 12,
    date: "",
    startTime: "",
    location: "",
  });

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const status = statusFilter === "All" ? undefined : statusFilter;
        const response = await sessionsApi.getAll(undefined, undefined, status);
        if (response.success && response.data) {
          setList(response.data);
        }
      } catch (error) {
        console.error("Error loading sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [statusFilter]);

  const filtered = useMemo(() => {
    return list.filter((cls) => {
      const matchesQuery = cls.name
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesQuery;
    });
  }, [query, list]);

  const resetForm = () => {
    setForm({
      name: "",
      trainer: "",
      capacity: 12,
      date: "",
      startTime: "",
      location: "",
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.trainer || !form.date || !form.startTime || !form.location) return;
    try {
      if (editing) {
        const response = await sessionsApi.update(editing._id, {
          name: form.name,
          trainer: form.trainer,
          date: form.date,
          startTime: form.startTime,
          capacity: form.capacity,
          location: form.location,
        });
        if (response.success) {
          // Reload sessions
          const sessionsResponse = await sessionsApi.getAll();
          if (sessionsResponse.success && sessionsResponse.data) {
            setList(sessionsResponse.data);
          }
          setEditing(null);
        }
      } else {
        const response = await sessionsApi.create({
          name: form.name,
          trainer: form.trainer,
          date: form.date,
          startTime: form.startTime,
          capacity: form.capacity,
          location: form.location,
        });
        if (response.success) {
          // Reload sessions
          const sessionsResponse = await sessionsApi.getAll();
          if (sessionsResponse.success && sessionsResponse.data) {
            setList(sessionsResponse.data);
          }
        }
      }
      resetForm();
      setOpenModal(false);
    } catch (error: any) {
      console.error("Error saving session:", error);
      alert(error.message || "Failed to save session");
    }
  };

  const startEdit = (cls: Session) => {
    setEditing(cls);
    setForm({
      name: cls.name,
      trainer: cls.trainer,
      capacity: cls.capacity,
      date: cls.date ? new Date(cls.date).toISOString().slice(0, 10) : "",
      startTime: cls.startTime,
      location: cls.location || "",
    });
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await sessionsApi.cancel(id);
      if (response.success) {
        // Reload sessions
        const sessionsResponse = await sessionsApi.getAll();
        if (sessionsResponse.success && sessionsResponse.data) {
          setList(sessionsResponse.data);
        }
      }
    } catch (error: any) {
      console.error("Error deleting session:", error);
      alert(error.message || "Failed to delete session");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Classes</p>
          <h2 className="text-xl font-semibold text-slate-900">
            Schedule & capacity
          </h2>
        </div>
        <Button onClick={() => setOpenModal(true)}>+ New class</Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search classes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leading="🔎"
            className="md:max-w-xs"
          />
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Scheduled", "Cancelled", "Completed"] as const).map(
              (item) => (
                <Button
                  key={item}
                  variant={statusFilter === item ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(item)}
                >
                  {item}
                </Button>
              )
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center text-slate-500 py-8">
              Loading classes...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-8">
              No classes found
            </div>
          ) : (
            filtered.map((cls) => {
              return (
                <div
                  key={cls._id}
                  className="card-surface space-y-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {cls.name}
                      </p>
                      <p className="text-xs text-slate-500">Trainer {cls.trainer}</p>
                    </div>
                    <span className={`badge ${
                      cls.status === 'Scheduled' ? 'bg-blue-50 text-blue-700' :
                      cls.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {cls.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>
                      {new Date(cls.date).toLocaleDateString()} {cls.startTime} · {cls.location || 'N/A'}
                    </span>
                    <div className="flex gap-2 text-xs font-semibold">
                      <button
                        className="text-blue-700 hover:underline"
                        onClick={() => startEdit(cls)}
                      >
                        Edit
                      </button>
                      {cls.status !== 'Cancelled' && (
                        <button
                          className="text-rose-600 hover:underline"
                          onClick={() => handleDelete(cls._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>Capacity</span>
                      <span>{cls.capacity} spots</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Capacity: {cls.capacity}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditing(null);
          resetForm();
        }}
        title={editing ? "Edit class" : "Create class"}
      >
        <div className="space-y-3">
          <Input
            label="Class name"
            placeholder="e.g. Strength Foundations"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Trainer"
              placeholder="Trainer name"
              value={form.trainer}
              onChange={(e) => setForm((f) => ({ ...f, trainer: e.target.value }))}
            />
            <Input
              label="Capacity"
              type="number"
              placeholder="16"
              value={form.capacity}
              onChange={(e) =>
                setForm((f) => ({ ...f, capacity: Number(e.target.value) }))
              }
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            <Input
              label="Start Time"
              type="time"
              placeholder="10:00"
              value={form.startTime}
              onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
            />
          </div>
          <Input
            label="Location"
            placeholder="Studio A"
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setOpenModal(false);
                setEditing(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Save changes" : "Create class"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

