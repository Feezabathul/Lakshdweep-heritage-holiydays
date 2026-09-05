import { ISLANDS_DATA } from "@/data/travelData";
import IslandCard from "./IslandCard";

export default function IslandsSection() {
  return (
    <section id="islands" className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100/70 px-4 py-1.5 rounded-full mb-4">
            Island Adventures
          </span>
          <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-sky-800 tracking-tight mb-4">
            Unforgettable Lakshadweep Experiences
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl font-normal">
            Immerse yourself in world-class watersports, pristine coral reefs, and tranquil island lifestyle activities.
          </p>
        </div>

        {/* Islands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {ISLANDS_DATA.map((island) => (
            <IslandCard key={island.id} island={island} />
          ))}
        </div>
      </div>
    </section>
  );
}
