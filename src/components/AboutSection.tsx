import Image from "next/image";
import { CheckCircle2, Shield, Anchor } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Large Image with Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=85"
                alt="Aerial view of Lakshadweep island with turquoise lagoon and white sand beach"
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
            </div>

            {/* Overlapping Trust Pill */}
            <div className="absolute -bottom-6 -right-2 sm:bottom-8 sm:-right-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-xs animate-float">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Anchor className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 block">Native Guides</span>
                <span className="text-xs text-slate-500 font-medium">Verified local staff on every island</span>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-100 px-4 py-1.5 rounded-full w-fit">
              ABOUT LAKSHADWEEP HERITAGE
            </span>

            <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15]">
              Your Trusted Partner for Lakshadweep
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              With over a decade of dedicated service, Lakshadweep Heritage Holidays specializes in crafting effortless, unforgettable island vacations. We take care of every detail—from entry permits and inter-island boat transfers to beachfront resort stays and aquatic excursions.
            </p>

            {/* Core Values Bullet List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
              {[
                "Local travel knowledge",
                "Carefully planned holidays",
                "Complete permit assistance",
                "Resort & boat transfers",
                "Personalized 24/7 support",
                "Transparent fair pricing",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

          </div>

        </div>
      </div>
    </section>
  );
}
