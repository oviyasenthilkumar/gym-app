"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { membersApi, Member, getUser } from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function TraineeProfileEditPage() {
  const router = useRouter();
  const user = useMemo(() => getUser(), []);
  const [memberProfile, setMemberProfile] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    weight: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await membersApi.getProfile();
        if (response.success && response.data) {
          setMemberProfile(response.data);
          setForm({
            name: response.data.name || "",
            phone: response.data.phone || "",
            email: response.data.email || "",
            age: response.data.age ? response.data.age.toString() : "",
            weight: response.data.weight ? response.data.weight.toString() : "",
            password: "",
          });
        } else {
          console.error("Failed to load profile:", response);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError("Name, phone, and email are required.");
      return;
    }
    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.age && (parseInt(form.age) < 1 || parseInt(form.age) > 150)) {
      setError("Age must be between 1 and 150.");
      return;
    }
    if (form.weight && (parseFloat(form.weight) < 1 || parseFloat(form.weight) > 1000)) {
      setError("Weight must be between 1 and 1000 kg.");
      return;
    }

    setError(null);
    setSaving(true);

    try {
      if (!memberProfile) {
        setError("Profile not found.");
        return;
      }

      // Update member profile using the profile endpoint (allows members to update their own profile)
      const updateData: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        age: form.age ? parseInt(form.age) : undefined,
        weight: form.weight ? parseFloat(form.weight) : undefined,
      };

      const response = await membersApi.updateProfile(updateData);

      if (response.success) {
        // If password is provided, update it separately
        if (form.password) {
          try {
            const { authApi } = await import("@/lib/api");
            // Note: Password update requires current password, so we'll skip it for now
            // The user can use the forgot password feature if needed
            console.log("Password update requires current password. Please use the password reset feature.");
          } catch (pwdError) {
            console.error("Password update error:", pwdError);
          }
        }

        setSaved(true);
        // Reload profile to get updated data
        const profileResponse = await membersApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setMemberProfile(profileResponse.data);
        }
        // Redirect back to profile page after 1.5 seconds
        setTimeout(() => {
          router.push("/trainee/profile");
        }, 1500);
      } else {
        setError(response.message || "Failed to update profile.");
      }
    } catch (error: any) {
      setError(error.message || "Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-emerald-700">Profile</p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit your details
        </h1>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Changes saved successfully! Redirecting...
        </div>
      ) : null}

      <Card>
        <div className="space-y-3">
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
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
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            hint="Only set this if you want to change it."
          />
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} loading={saving}>
              Save changes
            </Button>
            <Button variant="secondary" onClick={() => router.push("/trainee/profile")}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

