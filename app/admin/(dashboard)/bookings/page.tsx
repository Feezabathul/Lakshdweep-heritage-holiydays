"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Eye,
  FileDown,
  MessageCircle,
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

const formatWhatsAppUrl = (phone?: string | null, clientName?: string | null): string => {
  if (!phone) return "";
  let digits = phone.trim().replace(/[^0-9]/g, "");
  if (!digits) return "";
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  const text = encodeURIComponent(`Hello ${clientName || "Valued Customer"}, regarding your Lakshadweep travel enquiry...`);
  return `https://wa.me/${digits}?text=${text}`;
};

const generateBookingPdf = (booking: Booking) => {
  const safe = (v?: string | null) => v?.trim() || "—";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Booking — ${safe(booking.customer_name)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Lato', sans-serif; color: #0f172a; background: #fff; padding: 40px 48px; font-size: 13px; }
    .header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 2px solid #0f766e; padding-bottom: 18px; margin-bottom: 28px; }
    .brand { display: flex; flex-direction: column; gap: 2px; }
    .brand-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #0f766e; }
    .brand-sub { font-size: 11px; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; }
    .doc-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #1e293b; text-align: right; }
    .doc-id { font-size: 10px; color: #94a3b8; text-align: right; margin-top: 4px; }
    .section-title { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #0f766e; margin-bottom: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .field { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; }
    .field-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .field-value { font-size: 13px; font-weight: 700; color: #0f172a; word-break: break-word; }
    .field.full { grid-column: 1 / -1; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; line-height: 1.7; color: #334155; white-space: pre-wrap; word-break: break-word; }
    .status-badge { display: inline-block; padding: 4px 14px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
    .status-approved { background: #ccfbf1; color: #0f766e; }
    .status-cancelled { background: #fee2e2; color: #b91c1c; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .footer { margin-top: 36px; border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 24px 32px; }
      @page { margin: 0.5cm; size: A4; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="brand-name">Lakshadweep Heritage Holidays</div>
      <div class="brand-sub">Booking Confirmation</div>
    </div>
    <div>
      <div class="doc-title">Booking Summary</div>
      <div class="doc-id">Ref: ${safe(booking.id).slice(0, 8).toUpperCase()}</div>
    </div>
  </div>

  <p class="section-title">Customer Information</p>
  <div class="grid">
    <div class="field">
      <div class="field-label">Customer Name</div>
      <div class="field-value">${safe(booking.customer_name)}</div>
    </div>
    <div class="field">
      <div class="field-label">Phone Number</div>
      <div class="field-value">${safe(booking.phone)}</div>
    </div>
    <div class="field full">
      <div class="field-label">Email Address</div>
      <div class="field-value">${safe(booking.email)}</div>
    </div>
  </div>

  <p class="section-title">Trip Details</p>
  <div class="grid">
    <div class="field full">
      <div class="field-label">Package</div>
      <div class="field-value">${safe(booking.package_name)}</div>
    </div>
    <div class="field">
      <div class="field-label">Number of Travelers</div>
      <div class="field-value">${safe(booking.travelers)}</div>
    </div>
    <div class="field">
      <div class="field-label">Travel Date</div>
      <div class="field-value">${formatDate(booking.travel_date)}</div>
    </div>
    <div class="field">
      <div class="field-label">Booking Date</div>
      <div class="field-value">${formatDate(booking.created_at)}</div>
    </div>
    <div class="field">
      <div class="field-label">Permit Status</div>
      <div class="field-value">
        <span class="status-badge status-${(booking.permit_status ?? 'pending').toLowerCase()}">${safe(booking.permit_status) === '—' ? 'Pending' : safe(booking.permit_status)}</span>
      </div>
    </div>
  </div>

  ${booking.message ? `
  <p class="section-title">Special Requirements / Message</p>
  <div class="message-box">${safe(booking.message)}</div>
  ` : ''}

  <div class="footer">
    <span>Lakshadweep Heritage Holidays &mdash; Confidential</span>
    <span>Generated ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
  </div>
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (!doc) { document.body.removeChild(iframe); return; }
  doc.open();
  doc.write(html);
  doc.close();

  // Wait for fonts/resources then print
  const doPrint = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => { document.body.removeChild(iframe); }, 1000);
  };
  if (iframe.contentDocument?.readyState === "complete") {
    setTimeout(doPrint, 400);
  } else {
    iframe.onload = () => setTimeout(doPrint, 400);
  }
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [permitFilter, setPermitFilter] = useState<"all" | PermitStatus>("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pdfingId, setPdfingId] = useState<string | null>(null);

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
    return bookings.filter((b) => {
      const matchPermit = permitFilter === "all" || (b.permit_status ?? "Pending") === permitFilter;
      return matchPermit;
    });
  }, [bookings, permitFilter]);

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

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
                      {booking.phone && formatWhatsAppUrl(booking.phone, booking.customer_name) ? (
                        <a
                          href={formatWhatsAppUrl(booking.phone, booking.customer_name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp chat with ${booking.customer_name ?? "client"}`}
                          title={`Chat on WhatsApp (${booking.phone})`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <MessageCircle className="h-3.5 w-3.5 text-emerald-600 fill-emerald-100" />
                          <span>WhatsApp</span>
                        </a>
                      ) : null}
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
                        onClick={() => {
                          setPdfingId(booking.id);
                          generateBookingPdf(booking);
                          setTimeout(() => setPdfingId(null), 1500);
                        }}
                        disabled={pdfingId === booking.id}
                        aria-label={`Download PDF for ${booking.customer_name ?? "client"}`}
                        title="Download booking PDF"
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 transition-colors"
                      >
                        <FileDown className="h-4.5 w-4.5" strokeWidth={2.2} />
                        PDF
                      </button>
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
              {bookings.length ? "Try changing your permit status filter." : "Customer enquiries submitted from the website will appear here."}
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
