"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Eye, ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminButton from "@/components/admin/AdminButton";

const ISLANDS = ["Agatti", "Bangaram", "Kavaratti", "Kalpeni"];

type PackageRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
  island_id?: string | null;
  island?: string | null;
  target_island_slug?: string | null;
  category?: string | null;
  description?: string | null;
  price?: number | null;
  raw_price?: string | null;
  duration?: string | null;
  image_url?: string | null;
  image?: string | null;
  gallery_images?: string[] | null;
  highlights?: string[] | null;
  inclusions?: string[] | null;
  exclusions?: string[] | null;
  itinerary?: string[] | null;
  status?: string | null;
};

type IslandRecord = { id: string; name: string; slug?: string | null };
type PackageForm = { name: string; island_id: string; description: string; price: number; duration: string; image_url: string; gallery_images: string[]; inclusions: string[]; exclusions: string[]; itinerary: string[]; status: string };

const EMPTY_FORM: PackageForm = { name: "", island_id: "", description: "", price: 0, duration: "", image_url: "", gallery_images: [], inclusions: [], exclusions: [], itinerary: [], status: "Active" };
const listFrom = (value: unknown) => Array.isArray(value) ? value.map(String) : typeof value === "string" ? value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean) : [];
const displayName = (item: PackageRecord) => item.name || item.title || "Untitled package";
const displayIsland = (item: PackageRecord, islands: IslandRecord[]) => item.island || islands.find((island) => island.id === item.island_id)?.name || islands.find((island) => island.slug === item.target_island_slug)?.name || item.target_island_slug || "Unassigned";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageRecord[]>([]);
  const [islands, setIslands] = useState<IslandRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [islandFilter, setIslandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState<"form" | "details" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<PackageRecord | null>(null);
  const [form, setForm] = useState<PackageForm>(EMPTY_FORM);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const supabase = createClient();
    const [{ data: packageData, error: packageError }, { data: islandData }] = await Promise.all([
      supabase.from("packages").select("*").order("created_at", { ascending: false }),
      supabase.from("islands").select("id, name, slug").order("name"),
    ]);
    if (packageError) {
      setPackages([]);
      setErrorMessage(packageError.message.includes("relation") ? "The packages table is not available in Supabase yet." : packageError.message);
    } else setPackages((packageData ?? []) as PackageRecord[]);
    setIslands((islandData ?? []) as IslandRecord[]);
    setIsLoading(false);
  };

  useEffect(() => { void loadData(); }, []);

  const islandOptions = islands.length ? islands.map((island) => island.name) : ISLANDS;
  const filteredPackages = useMemo(() => packages.filter((item) => {
    const itemIsland = displayIsland(item, islands);
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [displayName(item), item.description || "", item.duration || "", item.category || ""].some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (islandFilter === "all" || itemIsland === islandFilter) && (statusFilter === "all" || (item.status || "Active").toLowerCase() === statusFilter.toLowerCase());
  }), [islandFilter, islands, packages, search, statusFilter]);

  const openCreate = () => { setEditingId(null); setForm({ ...EMPTY_FORM, island_id: islands[0]?.id || "" }); setErrorMessage(""); setModal("form"); };
  const openEdit = (item: PackageRecord) => { setEditingId(item.id); setSelected(item); setForm({ name: displayName(item), island_id: item.island_id || "", description: item.description || "", price: Number(item.price || 0), duration: item.duration || "", image_url: item.image_url || item.image || "", gallery_images: listFrom(item.gallery_images), inclusions: listFrom(item.inclusions || item.highlights), exclusions: listFrom(item.exclusions), itinerary: listFrom(item.itinerary), status: item.status || "Active" }); setErrorMessage(""); setModal("form"); };
  const update = <K extends keyof PackageForm>(key: K, value: PackageForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    const payload = { name: form.name, title: form.name, island_id: form.island_id || null, description: form.description, price: Number(form.price) || 0, duration: form.duration, image_url: form.image_url, gallery_images: form.gallery_images, inclusions: form.inclusions, highlights: form.inclusions, exclusions: form.exclusions, itinerary: form.itinerary, status: form.status };
    const supabase = createClient();
    const result = editingId ? await supabase.from("packages").update(payload).eq("id", editingId) : await supabase.from("packages").insert(payload);
    if (result.error) setErrorMessage(result.error.message);
    else { setModal(null); await loadData(); }
    setIsSaving(false);
  };

  const remove = async (item: PackageRecord) => {
    if (!window.confirm(`Delete ${displayName(item)}? This cannot be undone.`)) return;
    const { error } = await createClient().from("packages").delete().eq("id", item.id);
    if (error) setErrorMessage(error.message); else await loadData();
  };

  const toggleStatus = async (item: PackageRecord) => {
    const status = (item.status || "Active").toLowerCase() === "active" ? "Inactive" : "Active";
    const { error } = await createClient().from("packages").update({ status }).eq("id", item.id);
    if (error) setErrorMessage(error.message); else setPackages((current) => current.map((record) => record.id === item.id ? { ...record, status } : record));
  };

  return <div className="mx-auto max-w-[1400px] space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Catalog</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Packages</h2><p className="mt-2 max-w-2xl text-sm text-slate-500">Manage the island journeys available to your guests.</p></div><AdminButton onClick={openCreate}><Plus className="h-4 w-4" />Add Package</AdminButton></div>{errorMessage && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}<div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row"><label className="relative flex-1"><span className="sr-only">Search packages</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search packages..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" /></label><select value={islandFilter} onChange={(event) => setIslandFilter(event.target.value)} aria-label="Filter packages by island" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"><option value="all">All islands</option>{islandOptions.map((island) => <option key={island}>{island}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter packages by status" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr>{["Package", "Island", "Price", "Duration", "Status", "Actions"].map((heading) => <th key={heading} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{!isLoading && filteredPackages.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-5 py-4"><div className="flex min-w-64 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-50 text-sky-600">{(item.image_url || item.image) ? <img src={item.image_url || item.image || ""} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-5 w-5" />}</div><p className="font-semibold text-slate-900">{displayName(item)}</p></div></td><td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{displayIsland(item, islands)}</td><td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-800">₹{Number(item.price || 0).toLocaleString("en-IN")}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{item.duration || "-"}</td><td className="whitespace-nowrap px-5 py-4"><button onClick={() => void toggleStatus(item)}><AdminBadge tone={(item.status || "Active").toLowerCase() === "active" ? "teal" : "slate"}>{item.status || "Active"}</AdminBadge></button></td><td className="whitespace-nowrap px-5 py-4"><div className="flex items-center gap-1"><button onClick={() => { setSelected(item); setModal("details"); }} aria-label={`View ${displayName(item)}`} className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"><Eye className="h-4 w-4" /></button><button onClick={() => openEdit(item)} aria-label={`Edit ${displayName(item)}`} className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"><Pencil className="h-4 w-4" /></button><button onClick={() => void remove(item)} aria-label={`Delete ${displayName(item)}`} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>{isLoading ? <div className="p-12 text-center text-sm text-slate-500">Loading packages...</div> : filteredPackages.length === 0 ? <div className="border-t border-slate-200 px-6 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><PackageEmptyIcon /></div><h3 className="mt-4 text-sm font-semibold text-slate-900">{packages.length ? "No matching packages" : "No packages found"}</h3><p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{packages.length ? "Try changing your search or filters." : "Packages from Supabase will appear here once they are available."}</p></div> : null}</div>{modal === "form" && <PackageFormModal form={form} update={update} editing={Boolean(editingId)} isSaving={isSaving} errorMessage={errorMessage} islands={islands} onSubmit={handleSubmit} onClose={() => setModal(null)} />}{modal === "details" && selected && <PackageDetails item={selected} island={displayIsland(selected, islands)} onClose={() => setModal(null)} />}</div>;
}

function PackageEmptyIcon() { return <span className="text-xs font-bold">PKG</span>; }
function PackageFormModal({ form, update, editing, isSaving, errorMessage, islands, onSubmit, onClose }: { form: PackageForm; update: <K extends keyof PackageForm>(key: K, value: PackageForm[K]) => void; editing: boolean; isSaving: boolean; errorMessage: string; islands: IslandRecord[]; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4"><div><h2 className="font-bold text-slate-950">{editing ? "Edit package" : "Add package"}</h2><p className="mt-1 text-xs text-slate-500">Images must be URLs. Base64 images are not supported.</p></div><button onClick={onClose} aria-label="Close package form" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><form onSubmit={onSubmit} className="space-y-5 p-6">{errorMessage && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}<div className="grid gap-5 sm:grid-cols-2"><Field label="Package name" value={form.name} required onChange={(value) => update("name", value)} /><label className="block text-sm font-semibold text-slate-700">Island<select value={form.island_id} onChange={(event) => update("island_id", event.target.value)} required className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal"><option value="">Select island</option>{islands.map((island) => <option key={island.id} value={island.id}>{island.name}</option>)}</select></label><Field label="Price" type="number" min="0" value={String(form.price)} onChange={(value) => update("price", Number(value))} /><Field label="Duration" value={form.duration} placeholder="3 Nights / 4 Days" onChange={(value) => update("duration", value)} /><Field label="Main image URL" type="url" value={form.image_url} placeholder="https://..." onChange={(value) => update("image_url", value)} /><SelectField label="Status" value={form.status} options={["Active", "Inactive"]} onChange={(value) => update("status", value)} /></div><TextArea label="Description" value={form.description} required onChange={(value) => update("description", value)} /><TextArea label="Inclusions" value={form.inclusions.join("\n")} placeholder="One inclusion per line" onChange={(value) => update("inclusions", listFrom(value))} /><TextArea label="Exclusions" value={form.exclusions.join("\n")} placeholder="One exclusion per line" onChange={(value) => update("exclusions", listFrom(value))} /><TextArea label="Itinerary" value={form.itinerary.join("\n")} placeholder="One itinerary item per line" onChange={(value) => update("itinerary", listFrom(value))} /><TextArea label="Gallery image URLs" value={form.gallery_images.join("\n")} placeholder="One URL per line" onChange={(value) => update("gallery_images", listFrom(value))} /><div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><AdminButton type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</AdminButton><AdminButton type="submit" disabled={isSaving}>{isSaving ? "Saving..." : editing ? "Save changes" : "Add package"}</AdminButton></div></form></div></div>;
}
function PackageDetails({ item, island, onClose }: { item: PackageRecord; island: string; onClose: () => void }) { const groups: [string, string[]][] = [["Inclusions", listFrom(item.inclusions || item.highlights)], ["Exclusions", listFrom(item.exclusions)], ["Itinerary", listFrom(item.itinerary)]]; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-slate-200 px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-wider text-teal-700">Package details</p><h2 className="mt-1 text-xl font-bold text-slate-950">{displayName(item)}</h2><p className="mt-1 text-sm text-slate-500">{island} · {item.duration || "Duration not specified"}</p></div><button onClick={onClose} aria-label="Close package details" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="space-y-5 p-6"><p className="text-sm leading-6 text-slate-600">{item.description || "No description provided."}</p>{groups.map(([title, values]) => <div key={title}><h3 className="text-sm font-bold text-slate-900">{title}</h3>{values.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">{values.map((value, index) => <li key={`${title}-${index}`}>{value}</li>)}</ul> : <p className="mt-1 text-sm text-slate-400">Not provided</p>}</div>)}</div></div></div>; }
function Field({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) { return <label className="block text-sm font-semibold text-slate-700">{label}<input {...props} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" /></label>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="block text-sm font-semibold text-slate-700">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function TextArea({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">) { return <label className="block text-sm font-semibold text-slate-700">{label}<textarea {...props} value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-2 block w-full resize-y rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" /></label>; }
