import Link from "next/link";
import { CalendarClock, CheckCircle2, ClipboardList, Compass, Eye, FileCheck2, Home, Map, PackagePlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminTable from "@/components/admin/AdminTable";

type BookingRecord = Record<string, unknown>;

type DashboardBooking = {
  customer: string;
  packageName: string;
  travelDate: string;
  travelers: string;
  status: string;
  createdDate: string;
  id: string;
};

const valueFrom = (record: BookingRecord, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (value !== null && value !== undefined && String(value).trim()) return String(value);
  }
  return "-";
};

const formatDate = (value: string) => {
  if (value === "-") return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const statusTone = (status: string): "teal" | "amber" | "slate" | "rose" => {
  const normalized = status.toLowerCase();
  if (normalized.includes("approved") || normalized.includes("confirmed") || normalized.includes("complete")) return "teal";
  if (normalized.includes("reject") || normalized.includes("cancel")) return "rose";
  if (normalized.includes("pending") || normalized.includes("review")) return "amber";
  return "slate";
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data, count, error } = await supabase.from("bookings").select("*", { count: "exact" }).limit(50);
  const records = (data ?? []) as BookingRecord[];
  const hasPermitStatusField = records.some((record) => Object.prototype.hasOwnProperty.call(record, "permit_status"));
  const bookings: DashboardBooking[] = records.map((record, index) => ({
    id: valueFrom(record, ["id", "booking_id"]) || String(index),
    customer: valueFrom(record, ["customer_name", "guest_name", "name", "full_name", "customer"]),
    packageName: valueFrom(record, ["package_name", "package", "package_title", "tour_package"]),
    travelDate: formatDate(valueFrom(record, ["travel_date", "start_date", "check_in", "date"])),
    travelers: valueFrom(record, ["travelers", "traveller_count", "guests", "number_of_travelers"]),
    status: valueFrom(record, ["status", "booking_status"]) || "New",
    createdDate: formatDate(valueFrom(record, ["created_at", "created_date", "submitted_at"])),
  }));

  const pendingPermits = hasPermitStatusField ? records.filter((record) => valueFrom(record, ["permit_status"]).toLowerCase().includes("pending")).length : 0;
  const approvedPermits = hasPermitStatusField ? records.filter((record) => valueFrom(record, ["permit_status"]).toLowerCase().includes("approved")).length : 0;
  const dataUnavailable = Boolean(error);
  const permitStatusDetail = dataUnavailable || !hasPermitStatusField ? "Requires permit_status field" : "From Supabase booking records";

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Operations overview</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Welcome to your dashboard</h2><p className="mt-2 text-sm text-slate-500">Track enquiries, permits, and island journeys from one workspace.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard label="Total Inquiries" value={String(count ?? (dataUnavailable ? 0 : records.length))} detail={dataUnavailable ? "No booking data available" : "Total Supabase booking enquiries"} icon={ClipboardList} accent="bg-sky-50 text-sky-700" />
        <AdminStatCard label="Pending Permits" value={String(pendingPermits)} detail={permitStatusDetail} icon={FileCheck2} accent="bg-amber-50 text-amber-700" />
        <AdminStatCard label="Permits Approved" value={String(approvedPermits)} detail={permitStatusDetail} icon={CheckCircle2} accent="bg-teal-50 text-teal-700" />
      </div>
      <section>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h3 className="font-bold text-slate-950">Recent booking enquiries</h3><p className="mt-1 text-sm text-slate-500">New and recent guest enquiries from your Supabase records.</p></div><Link href="/admin/bookings" className="text-sm font-semibold text-teal-700 hover:text-teal-800">View all bookings</Link></div>
        <AdminTable columns={[{ key: "customer", label: "Customer" }, { key: "packageName", label: "Package" }, { key: "travelDate", label: "Travel date" }, { key: "travelers", label: "Travelers" }, { key: "status", label: "Status", render: (value) => <AdminBadge tone={statusTone(String(value))}>{String(value)}</AdminBadge> }, { key: "createdDate", label: "Created date" }, { key: "id", label: "Action", render: (value) => <Link href={`/admin/bookings?view=${encodeURIComponent(String(value))}`} aria-label="View booking" className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:text-teal-800"><Eye className="h-4 w-4" />View</Link> }]} rows={bookings.slice(0, 5)} emptyTitle={dataUnavailable ? "Bookings are not connected" : "No booking enquiries yet"} emptyDescription={dataUnavailable ? "Connect the Supabase bookings table to show enquiries here." : "New enquiries will appear here when customers submit a booking."} />
      </section>
      <section><div className="mb-4"><h3 className="font-bold text-slate-950">Quick actions</h3><p className="mt-1 text-sm text-slate-500">Jump directly to the areas you manage most.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><QuickAction href="/admin/packages" icon={PackagePlus} label="Add Package" /><QuickAction href="/admin/accommodation" icon={Home} label="Add Accommodation" /><QuickAction href="/admin/islands" icon={Map} label="Add Island" /><QuickAction href="/admin/bookings" icon={CalendarClock} label="View Bookings" /></div></section>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label }: { href: string; icon: typeof Compass; label: string }) {
  return <Link href={href} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"><span className="flex items-center gap-3"><span className="rounded-lg bg-sky-50 p-2.5 text-sky-700"><Icon className="h-5 w-5" /></span><span className="text-sm font-semibold text-slate-700 group-hover:text-slate-950">{label}</span></span><Compass className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600" /></Link>;
}
