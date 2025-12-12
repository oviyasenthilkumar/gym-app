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
import { Member, members } from "@/data/members";
import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";

const statusColors: Record<Member["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Frozen: "bg-amber-50 text-amber-700",
  Pending: "bg-slate-100 text-slate-700",
};

export default function MembersPage() {
  const [list, setList] = useState<Member[]>(members);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Member["status"] | "All">("All");
  const [selected, setSelected] = useState<Member | null>(null);
  const [editing, setEditing] = useState<Member | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Member | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    plan: "Standard",
    status: "Active" as Member["status"],
    activityLevel: "Active" as Member["activityLevel"],
    role: "Member" as Member["role"],
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    lastCheckIn: new Date().toISOString().slice(0, 10),
    assignedTrainer: "Alex J",
    visitsThisMonth: 0,
    nextBilling: new Date().toISOString().slice(0, 10),
  });

  const filtered = useMemo(() => {
    return list.filter((m) => {
      const matchesStatus = status === "All" || m.status === status;
      const q = query.toLowerCase();
      const matchesQuery =
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.assignedTrainer ?? "").toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [query, status, list]);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      avatar: "",
      plan: "Standard",
      status: "Active",
      activityLevel: "Active",
      role: "Member",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      lastCheckIn: new Date().toISOString().slice(0, 10),
      assignedTrainer: "Alex J",
      visitsThisMonth: 0,
      nextBilling: new Date().toISOString().slice(0, 10),
    });
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;

   if (editing) {
  setList((prev) =>
    prev.map((m) =>
      m.id === editing!.id ? ({ ...m, ...form } as Member) : m
    )
  );
  setEditing(null);
} else {
  const newMember: Member = {
    ...form,
    id: `GM-${Math.floor(1000 + Math.random() * 9000)}`,
    joinDate: new Date().toISOString().slice(0, 10),
  } as Member;
  setList((prev) => [newMember, ...prev]);
}


    resetForm();
    setOpenCreate(false);
  };

  const startEdit = (member: Member) => {
    setEditing(member);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone ?? "",
      avatar: member.avatar ?? "",
      plan: member.plan,
      status: member.status,
      activityLevel: member.activityLevel ?? "Active",
      role: member.role ?? "Member",
      startDate: member.startDate ?? new Date().toISOString().slice(0, 10),
      endDate: member.endDate ?? new Date().toISOString().slice(0, 10),
      lastCheckIn: member.lastCheckIn ?? new Date().toISOString().slice(0, 10),
      assignedTrainer: member.assignedTrainer ?? "Alex J",
      visitsThisMonth: member.visitsThisMonth,
      nextBilling: member.nextBilling,
    });
    setOpenCreate(true);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    setList((prev) => prev.filter((m) => m.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Members</p>
          <h2 className="text-xl font-semibold text-slate-900">
            Manage subscriptions & attendance
          </h2>
        </div>
        <Button onClick={() => setOpenCreate(true)}>+ Add member</Button>
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
        </div>

        {/* Desktop Table */}
     <div className="hidden sm:block">
  <div className="overflow-x-auto rounded-lg border border-slate-200">
    <table className="min-w-full table-fixed">
      <thead className="bg-slate-100 text-sm text-slate-700">
        <tr>
          <th className="p-3 text-left w-40">Name</th>
          <th className="p-3 text-left w-48">Email</th>
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
        {filtered.map((m) => (
          <tr key={m.id} className="border-t text-sm">
            <td className="p-3">
              <ProfileCell name={m.name} avatar={m.avatar} id={m.id} />
            </td>
            <td className="p-3 text-slate-600">{m.email ?? "—"}</td>
            <td className="p-3 text-slate-600">{m.phone ?? "—"}</td>
            <td className="p-3 text-slate-600">{m.plan ?? "—"}</td>
            <td className="p-3 text-slate-600">{m.activityLevel ?? "Active"}</td>
            <td className="p-3 text-slate-600">
              {m.startDate ? formatDate(m.startDate) : "—"}
            </td>
            <td className="p-3 text-slate-600">
              {m.endDate ? formatDate(m.endDate) : "—"}
            </td>
            <td className="p-3 text-slate-600">
              {m.nextBilling ? formatDate(m.nextBilling) : "—"}
            </td>
            <td className="p-3">
              <Link
                href={`/trainer/members/${m.id}`}
                className="text-emerald-700 font-semibold"
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        {/* Mobile Cards */}
      <div className="sm:hidden divide-y divide-slate-200">
          {filtered.map((m) => (
            <div key={m.id} className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <ProfileCell name={m.name} avatar={m.avatar} id={m.id} />
                <button
                  onClick={() => setSelected(m)}
                  className="text-sm font-semibold text-emerald-700"
                >
                  View
                </button>
              </div>

              <div className="grid grid-cols-2 text-xs gap-y-1 text-slate-600">
                <LabelValue label="Email" value={m.email} />
                <LabelValue label="Phone" value={m.phone ?? "—"} />
                <LabelValue label="Plan" value={m.plan} />
                <LabelValue label="Status" value={m.status} />
                <LabelValue label="Start" value={formatDate(m.startDate)} />
                <LabelValue label="End" value={formatDate(m.endDate)} />
                <LabelValue label="Next bill" value={formatDate(m.nextBilling)} />
              </div>
            </div>
          ))}
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
            <InfoRow label="Plan" value={selected.plan} />
            <InfoRow
              label="Status"
              value={selected.status}
              badgeClass={statusColors[selected.status]}
            />
            <InfoRow label="Phone" value={selected.phone ?? "—"} />
            <InfoRow label="Start" value={formatDate(selected.startDate)} />
            <InfoRow label="End" value={formatDate(selected.endDate)} />
            <InfoRow label="Next billing" value={formatDate(selected.nextBilling)} />
            <InfoRow label="Email" value={selected.email} />
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
        title={editing ? "Edit member" : "Add Member"}
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

          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />

          <Input
            label="Avatar URL (optional)"
            value={form.avatar}
            onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Plan"
              value={form.plan}
              onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value as Member["plan"] }))}
            />

            <Input
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Member["status"] }))}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Start date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            />

            <Input
              label="End date"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            />
          </div>

          <Input
            label="Next billing date"
            type="date"
            value={form.nextBilling}
            onChange={(e) => setForm((f) => ({ ...f, nextBilling: e.target.value }))}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Activity level"
              value={form.activityLevel}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  activityLevel: e.target.value as Member["activityLevel"],
                }))
              }
            />

            <Input
              label="Last check-in"
              type="date"
              value={form.lastCheckIn}
              onChange={(e) => setForm((f) => ({ ...f, lastCheckIn: e.target.value }))}
            />
          </div>

          <Input
            label="Assigned trainer"
            value={form.assignedTrainer}
            onChange={(e) =>
              setForm((f) => ({ ...f, assignedTrainer: e.target.value }))
            }
          />

          <Input
            label="Role"
            value={form.role}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value as Member["role"] }))
            }
          />

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
  avatar,
  id,
}: {
  name: string;
  avatar?: string;
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
        {avatar ? (
          <Image src={avatar} alt={name} fill className="object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm font-semibold text-slate-700">
            {initials}
          </div>
        )}
      </div>

      <div>
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">ID: {id}</p>
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
