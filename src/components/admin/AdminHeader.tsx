"use client";

import { Bell, LogOut, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AdminHeaderProps = { onMenuClick: () => void };

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const title = pathname === "/admin" ? "Dashboard" : pathname.split("/").pop()?.replace(/-/g, " ") ?? "Admin";

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-8"><div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={onMenuClick} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5" /></button><div><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Admin workspace</p><h1 className="mt-0.5 text-lg font-bold capitalize text-slate-950">{title}</h1></div></div><div className="flex items-center gap-2 sm:gap-4"><label className="relative hidden md:block"><span className="sr-only">Search admin workspace</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" placeholder="Search workspace" className="w-48 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 lg:w-64" /></label><button aria-label="Notifications" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" /></button><div className="hidden h-8 w-px bg-slate-200 sm:block" /><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">AD</span><span className="hidden text-sm font-semibold text-slate-700 sm:block">Administrator</span></div><button onClick={handleLogout} aria-label="Logout" className="hidden items-center gap-2 rounded-lg p-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 sm:flex"><LogOut className="h-4 w-4" />Logout</button></div></header>;
}