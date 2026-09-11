import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Accommodation } from "@/data/accommodationData";

type DbRow = {
  id: string;
  accommodation_type?: string | null;
  heading?: string | null;
  image_url?: string | null;
  description_points?: string[] | null;
};

async function getAccommodations(): Promise<Accommodation[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("accommodations")
      .select("id, accommodation_type, heading, image_url, description_points")
      .order("created_at", { ascending: true });

    if (!error && data) {
      return (data as DbRow[]).map((item) => ({
        id: item.id,
        accommodation_type: (item.accommodation_type || "Homestay") as Accommodation["accommodation_type"],
        heading: item.heading || "Accommodation",
        image_url: item.image_url || "/images/homestay.jpg",
        description_points: Array.isArray(item.description_points) ? item.description_points : [],
      }));
    }
  } catch {
    // Keep public page resilient — return empty on any error
  }

  return [];
}

export default async function AccommodationSection() {
  const accommodations = await getAccommodations();

  return (
    <section id="accommodation" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-4 py-1.5 rounded-full mb-4 border border-sky-200">
            ACCOMMODATION
          </span>
          <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Island Stays & Resorts
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl font-normal">
            Discover comfortable beachfront homestays, premium resorts, and standard rooms across the beautiful islands of Lakshadweep.
          </p>
        </div>

        {/* Accommodation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {accommodations.map((item) => (
            <div
              key={item.id}
              className="flex flex-col h-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-sky-100 group"
            >
              {/* 1. Image */}
              <div className="relative h-56 w-full overflow-hidden bg-sky-50">
                <img
                  src={item.image_url || "/images/homestay.jpg"}
                  alt={item.heading}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                {/* 2. Accommodation Type */}
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full w-fit mb-3 border border-sky-100">
                  {item.accommodation_type}
                </span>

                {/* 3. Heading */}
                <h3 className="text-2xl font-serif-custom font-bold text-slate-900 mb-4">
                  {item.heading}
                </h3>

                {/* 4. Description bullet points */}
                {item.description_points && item.description_points.length > 0 ? (
                  <ul className="space-y-2 text-slate-600 text-sm leading-relaxed list-disc pl-5 mt-auto pt-4 border-t border-slate-100">
                    {item.description_points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 text-xs italic mt-auto pt-4 border-t border-slate-100">
                    No description points provided.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
