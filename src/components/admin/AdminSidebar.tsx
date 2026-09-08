"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { BarChart3, CalendarDays, FileImage, Home, Hotel, LayoutDashboard, LogOut, Map, Settings, Ship, Users, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAVIGATION = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Packages", href: "/admin/packages", icon: Ship },
  { label: "Accommodation", href: "/admin/accommodation", icon: Hotel },
  { label: "Islands", href: "/admin/islands", icon: Map },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Website Content", href: "/admin/content", icon: FileImage },
  { label: "Media", href: "/admin/media", icon: Home },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

type AdminSidebarProps = { open: boolean; onClose: () => void };

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await createClient().auth.signOut();
    onClose();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {open && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 text-sm font-bold text-slate-950">LH</span>
            <span><strong className="block text-sm text-white">Heritage Holidays</strong><span className="text-xs text-slate-500">Admin workspace</span></span>
          </Link>
          <button aria-label="Close navigation" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-white/10 hover:text-white lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">Workspace</p>
          {NAVIGATION.map(({ label, href, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-teal-500/15 text-teal-300" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon className="h-[18px] w-[18px]" />{label}</Link>;
          })}
          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">System</p>
          <Link href="/admin/settings" onClick={onClose} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith("/admin/settings") ? "bg-teal-500/15 text-teal-300" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Settings className="h-[18px] w-[18px]" />Settings</Link>
        </nav>
        <div className="border-t border-white/10 p-4"><button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-400 hover:bg-white/5 hover:text-white"><LogOut className="h-[18px] w-[18px]" />Logout</button></div>
      </aside>
    </>
  );
}