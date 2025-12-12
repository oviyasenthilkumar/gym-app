// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { FormEvent, useState } from "react";

// type FormState = {
//   email: string;
//   password: string;
// };

// export default function LoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState<FormState>({ email: "", password: "" });
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [remember, setRemember] = useState(true);

//   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setError(null);

//     if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
//       setError("Enter a valid admin email address.");
//       return;
//     }
//     if (!form.password || form.password.length < 6) {
//       setError("Password must be at least 6 characters.");
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
//                 <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
//                 <p className="text-sm text-slate-600">
//                   Access your gym dashboard in seconds.
//                 </p>
//               </div>

//               {error ? (
//                 <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                   {error}
//                 </div>
//               ) : null}

//               <form className="space-y-4" onSubmit={handleSubmit} noValidate>
//                 <Input
//                   label="Email"
//                   type="email"
//                   placeholder="admin@gymmini.app"
//                   value={form.email}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, email: e.target.value }))
//                   }
//                   required
//                 />
//                 <Input
//                   label="Password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={form.password}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, password: e.target.value }))
//                   }
//                   required
//                 />

//                 <div className="flex items-center justify-between text-sm text-slate-600">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={remember}
//                       onChange={() => setRemember((v) => !v)}
//                       className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-500"
//                     />
//                     Keep me logged in
//                   </label>
//                   <Link href="#" className="font-semibold text-slate-800">
//                     Forgot password?
//                   </Link>
//                 </div>

//                 <Button
//                   type="submit"
//                   loading={loading}
//                   className="w-full"
//                   size="lg"
//                 >
//                   {loading ? "Signing in..." : "Log in"}
//                 </Button>
//               </form>

//               <p className="text-center text-sm text-slate-600">
//                 Don&apos;t have an account?{" "}
//                 <Link href="/register" className="font-semibold text-slate-900">
//                   Register
//                 </Link>
//               </p>

//               <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
//                 <Link href="#" className="hover:text-slate-800">
//                   Terms of Use
//                 </Link>
//                 <span>•</span>
//                 <Link href="#" className="hover:text-slate-800">
//                   Privacy Policy
//                 </Link>
//               </div>
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type FormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  // Forgot Password Modals States
const [showEmailModal, setShowEmailModal] = useState(false);
const [showOtpModal, setShowOtpModal] = useState(false);
const [showResetModal, setShowResetModal] = useState(false);
const [showPass, setShowPass] = useState(false);
const [showPass2, setShowPass2] = useState(false);
const [resetEmail, setResetEmail] = useState("");
const [otp, setOtp] = useState("");
const [newPass, setNewPass] = useState("");
const [confirmPass, setConfirmPass] = useState("");

const [generatedOtp] = useState("123456"); // mock OTP
const [msg, setMsg] = useState("");


  // REGEX
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!emailRegex.test(form.email)) {
      setError("Enter a valid admin email address.");
      return;
    }
    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must contain uppercase, lowercase, number & special character."
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 900);
  };

  return (
    <>
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

              {/* Logo */}
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

              {/* Titles */}
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
                <p className="text-sm text-slate-600">
                  Access your gym dashboard in seconds.
                </p>
              </div>

              {/* Error Box */}
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {/* FORM */}
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <Input
                  label="Email"
                  type="email"
                  placeholder="admin@gymmini.app"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />

                {/* PASSWORD WITH EYE ICON */}
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-[38px] text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={() => setRemember((v) => !v)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-500"
                    />
                    Keep me logged in
                  </label>
                  <Link
                  href="#"
                  className="font-semibold text-slate-800"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowEmailModal(true);
                  }}
                >
                  Forgot password?
                </Link>
                                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Signing in..." : "Log in"}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-slate-900">
                  Register
                </Link>
              </p>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
                <Link href="#" className="hover:text-slate-800">
                  Terms of Use
                </Link>
                <span>•</span>
                <Link href="#" className="hover:text-slate-800">
                  Privacy Policy
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
  <DialogContent className="rounded-2xl">
    <DialogHeader>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogDescription>
        Enter the registered email to receive OTP.
      </DialogDescription>
    </DialogHeader>

    <Input
      label="Email"
      type="email"
      placeholder="yourmail@example.com"
      value={resetEmail}
      onChange={(e) => setResetEmail(e.target.value)}
    />

    {msg && <p className="text-sm text-red-600">{msg}</p>}

    <Button
      className="w-full"
      onClick={() => {
        if (!/\S+@\S+\.\S+/.test(resetEmail)) {
          setMsg("Enter a valid email address.");
          return;
        }
        setMsg("");
        setShowEmailModal(false);
        setShowOtpModal(true);
        console.log("OTP Sent:", generatedOtp); // simulate OTP sending
      }}
    >
      Send OTP
    </Button>
  </DialogContent>
</Dialog>
<Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
  <DialogContent className="rounded-2xl">
    <DialogHeader>
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogDescription>
        OTP has been sent to <b>{resetEmail}</b>.
      </DialogDescription>
    </DialogHeader>

    <Input
      label="OTP"
      type="text"
      maxLength={6}
      placeholder="123456"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />

    {msg && <p className="text-sm text-red-600">{msg}</p>}

    <Button
      className="w-full"
      onClick={() => {
        if (otp !== generatedOtp) {
          setMsg("Incorrect OTP. Try again.");
          return;
        }
        setMsg("");
        setShowOtpModal(false);
        setShowResetModal(true);
      }}
    >
      Verify OTP
    </Button>
  </DialogContent>
</Dialog>
<Dialog open={showResetModal} onOpenChange={setShowResetModal}>
  <DialogContent className="rounded-2xl">
    <DialogHeader>
      <DialogTitle>Create New Password</DialogTitle>
      <DialogDescription>
        Your new password must be at least 6 characters.
      </DialogDescription>
    </DialogHeader>

    {/* New Password */}
    <div className="relative">
      <Input
        label="New Password"
        type={showPass ? "text" : "password"}
        placeholder="••••••••"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
        onClick={() => setShowPass((v) => !v)}
      >
        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>

    {/* Confirm Password */}
    <div className="relative">
      <Input
        label="Confirm Password"
        type={showPass2 ? "text" : "password"}
        placeholder="••••••••"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
        onClick={() => setShowPass2((v) => !v)}
      >
        {showPass2 ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>

    {msg && <p className="text-sm text-red-600">{msg}</p>}

    <Button
      className="w-full"
      onClick={() => {
        if (newPass.length < 6) {
          setMsg("Password must be at least 6 characters.");
          return;
        }
        if (newPass !== confirmPass) {
          setMsg("Passwords do not match.");
          return;
        }

        setMsg("");
        setShowResetModal(false);
        alert("Password changed successfully!");
      }}
    >
      Update Password
    </Button>
  </DialogContent>
</Dialog>

    </>
  );
}
