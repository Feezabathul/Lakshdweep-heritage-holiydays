"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Eye, ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminButton from "@/components/admin/AdminButton";

const BUCKET = "website-media";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

type PackageRecord = {
  id: string;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  duration?: string | null;
  image_url?: string | null;
  inclusions?: string[] | null;
  exclusions?: string[] | null;
};

type PackageForm = {
  name: string;
  description: string;
  price: number;
  duration: string;
  image_url: string;
  inclusions: string[];
  exclusions: string[];
};

const EMPTY_FORM: PackageForm = {
  name: "",
  description: "",
  price: 0,
  duration: "",
  image_url: "",
  inclusions: [],
  exclusions: [],
};

const DEFAULT_SEED_PACKAGES = [
  {
    name: "Kalpeni Island Adventure Package",
    duration: "3 Nights / 4 Days",
    price: 11399,
    image_url: "/images/kalpeni_island.jpg",
    description: "Thrill-filled holiday with Sightseeing and Water Adventure",
    inclusions: [
      "Pick up and Drop off.",
      "Entry Permit to Lakshadweep.",
      "Food and Accommodation.",
      "Transportation in Island.",
      "Water activities including kayaking, snorkeling and glass bottomed boat ride.",
      "Turtle Watch, Fish Watch & Coral Watch.",
      "Trip to Uninhabited Island (Pitti and Thilakam).",
      "Personal Tour Guide.",
    ],
    exclusions: [
      "Ship Ticket.",
      "Scuba Diving.",
      "Cheriyam trip (Uninhabited island).",
      "Night Fishing and Spot Grill.",
      "Personal Expenses.",
    ],
  },
  {
    name: "Agatti Island Adventure Package",
    duration: "3 Nights / 4 Days",
    price: 12499,
    image_url: "/images/agatti_island.jpg",
    description: "Explore the Beauty of Gateway of Lakshadweep",
    inclusions: [
      "Pick up and Drop off.",
      "Entry Permit to Lakshadweep.",
      "Food and Accommodation.",
      "Transportation in Island.",
      "Water activities including kayaking, snorkeling and glass bottomed boat ride.",
      "Turtle Watch, Fish Watch & Coral Watch.",
      "Trip to Uninhabited Island (Kalpitti).",
      "Personal Tour Guide.",
    ],
    exclusions: [
      "Ticket Charges.",
      "Scuba Dive and Other Water activities.",
      "Night Fishing and Spot Grill.",
      "Personal Expenses.",
    ],
  },
  {
    name: "Honeymoon in Paradise.(Agatti/ Kavaratti/ Kalpeni)",
    duration: "3 Nights / 4 Days",
    price: 29999,
    image_url: "/images/honeymoon.jpg",
    description: "Secluded premium, private beach candlelight dinner & sunset cruise.",
    inclusions: [
      "Pick up and Drop off.",
      "Entry Permit to Lakshadweep.",
      "Food and Accommodation (Beach Resort).",
      "Transportation in Island.",
      "Water activities including kayaking, snorkeling and glass bottomed boat ride.",
      "Turtle Watch, Fish Watch & Coral Watch.",
      "Trip to Uninhabited Island.",
      "Beach View Candlelight Dinner.",
      "Personal Tour Guide.",
    ],
    exclusions: [
      "Ticket Charges.",
      "Scuba Dive and Other Water activities.",
      "Night Fishing and Spot Grill.",
      "Personal Expenses.",
    ],
  },
  {
    name: "Family Island Holiday(Agatti/ Kavaratti/Kalpeni).",
    duration: "3 Nights / 4 Days",
    price: 13399,
    image_url: "/images/family_island_holiday.jpg",
    description: "Safe, fun-filled family vacation with shallow lagoon activities.",
    inclusions: [
      "Pick up and Drop off.",
      "Entry Permit to Lakshadweep.",
      "Food and Accommodation (Beach Resort).",
      "Transportation in Island.",
      "Water activities including kayaking, snorkeling and glass bottomed boat ride.",
      "Turtle Watch, Fish Watch & Coral Watch.",
      "Trip to Uninhabited Island.",
      "Beach View Candlelight Dinner.",
      "Personal Tour Guide.",
    ],
    exclusions: [
      "Ticket Charges.",
      "Scuba Dive and Other Water activities.",
      "Night Fishing and Spot Grill.",
      "Personal Expenses.",
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

const displayName = (item: PackageRecord) => item.name || "Untitled package";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"form" | "details" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<PackageRecord | null>(null);
  const [form, setForm] = useState<PackageForm>(EMPTY_FORM);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const supabase = createClient();
    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .select("id, name, description, duration, price, image_url, inclusions, exclusions")
      .order("created_at", { ascending: false });

    if (!packageError && packageData && packageData.length === 0) {
      const { data: seededPackages, error: seedError } = await supabase
        .from("packages")
        .insert(DEFAULT_SEED_PACKAGES)
        .select("id, name, description, duration, price, image_url, inclusions, exclusions");

      if (!seedError && seededPackages) {
        setPackages(seededPackages as PackageRecord[]);
      } else {
        setPackages([]);
      }
    } else if (packageError) {
      setPackages([]);
      if (!packageError.message.includes("relation")) {
        setErrorMessage(packageError.message);
      }
    } else {
      setPackages((packageData ?? []) as PackageRecord[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredPackages = useMemo(
    () =>
      packages.filter((item) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          [
            displayName(item),
            item.description || "",
            item.duration || "",
          ].some((value) => value.toLowerCase().includes(query));
        return matchesSearch;
      }),
    [packages, search],
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrorMessage("");
    setModal("form");
  };

  const openEdit = (item: PackageRecord) => {
    setEditingId(item.id);
    setSelected(item);
    setForm({
      name: displayName(item),
      description: item.description || "",
      price: Number(item.price || 0),
      duration: item.duration || "",
      image_url: item.image_url || "",
      inclusions: listFrom(item.inclusions),
      exclusions: listFrom(item.exclusions),
    });
    setErrorMessage("");
    setModal("form");
  };

  const update = <K extends keyof PackageForm>(key: K, value: PackageForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

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
    const path = `packages/${Date.now()}-${safeName || "image"}`;
    const supabase = createClient();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
    if (error) setErrorMessage(`Image upload failed: ${error.message}`);
    else
      update(
        "image_url",
        supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
      );
    setIsUploading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving || isUploading) return;
    const name = form.name.trim();
    const price = form.price === 0 ? 0 : Number(form.price);
    if (!name) {
      setErrorMessage("Package name is required.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setErrorMessage("Price must be a valid positive number.");
      return;
    }
    setIsSaving(true);
    setErrorMessage("");
    const payload = {
      name,
      description: form.description.trim(),
      price,
      duration: form.duration.trim(),
      image_url: form.image_url,
      inclusions: form.inclusions,
      exclusions: form.exclusions,
    };
    const supabase = createClient();
    const result = editingId
      ? await supabase.from("packages").update(payload).eq("id", editingId)
      : await supabase.from("packages").insert(payload);
    if (result.error) setErrorMessage(result.error.message);
    else {
      setModal(null);
      await loadData();
    }
    setIsSaving(false);
  };

  const remove = async (item: PackageRecord) => {
    if (!window.confirm(`Delete ${displayName(item)}? This cannot be undone.`))
      return;
    const { error } = await createClient()
      .from("packages")
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
            Catalog
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Packages
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage the travel packages available to your guests.
          </p>
        </div>
        <AdminButton onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Package
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
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search packages</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search packages..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
        </label>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Package",
                  "Price",
                  "Duration",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading &&
                filteredPackages.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex min-w-64 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-50 text-sky-600">
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
                        <p className="font-semibold text-slate-900">
                          {displayName(item)}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-800">
                      ₹{Number(item.price || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {item.duration || "-"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelected(item);
                            setModal("details");
                          }}
                          aria-label={`View ${displayName(item)}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          aria-label={`Edit ${displayName(item)}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void remove(item)}
                          aria-label={`Delete ${displayName(item)}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {isLoading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading packages...
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="border-t border-slate-200 px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <PackageEmptyIcon />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              {packages.length ? "No matching packages" : "No packages found"}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              {packages.length
                ? "Try changing your search filters."
                : "Add your first package to populate the catalog."}
            </p>
          </div>
        ) : null}
      </div>
      {modal === "form" && (
        <PackageFormModal
          form={form}
          update={update}
          editing={Boolean(editingId)}
          isSaving={isSaving}
          isUploading={isUploading}
          errorMessage={errorMessage}
          onImageChange={uploadImage}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "details" && selected && (
        <PackageDetails
          item={selected}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function PackageEmptyIcon() {
  return <span className="text-xs font-bold">PKG</span>;
}

function PackageFormModal({
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
  form: PackageForm;
  update: <K extends keyof PackageForm>(key: K, value: PackageForm[K]) => void;
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
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="font-bold text-slate-950">
              {editing ? "Edit package" : "Add package"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Upload an image from your device. Base64 images are not supported.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close package form"
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
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Package name"
              value={form.name}
              required
              onChange={(value) => update("name", value)}
            />
            <Field
              label="Price"
              type="number"
              min="0"
              value={String(form.price)}
              onChange={(value) => update("price", Number(value))}
            />
            <Field
              label="Duration"
              value={form.duration}
              placeholder="3 Nights / 4 Days"
              onChange={(value) => update("duration", value)}
            />
          </div>
          <TextArea
            label="Description"
            value={form.description}
            required
            onChange={(value) => update("description", value)}
          />
          <PackageListEditor
            label="Inclusions"
            items={form.inclusions}
            placeholder="Add an inclusion"
            onChange={(value) => update("inclusions", value)}
          />
          <PackageListEditor
            label="Exclusions"
            items={form.exclusions}
            placeholder="Add an exclusion"
            onChange={(value) => update("exclusions", value)}
          />
          <div>
            <p className="text-sm font-semibold text-slate-700">Package image</p>
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
                alt="Selected package"
                className="mt-3 h-16 w-28 rounded-lg object-cover"
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
                  : "Add package"}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function PackageDetails({
  item,
  onClose,
}: {
  item: PackageRecord;
  onClose: () => void;
}) {
  const groups: [string, string[]][] = [
    ["Inclusions", listFrom(item.inclusions)],
    ["Exclusions", listFrom(item.exclusions)],
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Package details
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {displayName(item)}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {item.duration || "Duration not specified"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close package details"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5 p-6">
          <p className="text-sm leading-6 text-slate-600">
            {item.description || "No description provided."}
          </p>
          {groups.map(([title, values]) => (
            <div key={title}>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              {values.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {values.map((value, index) => (
                    <li key={`${title}-${index}`}>{value}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-slate-400">Not provided</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ...props
}: { label: string; value: string; onChange: (value: string) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  ...props
}: { label: string; value: string; onChange: (value: string) => void } & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
>) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <textarea
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-2 block w-full resize-y rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      />
    </label>
  );
}

function PackageListEditor({
  label,
  items,
  onChange,
  ...props
}: { label: string; items: string[]; onChange: (value: string[]) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };

  return (
    <div className="block text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <div className="mt-2 space-y-2">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(event) => {
                const next = [...items];
                next[index] = event.target.value;
                onChange(next);
              }}
              className="block min-w-0 flex-1 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
            <button
              type="button"
              onClick={() =>
                onChange(items.filter((_, itemIndex) => itemIndex !== index))
              }
              aria-label={`Delete ${label.toLowerCase()} ${index + 1}`}
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <input
            {...props}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addItem();
              }
            }}
            className="block min-w-0 flex-1 rounded-lg border border-dashed border-slate-300 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
          <button
            type="button"
            onClick={addItem}
            aria-label={`Add ${label.toLowerCase()}`}
            className="rounded-lg p-2 text-teal-700 hover:bg-teal-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
