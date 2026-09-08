"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

type AdminModalProps = { open: boolean; title: string; onClose: () => void; children: ReactNode };

export default function AdminModal({ open, title, onClose, children }: AdminModalProps) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" className="w-full max-w-lg rounded-xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-6 py-4"><h2 id="admin-modal-title" className="font-bold text-slate-950">{title}</h2><button aria-label="Close dialog" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button></div><div className="p-6">{children}</div></div></div>;
}