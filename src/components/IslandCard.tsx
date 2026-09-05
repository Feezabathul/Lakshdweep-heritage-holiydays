import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Island } from "@/data/travelData";

interface IslandCardProps {
  island: Island;
}

export default function IslandCard({ island }: IslandCardProps) {
  return (
    <div className="group relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-end border border-slate-200/50">
      {/* Background Image */}
      <Image
        src={island.image}
        alt={island.name}
        fill
        className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/60 transition-colors duration-500" />

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-7 flex flex-col gap-3 text-white">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-400/30 text-teal-300 text-xs font-semibold w-fit">
          <Sparkles className="w-3 h-3 text-orange-400" />
          <span>{island.tagline}</span>
        </div>

        {/* Island Name */}
        <h3 className="font-serif-custom text-2xl sm:text-3xl font-bold tracking-tight group-hover:text-amber-200 transition-colors">
          {island.name}
        </h3>

        {/* Short Description */}
        <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 font-normal leading-relaxed">
          {island.description}
        </p>

        {/* Explore Link */}
        <div className="pt-2 flex items-center justify-between border-t border-white/10">
          <Link
            href={`/islands#${island.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300 group-hover:text-white transition-colors"
          >
            <span>Explore Island</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
