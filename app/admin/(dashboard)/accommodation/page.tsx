"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, ImagePlus, Plus, Search, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminButton from "@/components/admin/AdminButton";

const CATEGORY_OPTIONS = ["BEACH FRONT HOMESTAY", "BEACH RESORT", "BEACH FRONT STANDARD ROOMS"];
const ISLAND_OPTIONS = ["Agatti", "Kavaratti", "Kalpeni", "Bangaram"];

type Accommodation = {
  id: string;
  name: string;
  category: string;
  island: string;
  description: string;
  location: string;
  price: number;
  capacity: number;
  amenities: string[];
  image_url: string;
  gallery_images: string[];
  status: "active" | "inactive";
  badge: string | null;
};

type AccommodationForm = Omit<Accommodation, "id">;

const EMPTY_FORM: AccommodationForm = {
  name: "",
  category: CATEGORY_OPTIONS[0],
  island: ISLAND_OPTIONS[0],
  description: "",
  location: "",
  price: 0,
  capacity: 1,
  amenities: [],
  image_url: "",
  gallery_images: [],
  status: "active",
  badge: "",
};

const splitLines = (value: string) => value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
const joinLines = (items: string[]) => items.join("\n");

export default function AdminAccommodationPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [islandFilter, setIslandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AccommodationForm>(EMPTY_FORM);

  const loadAccommodations = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const { data, error } = await createClient().from("accommodations").select("*").order("created_at", { ascending: false });
    if (error) {
      setErrorMessage(error.message.includes("relation") ? "The accommodations table is not available yet. Run the migration in supabase/migrations/20260905000000_create_accommodations.sql in Supabase." : error.message);
      setAccommodations([]);
    } else {
      setAccommodations((data ?? []) as Accommodation[]);
    }
    setIsLoading(false);
  };

  useEffect(() => { void loadAccommodations(); }, []);

  const filteredAccommodations = useMemo(() => accommodations.filter((accommodation) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [accommodation.name, accommodation.category, accommodation.island, accommodation.location].some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (islandFilter === "all" || accommodation.island === islandFilter) && (statusFilter === "all" || accommodation.status === statusFilter);
  }), [accommodations, islandFilter, search, statusFilter]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setErrorMessage(""); setModalOpen(true); };
  const openEdit = (accommodation: Accommodation) => {
    setEditingId(accommodation.id);
    setForm({ ...accommodation, amenities: accommodation.amenities ?? [], gallery_images: accommodation.gallery_images ?? [], badge: accommodation.badge ?? "" });
    setErrorMessage("");
    setModalOpen(true);
  };

  const closeModal = () => { if (!isSaving) setModalOpen(false); };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    const payload = { ...form, price: Number(form.price) || 0, capacity: Number(form.capacity) || 1, amenities: form.amenities, gallery_images: form.gallery_images, badge: form.badge?.trim() || null };
    const supabase = createClient();
    const result = editingId
      ? await supabase.from("accommodations").update(payload).eq("id", editingId)
      : await supabase.from("accommodations").insert(payload);
    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      setModalOpen(false);
      await loadAccommodations();
    }
    setIsSaving(false);
  };

  const handleDelete = async (accommodation: Accommodation) => {
    if (!window.confirm(`Delete ${accommodation.name}? This cannot be undone.`)) return;
    const { error } = await createClient().from("accommodations").delete().eq("id", accommodation.id);
    if (error) setErrorMessage(error.message);
    else await loadAccommodations();
  };

  const toggleStatus = async (accommodation: Accommodation) => {
    const nextStatus = accommodation.status === "active" ? "inactive" : "active";
    const { error } = await createClient().from("accommodations").update({ status: nextStatus }).eq("id", accommodation.id);
    if (error) setErrorMessage(error.message);
    else setAccommodations((current) => current.map((item) => item.id === accommodation.id ? { ...item, status: nextStatus } : item));
  };

  return <div className="mx-auto max-w-[1400px] space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Inventory</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Accommodation</h2><p className="mt-2 max-w-2xl text-sm text-slate-500">Manage stays, room details, pricing, and availability across the islands.</p></div><AdminButton onClick={openCreate}><Plus className="h-4 w-4" />Add Accommodation</AdminButton></div>{errorMessage && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}<div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row"><label className="relative flex-1"><span className="sr-only">Search accommodations</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, category, island..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" /></label><select value={islandFilter} onChange={(event) => setIslandFilter(event.target.value)} aria-label="Filter by island" className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-500"><option value="all">All islands</option>{ISLAND_OPTIONS.map((island) => <option key={island}>{island}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status" className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-500"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr>{["Accommodation", "Island", "Category", "Price", "Capacity", "Status", "Actions"].map((heading) => <th key={heading} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{!isLoading && filteredAccommodations.map((accommodation) => <tr key={accommodation.id} className="hover:bg-slate-50"><td className="px-5 py-4"><div className="flex min-w-52 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-50 text-sky-600">{accommodation.image_url ? <img src={accommodation.image_url} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-5 w-5" />}</div><div><p className="font-semibold text-slate-900">{accommodation.name}</p>{accommodation.badge && <p className="mt-0.5 text-[10px] font-bold tracking-wider text-amber-700">{accommodation.badge}</p>}</div></div></td><td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{accommodation.island}</td><td className="whitespace-nowrap px-5 py-4 text-xs font-semibold text-slate-500">{accommodation.category}</td><td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-800">₹{Number(accommodation.price || 0).toLocaleString("en-IN")}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{accommodation.capacity}</td><td className="whitespace-nowrap px-5 py-4"><button onClick={() => void toggleStatus(accommodation)} aria-label={`Set ${accommodation.name} ${accommodation.status === "active" ? "inactive" : "active"}`}><AdminBadge tone={accommodation.status === "active" ? "teal" : "slate"}>{accommodation.status === "active" ? "Active" : "Inactive"}</AdminBadge></button></td><td className="whitespace-nowrap px-5 py-4"><div className="flex items-center gap-1"><button onClick={() => openEdit(accommodation)} aria-label={`Edit ${accommodation.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"><Edit3 className="h-4 w-4" /></button><button onClick={() => void handleDelete(accommodation)} aria-label={`Delete ${accommodation.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>{isLoading ? <div className="p-12 text-center text-sm text-slate-500">Loading accommodations...</div> : filteredAccommodations.length === 0 ? <div className="border-t border-slate-200 px-6 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><ImagePlus className="h-5 w-5" /></div><h3 className="mt-4 text-sm font-semibold text-slate-900">{accommodations.length ? "No matching accommodations" : "No accommodations yet"}</h3><p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{accommodations.length ? "Try changing your search or filters." : "Add your first stay to begin managing accommodation inventory."}</p></div> : null}</div>{modalOpen && <AccommodationModal form={form} setForm={setForm} editing={Boolean(editingId)} isSaving={isSaving} errorMessage={errorMessage} onClose={closeModal} onSubmit={handleSubmit} />}</div>;
}

function AccommodationModal({ form, setForm, editing, isSaving, errorMessage, onClose, onSubmit }: { form: AccommodationForm; setForm: React.Dispatch<React.SetStateAction<AccommodationForm>>; editing: boolean; isSaving: boolean; errorMessage: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const update = <K extends keyof AccommodationForm>(key: K, value: AccommodationForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div role="dialog" aria-modal="true" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4"><div><h2 className="font-bold text-slate-950">{editing ? "Edit accommodation" : "Add accommodation"}</h2><p className="mt-1 text-xs text-slate-500">Use image URLs only. Base64 images are not supported.</p></div><button onClick={onClose} aria-label="Close modal" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><form onSubmit={onSubmit} className="space-y-5 p-6">{errorMessage && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}<div className="grid gap-5 sm:grid-cols-2"><Field label="Name" value={form.name} required onChange={(value) => update("name", value)} /><SelectField label="Category" value={form.category} options={CATEGORY_OPTIONS} onChange={(value) => update("category", value)} /><SelectField label="Island" value={form.island} options={ISLAND_OPTIONS} onChange={(value) => update("island", value)} /><Field label="Location" value={form.location} onChange={(value) => update("location", value)} /><Field label="Price" type="number" min="0" value={String(form.price)} onChange={(value) => update("price", Number(value))} /><Field label="Capacity" type="number" min="1" value={String(form.capacity)} onChange={(value) => update("capacity", Number(value))} /><SelectField label="Status" value={form.status} options={["active", "inactive"]} onChange={(value) => update("status", value as AccommodationForm["status"])} /><Field label="Badge (optional)" value={form.badge ?? ""} placeholder="PREMIUM STAY" onChange={(value) => update("badge", value)} /></div><TextAreaField label="Description" value={form.description} required onChange={(value) => update("description", value)} /><TextAreaField label="Amenities" value={joinLines(form.amenities)} placeholder="One amenity per line" onChange={(value) => update("amenities", splitLines(value))} /><Field label="Image URL" type="url" value={form.image_url} placeholder="https://..." onChange={(value) => update("image_url", value)} /><TextAreaField label="Gallery image URLs" value={joinLines(form.gallery_images)} placeholder="One URL per line" onChange={(value) => update("gallery_images", splitLines(value))} /><div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><AdminButton type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</AdminButton><AdminButton type="submit" disabled={isSaving}>{isSaving ? "Saving..." : editing ? "Save changes" : "Add accommodation"}</AdminButton></div></form></div></div>;
}

function Field({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) { return <label className="block text-sm font-semibold text-slate-700">{label}<input {...props} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" /></label>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="block text-sm font-semibold text-slate-700">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function TextAreaField({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">) { return <label className="block text-sm font-semibold text-slate-700">{label}<textarea {...props} value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-2 block w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" /></label>; }
