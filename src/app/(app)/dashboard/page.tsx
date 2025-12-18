"use client";

import { Card } from "@/components/ui/card";
import { TableRow } from "@/components/ui/table-row";
import { recentActivities, revenueTrend } from "@/data/metrics";
import { dashboardApi, membersApi, sessionsApi, getUser } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeMembers: 0,
    expiringSoon: 0,
    weeklyClasses: 0,
    attendancePercent: 0,
  });
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [recentMembers, setRecentMembers] = useState<any[]>([]);

  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Load dashboard stats based on role
        let statsResponse;
        if (user.role === 'admin') {
          statsResponse = await dashboardApi.getAdminStats();
        } else if (user.role === 'trainer') {
          statsResponse = await dashboardApi.getTrainerStats();
        } else {
          statsResponse = await dashboardApi.getMemberStats();
        }

        if (statsResponse.success && statsResponse.data) {
          const data = statsResponse.data;
          setStats({
            activeMembers: data.activeMembersCount || data.activeMembers || 0,
            expiringSoon: data.expiringMembersCount || data.expiringMembers || 0,
            weeklyClasses: data.weeklyClassesCount || data.weeklyClasses || 0,
            attendancePercent: data.attendancePercentage || 0,
          });
          if (data.revenueTrend) {
            setRevenueData(data.revenueTrend);
          }
        }

        // Load recent members
        const membersResponse = await membersApi.getAll();
        if (membersResponse.success && membersResponse.data) {
          setRecentMembers(membersResponse.data.slice(0, 4));
        }

        // Load upcoming classes (sessions)
        const sessionsResponse = await sessionsApi.getAll();
        if (sessionsResponse.success && sessionsResponse.data) {
          const upcoming = sessionsResponse.data
            .filter((s: any) => s.status === 'Scheduled')
            .slice(0, 3);
          setUpcomingClasses(upcoming);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">Active members</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-slate-900">
              {stats.activeMembers}
            </p>
            <span className="badge bg-emerald-50 text-emerald-700">Live</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Members currently in good standing.
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Expiring in 7 days
          </p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-slate-900">
              {stats.expiringSoon}
            </p>
            <span className="badge bg-amber-50 text-amber-700">Renewals</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Next billing approaching. Prompt outreach.
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Weekly classes
          </p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-slate-900">
              {stats.weeklyClasses}
            </p>
            <span className="badge bg-blue-50 text-blue-700">This week</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Total scheduled sessions.
          </p>
        </Card>
        <Card padded={false} className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            Attendance percentage
          </p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-slate-900">
              {stats.attendancePercent}%
            </p>
            <span className="badge bg-indigo-50 text-indigo-700">Fill</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Average class fill based on current bookings.
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-700">Revenue trend</p>
              <p className="text-sm text-slate-500">
                Last 7 days • Estimated
              </p>
            </div>
            <div className="badge bg-emerald-50 text-emerald-700">
              Stable growth
            </div>
          </header>
          <div className="flex items-end gap-3 h-40">
            {revenueData.length > 0 ? (
              revenueData.map((point) => (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full rounded-xl bg-gradient-to-t from-blue-200 via-blue-400 to-blue-600 shadow-inner transition-all duration-500"
                    style={{ height: `${Math.max(point.value / 10, 4)}px` }}
                  />
                  <p className="text-xs text-slate-500">{point.label}</p>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                No revenue data available
              </div>
            )}
          </div>
        </Card>

        <Card title="Recent activity" className="lg:col-span-1">
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.title}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
                <span className="badge bg-blue-100 text-blue-700">
                  {activity.tag}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Upcoming classes" action={<span className="text-sm text-blue-700">View all</span>}>
          <div className="space-y-3">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((item) => (
                <TableRow
                  key={item._id}
                  cells={[
                    <div key="title">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(item.date).toLocaleDateString()} {item.startTime} · {item.location || 'N/A'}
                      </p>
                    </div>,
                    <div key="coach" className="text-sm text-slate-600">
                      Trainer {item.trainer && typeof item.trainer === 'object' ? item.trainer.name : (item.trainer || 'Unknown')}
                    </div>,
                    <div key="capacity" className="text-sm font-semibold text-blue-700">
                      {item.capacity} capacity
                    </div>,
                  ]}
                  className="grid-cols-[1.5fr,1fr,1fr]"
                />
              ))
            ) : (
              <p className="text-sm text-slate-500">No upcoming classes</p>
            )}
          </div>
        </Card>

        <Card title="Recent members" action={<span className="text-sm text-blue-700">Manage</span>}>
          <div className="space-y-3">
            {recentMembers.length > 0 ? (
              recentMembers.map((member) => (
                <TableRow
                  key={member._id}
                  cells={[
                    <div key="name">
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>,
                    <div key="plan" className="text-sm text-slate-600">
                      {member.plan || 'N/A'} plan
                    </div>,
                    <div key="status">
                      <span className="badge bg-emerald-50 text-emerald-700">
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>,
                  ]}
                  className="grid-cols-[1.5fr,1fr,0.8fr]"
                />
              ))
            ) : (
              <p className="text-sm text-slate-500">No members found</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

