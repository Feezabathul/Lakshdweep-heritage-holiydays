"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DEFAULT_FAQS, FAQItem, getFaqs } from "@/lib/content";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    void getFaqs(true).then((data) => {
      if (data && data.length > 0) setFaqs(data);
    });
  }, []);

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
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.id || i}
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
                    {faq.question}
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
                    {faq.answer}
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
