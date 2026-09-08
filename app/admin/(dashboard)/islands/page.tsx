"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, ImagePlus, MapPin, Plus, Search, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminButton from "@/components/admin/AdminButton";

type Island = { id: string; name: string; slug?: string | null; description?: string | null; image_url?: string | null; gallery_images?: string[] | null; activities?: string[] | null; location?: string | null; status?: string | null };
type IslandForm = { name: string; description: string; image_url: string; gallery_images: string[]; activities: string[]; location: string; status: string };
const EMPTY_FORM: IslandForm = { name: "", description: "", image_url: "", gallery_images: [], activities: [], location: "", status: "Active" };
const listFrom = (value: unknown) => Array.isArray(value) ? value.map(String) : typeof value === "string" ? value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean) : [];
const joinLines = (items: string[] | null | undefined) => (items ?? []).join("\n");

export default function AdminIslandsPage() {
  const [islands, setIslands] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IslandForm>(EMPTY_FORM);

  const loadIslands = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const { data, error } = await createClient().from("islands").select("*").order("name");
    if (error) {
      setIslands([]);
      setErrorMessage(error.message.includes("relation") ? "The islands table is not available in Supabase yet." : error.message);
    } else setIslands((data ?? []) as Island[]);
    setIsLoading(false);
  };

  useEffect(() => { void loadIslands(); }, []);
  const filteredIslands = useMemo(() => islands.filter((island) => { const query = search.trim().toLowerCase(); return !query || [island.name, island.description || "", island.location || "", island.slug || ""].some((value) => value.toLowerCase().includes(query)); }), [islands, search]);
  const update = <K extends keyof IslandForm>(key: K, value: IslandForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setErrorMessage(""); setModalOpen(true); };
  const openEdit = (island: Island) => { setEditingId(island.id); setForm({ name: island.name, description: island.description || "", image_url: island.image_url || "", gallery_images: listFrom(island.gallery_images), activities: listFrom(island.activities), location: island.location || "", status: island.status || "Active" }); setErrorMessage(""); setModalOpen(true); };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    const slug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload = { ...form, slug, gallery_images: form.gallery_images, activities: form.activities };
    const supabase = createClient();
    const result = editingId ? await supabase.from("islands").update(payload).eq("id", editingId) : await supabase.from("islands").insert(payload);
    if (result.error) setErrorMessage(result.error.message); else { setModalOpen(false); await loadIslands(); }
    setIsSaving(false);
  };

  const remove = async (island: Island) => {
    if (!window.confirm(`Delete ${island.name}? This cannot be undone.`)) return;
    const { error } = await createClient().from("islands").delete().eq("id", island.id);
    if (error) setErrorMessage(error.message); else await loadIslands();
  };
  const toggleStatus = async (island: Island) => {
    const status = (island.status || "Active").toLowerCase() === "active" ? "Inactive" : "Active";
    const { error } = await createClient().from("islands").update({ status }).eq("id", island.id);
    if (error) setErrorMessage(error.message); else setIslands((current) => current.map((item) => item.id === island.id ? { ...item, status } : item));
  };

  return <div className="mx-auto max-w-[1400px] space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Destinations</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Islands</h2><p className="mt-2 max-w-2xl text-sm text-slate-500">Manage island profiles, activities, imagery, and availability.</p></div><AdminButton onClick={openCreate}><Plus className="h-4 w-4" />Add Island</AdminButton></div>{errorMessage && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><label className="relative block"><span className="sr-only">Search islands</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search islands..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" /></label></div><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr>{["Island", "Location", "Activities", "Status", "Actions"].map((heading) => <th key={heading} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{!isLoading && filteredIslands.map((island) => <tr key={island.id} className="hover:bg-slate-50"><td className="px-5 py-4"><div className="flex min-w-64 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-50 text-sky-600">{island.image_url ? <img src={island.image_url} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-5 w-5" />}</div><div><p className="font-semibold text-slate-900">{island.name}</p><p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">{island.description || "No description"}</p></div></div></td><td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600"><span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-sky-600" />{island.location || "-"}</span></td><td className="max-w-xs px-5 py-4 text-sm text-slate-600">{island.activities?.length ? island.activities.join(", ") : "-"}</td><td className="whitespace-nowrap px-5 py-4"><button onClick={() => void toggleStatus(island)}><AdminBadge tone={(island.status || "Active").toLowerCase() === "active" ? "teal" : "slate"}>{island.status || "Active"}</AdminBadge></button></td><td className="whitespace-nowrap px-5 py-4"><div className="flex items-center gap-1"><button onClick={() => openEdit(island)} aria-label={`Edit ${island.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"><Edit3 className="h-4 w-4" /></button><button onClick={() => void remove(island)} aria-label={`Delete ${island.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>{isLoading ? <div className="p-12 text-center text-sm text-slate-500">Loading islands...</div> : filteredIslands.length === 0 ? <div className="border-t border-slate-200 px-6 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><MapPin className="h-5 w-5" /></div><h3 className="mt-4 text-sm font-semibold text-slate-900">{islands.length ? "No matching islands" : "No islands found"}</h3><p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{islands.length ? "Try a different search." : "Island records from Supabase will appear here."}</p></div> : null}</div>{modalOpen && <IslandModal form={form} update={update} editing={Boolean(editingId)} isSaving={isSaving} errorMessage={errorMessage} onSubmit={handleSubmit} onClose={() => !isSaving && setModalOpen(false)} />}</div>;
}

function IslandModal({ form, update, editing, isSaving, errorMessage, onSubmit, onClose }: { form: IslandForm; update: <K extends keyof IslandForm>(key: K, value: IslandForm[K]) => void; editing: boolean; isSaving: boolean; errorMessage: string; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-6 py-4"><div><h2 className="font-bold text-slate-950">{editing ? "Edit island" : "Add island"}</h2><p className="mt-1 text-xs text-slate-500">Use image URLs only. Base64 images are not supported.</p></div><button onClick={onClose} aria-label="Close island form" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><form onSubmit={onSubmit} className="space-y-5 p-6">{errorMessage && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}<div className="grid gap-5 sm:grid-cols-2"><Field label="Island name" value={form.name} required onChange={(value) => update("name", value)} /><Field label="Location" value={form.location} placeholder="Lakshadweep, India" onChange={(value) => update("location", value)} /><Field label="Main image URL" type="url" value={form.image_url} placeholder="https://..." onChange={(value) => update("image_url", value)} /><SelectField label="Status" value={form.status} options={["Active", "Inactive"]} onChange={(value) => update("status", value)} /></div><TextArea label="Description" value={form.description} required onChange={(value) => update("description", value)} /><TextArea label="Activities" value={joinLines(form.activities)} placeholder="One activity per line" onChange={(value) => update("activities", listFrom(value))} /><TextArea label="Gallery image URLs" value={joinLines(form.gallery_images)} placeholder="One URL per line" onChange={(value) => update("gallery_images", listFrom(value))} /><div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><AdminButton type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</AdminButton><AdminButton type="submit" disabled={isSaving}>{isSaving ? "Saving..." : editing ? "Save changes" : "Add island"}</AdminButton></div></form></div></div>;
}
function Field({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) { return <label className="block text-sm font-semibold text-slate-700">{label}<input {...props} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" /></label>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="block text-sm font-semibold text-slate-700">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function TextArea({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">) { return <label className="block text-sm font-semibold text-slate-700">{label}<textarea {...props} value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-2 block w-full resize-y rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" /></label>; }
