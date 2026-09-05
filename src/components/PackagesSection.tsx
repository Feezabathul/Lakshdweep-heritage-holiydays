import { PACKAGES_DATA } from "@/data/travelData";
import PackageCard from "./PackageCard";

export default function PackagesSection() {
  return (
    <section id="packages" className="py-20 sm:py-28 bg-sky-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-4 py-1.5 rounded-full mb-4 border border-sky-200">
            CURATED TRAVEL PACKAGES
          </span>
          <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Discover Our Travel Packages
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl font-normal">
            Thoughtfully designed holidays for couples, families and adventure seekers.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {PACKAGES_DATA.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
