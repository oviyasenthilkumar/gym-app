// "use client";

// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { TableRow } from "@/components/ui/table-row";
// import { trainerMembers } from "@/data/trainer";
// import { formatDate } from "@/lib/utils";
// import Image from "next/image";
// import Link from "next/link";
// import { useMemo, useState } from "react";

// export default function TrainerMembersPage() {
//   const [query, setQuery] = useState("");

//   const filtered = useMemo(() => {
//     return trainerMembers.filter((m) => {
//       const q = query.toLowerCase();
//       return (
//         m.name.toLowerCase().includes(q) ||
//         (m.phone ?? "").toLowerCase().includes(q) ||
//         (m.email ?? "").toLowerCase().includes(q)
//       );
//     });
//   }, [query]);

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <p className="text-sm font-semibold text-blue-700">Members</p>
//           <h1 className="text-xl font-semibold text-slate-900">
//             Only members in your classes
//           </h1>
//         </div>
//         <Input
//           placeholder="Search name or phone"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           leading="🔎"
//           className="sm:max-w-xs"
//         />
//       </div>

//       <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
//         <div className="space-y-0 divide-y divide-slate-200 hidden md:block">
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
//             className="grid-cols-[1.4fr,1.5fr,1.2fr,0.9fr,0.9fr,1fr,1fr,1fr,0.8fr] bg-slate-100 px-4 !rounded-none !shadow-none !ring-0"
//           />
//           {filtered.map((m) => {
//             return (
//               <TableRow
//                 key={m.id}
//                 cells={[
//                   <ProfileCell key="profile" name={m.name} avatar={m.avatar} id={m.id} />,
//                   <span key="email" className="text-sm text-slate-600">
//                     {m.email ?? "—"}
//                   </span>,
//                   <span key="phone" className="text-sm text-slate-600">
//                     {m.phone ?? "—"}
//                   </span>,
//                   <span key="plan" className="text-sm text-slate-600">
//                     {m.plan ?? "—"}
//                   </span>,
//                   <span key="status" className="text-sm text-slate-600">
//                     {m.activityLevel ?? "Active"}
//                   </span>,
//                   <span key="start" className="text-sm text-slate-600">
//                     {m.startDate ? formatDate(m.startDate) : "—"}
//                   </span>,
//                   <span key="end" className="text-sm text-slate-600">
//                     {m.endDate ? formatDate(m.endDate) : "—"}
//                   </span>,
//                   <span key="next" className="text-sm text-slate-600">
//                     {m.nextBilling ? formatDate(m.nextBilling) : "—"}
//                   </span>,
//                   <Link
//                     key="link"
//                     href={`/trainer/members/${m.id}`}
//                     className="text-sm font-semibold text-emerald-800"
//                   >
//                     View Profile
//                   </Link>,
//                 ]}
//                 className="grid-cols-[1.4fr,1.5fr,1.2fr,0.9fr,0.9fr,1fr,1fr,1fr,0.8fr] px-4 hover:bg-slate-50 !rounded-none !shadow-none !ring-0"
//               />
//             );
//           })}
//         </div>

//         <div className="md:hidden divide-y divide-slate-200">
//           {filtered.map((m) => (
//             <div key={m.id} className="px-4 py-3">
//               <div className="flex items-center justify-between">
//                 <ProfileCell name={m.name} avatar={m.avatar} id={m.id} />
//                 <Link
//                   href={`/trainer/members/${m.id}`}
//                   className="text-sm font-semibold text-emerald-800"
//                 >
//                   View
//                 </Link>
//               </div>
//               <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
//                 <span className="font-semibold text-slate-500">Email</span>
//                 <span>{m.email ?? "—"}</span>
//                 <span className="font-semibold text-slate-500">Number</span>
//                 <span>{m.phone ?? "—"}</span>
//                 <span className="font-semibold text-slate-500">Plan</span>
//                 <span>{m.plan ?? "—"}</span>
//                 <span className="font-semibold text-slate-500">Status</span>
//                 <span>{m.activityLevel ?? "Active"}</span>
//                 <span className="font-semibold text-slate-500">Start date</span>
//                 <span>{m.startDate ? formatDate(m.startDate) : "—"}</span>
//                 <span className="font-semibold text-slate-500">End date</span>
//                 <span>{m.endDate ? formatDate(m.endDate) : "—"}</span>
//                 <span className="font-semibold text-slate-500">Next billing</span>
//                 <span>{m.nextBilling ? formatDate(m.nextBilling) : "—"}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </Card>
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

"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { membersApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function TrainerMembersPage() {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await membersApi.getAll(undefined, undefined, 'member');
        if (response.success && response.data) {
          setMembers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch members", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return members.filter((m) => {
      return (
        m.name.toLowerCase().includes(q) ||
        (m.phone ?? "").toLowerCase().includes(q) ||
        (m.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, members]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Members</p>
          <h1 className="text-xl font-semibold text-slate-900">
            Only members in your classes
          </h1>
        </div>

        <Input
          placeholder="Search name or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leading="🔎"
          className="sm:max-w-xs"
        />
      </div>

      <Card className="overflow-hidden border border-slate-200 shadow-sm">

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr className="text-left text-sm text-slate-600">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Number</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Start Date</th>
                <th className="px-4 py-3 font-semibold">End Date</th>
                <th className="px-4 py-3 font-semibold">Next Billing</th>
                <th className="px-4 py-3 font-semibold">View</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    Loading members...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No members found.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m._id}
                    className="hover:bg-slate-50 text-sm text-slate-700"
                  >
                    <td className="px-4 py-3">
                      <ProfileCell name={m.name} avatar={m.avatar} id={m._id} />
                    </td>

                    <td className="px-4 py-3">{m.email ?? "—"}</td>
                    <td className="px-4 py-3">{m.phone ?? "—"}</td>
                    <td className="px-4 py-3">{m.plan ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${m.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {m.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {m.membershipStartDate ? formatDate(m.membershipStartDate) : "—"}
                    </td>

                    <td className="px-4 py-3">
                      {m.membershipEndDate ? formatDate(m.membershipEndDate) : "—"}
                    </td>

                    <td className="px-4 py-3">
                      {m.nextBillingDate ? formatDate(m.nextBillingDate) : "—"}
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        href={`/trainer/members/${m._id}`}
                        className="text-sm font-semibold text-emerald-800"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden divide-y divide-slate-200">
          {loading ? (
            <div className="px-4 py-8 text-center text-slate-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500">No members found.</div>
          ) : (
            filtered.map((m) => (
              <div key={m._id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <ProfileCell name={m.name} avatar={m.avatar} id={m._id} />
                  <Link
                    href={`/trainer/members/${m._id}`}
                    className="text-sm font-semibold text-emerald-800"
                  >
                    View
                  </Link>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="font-semibold text-slate-500">Email</span>
                  <span>{m.email ?? "—"}</span>

                  <span className="font-semibold text-slate-500">Number</span>
                  <span>{m.phone ?? "—"}</span>

                  <span className="font-semibold text-slate-500">Plan</span>
                  <span>{m.plan ?? "—"}</span>

                  <span className="font-semibold text-slate-500">Status</span>
                  <span>{m.isActive !== false ? "Active" : "Inactive"}</span>

                  <span className="font-semibold text-slate-500">Start date</span>
                  <span>{m.membershipStartDate ? formatDate(m.membershipStartDate) : "—"}</span>

                  <span className="font-semibold text-slate-500">End date</span>
                  <span>{m.membershipEndDate ? formatDate(m.membershipEndDate) : "—"}</span>

                  <span className="font-semibold text-slate-500">Next billing</span>
                  <span>{m.nextBillingDate ? formatDate(m.nextBillingDate) : "—"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

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
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="40px"
            className="object-cover"
          />
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
