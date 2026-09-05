import { TESTIMONIALS_DATA } from "@/data/travelData";
import { Star, CheckCircle, Quote } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-400 bg-teal-950/80 border border-teal-800 px-4 py-1.5 rounded-full mb-4">
            REAL TRAVELER REVIEWS
          </span>
          <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Stories From Paradise
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal">
            Read what guests have to say about their Lakshadweep holidays with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white/5 border border-white/10 p-7 rounded-3xl backdrop-blur-md flex flex-col justify-between hover:border-teal-500/40 transition-colors group"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-teal-500/40 mb-3" />

                {/* Comment Text */}
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal italic mb-6">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              {/* Author & Verified Tag */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                    {t.name}
                  </h4>
                  <span className="text-xs text-slate-400">{t.location} • {t.date}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
