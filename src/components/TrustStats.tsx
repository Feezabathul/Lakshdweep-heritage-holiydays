import { TRUST_STATS } from "@/data/travelData";
import { Award, Users, FileCheck, MapPin } from "lucide-react";

const STAT_ICONS = [Award, Users, FileCheck, MapPin];

export default function TrustStats() {
  return (
    <section className="pt-20 sm:pt-24 pb-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-slate-200/80">
          {TRUST_STATS.map((stat, index) => {
            const IconComponent = STAT_ICONS[index] || Award;
            return (
              <div
                key={stat.label}
                className={`flex items-center gap-4 ${
                  index > 0 ? "pt-6 sm:pt-0 lg:pl-8" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100 shadow-sm">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-slate-700">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {stat.sublabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
