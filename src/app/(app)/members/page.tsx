// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Modal } from "@/components/ui/modal";
// import { TableRow } from "@/components/ui/table-row";
// import { formatDate } from "@/lib/utils";
// import { Member, members } from "@/data/members";
// import Image from "next/image";
// import { useMemo, useState } from "react";

// const statusColors: Record<Member["status"], string> = {
//   Active: "bg-emerald-50 text-emerald-700",
//   Frozen: "bg-amber-50 text-amber-700",
//   Pending: "bg-slate-100 text-slate-700",
// };

// export default function MembersPage() {
//   const [list, setList] = useState<Member[]>(members);
//   const [query, setQuery] = useState("");
//   const [status, setStatus] = useState<Member["status"] | "All">("All");
//   const [selected, setSelected] = useState<Member | null>(null);
//   const [editing, setEditing] = useState<Member | null>(null);
//   const [openCreate, setOpenCreate] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState<Member | null>(null);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     avatar: "",
//     plan: "Standard",
//     status: "Active" as Member["status"],
//     activityLevel: "Active" as Member["activityLevel"],
//     role: "Member" as Member["role"],
//     startDate: new Date().toISOString().slice(0, 10),
//     endDate: new Date().toISOString().slice(0, 10),
//     lastCheckIn: new Date().toISOString().slice(0, 10),
//     assignedTrainer: "Alex J",
//     visitsThisMonth: 0,
//     nextBilling: new Date().toISOString().slice(0, 10),
//   });

//   const filtered = useMemo(() => {
//     return list.filter((member) => {
//       const matchesStatus = status === "All" || member.status === status;
//       const matchesQuery =
//         member.name.toLowerCase().includes(query.toLowerCase()) ||
//         member.email.toLowerCase().includes(query.toLowerCase()) ||
//         (member.assignedTrainer ?? "").toLowerCase().includes(query.toLowerCase());
//       return matchesStatus && matchesQuery;
//     });
//   }, [query, status, list]);

//   const resetForm = () => {
//     setForm({
//       name: "",
//       email: "",
//       phone: "",
//       avatar: "",
//       plan: "Standard",
//       status: "Active",
//       activityLevel: "Active",
//       role: "Member",
//       startDate: new Date().toISOString().slice(0, 10),
//       endDate: new Date().toISOString().slice(0, 10),
//       lastCheckIn: new Date().toISOString().slice(0, 10),
//       assignedTrainer: "Alex J",
//       visitsThisMonth: 0,
//       nextBilling: new Date().toISOString().slice(0, 10),
//     });
//   };

//   const handleSave = () => {
//     if (!form.name || !form.email) return;
//     if (editing) {
//       setList((prev) =>
//         prev.map((m) => (m.id === editing.id ? { ...editing, ...form } : m))
//       );
//       setEditing(null);
//     } else {
//       const newMember: Member = {
//         ...form,
//         id: `GM-${Math.floor(1000 + Math.random() * 9000)}`,
//         joinDate: new Date().toISOString().slice(0, 10),
//       };
//       setList((prev) => [newMember, ...prev]);
//     }
//     resetForm();
//     setOpenCreate(false);
//   };

//   const startEdit = (member: Member) => {
//     setEditing(member);
//     setForm({
//       name: member.name,
//       email: member.email,
//       phone: member.phone ?? "",
//       avatar: member.avatar ?? "",
//       plan: member.plan,
//       status: member.status,
//       activityLevel: member.activityLevel ?? "Active",
//       role: member.role ?? "Member",
//       startDate: member.startDate ?? new Date().toISOString().slice(0, 10),
//       endDate: member.endDate ?? new Date().toISOString().slice(0, 10),
//       lastCheckIn: member.lastCheckIn ?? new Date().toISOString().slice(0, 10),
//       assignedTrainer: member.assignedTrainer ?? "Alex J",
//       visitsThisMonth: member.visitsThisMonth,
//       nextBilling: member.nextBilling,
//     });
//     setOpenCreate(true);
//   };

//   const handleDelete = () => {
//     if (!confirmDelete) return;
//     setList((prev) => prev.filter((m) => m.id !== confirmDelete.id));
//     setConfirmDelete(null);
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <p className="text-sm font-semibold text-blue-700">Members</p>
//           <h2 className="text-xl font-semibold text-slate-900">
//             Manage subscriptions & attendance
//           </h2>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="secondary" onClick={() => setOpenCreate(true)}>
//             + Add member
//           </Button>
//         </div>
//       </div>

//       <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-4">
//           <Input
//             placeholder="Search name or email"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             leading="🔎"
//             className="md:max-w-xs"
//           />
//           <div className="flex flex-wrap items-center gap-2">
//             {(["All", "Active", "Frozen", "Pending"] as const).map((item) => (
//               <Button
//                 key={item}
//                 variant={status === item ? "primary" : "ghost"}
//                 size="sm"
//                 onClick={() => setStatus(item)}
//               >
//                 {item}
//               </Button>
//             ))}
//           </div>
//         </div>

//         <div className="mt-0 space-y-0 divide-y divide-slate-200">
//           <TableRow
//             header
//             cells={[
//               "Name",
//               "Email",
//               "Number",
//               "Plan",
//               "Status",
//               "Start date",
//               "End date",
//               "Next billing",
//               "",
//             ]}
//             className="grid-cols-[1.4fr,1.5fr,1.2fr,0.9fr,0.9fr,1fr,1fr,1fr,0.8fr] !rounded-none !shadow-none !ring-0 bg-slate-100 px-4"
//           />
//           {filtered.map((member) => (
//             <TableRow
//               key={member.id}
//               cells={[
//                 <ProfileCell key="profile" name={member.name} avatar={member.avatar} id={member.id} />,
//                 <span key="email" className="text-sm text-slate-600">
//                   {member.email}
//                 </span>,
//                 <span key="phone" className="text-sm text-slate-600">
//                   {member.phone ?? "—"}
//                 </span>,
//                 <span key="plan" className="text-sm text-slate-600">
//                   {member.plan}
//                 </span>,
//                 <span key="status" className={`badge ${statusColors[member.status]}`}>
//                   {member.status}
//                 </span>,
//                 <span key="start" className="text-sm text-slate-600">
//                   {member.startDate ? formatDate(member.startDate) : "—"}
//                 </span>,
//                 <span key="end" className="text-sm text-slate-600">
//                   {member.endDate ? formatDate(member.endDate) : "—"}
//                 </span>,
//                 <span key="next" className="text-sm text-slate-600">
//                   {member.nextBilling ? formatDate(member.nextBilling) : "—"}
//                 </span>,
//                 <button
//                   key="action"
//                   className="text-sm font-semibold text-emerald-800"
//                   onClick={() => setSelected(member)}
//                 >
//                   View Profile
//                 </button>,
//               ]}
//               className="grid-cols-[1.4fr,1.5fr,1.2fr,0.9fr,0.9fr,1fr,1fr,1fr,0.8fr] !rounded-none !shadow-none !ring-0 px-4 hover:bg-slate-50"
//             />
//           ))}
//         </div>
//       </Card>

//       <Modal
//         open={Boolean(selected)}
//         onClose={() => setSelected(null)}
//         title={selected ? selected.name : "Member details"}
//         footer={
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" onClick={() => setSelected(null)}>
//               Close
//             </Button>
//             <Button onClick={() => startEdit(selected)}>Edit member</Button>
//             <Button
//               variant="secondary"
//               onClick={() => setConfirmDelete(selected)}
//             >
//               Delete
//             </Button>
//           </div>
//         }
//       >
//         {selected ? (
//           <div className="space-y-3 text-sm">
//             <InfoRow label="Plan" value={selected.plan} />
//             <InfoRow
//               label="Status"
//               value={selected.status}
//               badgeClass={statusColors[selected.status]}
//             />
//             <InfoRow label="Phone" value={selected.phone ?? "—"} />
//             <InfoRow label="Start date" value={formatDate(selected.startDate)} />
//             <InfoRow label="End date" value={formatDate(selected.endDate)} />
//             <InfoRow
//               label="Next billing"
//               value={formatDate(selected.nextBilling)}
//             />
//             <InfoRow label="Email" value={selected.email} />
//           </div>
//         ) : null}
//       </Modal>

//       <Modal
//         open={openCreate}
//         onClose={() => {
//           setOpenCreate(false);
//           setEditing(null);
//           resetForm();
//         }}
//         title={editing ? "Edit member" : "Add a member"}
//       >
//         <div className="space-y-3">
//           <Input
//             label="Full name"
//             placeholder="New member name"
//             value={form.name}
//             onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//           />
//           <Input
//             label="Email"
//             type="email"
//             placeholder="email@example.com"
//             value={form.email}
//             onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
//           />
//           <Input
//             label="Phone"
//             placeholder="+1 555..."
//             value={form.phone}
//             onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
//           />
//           <Input
//             label="Avatar URL (optional)"
//             placeholder="https://..."
//             value={form.avatar}
//             onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
//           />
//           <div className="grid gap-3 sm:grid-cols-2">
//             <Input
//               label="Plan"
//               placeholder="Standard / Plus / Premium"
//               value={form.plan}
//               onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value as Member["plan"] }))}
//             />
//             <Input
//               label="Status"
//               placeholder="Active"
//               value={form.status}
//               onChange={(e) =>
//                 setForm((f) => ({
//                   ...f,
//                   status: e.target.value as Member["status"],
//                 }))
//               }
//             />
//           </div>
//           <div className="grid gap-3 sm:grid-cols-2">
//             <Input
//               label="Start date"
//               type="date"
//               value={form.startDate}
//               onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
//             />
//             <Input
//               label="End date"
//               type="date"
//               value={form.endDate}
//               onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
//             />
//           </div>
//           <div className="grid gap-3 sm:grid-cols-2">
//             <Input
//               label="Next billing date"
//               type="date"
//               value={form.nextBilling}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, nextBilling: e.target.value }))
//               }
//             />
//             <Input
//               label="Status"
//               placeholder="Active / Frozen / Pending"
//               value={form.status}
//               onChange={(e) =>
//                 setForm((f) => ({
//                   ...f,
//                   status: e.target.value as Member["status"],
//                 }))
//               }
//             />
//           </div>
//           <div className="grid gap-3 sm:grid-cols-2">
//             <Input
//               label="Activity level"
//               placeholder="Active / Inactive"
//               value={form.activityLevel}
//               onChange={(e) =>
//                 setForm((f) => ({
//                   ...f,
//                   activityLevel: e.target.value as Member["activityLevel"],
//                 }))
//               }
//             />
//             <Input
//               label="Last check-in"
//               type="date"
//               value={form.lastCheckIn}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, lastCheckIn: e.target.value }))
//               }
//             />
//           </div>
//           <div className="grid gap-3 sm:grid-cols-2">
//             <Input
//               label="Assigned trainer"
//               placeholder="Alex J"
//               value={form.assignedTrainer}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, assignedTrainer: e.target.value }))
//               }
//             />
//             <Input
//               label="Role"
//               placeholder="Member / Trainer / Admin"
//               value={form.role}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, role: e.target.value as Member["role"] }))
//               }
//             />
//           </div>
//           <div className="flex justify-end gap-2 pt-2">
//             <Button variant="ghost" onClick={() => {
//               setOpenCreate(false);
//               setEditing(null);
//               resetForm();
//             }}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave}>
//               {editing ? "Save changes" : "Add member"}
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       <Modal
//         open={Boolean(confirmDelete)}
//         onClose={() => setConfirmDelete(null)}
//         title="Remove member"
//         footer={
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
//               Cancel
//             </Button>
//             <Button variant="secondary" onClick={handleDelete}>
//               Delete member
//             </Button>
//           </div>
//         }
//       >
//         <p className="text-sm text-slate-700">
//           Are you sure you want to remove{" "}
//           <span className="font-semibold">
//             {confirmDelete?.name}
//           </span>{" "}
//           from the roster? This action only affects this mock UI.
//         </p>
//       </Modal>
//     </div>
//   );
// }

// function ProfileCell({
//   name,
//   avatar,
//   id,
// }: {
//   name: string;
//   avatar?: string;
//   id: string;
// }) {
//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   return (
//     <div className="flex items-center gap-3">
//       <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
//         {avatar ? (
//           <Image
//             src={avatar}
//             alt={name}
//             fill
//             sizes="40px"
//             className="object-cover"
//           />
//         ) : (
//           <div className="grid h-full w-full place-items-center text-sm font-semibold text-slate-700">
//             {initials}
//           </div>
//         )}
//       </div>
//       <div>
//         <p className="font-semibold text-slate-900">{name}</p>
//         <p className="text-xs text-slate-500">ID: {id}</p>
//       </div>
//     </div>
//   );
// }

// function InfoRow({
//   label,
//   value,
//   badgeClass,
// }: {
//   label: string;
//   value: string;
//   badgeClass?: string;
// }) {
//   return (
//     <div className="flex items-center justify-between">
//       <span className="text-slate-500">{label}</span>
//       {badgeClass ? (
//         <span className={`badge ${badgeClass}`}>{value}</span>
//       ) : (
//         <span className="font-semibold">{value}</span>
//       )}
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { TableRow } from "@/components/ui/table-row";
import { formatDate } from "@/lib/utils";
import { Member as MemberType } from "@/data/members";
import { membersApi, Member } from "@/lib/api";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Frozen: "bg-amber-50 text-amber-700",
  Pending: "bg-slate-100 text-slate-700",
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-amber-50 text-amber-700",
  pending: "bg-slate-100 text-slate-700",
};

const roleColors: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700",
  trainer: "bg-blue-50 text-blue-700",
  member: "bg-emerald-50 text-emerald-700",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  trainer: "Trainer",
  member: "Trainee",
};

export default function MembersPage() {
  const [list, setList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"members" | "roles">("members");
  const [selected, setSelected] = useState<Member | null>(null);
  const [editing, setEditing] = useState<Member | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Member | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "member" as "admin" | "trainer" | "member",
    plan: "Standard",
    status: "active",
    membershipStartDate: new Date().toISOString().slice(0, 10),
    membershipEndDate: new Date().toISOString().slice(0, 10),
    nextBillingDate: "",
    className: "",
    classType: "Cardio",
    difficultyLevel: "Beginner",
    age: "",
    weight: "",
  });

  // Auto-calculate next billing date when start date changes (30 days from start)
  const handleStartDateChange = (date: string) => {
    setForm((f) => {
      const updated = { ...f, membershipStartDate: date };
      if (date) {
        const startDate = new Date(date);
        const billingDate = new Date(startDate);
        billingDate.setDate(billingDate.getDate() + 30);
        updated.nextBillingDate = billingDate.toISOString().slice(0, 10);
      } else {
        updated.nextBillingDate = "";
      }
      return updated;
    });
  };

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        const statusFilter = status === "All" ? undefined : status.toLowerCase();
        // Map frontend role labels to backend role values
        const roleMap: Record<string, string> = {
          All: "",
          Admin: "admin",
          Trainer: "trainer",
          Trainee: "member",
        };
        const roleFilterParam =
          activeTab === "members"
            ? "member"
            : roleFilter === "All"
            ? undefined
            : roleMap[roleFilter];

        const response = await membersApi.getAll(
          query || undefined,
          statusFilter,
          roleFilterParam
        );
        if (response.success && response.data) {
          setList(response.data);
        }
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [query, status, roleFilter, activeTab]);

  const filtered = useMemo(() => {
    return list;
  }, [list]);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "member" as "admin" | "trainer" | "member",
      plan: "Standard",
      status: "active",
      membershipStartDate: new Date().toISOString().slice(0, 10),
      membershipEndDate: new Date().toISOString().slice(0, 10),
      nextBillingDate: "",
      className: "",
      classType: "Cardio",
      difficultyLevel: "Beginner",
      age: "",
      weight: "",
    });
  };

  // Check if membership is expiring in 7 days
  const isExpiringSoon = (endDate?: string) => {
    if (!endDate) return false;
    const expiryDate = new Date(endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    // Phone is required only for members/trainers, not admins
    if (form.role !== 'admin' && !form.phone) {
      alert("Phone number is required for trainers and trainees");
      return;
    }

    // Validate trainee-specific fields
    if (form.role === 'member') {
      if (!form.membershipStartDate || !form.membershipEndDate || !form.plan || !form.className) {
        alert("For trainees, please provide start date, end date, plan, and class");
        return;
      }
    }

    try {
   if (editing) {
        const response = await membersApi.update(editing._id, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          plan: form.plan,
          status: form.status,
          membershipStartDate: form.membershipStartDate,
          membershipEndDate: form.membershipEndDate,
          nextBillingDate: form.nextBillingDate,
          age: form.age ? parseInt(form.age) : undefined,
          weight: form.weight ? parseFloat(form.weight) : undefined,
          class: form.className,
          classType: form.classType,
          difficultyLevel: form.difficultyLevel,
        });
        if (response.success) {
          // Reload members
          const membersResponse = await membersApi.getAll();
          if (membersResponse.success && membersResponse.data) {
            setList(membersResponse.data);
          }
  setEditing(null);
        }
} else {
        const response = await membersApi.create({
          name: form.name,
          email: form.email,
          phone: form.phone || "",
          role: form.role,
          plan: form.plan,
          status: form.status,
          membershipStartDate: form.membershipStartDate,
          membershipEndDate: form.membershipEndDate,
          className: form.className,
          classType: form.classType,
          difficultyLevel: form.difficultyLevel,
          age: form.age ? parseInt(form.age) : undefined,
          weight: form.weight ? parseFloat(form.weight) : undefined,
          // nextBillingDate will be auto-calculated on backend (30 days from start)
        });
        if (response.success) {
          alert(`User created successfully! Login credentials have been sent to ${form.email}`);
          // Reload members
          const membersResponse = await membersApi.getAll();
          if (membersResponse.success && membersResponse.data) {
            setList(membersResponse.data);
          }
        }
      }
    resetForm();
    setOpenCreate(false);
    } catch (error: any) {
      console.error("Error saving member:", error);
      alert(error.message || "Failed to save member");
    }
  };

  const startEdit = (member: Member) => {
    setEditing(member);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone ?? "",
      role: "member" as "admin" | "trainer" | "member", // Default to member when editing
      plan: member.plan || "Standard",
      status: member.status || "active",
      membershipStartDate: member.membershipStartDate
        ? new Date(member.membershipStartDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      membershipEndDate: member.membershipEndDate
        ? new Date(member.membershipEndDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      nextBillingDate: member.nextBillingDate
        ? new Date(member.nextBillingDate).toISOString().slice(0, 10)
        : "",
      className: (member as any).class || "",
      classType: (member as any).classType || "Cardio",
      difficultyLevel: (member as any).difficultyLevel || "Beginner",
      age: member.age ? member.age.toString() : "",
      weight: member.weight ? member.weight.toString() : "",
    });
    setOpenCreate(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const response = await membersApi.delete(confirmDelete._id);
      if (response.success) {
        // Reload members
        const membersResponse = await membersApi.getAll();
        if (membersResponse.success && membersResponse.data) {
          setList(membersResponse.data);
        }
    setConfirmDelete(null);
      }
    } catch (error: any) {
      console.error("Error deleting member:", error);
      alert(error.message || "Failed to delete member");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Users</p>
          <h2 className="text-xl font-semibold text-slate-900">
            Manage Admins, Trainers & Trainees
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {(["members", "roles"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab)}
            >
              {tab === "members" ? "Trainees" : "Roles"}
            </Button>
          ))}
          <Button onClick={() => setOpenCreate(true)}>+ Add User</Button>
        </div>
      </div>

      {/* Table Wrapper */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-4">
          <Input
            placeholder="Search name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leading="🔎"
            className="w-1/2"
          />

          <div className="flex flex-wrap gap-2 w-1/2">
            {activeTab === "roles" && (
              <div className="flex gap-2">
                <span className="text-xs text-slate-500 self-center">Role:</span>
                {(["All", "Admin", "Trainer", "Trainee"] as const).map((item) => (
                  <Button
                    key={item}
                    variant={roleFilter === item ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setRoleFilter(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            )}
            {activeTab === "members" && (
              <div className="flex gap-2">
                <span className="text-xs text-slate-500 self-center">Status:</span>
            {(["All", "Active", "Frozen", "Pending"] as const).map((item) => (
              <Button
                key={item}
                variant={status === item ? "primary" : "ghost"}
                size="sm"
                onClick={() => setStatus(item)}
              >
                {item}
              </Button>
            ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table */}
     <div className="hidden sm:block">
  <div className="overflow-x-auto rounded-lg border border-slate-200">
    <table className="min-w-full table-fixed">
      <thead className="bg-slate-100 text-sm text-slate-700">
        <tr>
          <th className="p-3 text-left w-40">Name</th>
          <th className="p-3 text-left w-48">Email</th>
          <th className="p-3 text-left w-24">Role</th>
          <th className="p-3 text-left w-32">Number</th>
          <th className="p-3 text-left w-28">Plan</th>
          <th className="p-3 text-left w-28">Status</th>
          <th className="p-3 text-left w-32">Start date</th>
          <th className="p-3 text-left w-32">End date</th>
          <th className="p-3 text-left w-32">Next billing</th>
          <th className="p-3 text-left w-20"></th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={10} className="p-8 text-center text-slate-500">
              Loading users...
            </td>
          </tr>
        ) : filtered.length === 0 ? (
          <tr>
            <td colSpan={10} className="p-8 text-center text-slate-500">
              No users found
            </td>
          </tr>
        ) : (
          filtered.map((m) => (
            <tr key={m._id} className="border-t text-sm">
            <td className="p-3">
                <ProfileCell name={m.name} id={m._id} />
            </td>
            <td className="p-3 text-slate-600">{m.email ?? "—"}</td>
              <td className="p-3">
                {m.role && (
                  <span className={`badge ${roleColors[m.role] || 'bg-slate-100 text-slate-700'}`}>
                    {roleLabels[m.role] || m.role}
                  </span>
                )}
              </td>
            <td className="p-3 text-slate-600">{m.phone ?? "—"}</td>
            <td className="p-3 text-slate-600">{m.plan ?? "—"}</td>
              <td className="p-3">
                <div className="flex flex-col gap-1">
                  <span className={`badge ${statusColors[m.status || (m.isActive ? 'active' : 'inactive')]}`}>
                    {m.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {m.role === 'member' && m.membershipEndDate && isExpiringSoon(m.membershipEndDate) && (
                    <span className="badge bg-amber-50 text-amber-700 text-xs">Expiring in 7 days</span>
                  )}
                </div>
              </td>
            <td className="p-3 text-slate-600">
                {m.membershipStartDate ? formatDate(new Date(m.membershipStartDate).toISOString().slice(0, 10)) : "—"}
            </td>
            <td className="p-3 text-slate-600">
                <div className="flex flex-col gap-1">
                  {m.membershipEndDate ? formatDate(new Date(m.membershipEndDate).toISOString().slice(0, 10)) : "—"}
                  {m.role === 'member' && m.membershipEndDate && isExpiringSoon(m.membershipEndDate) && (
                    <span className="text-xs text-amber-700 font-semibold">⚠️ Expiring soon</span>
                  )}
                </div>
            </td>
            <td className="p-3 text-slate-600">
                {m.nextBillingDate ? formatDate(new Date(m.nextBillingDate).toISOString().slice(0, 10)) : "—"}
            </td>
            <td className="p-3">
                <button
                  onClick={() => setSelected(m)}
                  className="text-emerald-700 font-semibold hover:underline"
              >
                View
                </button>
            </td>
          </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>


        {/* Mobile Cards */}
      <div className="sm:hidden divide-y divide-slate-200">
          {loading ? (
            <div className="px-4 py-8 text-center text-slate-500">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500">No users found</div>
          ) : (
            filtered.map((m) => (
              <div key={m._id} className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                  <ProfileCell name={m.name} id={m._id} />
                <button
                  onClick={() => setSelected(m)}
                  className="text-sm font-semibold text-emerald-700"
                >
                  View
                </button>
              </div>

              <div className="grid grid-cols-2 text-xs gap-y-1 text-slate-600">
                <LabelValue label="Email" value={m.email} />
                  <LabelValue label="Role" value={m.role ? roleLabels[m.role] || m.role : "—"} />
                <LabelValue label="Phone" value={m.phone ?? "—"} />
                  <LabelValue label="Plan" value={m.plan ?? "—"} />
                  <LabelValue label="Status" value={m.isActive ? 'Active' : 'Inactive'} />
                  <LabelValue label="Start" value={m.membershipStartDate ? formatDate(new Date(m.membershipStartDate).toISOString().slice(0, 10)) : "—"} />
                  <div className="col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">End</span>
                      <div className="flex items-center gap-2">
                        <span>{m.membershipEndDate ? formatDate(new Date(m.membershipEndDate).toISOString().slice(0, 10)) : "—"}</span>
                        {m.role === 'member' && m.membershipEndDate && isExpiringSoon(m.membershipEndDate) && (
                          <span className="badge bg-amber-50 text-amber-700 text-xs">⚠️ Expiring in 7 days</span>
                        )}
              </div>
            </div>
                  </div>
                  <LabelValue label="Next bill" value={m.nextBillingDate ? formatDate(new Date(m.nextBillingDate).toISOString().slice(0, 10)) : "—"} />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Profile Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        footer={
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            <Button onClick={() => startEdit(selected!)}>Edit</Button>
            <Button variant="secondary" onClick={() => setConfirmDelete(selected!)}>Delete</Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <InfoRow
              label="Role" 
              value={selected.role ? roleLabels[selected.role] || selected.role : "—"}
              badgeClass={selected.role ? roleColors[selected.role] : undefined}
            />
            <InfoRow label="Email" value={selected.email} />
            <InfoRow label="Phone" value={selected.phone ?? "—"} />
            <InfoRow label="Plan" value={selected.plan ?? "—"} />
            <InfoRow
              label="Status"
              value={selected.isActive ? 'Active' : 'Inactive'}
              badgeClass={statusColors[selected.status || (selected.isActive ? 'active' : 'inactive')]}
            />
            <InfoRow label="Start" value={selected.membershipStartDate ? formatDate(new Date(selected.membershipStartDate).toISOString().slice(0, 10)) : "—"} />
            <div className="flex items-center justify-between">
              <span className="text-slate-500">End</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {selected.membershipEndDate ? formatDate(new Date(selected.membershipEndDate).toISOString().slice(0, 10)) : "—"}
                </span>
                {selected.role === 'member' && selected.membershipEndDate && isExpiringSoon(selected.membershipEndDate) && (
                  <span className="badge bg-amber-50 text-amber-700 text-xs">⚠️ Expiring in 7 days</span>
                )}
              </div>
            </div>
            <InfoRow label="Next billing" value={selected.nextBillingDate ? formatDate(new Date(selected.nextBillingDate).toISOString().slice(0, 10)) : "—"} />
            {selected.role === 'member' && (selected as any).class && (
              <InfoRow label="Class" value={(selected as any).class} />
            )}
          </div>
        )}
      </Modal>

      {/* Create / Edit Modal */}
      <Modal
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setEditing(null);
          resetForm();
        }}
        title={editing ? "Edit member" : "Add User"}
      >
        <div className="space-y-3">

          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          

          {!editing && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "admin" | "trainer" | "member" }))}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="member">Trainee</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            required={form.role !== 'admin'}
          />

          {form.role === 'member' && (
            <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Age"
              type="number"
              placeholder="e.g., 25"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              min="1"
              max="150"
            />

            <Input
              label="Weight (kg)"
              type="number"
              placeholder="e.g., 70"
              value={form.weight}
              onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
              min="1"
              max="1000"
              step="0.1"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Plan"
              value={form.plan}
                  onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
                  required
            />

            <Input
                  label="Class"
                  placeholder="e.g., Yoga, CrossFit"
                  value={form.className}
                  onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
                  required
            />
          </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Class Type
                  </label>
                  <select
                    value={form.classType}
                    onChange={(e) => setForm((f) => ({ ...f, classType: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Yoga">Yoga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={form.difficultyLevel}
                    onChange={(e) => setForm((f) => ({ ...f, difficultyLevel: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Start date"
              type="date"
                  value={form.membershipStartDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  required
            />

            <Input
              label="End date"
              type="date"
                  value={form.membershipEndDate}
                  onChange={(e) => setForm((f) => ({ ...f, membershipEndDate: e.target.value }))}
                  required
            />
          </div>

          <Input
                label="Status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              />

              {form.nextBillingDate && (
                <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm">
                  <span className="font-semibold text-blue-900">Next Billing Date (Auto-calculated): </span>
                  <span className="text-blue-700">{new Date(form.nextBillingDate).toLocaleDateString()}</span>
                  <p className="text-xs text-blue-600 mt-1">30 days from start date</p>
                </div>
              )}

              {isExpiringSoon(form.membershipEndDate) && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm">
                  <span className="font-semibold text-amber-900">⚠️ Warning: </span>
                  <span className="text-amber-800">Membership expiring in 7 days or less</span>
          </div>
              )}
            </>
          )}


          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setOpenCreate(false);
                setEditing(null);
                resetForm();
              }}
            >
              Cancel
            </Button>

            <Button onClick={handleSave}>
              {editing ? "Save changes" : "Add member"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Remove member"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="secondary" onClick={handleDelete}>Delete member</Button>
          </div>
        }
      >
        <p className="text-sm text-slate-700">
          Are you sure you want to remove{" "}
          <span className="font-semibold">{confirmDelete?.name}</span>?
        </p>
      </Modal>
    </div>
  );
}

/* ---------------------------------------------- */
/* SMALL COMPONENTS */
/* ---------------------------------------------- */

function ProfileCell({
  name,
  id,
}: {
  name: string;
  id: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-200">
          <div className="grid h-full w-full place-items-center text-sm font-semibold text-slate-700">
            {initials}
          </div>
      </div>

      <div>
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">ID: {id.slice(-6)}</p>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  badgeClass,
}: {
  label: string;
  value: string;
  badgeClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>

      {badgeClass ? (
        <span className={`badge ${badgeClass}`}>{value}</span>
      ) : (
        <span className="font-semibold">{value}</span>
      )}
    </div>
  );
}

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-slate-500">{label}</span>
      <span>{value}</span>
    </>
  );
}
