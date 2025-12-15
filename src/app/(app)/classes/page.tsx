"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ClassItem } from "@/data/classes";
import { sessionsApi, trainersApi, Session } from "@/lib/api";
import { useMemo, useState, useEffect } from "react";

const levelColors = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-blue-50 text-blue-700",
  Advanced: "bg-rose-50 text-rose-700",
};

export default function ClassesPage() {
  const [list, setList] = useState<Session[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
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
    status: "Scheduled",
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

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const response = await trainersApi.getAll();
        if (response.success && response.data) {
          setTrainers(response.data);
        }
      } catch (error) {
        console.error("Error loading trainers:", error);
      }
    };
    loadTrainers();
  }, []);

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
      status: "Scheduled",
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
          status: form.status as any,
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
      trainer: typeof cls.trainer === 'object' ? cls.trainer._id : cls.trainer,
      capacity: cls.capacity,
      date: cls.date ? new Date(cls.date).toISOString().slice(0, 10) : "",
      startTime: cls.startTime,
      location: cls.location || "",
      status: cls.status,
    });
    setOpenModal(true);
  };

  const handleCancel = async (id: string) => {
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
      console.error("Error cancelling session:", error);
      alert(error.message || "Failed to cancel session");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class? This action cannot be undone.")) return;
    try {
      const response = await sessionsApi.delete(id);
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
                      <p className="text-xs text-slate-500">
                        Trainer {typeof cls.trainer === 'object' ? cls.trainer.name : cls.trainer}
                      </p>
                    </div>
                    <span className={`badge ${cls.status === 'Scheduled' ? 'bg-blue-50 text-blue-700' :
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
                          onClick={() => handleCancel(cls._id)}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(cls._id)}
                      >
                        Delete
                      </button>
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

            <div className="space-y-1">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Trainer
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.trainer}
                onChange={(e) => setForm((f) => ({ ...f, trainer: e.target.value }))}
              >
                <option value="">Select a trainer</option>
                {trainers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
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

          {editing && (
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Status
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}

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

