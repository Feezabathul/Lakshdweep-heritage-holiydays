import { EXPERIENCES_DATA } from "@/data/travelData";
import ExperienceCard from "./ExperienceCard";

export default function ExperiencesSection() {
  return (
    <section id="experiences" className="py-8 sm:py-12 lg:py-14 bg-slate-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-100/70 px-3.5 py-1 rounded-full mb-2">
            TURQUOISE WATER ADVENTURES
          </span>
          <h2 className="font-serif-custom text-2xl sm:text-4xl font-bold text-blue-600 tracking-tight mb-2">
            Unforgettable Lakshadweep Experiences
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-normal">
            Immerse yourself in world-class watersports, pristine coral reefs, and tranquil island lifestyle activities.
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {EXPERIENCES_DATA.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}
