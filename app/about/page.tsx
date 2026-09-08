"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  Shield,
  Star,
  Heart,
  Users,
  Anchor,
  MapPin,
  Compass,
  MessageCircle,
  Waves,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import {
  AboutContent,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_FAQS,
  FAQItem,
  getAboutContent,
  getFaqs,
} from "@/lib/content";

const CORE_VALUES = [
  {
    icon: <Shield className="w-6 h-6 text-teal-600" />,
    title: "100% Permit Success",
    desc: "Every entry permit application handled directly with Lakshadweep Administration—no rejections.",
  },
  {
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    title: "Authentic Native Hospitality",
    desc: "Founded and run by local islanders born and raised in Agatti, Kavaratti, and Kalpeni.",
  },
  {
    icon: <Compass className="w-6 h-6 text-cyan-600" />,
    title: "End-to-End Trip Management",
    desc: "From Kochi flight to your island beach resort—every detail coordinated by our team.",
  },
  {
    icon: <Waves className="w-6 h-6 text-blue-500" />,
    title: "Curated Water Adventures",
    desc: "Kayaking, scuba diving, snorkeling, and island hopping—all arranged with certified guides.",
  },
  {
    icon: <Users className="w-6 h-6 text-amber-500" />,
    title: "24/7 On-Island Concierge",
    desc: "Our local island coordinators are on standby throughout your stay for any instant help.",
  },
  {
    icon: <Star className="w-6 h-6 text-yellow-500" />,
    title: "Transparent Pricing",
    desc: "All-inclusive pricing with zero surprise fees, hidden taxes, or last-minute add-ons.",
  },
];

const TIMELINE = [
  {
    year: "2013",
    title: "Founded in Agatti",
    desc: "Started as a local hospitality initiative by native islanders to bring responsible tourism to Lakshadweep.",
  },
  {
    year: "2016",
    title: "Official Registration",
    desc: "Registered as a premier island travel agency under the Ministry of Tourism, Government of India.",
  },
  {
    year: "2019",
    title: "1,000 Happy Travelers",
    desc: "Celebrated our 1,000th successfully guided traveler group to Agatti and Kavaratti Islands.",
  },
  {
    year: "2023",
    title: "Multi-Island Operations",
    desc: "Expanded operations to all 4 major tourist islands: Agatti, Bangaram, Kalpeni, and Kavaratti.",
  },
  {
    year: "2026",
    title: "Digital Permit Platform",
    desc: "Launched online permit tracking and real-time tour coordination for all booked travelers.",
  },
];

const TEAM = [
  {
    name: "Mohammed Rashid",
    role: "Founder & CEO",
    island: "Native of Agatti Island",
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Fatima Zara",
    role: "Head of Permit & Compliance",
    island: "Native of Kavaratti Island",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ibrahim Arif",
    role: "Chief Island Guide",
    island: "Native of Kalpeni Island",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
];

export default function AboutPage() {
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    void getAboutContent().then(setAbout);
    void getFaqs(true).then((data) => {
      if (data && data.length > 0) setFaqs(data);
    });
  }, []);

  const whatsappMessage = encodeURIComponent(
    "Hello! I'd like to speak to an Island Expert about planning my Lakshadweep trip."
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow pt-20">
        {/* ============================================================
            SECTION 1 — HERO STORY SECTION
        ============================================================ */}
        <section id="our-story" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* LEFT: Photo of Lakshadweep Island */}
              <div className="relative">
                <div className="relative h-[420px] sm:h-[540px] w-full rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={about.image || DEFAULT_ABOUT_CONTENT.image}
                    alt="Lakshadweep island view"
                    fill
                    priority
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                </div>

                <div className="absolute -bottom-5 right-4 sm:-bottom-6 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-[220px]">
                  <div className="w-11 h-11 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                    <Anchor className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-slate-900 block leading-tight">Native Guides</span>
                    <span className="text-xs text-slate-500 font-medium">Local staff on every island</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Story Content */}
              <div className="flex flex-col gap-6">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full w-fit">
                  OUR STORY &amp; COMMITMENT
                </span>

                <h1 className="font-serif-custom text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.12]">
                  {about.heading}
                </h1>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                  {about.description}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-slate-100">
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">100%</div>
                    <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Permit Success Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">12<span className="text-2xl font-bold text-teal-600">+</span></div>
                    <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Islands &amp; Atolls Covered</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">24/7</div>
                    <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">On-Ground Support</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={`https://wa.me/919995554321?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-teal-800 hover:bg-teal-700 text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-teal-200" />
                    <span>Talk to an Island Expert</span>
                  </a>
                  <Link
                    href="/packages"
                    className="inline-flex items-center gap-2 text-teal-700 font-semibold text-sm hover:text-teal-900 transition-colors"
                  >
                    <span>View Packages</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 2 — CORE VALUES
        ============================================================ */}
        <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full inline-block mb-4">
                THE HERITAGE ADVANTAGE
              </span>
              <h2 className="font-serif-custom text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Why Thousands Choose Us
              </h2>
              <p className="text-slate-500 text-base mt-3">
                A decade of native island knowledge — brought to every traveler through meticulous care and local expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {CORE_VALUES.map((val, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-4 hover:border-teal-300 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {val.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{val.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 3 — OUR JOURNEY TIMELINE
        ============================================================ */}
        <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full inline-block mb-4">
                OUR JOURNEY
              </span>
              <h2 className="font-serif-custom text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                A Decade of Island Heritage
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-slate-200 sm:-translate-x-0.5" />

              <div className="flex flex-col gap-10">
                {TIMELINE.map((item, i) => (
                  <div
                    key={i}
                    className={`relative flex items-start gap-6 sm:gap-10 ${
                      i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-4.5 sm:left-1/2 sm:-translate-x-2.5 w-5 h-5 rounded-full bg-teal-600 border-4 border-white shadow-md z-10 mt-1" />

                    <div className={`hidden sm:flex sm:w-1/2 ${i % 2 === 0 ? "justify-end pr-10" : "justify-start pl-10"}`}>
                      <span className="bg-teal-50 border border-teal-200 text-teal-800 text-sm font-extrabold px-4 py-1.5 rounded-full">
                        {item.year}
                      </span>
                    </div>

                    <div className={`ml-14 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? "sm:pl-10" : "sm:pr-10"}`}>
                      <span className="sm:hidden bg-teal-50 border border-teal-200 text-teal-800 text-xs font-extrabold px-3 py-1 rounded-full mb-2 inline-block">
                        {item.year}
                      </span>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-teal-300 hover:shadow-md transition-all">
                        <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 4 — MEET THE TEAM
        ============================================================ */}
        <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full inline-block mb-4">
                OUR TEAM
              </span>
              <h2 className="font-serif-custom text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Native Islanders Behind Every Trip
              </h2>
              <p className="text-slate-500 text-base mt-3">
                Our team is born and raised on these islands — bringing you insider knowledge no outsider agency can offer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {TEAM.map((member, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-teal-200 transition-all duration-300 group"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col gap-1">
                    <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
                    <p className="text-teal-700 font-semibold text-sm">{member.role}</p>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-500" />
                      <span>{member.island}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 5 — FAQ ACCORDION
        ============================================================ */}
        <section className="py-16 sm:py-24 border-t border-slate-100" style={{ background: "#eef9f8" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span
                className="inline-block px-5 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border"
                style={{ color: "#1a9e96", borderColor: "#1a9e96" }}
              >
                FAQ
              </span>
              <h2
                className="font-serif-custom text-3xl sm:text-5xl font-extrabold uppercase tracking-tight mb-4"
                style={{ color: "#0d3d4a" }}
              >
                Frequently Asking Questions
              </h2>
              <p className="text-base sm:text-lg" style={{ color: "#5a7a82" }}>
                Plan Your Island Escape with Confidence
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={faq.id || i}
                    className="bg-white rounded-2xl shadow-sm transition-all duration-300"
                    style={{ border: isOpen ? "2px solid #1a9e96" : "2px solid #e5f0ef" }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none"
                    >
                      <span className="font-bold text-base sm:text-lg leading-snug" style={{ color: "#0d3d4a" }}>
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="shrink-0 w-5 h-5" style={{ color: "#1a9e96" }} />
                      ) : (
                        <ChevronDown className="shrink-0 w-5 h-5" style={{ color: "#1a9e96" }} />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm sm:text-base leading-relaxed" style={{ color: "#4a6b74" }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 6 — FINAL CTA
        ============================================================ */}
        <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-6 items-center">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
              READY TO EXPLORE?
            </span>
            <h2 className="font-serif-custom text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Let Us Plan Your Perfect Lakshadweep Holiday
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl">
              From permits to paradise — connect with our native island experts today and begin your unforgettable Lakshadweep journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a
                href={`https://wa.me/919995554321?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-teal-800 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-full text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white text-teal-200" />
                Talk to an Island Expert
              </a>
              <Link
                href="/packages"
                className="inline-flex items-center gap-3 border-2 border-teal-800 text-teal-800 hover:bg-teal-800 hover:text-white font-bold px-8 py-4 rounded-full text-sm transition-all"
              >
                <Award className="w-5 h-5" />
                View All Packages
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
