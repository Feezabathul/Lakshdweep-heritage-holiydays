import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-slate-950 text-white">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
        alt="Lakshadweep Tropical Sunset Beach"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark Ocean Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-teal-950/85 to-slate-950/90" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-300 bg-amber-950/80 border border-amber-700/60 px-4 py-1.5 rounded-full mb-6">
          BOOK YOUR 2026 TRIP TODAY
        </span>

        <h2 className="font-serif-custom text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-3xl leading-[1.12] mb-6">
          Your Island Escape <br />
          <span className="italic text-teal-300">Starts Here.</span>
        </h2>

        <p className="text-slate-200 text-base sm:text-xl max-w-2xl font-normal leading-relaxed mb-10">
          Let us help you turn your Lakshadweep dream into an unforgettable journey with end-to-end permit assistance and local expertise.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/#planner"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-9 py-4 rounded-full text-base shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform hover:-translate-y-0.5"
          >
            <PhoneCall className="w-5 h-5 text-amber-200" />
            <span>Plan Your Trip</span>
          </Link>
          <Link
            href="/#packages"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold px-9 py-4 rounded-full text-base transition-all hover:-translate-y-0.5"
          >
            <span>Explore Packages</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
