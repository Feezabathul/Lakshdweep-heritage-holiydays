import type { ReactNode } from "react";

type AdminBadgeProps = {
  children: ReactNode;
  tone?: "teal" | "amber" | "slate" | "rose";
};

export default function AdminBadge({ children, tone = "slate" }: AdminBadgeProps) {
  const tones = {
    teal: "bg-teal-50 text-teal-700 ring-teal-600/10",
    amber: "bg-amber-50 text-amber-700 ring-amber-600/10",
    slate: "bg-slate-100 text-slate-600 ring-slate-500/10",
    rose: "bg-rose-50 text-rose-700 ring-rose-600/10",
  };

  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}