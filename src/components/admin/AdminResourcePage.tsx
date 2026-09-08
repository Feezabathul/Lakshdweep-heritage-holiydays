import { Plus } from "lucide-react";
import AdminButton from "./AdminButton";
import AdminTable, { type AdminTableColumn } from "./AdminTable";

type AdminResourcePageProps<T extends Record<string, unknown>> = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  columns: AdminTableColumn<T>[];
};

export default function AdminResourcePage<T extends Record<string, unknown>>({ eyebrow, title, description, actionLabel, columns }: AdminResourcePageProps<T>) {
  return <div className="mx-auto max-w-[1400px] space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h2><p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p></div><AdminButton disabled><Plus className="h-4 w-4" />{actionLabel}</AdminButton></div><AdminTable columns={columns} /> </div>;
}