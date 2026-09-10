"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { Package } from "@/data/travelData";

interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inclusions = pkg.inclusions || [];
  const exclusions = pkg.exclusions || [];

  return (
    <>
    <div
      className={`group relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
        pkg.isPopular
          ? "border-sky-400 ring-2 ring-sky-300/40 shadow-xl shadow-sky-500/10 scale-[1.02] lg:scale-[1.03] z-10"
          : "border-sky-100 shadow-md hover:shadow-xl hover:border-sky-200"
      }`}
    >
      {/* Popular Badge */}
      {pkg.isPopular && (
        <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Most Popular</span>
        </div>
      )}

      {/* Top Image */}
      <div>
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={pkg.image_url}
            alt={pkg.name}
            fill
            loading="eager"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Duration */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>{pkg.duration}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif-custom text-xl font-bold text-sky-800 group-hover:text-sky-600 transition-colors mb-2">
            {pkg.name}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
            {pkg.description}
          </p>

        </div>
      </div>

      {/* Card Footer Price & CTA */}
      <div className="p-6 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">Starting from</span>
          <span className="text-xl font-extrabold text-sky-800">₹{pkg.price.toLocaleString("en-IN")}</span>
          <span className="text-[10px] text-slate-400"> / person</span>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          suppressHydrationWarning
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            "bg-sky-700 hover:bg-sky-800 text-white shadow-md"
          }`}
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-3 sm:p-6 backdrop-blur-[2px]">
        <div className="w-full max-w-[820px] rounded-[22px] bg-white p-5 sm:p-7 shadow-2xl border border-slate-200">
          <div className="mb-4 flex items-center justify-between gap-3 text-sky-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">≣</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Package Details
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close package details"
              suppressHydrationWarning
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              ×
            </button>
          </div>

          <p className="text-base sm:text-lg text-slate-700 mb-6">
            Review the package inclusions and exclusions before booking.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-sky-700 mb-3">Inclusions</h4>
              {inclusions.length > 0 ? (
                <ul className="space-y-2 text-slate-700 text-base sm:text-lg leading-relaxed list-disc pl-5">
                  {inclusions.map((item, idx) => (
                    <li key={`${item}-${idx}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-sm italic">No inclusions specified.</p>
              )}
            </div>

            <div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-sky-700 mb-3">Exclusions</h4>
              {exclusions.length > 0 ? (
                <ul className="space-y-2 text-slate-700 text-base sm:text-lg leading-relaxed list-disc pl-5">
                  {exclusions.map((item, idx) => (
                    <li key={`${item}-${idx}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-sm italic">No exclusions specified.</p>
              )}
            </div>
          </div>

          <div className="mt-7 border-t border-slate-200 pt-5 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              suppressHydrationWarning
              className="w-full sm:w-auto rounded-full bg-orange-400 px-5 py-3 text-base sm:text-lg font-bold text-white shadow-md hover:bg-orange-500 transition-colors"
            >
              Close
            </button>
            <Link
              href="/contact"
              className="w-full sm:w-auto rounded-full bg-sky-700 px-5 py-3 text-center text-base sm:text-lg font-bold text-white shadow-md hover:bg-sky-800 transition-colors"
            >
              Book This Package
            </Link>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
