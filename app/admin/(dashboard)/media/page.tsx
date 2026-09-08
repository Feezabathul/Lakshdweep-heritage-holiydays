"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  FolderOpen,
  Grid3X3,
  ImageOff,
  LayoutList,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminButton from "@/components/admin/AdminButton";
import AdminBadge from "@/components/admin/AdminBadge";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BUCKET = "website-media";

const FOLDERS = [
  { value: "general",       label: "General" },
  { value: "homepage",      label: "Homepage" },
  { value: "packages",      label: "Packages" },
  { value: "accommodation", label: "Accommodation" },
  { value: "islands",       label: "Islands" },
  { value: "about",         label: "About" },
] as const;

type Folder = (typeof FOLDERS)[number]["value"];

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MediaFile {
  id: string;           // storage path (folder/filename)
  name: string;         // bare filename
  folder: Folder;
  size: number;
  updatedAt: string;    // ISO string
  publicUrl: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Sanitise a filename: lowercase, strip unsafe characters, collapse spaces → hyphens */
function sanitiseFilename(original: string): string {
  const ext = original.slice(original.lastIndexOf(".")).toLowerCase();
  const base = original
    .slice(0, original.lastIndexOf("."))
    .toLowerCase()
    .replace(/[^a-z0-9_\-\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${base || "image"}${ext}`;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AdminMediaPage() {
  const supabase = createClient();

  // ------ state ------
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // search / filter / view
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState<"all" | Folder>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // upload
  const [uploadFolder, setUploadFolder] = useState<Folder>("general");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // delete
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ------ load files ------
  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    const allFiles: MediaFile[] = [];

    for (const folder of FOLDERS) {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(folder.value, { limit: 500, sortBy: { column: "updated_at", order: "desc" } });

      if (error) {
        // bucket may not exist yet; show a helpful message
        if (error.message.includes("Bucket not found") || error.message.includes("does not exist")) {
          setErrorMessage(
            'The "website-media" Storage bucket does not exist yet. Run the migration: supabase/migrations/20260907100000_create_website_media_bucket.sql in your Supabase project.'
          );
          setIsLoading(false);
          return;
        }
        // any other error: skip this folder silently
        continue;
      }

      for (const item of data ?? []) {
        if (!item.id || item.name === ".emptyFolderPlaceholder") continue;
        const path = `${folder.value}/${item.name}`;
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
        allFiles.push({
          id: path,
          name: item.name,
          folder: folder.value,
          size: item.metadata?.size ?? 0,
          updatedAt: item.updated_at ?? item.created_at ?? new Date().toISOString(),
          publicUrl: urlData.publicUrl,
        });
      }
    }

    setFiles(allFiles);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { void loadFiles(); }, [loadFiles]);

  // ------ filter ------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return files.filter((f) => {
      const matchFolder = folderFilter === "all" || f.folder === folderFilter;
      const matchSearch = !q || f.name.toLowerCase().includes(q) || f.folder.includes(q);
      return matchFolder && matchSearch;
    });
  }, [files, search, folderFilter]);

  // ------ upload ------
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
      return `${file.name}: unsupported type. Allowed: JPG, PNG, WEBP.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `${file.name}: exceeds 5 MB limit (${formatBytes(file.size)}).`;
    }
    return null;
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(event.target.files ?? []);
    const errors: string[] = [];
    const valid: File[] = [];
    for (const file of list) {
      const err = validateFile(file);
      if (err) errors.push(err);
      else valid.push(file);
    }
    setFileErrors(errors);
    setSelectedFiles((prev) => [...prev, ...valid]);
    // reset input so same files can be re-selected after removal
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);
    setErrorMessage("");

    const errors: string[] = [];
    let done = 0;

    for (const file of selectedFiles) {
      const safeName = sanitiseFilename(file.name);
      const path = `${uploadFolder}/${Date.now()}_${safeName}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false, cacheControl: "3600" });

      if (error) errors.push(`${file.name}: ${error.message}`);
      done++;
      setUploadProgress(Math.round((done / selectedFiles.length) * 100));
    }

    if (errors.length > 0) {
      setFileErrors(errors);
    } else {
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadModalOpen(false);
        setSelectedFiles([]);
        setFileErrors([]);
        setUploadSuccess(false);
      }, 1200);
    }

    setIsUploading(false);
    await loadFiles();
  };

  const openUploadModal = () => {
    setSelectedFiles([]);
    setFileErrors([]);
    setUploadSuccess(false);
    setUploadFolder("general");
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    if (isUploading) return;
    setUploadModalOpen(false);
    setSelectedFiles([]);
    setFileErrors([]);
    setUploadSuccess(false);
  };

  // ------ copy URL ------
  const copyUrl = async (file: MediaFile) => {
    await navigator.clipboard.writeText(file.publicUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ------ delete ------
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const { error } = await supabase.storage.from(BUCKET).remove([deleteTarget.id]);
    if (error) {
      setErrorMessage(`Delete failed: ${error.message}`);
    } else {
      setFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    }
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  // ------ stats ------
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      {/* ---- Header ---- */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Admin</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Media Library
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Upload, organise, and manage images for the website.
          </p>
        </div>
        <AdminButton onClick={openUploadModal} id="media-upload-btn">
          <Upload className="h-4 w-4" />
          Upload Images
        </AdminButton>
      </div>

      {/* ---- Stats bar ---- */}
      {!isLoading && !errorMessage && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total images", value: files.length },
            { label: "Total size",   value: formatBytes(totalSize) },
            { label: "Folders",      value: FOLDERS.length },
            { label: "Showing",      value: filtered.length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ---- Error banner ---- */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <span className="flex-1">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage("")}
            aria-label="Dismiss error"
            className="shrink-0 text-rose-400 hover:text-rose-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ---- Toolbar ---- */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search images</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="media-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or folder…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
        </label>

        <select
          id="media-folder-filter"
          value={folderFilter}
          onChange={(e) => setFolderFilter(e.target.value as "all" | Folder)}
          aria-label="Filter by folder"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-500"
        >
          <option value="all">All folders</option>
          {FOLDERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            id="media-view-grid"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={`rounded-md p-2 text-slate-500 transition ${viewMode === "grid" ? "bg-white shadow-sm text-slate-900" : "hover:text-slate-700"}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            id="media-view-list"
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={`rounded-md p-2 text-slate-500 transition ${viewMode === "list" ? "bg-white shadow-sm text-slate-900" : "hover:text-slate-700"}`}
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ---- Content ---- */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
          <span className="text-sm">Loading media library…</span>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasFiles={files.length > 0} onUpload={openUploadModal} />
      ) : viewMode === "grid" ? (
        <MediaGrid
          files={filtered}
          copiedId={copiedId}
          onCopy={copyUrl}
          onDelete={(f) => setDeleteTarget(f)}
        />
      ) : (
        <MediaList
          files={filtered}
          copiedId={copiedId}
          onCopy={copyUrl}
          onDelete={(f) => setDeleteTarget(f)}
        />
      )}

      {/* ---- Upload modal ---- */}
      {uploadModalOpen && (
        <UploadModal
          folders={FOLDERS}
          uploadFolder={uploadFolder}
          setUploadFolder={setUploadFolder}
          selectedFiles={selectedFiles}
          fileErrors={fileErrors}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          uploadSuccess={uploadSuccess}
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
          onRemoveFile={removeSelectedFile}
          onUpload={handleUpload}
          onClose={closeUploadModal}
        />
      )}

      {/* ---- Delete confirmation ---- */}
      {deleteTarget && (
        <DeleteDialog
          file={deleteTarget}
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EmptyState({
  hasFiles,
  onUpload,
}: {
  hasFiles: boolean;
  onUpload: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        {hasFiles ? <Search className="h-6 w-6" /> : <ImageOff className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {hasFiles ? "No images match your filters" : "No images uploaded yet"}
      </h3>
      <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">
        {hasFiles
          ? "Try adjusting your search query or folder filter."
          : "Upload your first image to start building the media library."}
      </p>
      {!hasFiles && (
        <button
          onClick={onUpload}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
        >
          <Upload className="h-4 w-4" />
          Upload Images
        </button>
      )}
    </div>
  );
}

// ---- Grid view ----
function MediaGrid({
  files,
  copiedId,
  onCopy,
  onDelete,
}: {
  files: MediaFile[];
  copiedId: string | null;
  onCopy: (f: MediaFile) => void;
  onDelete: (f: MediaFile) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {files.map((file) => (
        <div
          key={file.id}
          className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-slate-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={file.publicUrl}
              alt={file.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/50 opacity-0 transition group-hover:opacity-100">
              <button
                onClick={() => onCopy(file)}
                aria-label={`Copy URL for ${file.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow hover:bg-white"
              >
                {copiedId === file.id ? (
                  <Check className="h-4 w-4 text-teal-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => onDelete(file)}
                aria-label={`Delete ${file.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-rose-600 shadow hover:bg-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1.5 p-3">
            <p className="truncate text-xs font-semibold text-slate-800" title={file.name}>
              {file.name}
            </p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FolderOpen className="h-3 w-3" />
                {file.folder}
              </span>
              <span className="text-[11px] text-slate-400">{formatBytes(file.size)}</span>
            </div>
            <p className="text-[11px] text-slate-400">{formatDate(file.updatedAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- List view ----
function MediaList({
  files,
  copiedId,
  onCopy,
  onDelete,
}: {
  files: MediaFile[];
  copiedId: string | null;
  onCopy: (f: MediaFile) => void;
  onDelete: (f: MediaFile) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {["Preview", "Filename", "Folder", "Size", "Uploaded", "Actions"].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-slate-50">
                {/* Preview */}
                <td className="px-5 py-3">
                  <div className="h-11 w-16 overflow-hidden rounded-lg bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                {/* Filename */}
                <td className="max-w-[200px] px-5 py-3">
                  <p className="truncate text-sm font-medium text-slate-800" title={file.name}>
                    {file.name}
                  </p>
                </td>
                {/* Folder */}
                <td className="whitespace-nowrap px-5 py-3">
                  <AdminBadge tone="teal">{file.folder}</AdminBadge>
                </td>
                {/* Size */}
                <td className="whitespace-nowrap px-5 py-3 text-sm text-slate-600">
                  {formatBytes(file.size)}
                </td>
                {/* Date */}
                <td className="whitespace-nowrap px-5 py-3 text-sm text-slate-500">
                  {formatDate(file.updatedAt)}
                </td>
                {/* Actions */}
                <td className="whitespace-nowrap px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onCopy(file)}
                      aria-label={`Copy URL for ${file.name}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                    >
                      {copiedId === file.id ? (
                        <Check className="h-4 w-4 text-teal-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(file)}
                      aria-label={`Delete ${file.name}`}
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
    </div>
  );
}

// ---- Upload modal ----
function UploadModal({
  folders,
  uploadFolder,
  setUploadFolder,
  selectedFiles,
  fileErrors,
  isUploading,
  uploadProgress,
  uploadSuccess,
  fileInputRef,
  onFileSelect,
  onRemoveFile,
  onUpload,
  onClose,
}: {
  folders: typeof FOLDERS;
  uploadFolder: Folder;
  setUploadFolder: (f: Folder) => void;
  selectedFiles: File[];
  fileErrors: string[];
  isUploading: boolean;
  uploadProgress: number;
  uploadSuccess: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (i: number) => void;
  onUpload: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="upload-modal-title" className="font-bold text-slate-950">
              Upload Images
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              JPG · PNG · WEBP · Max 5 MB per file
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            aria-label="Close upload modal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Folder selector */}
          <div>
            <label
              htmlFor="upload-folder-select"
              className="block text-sm font-semibold text-slate-700"
            >
              Upload to folder
            </label>
            <select
              id="upload-folder-select"
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value as Folder)}
              disabled={isUploading}
              className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:opacity-50"
            >
              {folders.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Drop zone / file picker */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              id="media-file-input"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={onFileSelect}
              disabled={isUploading}
            />
            <label
              htmlFor="media-file-input"
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-teal-400 hover:bg-teal-50 ${isUploading ? "pointer-events-none opacity-50" : ""}`}
            >
              <Upload className="h-8 w-8 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">
                Click to select images
              </p>
              <p className="text-xs text-slate-400">or drag and drop (JPG, PNG, WEBP · max 5 MB)</p>
            </label>
          </div>

          {/* Validation errors */}
          {fileErrors.length > 0 && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
              <ul className="space-y-1">
                {fileErrors.map((e, i) => (
                  <li key={i} className="text-xs text-rose-700">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Selected file list with previews */}
          {selectedFiles.length > 0 && (
            <div className="max-h-52 space-y-2 overflow-y-auto">
              {selectedFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2"
                >
                  {/* Mini preview */}
                  <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-700">{file.name}</p>
                    <p className="text-[11px] text-slate-400">{formatBytes(file.size)}</p>
                  </div>
                  <button
                    onClick={() => onRemoveFile(i)}
                    disabled={isUploading}
                    aria-label={`Remove ${file.name}`}
                    className="shrink-0 rounded p-1 text-slate-400 hover:text-rose-600 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Progress bar */}
          {isUploading && (
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success banner */}
          {uploadSuccess && (
            <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700">
              <Check className="h-4 w-4" />
              All images uploaded successfully!
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="button"
              onClick={onUpload}
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload {selectedFiles.length > 0 ? `${selectedFiles.length} image${selectedFiles.length > 1 ? "s" : ""}` : ""}
                </>
              )}
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Delete confirmation dialog ----
function DeleteDialog({
  file,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  file: MediaFile;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <Trash2 className="h-6 w-6" />
          </div>
          <h2 id="delete-dialog-title" className="mt-4 text-lg font-bold text-slate-900">
            Delete image?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            This will permanently delete{" "}
            <span className="font-semibold text-slate-800">{file.name}</span> from the{" "}
            <span className="font-semibold text-slate-800">{file.folder}</span> folder. This
            action cannot be undone.
          </p>

          {/* Preview */}
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={file.publicUrl}
              alt={file.name}
              className="h-36 w-full object-cover"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <AdminButton
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </AdminButton>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}