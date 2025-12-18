"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, Edit, Trash2, Calendar, Users, XCircle } from "lucide-react";
import { sessionsApi, trainersApi, Session } from "@/lib/api";
import { useMemo, useState, useEffect } from "react";

// Utility colors for status badges
const statusStyles = {
  Scheduled: "bg-blue-50 text-blue-700",
  Cancelled: "bg-rose-50 text-rose-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

export default function ClassesPage() {
  // Data & UI state
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

  // Load sessions
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const status = statusFilter === "All" ? undefined : statusFilter;
        const res = await sessionsApi.getAll(undefined, undefined, status);
        if (res.success && res.data) setList(res.data);
      } catch (e) {
        console.error("Failed to load sessions", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [statusFilter]);

  // Load trainers once
  useEffect(() => {
    const load = async () => {
      try {
        const res = await trainersApi.getAll();
        if (res.success && res.data) setTrainers(res.data);
      } catch (e) {
        console.error("Failed to load trainers", e);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return list.filter((cls) => cls.name.toLowerCase().includes(query.toLowerCase()));
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

  const startEdit = (cls: Session) => {
    setEditing(cls);
    setForm({
      name: cls.name,
      trainer: typeof cls.trainer === "object" ? cls.trainer._id : cls.trainer,
      capacity: cls.capacity,
      date: cls.date ? new Date(cls.date).toISOString().slice(0, 10) : "",
      startTime: cls.startTime,
      location: cls.location || "",
      status: cls.status,
    });
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.trainer || !form.date || !form.startTime || !form.location) {
      alert("Please fill all required fields");
      return;
    }
    try {
      if (editing) {
        const res = await sessionsApi.update(editing._id, { ...form });
        if (res.success) {
          const fresh = await sessionsApi.getAll();
          if (fresh.success && fresh.data) setList(fresh.data);
        }
      } else {
        const res = await sessionsApi.create({
          name: form.name,
          trainer: form.trainer,
          capacity: form.capacity,
          date: form.date,
          startTime: form.startTime,
          location: form.location,
        });
        if (res.success) {
          const fresh = await sessionsApi.getAll();
          if (fresh.success && fresh.data) setList(fresh.data);
        }
      }
      resetForm();
      setOpenModal(false);
      setEditing(null);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to save class");
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this class?")) return;
    try {
      const res = await sessionsApi.cancel(id);
      if (res.success) {
        const fresh = await sessionsApi.getAll();
        if (fresh.success && fresh.data) setList(fresh.data);
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to cancel class");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this class permanently?")) return;
    try {
      const res = await sessionsApi.delete(id);
      if (res.success) {
        const fresh = await sessionsApi.getAll();
        if (fresh.success && fresh.data) setList(fresh.data);
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to delete class");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-slate-600" />
          <h1 className="text-2xl font-bold text-slate-900">Classes</h1>
        </div>
        <Button onClick={() => setOpenModal(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-2xl transition-shadow">
          <Plus className="h-4 w-4" /> New class
        </Button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="Search classes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leading="🔎"
          className="md:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {(["All", "Scheduled", "Cancelled", "Completed"] as const).map((item) => (
            <Button
              key={item}
              variant={statusFilter === item ? "primary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      {/* Class Grid */}
      {loading ? (
        <p className="text-center text-slate-500 py-8">Loading classes…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No classes found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((cls) => (
            <Card key={cls._id} className="relative hover:shadow-xl transition-shadow overflow-hidden bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg transform hover:scale-105 transition-all duration-300">
              {/* Status badge */}
              <span
                className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${statusStyles[cls.status as keyof typeof statusStyles]}`}
              >
                {cls.status}
              </span>
              <div className="p-4 space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">{cls.name}</h2>
                <p className="text-sm text-slate-500">
                  Trainer: {cls.trainer && typeof cls.trainer === "object" ? cls.trainer.name : (cls.trainer || 'Unknown')}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(cls.date).toLocaleDateString()} {cls.startTime} • {cls.location || "N/A"}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4" /> {cls.capacity} spots
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(cls)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {cls.status !== "Cancelled" && (
                    <Button variant="ghost" size="sm" onClick={() => handleCancel(cls._id)}>
                      <XCircle className="h-4 w-4 text-rose-600" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(cls._id)}>
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for Create / Edit */}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditing(null);
          resetForm();
        }}
        title={editing ? "Edit class" : "Create class"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => {
              setOpenModal(false);
              setEditing(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editing ? "Save changes" : "Create class"}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Class name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Trainer</label>
              <select
                className="w-full rounded-md border border-slate-200 p-2"
                value={form.trainer}
                onChange={(e) => setForm({ ...form, trainer: e.target.value })}
              >
                <option value="">Select trainer</option>
                {trainers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <Input label="Capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input label="Start Time" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
          </div>
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          {editing && (
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full rounded-md border border-slate-200 p-2"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}
        </div>
      </Modal>
      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-6 right-6 flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
