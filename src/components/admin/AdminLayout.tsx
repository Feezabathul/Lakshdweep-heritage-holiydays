"use client";

import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="min-h-screen bg-slate-100 text-slate-900"><AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="lg:pl-72"><AdminHeader onMenuClick={() => setSidebarOpen(true)} /><main className="min-h-[calc(100vh-5rem)] p-4 sm:p-8">{children}</main></div></div>;
}