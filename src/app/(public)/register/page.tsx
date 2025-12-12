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

type FormState = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ---------------- REGEX ----------------
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 900);
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
