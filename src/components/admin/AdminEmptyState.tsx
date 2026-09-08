import { FileText } from "lucide-react";
import type { ReactNode } from "react";

type AdminEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export default function AdminEmptyState({ title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center border-t border-slate-200 px-6 py-12 text-center">
      <div className="rounded-full bg-slate-100 p-3 text-slate-500"><FileText className="h-6 w-6" /></div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}