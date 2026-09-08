"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { DEFAULT_HOMEPAGE_CONTENT, getHomepageContent, HomepageContent } from "@/lib/content";

export default function Hero() {
  const [content, setContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);

  useEffect(() => {
    void getHomepageContent().then((data) => setContent(data));
  }, []);

  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-between pt-24 sm:pt-28 pb-12 overflow-hidden bg-sky-950">
      {/* Background Image with Layered Ocean Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80"
          alt="Lakshadweep beach aerial view"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-10000 ease-out brightness-105 contrast-110 saturate-110"
          sizes="100vw"
        />
        {/* Layered ocean gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-sky-900/20 to-sky-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 via-cyan-900/15 to-white/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-200/10 via-transparent to-sky-950/30" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 sm:pt-16 pb-16 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-100 text-xs sm:text-sm font-semibold tracking-wide mb-3 shadow-lg">
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Lakshadweep Heritage Holidays</span>
        </div>

        <p className="text-sm sm:text-base font-semibold uppercase tracking-[0.28em] text-cyan-100/95 mb-6">
          Your Travel Partner
        </p>

        {/* Main Heading */}
        <h1 className="font-serif-custom text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.12] mb-6 drop-shadow-md">
          {content.heroHeading}
        </h1>

        {/* Supporting Text */}
        <p className="text-sky-50 text-base sm:text-xl max-w-2xl font-normal leading-relaxed mb-8 drop-shadow">
          {content.heroDescription}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
          <Link
            href="/#packages"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white font-bold px-8 py-4 rounded-full text-base shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{content.ctaText || "Explore Packages"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:-translate-y-0.5"
          >
            <span>Plan Your Trip</span>
          </Link>
        </div>

        {/* Permit Guarantee Note */}
        <div className="inline-flex items-center gap-2 text-sky-100 text-xs sm:text-sm font-medium bg-sky-950/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
          <ShieldCheck className="w-4 h-4 text-cyan-300" />
          <span>100% Official Entry Permit Support & Local Assistance</span>
        </div>

      </div>
    </section>
  );
}
