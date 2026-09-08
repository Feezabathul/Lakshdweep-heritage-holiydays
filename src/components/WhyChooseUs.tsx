"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { DEFAULT_HOMEPAGE_CONTENT, getHomepageContent } from "@/lib/content";

export default function WhyChooseUs() {
  const [whyChooseUsText, setWhyChooseUsText] = useState(DEFAULT_HOMEPAGE_CONTENT.whyChooseUs);

  useEffect(() => {
    void getHomepageContent().then((data) => {
      if (data.whyChooseUs) setWhyChooseUsText(data.whyChooseUs);
    });
  }, []);

  return (
    <section id="why-choose-us" className="relative overflow-hidden bg-white py-10 sm:py-14 lg:min-h-[calc(100vh-80px)] lg:py-8">
      <div className="absolute inset-x-0 top-0 h-2 bg-sky-100/70" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div>
          <span className="inline-flex rounded-full bg-cyan-100 px-5 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-600">
            The Heritage Advantage
          </span>
          <h2 className="mt-4 max-w-3xl font-serif-custom text-3xl font-bold leading-[1.08] tracking-tight text-cyan-950 sm:text-4xl lg:text-5xl">
            Why Travel With Lakshadweep Heritage Holidays?
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {whyChooseUsText}
          </p>
          <div className="mt-6 grid grid-cols-[56px_1fr] gap-4">
            <div className="h-14 w-14 rounded-2xl bg-cyan-100" />
            <div>
              <h3 className="text-lg font-extrabold leading-relaxed text-cyan-950 sm:text-xl">
                Native Lakshadweep Expertise, Born and rooted in the islands.
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Our local team offers authentic insights, hidden lagoon spots, and native premium hospitality. 100% Customizable Packages. Whether you want relaxed beach hammock time or high-adrenaline scuba diving, we tailor every detail to your pace. Stay, Food, Transport, Water activities, Island hoping &amp; Permit Assistance We process your mandatory Lakshadweep Entry Permits, book high-speed inter-island ferries, and arrange delicious meals. 24/7 On-Island Concierge Support Enjoy peace of mind with our local island co-ordinators on standby throughout your stay for any instant help. Transparent &amp; Honest Pricing All quotes are all-inclusive with zero surprise fees, mandatory government charges, or hidden taxes.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-7">
          <div className="relative overflow-hidden rounded-[28px] bg-cyan-800 p-6 text-white shadow-xl shadow-cyan-900/15 sm:p-8">
            <div className="absolute -right-8 -top-14 h-56 w-56 rounded-full bg-cyan-600/45" />
            <div className="relative">
              <h3 className="font-serif-custom text-2xl font-bold sm:text-3xl">100% Verified Entry Permits</h3>
              <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-cyan-50 sm:text-base">
                We submit all Administration approvals directly to Lakshadweep authorities.
              </p>
              <div className="mt-5 inline-block rounded-2xl bg-cyan-600/70 px-6 py-4">
                <strong className="block text-3xl font-extrabold text-amber-100">500+</strong>
                <span className="mt-1 block text-xs font-semibold text-cyan-50 sm:text-sm">Happy Travelers Guided</span>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[28px] border border-amber-200 bg-amber-50 p-6 shadow-xl shadow-cyan-900/10 sm:p-8">
            <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-cyan-100" />
            <div className="relative">
              <div className="flex gap-2 text-amber-400" aria-label="Five star rating">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} className="h-6 w-6 fill-current" />)}
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-cyan-950 sm:text-2xl">4.5/5 Rating</h3>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">Rated #6 Local Travel Agency in Lakshadweep.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
