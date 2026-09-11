"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, ImagePlus, Plus, Search, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminButton from "@/components/admin/AdminButton";

const BUCKET = "website-media";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

type AccommodationRecord = {
  id: string;
  image_url?: string | null;
  accommodation_type?: string | null;
  heading?: string | null;
  description_points?: string[] | null;
  name?: string | null;
  category?: string | null;
  amenities?: string[] | null;
};

type AccommodationForm = {
  image_url: string;
  accommodation_type: string;
  heading: string;
  description_points: string[];
};

const EMPTY_FORM: AccommodationForm = {
  image_url: "",
  accommodation_type: "",
  heading: "",
  description_points: [],
};

const DEFAULT_SEED_ACCOMMODATIONS: Omit<AccommodationForm, "id">[] = [
  {
    accommodation_type: "Homestay",
    heading: "Beach Front Homestay",
    image_url: "/images/homestay.jpg",
    description_points: [
      "Beach front location",
      "Local island experience",
      "Comfortable rooms",
      "Authentic hospitality",
      "Budget-friendly option",
    ],
  },
  {
    accommodation_type: "Resort",
    heading: "Beach Resort",
    image_url: "/images/resort.jpg",
    description_points: [
      "Beach resort",
      "Premium accommodation",
      "Beautiful ocean surroundings",
      "Ideal for couples & honeymooners",
      "Enhanced comfort",
    ],
  },
  {
    accommodation_type: "Standard Rooms",
    heading: "Beach Front Standard Rooms",
    image_url: "/images/standard_rooms.jpg",
    description_points: [
      "Beach front location",
      "Clean & comfortable",
      "Essential amenities",
      "Family-friendly",
      "Affordable",
    ],
  },
];

const listFrom = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value
          .split(/\r?\n|,/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

const getHeading = (item: AccommodationRecord) =>
  item.heading || item.name || "Untitled Accommodation";

const getType = (item: AccommodationRecord): string =>
  item.accommodation_type || item.category || "";

export default function AdminAccommodationPage() {
  const [accommodations, setAccommodations] = useState<AccommodationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AccommodationForm>(EMPTY_FORM);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("accommodations")
      .select("id, accommodation_type, heading, image_url, description_points, name, category, amenities")
      .order("created_at", { ascending: false });

    if (!error && data && data.length === 0) {
      const { data: seeded, error: seedError } = await supabase
        .from("accommodations")
        .insert(
          DEFAULT_SEED_ACCOMMODATIONS.map((item) => ({
            accommodation_type: item.accommodation_type,
            heading: item.heading,
            image_url: item.image_url,
            description_points: item.description_points,
            name: item.heading,
            category: item.accommodation_type,
          })),
        )
        .select("id, accommodation_type, heading, image_url, description_points, name, category, amenities");

      if (!seedError && seeded) {
        setAccommodations(seeded as AccommodationRecord[]);
      } else {
        setAccommodations([]);
      }
    } else if (error) {
      setAccommodations([]);
      if (!error.message.includes("relation")) {
        setErrorMessage(error.message);
      }
    } else {
      setAccommodations((data ?? []) as AccommodationRecord[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredAccommodations = useMemo(() => {
    return accommodations.filter((item) => {
      const query = search.trim().toLowerCase();
      const heading = getHeading(item).toLowerCase();
      const type = getType(item).toLowerCase();
      const points = listFrom(item.description_points ?? item.amenities).join(" ").toLowerCase();
      return !query || [heading, type, points].some((str) => str.includes(query));
    });
  }, [accommodations, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrorMessage("");
    setModalOpen(true);
  };

  const openEdit = (item: AccommodationRecord) => {
    setEditingId(item.id);
    setForm({
      heading: getHeading(item),
      accommodation_type: getType(item),
      image_url: item.image_url || "",
      description_points: listFrom(item.description_points ?? item.amenities),
    });
    setErrorMessage("");
    setModalOpen(true);
  };

  const update = <K extends keyof AccommodationForm>(
    key: K,
    value: AccommodationForm[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setErrorMessage("Choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage("Images must be 5 MB or smaller.");
      return;
    }
    setIsUploading(true);
    setErrorMessage("");
    const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
    const path = `accommodations/${Date.now()}-${safeName || "image"}`;
    const supabase = createClient();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      setErrorMessage(`Image upload failed: ${error.message}`);
    } else {
      update(
        "image_url",
        supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
      );
    }
    setIsUploading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving || isUploading) return;
    const heading = form.heading.trim();
    if (!heading) {
      setErrorMessage("Heading is required.");
      return;
    }
    setIsSaving(true);
    setErrorMessage("");

    const payload = {
      accommodation_type: form.accommodation_type,
      heading,
      description_points: form.description_points,
      image_url: form.image_url,
      name: heading,
      category: form.accommodation_type,
    };

    const supabase = createClient();
    const result = editingId
      ? await supabase.from("accommodations").update(payload).eq("id", editingId)
      : await supabase.from("accommodations").insert(payload);

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      setModalOpen(false);
      await loadData();
    }
    setIsSaving(false);
  };

  const handleDelete = async (item: AccommodationRecord) => {
    if (!window.confirm(`Delete ${getHeading(item)}? This cannot be undone.`)) return;
    const { error } = await createClient()
      .from("accommodations")
      .delete()
      .eq("id", item.id);
    if (error) setErrorMessage(error.message);
    else await loadData();
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
            Inventory
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Accommodation
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage your island stays, resorts, and rooms.
          </p>
        </div>
        <AdminButton onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Accommodation
        </AdminButton>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {errorMessage}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search accommodations</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by heading or type..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {["Heading", "Accommodation Type", "Description Points", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading &&
                filteredAccommodations.map((item) => {
                  const points = listFrom(item.description_points ?? item.amenities);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex min-w-56 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-50 text-sky-600">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImagePlus className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {getHeading(item)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-sky-700">
                        {getType(item)}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {points.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-600 max-w-md">
                            {points.slice(0, 3).map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                            {points.length > 3 && (
                              <li className="text-slate-400 italic list-none">
                                +{points.length - 3} more point(s)
                              </li>
                            )}
                          </ul>
                        ) : (
                          <span className="text-xs text-slate-400 italic">None</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            aria-label={`Edit ${getHeading(item)}`}
                            className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => void handleDelete(item)}
                            aria-label={`Delete ${getHeading(item)}`}
                            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading accommodations...
          </div>
        ) : filteredAccommodations.length === 0 ? (
          <div className="border-t border-slate-200 px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <ImagePlus className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              {accommodations.length ? "No matching accommodations" : "No accommodations found"}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              {accommodations.length
                ? "Try changing your search or type filter."
                : "Add your first accommodation to populate the inventory."}
            </p>
          </div>
        ) : null}
      </div>

      {modalOpen && (
        <AccommodationFormModal
          form={form}
          update={update}
          editing={Boolean(editingId)}
          isSaving={isSaving}
          isUploading={isUploading}
          errorMessage={errorMessage}
          onImageChange={uploadImage}
          onSubmit={handleSubmit}
          onClose={() => !isSaving && !isUploading && setModalOpen(false)}
        />
      )}
    </div>
  );
}

function AccommodationFormModal({
  form,
  update,
  editing,
  isSaving,
  isUploading,
  errorMessage,
  onImageChange,
  onSubmit,
  onClose,
}: {
  form: AccommodationForm;
  update: <K extends keyof AccommodationForm>(
    key: K,
    value: AccommodationForm[K],
  ) => void;
  editing: boolean;
  isSaving: boolean;
  isUploading: boolean;
  errorMessage: string;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="font-bold text-slate-950">
              {editing ? "Edit accommodation" : "Add accommodation"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Fill in the accommodation details below.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {errorMessage}
            </div>
          )}

          {/* 1. Accommodation Type */}
          <label className="block text-sm font-semibold text-slate-700">
            Accommodation Type
            <input
              value={form.accommodation_type ?? ""}
              onChange={(event) =>
                update("accommodation_type", event.target.value)
              }
              placeholder="e.g. Homestay, Resort, Standard Rooms"
              className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
          </label>

          {/* 2. Heading */}
          <label className="block text-sm font-semibold text-slate-700">
            Heading
            <input
              value={form.heading ?? ""}
              onChange={(event) => update("heading", event.target.value)}
              placeholder="e.g. Beach Front Homestay"
              required
              className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
          </label>

          {/* 3. Description Points */}
          <DescriptionPointsEditor
            points={form.description_points}
            onChange={(points) => update("description_points", points)}
          />

          {/* 4. Image Upload */}
          <div>
            <p className="text-sm font-semibold text-slate-700">Accommodation Image</p>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <ImagePlus className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={onImageChange}
                disabled={isUploading}
                className="sr-only"
              />
            </label>

            {form.image_url && (
              <img
                src={form.image_url}
                alt="Selected accommodation"
                className="mt-3 h-20 w-32 rounded-lg object-cover border border-slate-200"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving || isUploading}
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" disabled={isSaving || isUploading}>
              {isSaving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Add accommodation"}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function DescriptionPointsEditor({
  points,
  onChange,
}: {
  points: string[];
  onChange: (points: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const addPoint = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...points, value]);
    setDraft("");
  };

  return (
    <div className="block text-sm font-semibold text-slate-700">
      <span>Description Points</span>
      <p className="text-xs text-slate-500 font-normal mt-0.5 mb-2">
        Add bullet points describing this stay (e.g. "Beach front location").
      </p>

      <div className="space-y-2">
        {points.map((point, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">•</span>
            <input
              value={point ?? ""}
              onChange={(event) => {
                const next = [...points];
                next[index] = event.target.value;
                onChange(next);
              }}
              className="block min-w-0 flex-1 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
            <button
              type="button"
              onClick={() =>
                onChange(points.filter((_, pointIdx) => pointIdx !== index))
              }
              aria-label={`Remove point ${index + 1}`}
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addPoint();
              }
            }}
            placeholder="Add a description point and press Enter..."
            className="block min-w-0 flex-1 rounded-lg border border-dashed border-slate-300 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
          <button
            type="button"
            onClick={addPoint}
            aria-label="Add description point"
            className="rounded-lg p-2 text-teal-700 hover:bg-teal-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
