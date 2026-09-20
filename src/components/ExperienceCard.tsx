import Image from "next/image";
import { Experience } from "@/data/travelData";

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div
      className="group relative h-44 sm:h-48 rounded-2xl overflow-hidden border border-slate-200/60 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end"
    >
      <Image
        src={experience.image}
        alt={experience.title}
        fill
        priority
        className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      
      {/* Overlay — only a soft bottom fade so text is readable but image stays clear */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-colors duration-500" />

      {/* Title only */}
      <div className="relative z-10 p-3 sm:p-3.5 text-white">
        <h3 className="font-serif-custom text-sm sm:text-base font-bold tracking-tight group-hover:text-amber-300 transition-colors leading-snug">
          {experience.title}
        </h3>
      </div>
    </div>
  );
}
