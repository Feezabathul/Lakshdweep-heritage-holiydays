"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(error.message || "Unable to sign in. Please check your details and try again.");
      setIsLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-50 px-4 py-12 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(13,148,136,0.12),_transparent_32%)]" />
      <div className="relative w-full max-w-[440px]">
        <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3 text-sm font-bold text-slate-700 transition-colors hover:text-sky-700">
          <span className="relative h-11 w-11 overflow-hidden rounded-xl border border-white bg-white shadow-md">
            <Image src="/logo.jpg" alt="Lakshadweep Heritage Holidays" fill className="object-cover" sizes="44px" priority />
          </span>
          <span>Lakshadweep Heritage Holidays</span>
        </Link>

        <section className="rounded-2xl border border-white/80 bg-white p-7 shadow-[0_24px_70px_rgba(8,58,90,0.14)] sm:p-10">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Private workspace</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Admin Portal</h1>
            <p className="mt-2 text-sm text-slate-500">Lakshadweep Heritage Holidays</p>
          </div>

          {errorMessage && (
            <div role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium leading-5 text-rose-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="text-sm font-semibold text-slate-700">Email address</label>
              <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" autoComplete="email" required disabled={isLoading} className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50" />
            </div>
            <div>
              <label htmlFor="admin-password" className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative mt-2">
                <input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required disabled={isLoading} className="block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50" />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 transition-colors hover:text-sky-700 disabled:cursor-not-allowed">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-700/20 transition-colors hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-500/25 disabled:cursor-not-allowed disabled:opacity-70">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</> : <>Sign In<ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-8 border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-400">Authorized team members only. Your account is secured by Supabase Auth.</p>
        </section>
      </div>
    </main>
  );
}
