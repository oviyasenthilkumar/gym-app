"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SettingsPage() {
  const [toggles, setToggles] = useState({
    weeklyDigest: true,
    attendanceAlerts: true,
    billingReminders: false,
  });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-blue-700">Settings</p>
        <h2 className="text-xl font-semibold text-slate-900">
          Organization & notifications
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Organization profile">
          <div className="space-y-4">
            <Input label="Gym name" defaultValue="Gym Mini HQ" />
            <Input label="Support email" defaultValue="support@gymmini.app" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Timezone" defaultValue="Pacific Time" />
              <Input label="Location" defaultValue="Seattle, WA" />
            </div>
            <Button className="w-full sm:w-auto">Save changes</Button>
          </div>
        </Card>

        <Card title="Notifications">
          <div className="space-y-4">
            {[
              {
                key: "weeklyDigest",
                label: "Weekly digest",
                desc: "Summary of revenue, attendance, and churn.",
              },
              {
                key: "attendanceAlerts",
                label: "Attendance alerts",
                desc: "Notify when peak hours exceed 90% capacity.",
              },
              {
                key: "billingReminders",
                label: "Billing reminders",
                desc: "Send alerts for failed payments or expiring cards.",
              },
            ].map((item) => (
              <ToggleRow
                key={item.key}
                label={item.label}
                description={item.desc}
                enabled={toggles[item.key as keyof typeof toggles]}
                onChange={(value) =>
                  setToggles((prev) => ({
                    ...prev,
                    [item.key]: value,
                  }))
                }
              />
            ))}
          </div>
        </Card>
      </div>

      <Card title="Data exports">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Export mock data
            </p>
            <p className="text-sm text-slate-500">
              Download CSVs for members, attendance, and classes.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Export CSV</Button>
            <Button>Export XLSX</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-blue-300" : "bg-slate-300"
          }`}
        aria-pressed={enabled}
      >
        <span
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition ${enabled ? "translate-x-5" : ""
            }`}
        />
      </button>
    </div>
  );
}

