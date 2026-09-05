"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "How do I get an entry permit to visit Lakshadweep?",
    a: "An entry permit issued by the Lakshadweep Administration is mandatory for all Indian tourists. Lakshadweep Heritage Holidays handles 100% of your permit process! You only need to submit your valid ID proof (Aadhaar/Passport) and Passport Size Photo. We process all government paperwork seamlessly.",
  },
  {
    q: "What is the best time to visit Lakshadweep?",
    a: "The ideal time is from September to May. During these months, the sea is calm, lagoons are turquoise blue with high underwater visibility, and temperature ranges comfortably between 22°C to 32°C. June to September is the monsoon season with Rough Sea and rainfall.",
  },
  {
    q: "What is included in your travel packages?",
    a: "Our all-inclusive packages cover: Lakshadweep Entry Permit approval & documentation · Airport pickup & inter-island high-speed boat transfers · AC Standard Beach Front Rooms / Beach resorts / cottages accommodation · Breakfast, Lunch & Dinner (Fresh sea food & vegetarian options) · Complimentary snorkelling, Glass bottomed boat ride & kayaking sessions · 24/7 Local island guide support.",
  },
  {
    q: "Are water sports suitable for non-swimmers?",
    a: "Yes! Activities like Glass-bottomed boat ride, kayaking, shallow lagoon snorkelling, and Discovery Scuba Diving are 100% safe for non-swimmers. Certified life jackets are mandatory and certified PADI divemasters accompany you individually in shallow waters.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eef9f8" }}>
      <Header />

      <main className="flex-grow pt-28 pb-20 px-4">
        {/* ── Header ── */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-5 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border"
            style={{ color: "#1a9e96", borderColor: "#1a9e96", background: "transparent" }}
          >
            FAQ
          </span>

          <h1
            className="font-serif-custom text-3xl sm:text-5xl font-extrabold uppercase tracking-tight mb-4"
            style={{ color: "#0d3d4a" }}
          >
            Frequently Asking Questions
          </h1>

          <p className="text-base sm:text-lg" style={{ color: "#5a7a82" }}>
            Plan Your Island Escape with Confidence
          </p>
        </div>

        {/* ── Accordion ── */}
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm transition-all duration-300"
                style={{
                  border: isOpen ? "2px solid #1a9e96" : "2px solid #e5f0ef",
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none"
                >
                  <span
                    className="font-bold text-base sm:text-lg leading-snug"
                    style={{ color: "#0d3d4a" }}
                  >
                    {faq.q}
                  </span>

                  {isOpen ? (
                    <ChevronUp
                      className="shrink-0 w-5 h-5"
                      style={{ color: "#1a9e96" }}
                    />
                  ) : (
                    <ChevronDown
                      className="shrink-0 w-5 h-5"
                      style={{ color: "#1a9e96" }}
                    />
                  )}
                </button>

                {isOpen && (
                  <div
                    className="px-6 pb-6 text-sm sm:text-base leading-relaxed"
                    style={{ color: "#4a6b74" }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
