"use client";

import { useEffect, useState } from "react";
import { EXPERIENCES_DATA } from "@/data/travelData";
import { getExperienceImages, ExperienceImages } from "@/lib/content";
import ExperienceCard from "./ExperienceCard";

export default function ExperiencesSection({
  className = "",
}: {
  className?: string;
} = {}) {
  const [experienceImages, setExperienceImages] = useState<ExperienceImages>({});

  useEffect(() => {
    void getExperienceImages().then((images) => {
      if (images && Object.keys(images).length > 0) {
        setExperienceImages(images);
      }
    });
  }, []);

  return (
    <section id="experiences" className={`py-8 sm:py-12 lg:py-14 relative overflow-hidden ${className || "bg-slate-50"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-100/70 px-3.5 py-1 rounded-full mb-2">
            TURQUOISE WATER ADVENTURES
          </span>
          <h2 className="font-serif-custom text-2xl sm:text-4xl font-bold text-blue-600 tracking-tight mb-2">
            Unforgettable Lakshadweep Experiences
          </h2>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 sm:gap-6">
          {EXPERIENCES_DATA.map((exp) => {
            // Use admin-uploaded image override if available, otherwise fall back to static default
            const resolvedImage = experienceImages[exp.id] ?? exp.image;
            return (
              <ExperienceCard
                key={exp.id}
                experience={{ ...exp, image: resolvedImage }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}


