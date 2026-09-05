import Image from "next/image";
import Link from "next/link";
import { Experience } from "@/data/travelData";

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Link
      href={`/experiences/${experience.slug}`}
      className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden border border-slate-200/60 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end block"
    >
      <Image
        src={experience.image}
        alt={experience.title}
        fill
        className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/60 transition-colors duration-500" />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col gap-1 text-white">
        <span className="text-[10px] font-bold tracking-widest text-cyan-300 uppercase bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full w-fit mb-1 border border-white/20">
          EXPLORE EXPERIENCE →
        </span>
        <h3 className="font-serif-custom text-xl sm:text-2xl font-bold tracking-tight group-hover:text-amber-300 transition-colors">
          {experience.title}
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm font-normal">
          {experience.subtitle}
        </p>
      </div>
    </Link>
  );
}
