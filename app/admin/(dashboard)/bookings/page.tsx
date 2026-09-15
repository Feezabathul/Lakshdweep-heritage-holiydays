"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Eye,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminButton from "@/components/admin/AdminButton";

type Booking = {
  id: string;
  created_at?: string | null;
  customer_name?: string | null;
  package_name?: string | null;
  travelers?: string | null;
  travel_date?: string | null;
  permit_status?: string | null;
  status?: string | null;
  email?: string | null;
  phone?: string | null;
  accommodation_type?: string | null;
  message?: string | null;
};

type PermitStatus = "Pending" | "Approved" | "Cancelled";

const PERMIT_STATUSES: PermitStatus[] = ["Pending", "Approved", "Cancelled"];

const formatDate = (value?: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const permitTone = (status?: string | null): "teal" | "amber" | "rose" | "slate" => {
  switch ((status ?? "").toLowerCase()) {
    case "approved": return "teal";
    case "cancelled": return "rose";
    default: return "amber";
  }
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [permitFilter, setPermitFilter] = useState<"all" | PermitStatus>("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const { data, error } = await createClient()
      .from("bookings")
      .select("id, created_at, customer_name, package_name, travelers, travel_date, permit_status, status, email, phone, accommodation_type, message")
      .order("created_at", { ascending: false });

    if (error) {
      setBookings([]);
      setErrorMessage(
        error.message.includes("relation")
          ? "The bookings table is not set up in Supabase yet."
          : error.message,
      );
    } else {
      setBookings((data ?? []) as Booking[]);
    }
    setIsLoading(false);
  };

  useEffect(() => { void loadBookings(); }, []);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchSearch = !query ||
        (b.customer_name ?? "").toLowerCase().includes(query) ||
        (b.package_name ?? "").toLowerCase().includes(query);
      const matchPermit = permitFilter === "all" || (b.permit_status ?? "Pending") === permitFilter;
      return matchSearch && matchPermit;
    });
  }, [bookings, search, permitFilter]);

  const updatePermitStatus = async (booking: Booking, status: PermitStatus) => {
    if (updatingId) return;
    setUpdatingId(booking.id);
    setErrorMessage("");
    const { error } = await createClient().from("bookings").update({ permit_status: status }).eq("id", booking.id);
    if (error) {
      setErrorMessage(error.message);
    } else {
      const patch = (b: Booking) => b.id === booking.id ? { ...b, permit_status: status } : b;
      setBookings((prev) => prev.map(patch));
      setSelected((prev) => (prev?.id === booking.id ? patch(prev) : prev));
    }
    setUpdatingId(null);
  };

  const deleteBooking = async (booking: Booking) => {
    if (!window.confirm(`Delete booking for ${booking.customer_name ?? "this client"}? This cannot be undone.`)) return;
    setDeletingId(booking.id);
    setErrorMessage("");
    const { error } = await createClient().from("bookings").delete().eq("id", booking.id);
    if (error) {
      setErrorMessage(error.message);
    } else {
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      if (selected?.id === booking.id) setSelected(null);
    }
    setDeletingId(null);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Operations</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Bookings</h2>
        <p className="mt-2 max-w-2xl text-sm font-medium text-slate-600">
          Review customer enquiries, manage permit status, and keep every guest journey moving.
        </p>
      </div>

      {errorMessage && (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search client or package</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client name or package..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800">
          <ShieldCheck className="h-4 w-4 text-slate-400" />
          <span className="sr-only">Filter by permit status</span>
          <select
            value={permitFilter}
            onChange={(e) => setPermitFilter(e.target.value as "all" | PermitStatus)}
            className="bg-transparent outline-none"
            aria-label="Filter by permit status"
          >
            <option value="all">All permit statuses</option>
            {PERMIT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </label>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {["Date", "Client Name", "Package", "Travelers", "Travel Date", "Permit Status", "Quick Action"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading && rows.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-800">{formatDate(booking.created_at)}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="text-sm font-semibold text-slate-950">{booking.customer_name || "—"}</p>
                  </td>
                  <td className="max-w-52 truncate px-5 py-4 text-sm font-medium text-slate-900">{booking.package_name || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-800">{booking.travelers || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-800">{formatDate(booking.travel_date)}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <AdminBadge tone={permitTone(booking.permit_status)}>{booking.permit_status ?? "Pending"}</AdminBadge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelected(booking)}
                        aria-label={`View booking for ${booking.customer_name ?? "client"}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                      <div className="relative">
                        <select
                          value={booking.permit_status ?? "Pending"}
                          onChange={(e) => void updatePermitStatus(booking, e.target.value as PermitStatus)}
                          disabled={updatingId === booking.id}
                          aria-label={`Update permit status for ${booking.customer_name ?? "client"}`}
                          className="cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 pr-6 text-xs font-bold text-slate-900 hover:bg-slate-50 focus:outline-none disabled:opacity-50"
                        >
                          {PERMIT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                      </div>
                      <button
                        onClick={() => void deleteBooking(booking)}
                        disabled={deletingId === booking.id}
                        aria-label={`Delete booking for ${booking.customer_name ?? "client"}`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading ? (
          <div className="p-12 text-center text-sm text-slate-500">Loading bookings...</div>
        ) : rows.length === 0 ? (
          <div className="border-t border-slate-200 px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              {bookings.length ? "No matching bookings" : "No enquiries yet"}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              {bookings.length ? "Try changing your search or permit status filter." : "Customer enquiries submitted from the website will appear here."}
            </p>
          </div>
        ) : null}
      </div>

      {selected && (
        <BookingDrawer
          booking={selected}
          updatingId={updatingId}
          onUpdatePermit={updatePermitStatus}
          onDelete={deleteBooking}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function BookingDrawer({
  booking,
  updatingId,
  onUpdatePermit,
  onDelete,
  onClose,
}: {
  booking: Booking;
  updatingId: string | null;
  onUpdatePermit: (booking: Booking, status: PermitStatus) => void;
  onDelete: (booking: Booking) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close booking details" onClick={onClose} className="absolute inset-0 bg-slate-950/30" />
      <aside role="dialog" aria-modal="true" aria-label="Booking details" className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Booking details</p>
            <h2 className="mt-1.5 text-xl font-bold text-slate-950">{booking.customer_name || "—"}</h2>
            <p className="mt-0.5 text-sm font-medium text-slate-700">{booking.package_name || "No package selected"}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-sm font-bold text-slate-900">Permit Status</span>
            <AdminBadge tone={permitTone(booking.permit_status)}>{booking.permit_status ?? "Pending"}</AdminBadge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailCard label="Enquiry date" value={formatDate(booking.created_at)} />
            <DetailCard label="Travel date" value={formatDate(booking.travel_date)} />
            <DetailCard label="Travelers" value={booking.travelers ?? "—"} />
            <DetailCard label="Accommodation" value={booking.accommodation_type ?? "—"} />
          </div>

          {booking.message && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">Special Requirements / Message</p>
              <p className="rounded-xl bg-slate-50 p-4 text-sm font-medium leading-relaxed text-slate-800">{booking.message}</p>
            </div>
          )}

          <div>
            <p className="mb-3 text-sm font-bold text-slate-900">Update Permit Status</p>
            <div className="flex flex-wrap gap-2">
              {PERMIT_STATUSES.map((status) => (
                <AdminButton
                  key={status}
                  variant={(booking.permit_status ?? "Pending") === status ? "primary" : "secondary"}
                  disabled={updatingId === booking.id || (booking.permit_status ?? "Pending") === status}
                  onClick={() => onUpdatePermit(booking, status)}
                >
                  {status}
                </AdminButton>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={() => onDelete(booking)}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete this booking
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</p>
      <p className="mt-1.5 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}
