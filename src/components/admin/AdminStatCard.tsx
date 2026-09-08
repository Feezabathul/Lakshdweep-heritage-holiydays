import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
};

export default function AdminStatCard({ label, value, detail, icon: Icon, accent }: AdminStatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${accent}`}><Icon className="h-5 w-5" /></div>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500">{detail}</p>
    </div>
  );
}