"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trainerProfile } from "@/data/trainer";
import Image from "next/image";
import { useState, useEffect } from "react";
import { authApi, removeAuthToken, removeUser } from "@/lib/api";

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authApi.getProfile();
        if (response.success && response.data) {
          setProfile(prev => ({
            ...prev,
            name: response.data!.name,
            email: response.data!.email,
            phone: (response.data as any).phone || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const onChange = (key: keyof typeof profile, value: string) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">Profile</p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Manage your account
          </h1>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            // Reset to initial fetched values would require storing them separately
            // For now, we just clear password
            setProfile(prev => ({
              ...prev,
              password: "",
            }));
            setSaved(false);
          }}
        >
          Reset
        </Button>
      </div>

      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Profile saved (mock).
        </div>
      ) : null}

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              <Image
                src={trainerProfile.avatar}
                alt={profile.name || "Profile"}
                fill
                sizes="96px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex-1 space-y-3">
              <Input
                label="Full name"
                value={profile.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
              <Input
                label="Phone"
                value={profile.phone}
                onChange={(e) => onChange("phone", e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={profile.password}
                onChange={(e) => onChange("password", e.target.value)}
                hint="Set a new password to update."
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setSaved(true)}>Save changes</Button>
            <Button variant="secondary" onClick={() => {
              removeAuthToken();
              removeUser();
              window.location.href = '/login';
            }}>
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

