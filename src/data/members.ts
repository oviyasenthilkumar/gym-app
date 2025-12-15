export type Member = {
  id: string;
  name: string;
  avatar?: string;
  status: "Active" | "Inactive" | "Pending";
  plan: "Standard" | "Plus" | "Premium";
  visitsThisMonth: number;
  nextBilling: string;
  email: string;
  joinDate: string;
  activityLevel?: "Active" | "Inactive";
  lastCheckIn?: string;
  assignedTrainer?: string;
  role?: "Member" | "Trainer" | "Admin";
  phone?: string;
  startDate?: string;
  endDate?: string;
};

export const members: Member[] = [
  {
    id: "GM-1042",
    name: "Alex Carter",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    status: "Active",
    plan: "Premium",
    visitsThisMonth: 14,
    nextBilling: "2025-01-14",
    email: "alex@gymmini.com",
    joinDate: "2024-04-21",
    activityLevel: "Active",
    lastCheckIn: "2025-01-08",
    assignedTrainer: "Alex J",
    role: "Member",
    phone: "+1 555-310-8899",
    startDate: "2024-04-21",
    endDate: "2025-04-21",
  },
  {
    id: "GM-1038",
    name: "Priya Desai",
    avatar:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
    status: "Active",
    plan: "Plus",
    visitsThisMonth: 11,
    nextBilling: "2025-01-11",
    email: "priya.desai@gmail.com",
    joinDate: "2024-10-04",
    activityLevel: "Active",
    lastCheckIn: "2025-01-06",
    assignedTrainer: "Alex J",
    role: "Member",
    phone: "+1 555-410-1122",
    startDate: "2024-10-04",
    endDate: "2025-10-04",
  },
  {
    id: "GM-1024",
    name: "Diego Alvarez",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    status: "Inactive",
    plan: "Standard",
    visitsThisMonth: 3,
    nextBilling: "2025-02-02",
    email: "diego@alvarez.studio",
    joinDate: "2023-12-18",
    activityLevel: "Inactive",
    lastCheckIn: "2024-12-28",
    assignedTrainer: "Lena K",
    role: "Member",
    phone: "+1 555-215-7741",
    startDate: "2023-12-18",
    endDate: "2024-12-18",
  },
  {
    id: "GM-1045",
    name: "Brooklyn James",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    status: "Pending",
    plan: "Standard",
    visitsThisMonth: 0,
    nextBilling: "2025-01-20",
    email: "brooklyn.james@outlook.com",
    joinDate: "2025-01-02",
    activityLevel: "Inactive",
    lastCheckIn: "—",
    assignedTrainer: "Alex J",
    role: "Member",
    phone: "+1 555-009-3321",
    startDate: "2025-01-02",
    endDate: "2026-01-02",
  },
  {
    id: "GM-1011",
    name: "Sofia Park",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
    status: "Active",
    plan: "Premium",
    visitsThisMonth: 18,
    nextBilling: "2025-01-08",
    email: "sofia.park@northwest.edu",
    joinDate: "2023-07-14",
    activityLevel: "Active",
    lastCheckIn: "2025-01-08",
    assignedTrainer: "Chris Y",
    role: "Member",
    phone: "+1 555-778-9981",
    startDate: "2023-07-14",
    endDate: "2024-07-14",
  },
  {
    id: "GM-1007",
    name: "Marcus Lee",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
    status: "Active",
    plan: "Plus",
    visitsThisMonth: 9,
    nextBilling: "2025-01-10",
    email: "marcus.lee@product.dev",
    joinDate: "2024-02-19",
    activityLevel: "Active",
    lastCheckIn: "2025-01-07",
    assignedTrainer: "Jordan F",
    role: "Trainer",
    phone: "+1 555-104-2231",
    startDate: "2024-02-19",
    endDate: "2025-02-19",
  },
];

