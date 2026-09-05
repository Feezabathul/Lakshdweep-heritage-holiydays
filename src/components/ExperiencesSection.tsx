import { EXPERIENCES_DATA } from "@/data/travelData";
import ExperienceCard from "./ExperienceCard";

export default function ExperiencesSection() {
  return (
    <section id="experiences" className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-700 bg-teal-100/70 px-4 py-1.5 rounded-full mb-4">
            TURQUOISE WATER ADVENTURES
          </span>
          <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-blue-600 tracking-tight mb-4">
            Unforgettable Lakshadweep Experiences
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl font-normal">
            Immerse yourself in world-class watersports, pristine coral reefs, and tranquil island lifestyle activities.
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {EXPERIENCES_DATA.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}
