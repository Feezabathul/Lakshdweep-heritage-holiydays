import type { ReactNode } from "react";
import AdminEmptyState from "./AdminEmptyState";

export type AdminTableColumn<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

type AdminTableProps<T extends Record<string, unknown>> = {
  columns: AdminTableColumn<T>[];
  rows?: T[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function AdminTable<T extends Record<string, unknown>>({ columns, rows = [], emptyTitle = "Nothing here yet", emptyDescription = "Records added through Supabase will appear here." }: AdminTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50"><tr>{columns.map((column) => <th key={String(column.key)} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{column.label}</th>)}</tr></thead>
          {rows.length > 0 && <tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={index} className="hover:bg-slate-50">{columns.map((column) => <td key={String(column.key)} className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">{column.render ? column.render(row[column.key], row) : String(row[column.key] ?? "-")}</td>)}</tr>)}</tbody>}
        </table>
      </div>
      {rows.length === 0 && <AdminEmptyState title={emptyTitle} description={emptyDescription} />}
    </div>
  );
}