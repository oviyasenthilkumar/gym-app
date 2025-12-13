// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { FormEvent, useState } from "react";

// type FormState = {
//   name: string;
//   email: string;
//   password: string;
//   confirm: string;
// };

// export default function RegisterPage() {
//   const router = useRouter();
//   const [form, setForm] = useState<FormState>({
//     name: "",
//     email: "",
//     password: "",
//     confirm: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [terms, setTerms] = useState(true);

//   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setError(null);

//     if (!form.name) {
//       setError("Please enter your full name.");
//       return;
//     }
//     if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
//       setError("Enter a valid email address.");
//       return;
//     }
//     if (form.password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }
//     if (form.password !== form.confirm) {
//       setError("Passwords do not match.");
//       return;
//     }
//     if (!terms) {
//       setError("Please accept the terms.");
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       router.push("/dashboard");
//     }, 900);
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: "url('/gym-bg.jpg')" }}
//       />
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40" />

//       <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
//         <div className="relative w-full max-w-xl">
//           <div className="pointer-events-none absolute inset-x-6 top-full h-24 rounded-[28px] bg-white/25 blur-3xl opacity-60" />
//           <div className="mirror-card relative rounded-[28px] border border-white/30 bg-white/70 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
//             <div className="grid gap-6 rounded-[26px] bg-gradient-to-b from-white/70 to-white/55 p-8 shadow-inner">
//               <div className="flex items-center gap-3">
//                 <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-lg font-bold text-white shadow-lg">
//                   e
//                 </div>
//                 <div>
//                   <p className="text-xs font-semibold uppercase text-slate-500">
//                     Fitness
//                   </p>
//                   <p className="text-base font-semibold text-slate-900">
//                     Gym management
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <h1 className="text-2xl font-semibold text-slate-900">
//                   Create account
//                 </h1>
//                 <p className="text-sm text-slate-600">
//                   Start managing members, classes, and attendance in minutes.
//                 </p>
//               </div>

//               {error ? (
//                 <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                   {error}
//                 </div>
//               ) : null}

//               <form className="space-y-4" onSubmit={handleSubmit} noValidate>
//                 <Input
//                   label="Full name"
//                   placeholder="Alex Carter"
//                   value={form.name}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, name: e.target.value }))
//                   }
//                   required
//                 />
//                 <Input
//                   label="Work email"
//                   type="email"
//                   placeholder="you@company.com"
//                   value={form.email}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, email: e.target.value }))
//                   }
//                   required
//                 />
//                 <Input
//                   label="Password"
//                   type="password"
//                   placeholder="Create a password"
//                   value={form.password}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, password: e.target.value }))
//                   }
//                   required
//                   hint="Use at least 6 characters."
//                 />
//                 <Input
//                   label="Confirm password"
//                   type="password"
//                   placeholder="Re-enter password"
//                   value={form.confirm}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, confirm: e.target.value }))
//                   }
//                   required
//                 />

//                 <label className="flex items-center gap-2 text-sm text-slate-600">
//                   <input
//                     type="checkbox"
//                     checked={terms}
//                     onChange={() => setTerms((v) => !v)}
//                     className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-500"
//                   />
//                   I agree to the Terms and Privacy Policy
//                 </label>

//                 <Button
//                   type="submit"
//                   loading={loading}
//                   className="w-full"
//                   size="lg"
//                 >
//                   {loading ? "Creating..." : "Create account"}
//                 </Button>
//               </form>

//               <p className="text-center text-sm text-slate-600">
//                 Already have an account?{" "}
//                 <Link href="/login" className="font-semibold text-slate-900">
//                   Log in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authApi, setAuthToken, setUser } from "@/lib/api";

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  role: "member" | "trainer" | "admin";
  membershipStartDate: string;
  membershipEndDate: string;
  plan: string;
  class: string;
  classType: string;
  difficultyLevel: string;
  age: string;
  weight: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    role: "member",
    membershipStartDate: "",
    membershipEndDate: "",
    plan: "",
    class: "",
    classType: "Cardio",
    difficultyLevel: "Beginner",
    age: "",
    weight: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(true);
  const [nextBillingDate, setNextBillingDate] = useState<string>("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ---------------- REGEX ----------------
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Auto-calculate next billing date when start date changes (30 days from start)
  const handleStartDateChange = (date: string) => {
    setForm((f) => ({ ...f, membershipStartDate: date }));
    if (date) {
      const startDate = new Date(date);
      const billingDate = new Date(startDate);
      billingDate.setDate(billingDate.getDate() + 30);
      setNextBillingDate(billingDate.toISOString().slice(0, 10));
    } else {
      setNextBillingDate("");
    }
  };

  // Check if membership is expiring in 7 days
  const isExpiringSoon = () => {
    if (!form.membershipEndDate) return false;
    const endDate = new Date(form.membershipEndDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!emailRegex.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!form.phone.trim() || form.phone.length < 6) {
      setError("Phone number must be at least 6 characters.");
      return;
    }
    // Validate trainee-specific fields
    if (form.role === 'member') {
      if (!form.membershipStartDate) {
        setError("Please select a membership start date.");
        return;
      }
      if (!form.membershipEndDate) {
        setError("Please select a membership end date.");
        return;
      }
      if (new Date(form.membershipEndDate) <= new Date(form.membershipStartDate)) {
        setError("Membership end date must be after start date.");
        return;
      }
      if (!form.plan.trim()) {
        setError("Please enter a membership plan.");
        return;
      }
      if (!form.class.trim()) {
        setError("Please enter a class.");
        return;
      }
    }
    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and a special character."
      );
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!terms) {
      setError("Please accept the terms.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register(
        form.name,
        form.email,
        form.phone,
        form.password,
        form.confirm,
        form.role === 'member' ? form.membershipStartDate : undefined,
        form.role === 'member' ? form.membershipEndDate : undefined,
        form.role === 'member' ? form.plan : undefined,
        form.role === 'member' ? form.class : undefined,
        form.role === 'member' ? form.classType : undefined,
        form.role === 'member' ? form.difficultyLevel : undefined,
        form.role,
        form.role === 'member' && form.age ? parseInt(form.age) : undefined,
        form.role === 'member' && form.weight ? parseFloat(form.weight) : undefined
      );

      if (response.success && response.data) {
        // Store token and user data
        setAuthToken(response.data.token);
        setUser(response.data.user);

        // Redirect based on role
        const role = response.data.user.role;
        if (role === 'admin') {
          router.push('/dashboard');
        } else if (role === 'trainer') {
          router.push('/trainer/dashboard');
        } else {
          router.push('/trainee/dashboard');
        }
      }
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/gym-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-xl">
          <div className="pointer-events-none absolute inset-x-6 top-full h-24 rounded-[28px] bg-white/25 blur-3xl opacity-60" />
          <div className="mirror-card relative rounded-[28px] border border-white/30 bg-white/70 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="grid gap-6 rounded-[26px] bg-gradient-to-b from-white/70 to-white/55 p-8 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-lg font-bold text-white shadow-lg">
                  e
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Fitness
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    Gym management
                  </p>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  Create account
                </h1>
                <p className="text-sm text-slate-600">
                  Start managing members, classes, and attendance in minutes.
                </p>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <Input
                  label="Full name"
                  placeholder="Alex Carter"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />

                <Input
                  label="Work email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />

                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  required
                  hint="Minimum 6 characters"
                />

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "member" | "trainer" | "admin" }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="member">Trainee</option>
                    <option value="trainer">Trainer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Trainee-specific Membership Fields */}
                {form.role === 'member' && (
                  <div className="space-y-4 border-t border-slate-200 pt-4">
                    <p className="text-sm font-semibold text-slate-700">Membership Details (Trainee)</p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        label="Age"
                        type="number"
                        placeholder="e.g., 25"
                        value={form.age}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, age: e.target.value }))
                        }
                        min="1"
                        max="150"
                      />
                      <Input
                        label="Weight (kg)"
                        type="number"
                        placeholder="e.g., 70"
                        value={form.weight}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, weight: e.target.value }))
                        }
                        min="1"
                        max="1000"
                        step="0.1"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        label="Start Date"
                        type="date"
                        value={form.membershipStartDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        required
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={form.membershipEndDate}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, membershipEndDate: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        label="Plan"
                        placeholder="e.g., Premium, Standard"
                        value={form.plan}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, plan: e.target.value }))
                        }
                        required
                      />
                      <Input
                        label="Class"
                        placeholder="e.g., Yoga, CrossFit"
                        value={form.class}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, class: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Class Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.classType}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, classType: e.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          required
                        >
                          <option value="Cardio">Cardio</option>
                          <option value="Strength">Strength</option>
                          <option value="Yoga">Yoga</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Difficulty Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.difficultyLevel}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, difficultyLevel: e.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          required
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    {nextBillingDate && (
                      <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm">
                        <span className="font-semibold text-blue-900">Next Billing Date (Auto-calculated): </span>
                        <span className="text-blue-700">{new Date(nextBillingDate).toLocaleDateString()}</span>
                        <p className="text-xs text-blue-600 mt-1">30 days from start date</p>
                      </div>
                    )}

                    {isExpiringSoon() && (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm">
                        <span className="font-semibold text-amber-900">⚠️ Warning: </span>
                        <span className="text-amber-800">Membership expiring in 7 days or less</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Password */}
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    required
                    hint="At least 8 characters with uppercase, lowercase, number & special symbol."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-[38px] text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Input
                    label="Confirm password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirm}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, confirm: e.target.value }))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-[38px] text-slate-600"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={() => setTerms((v) => !v)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-500"
                  />
                  I agree to the Terms and Privacy Policy
                </label>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Creating..." : "Create account"}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-slate-900">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
