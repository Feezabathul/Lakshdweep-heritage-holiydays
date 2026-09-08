"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DEFAULT_FAQS, FAQItem, getFaqs } from "@/lib/content";

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    void getFaqs(true).then((data) => {
      if (data && data.length > 0) {
        setFaqs(data);
      }
    });
  }, []);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-100 px-4 py-1.5 rounded-full">
            FAQ
          </span>
          <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mt-5 mb-4">
            Plan Your Island Escape with Confidence
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.id || faq.question} className="bg-sky-50 rounded-2xl border border-sky-100">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-bold text-slate-900"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 shrink-0 text-teal-600" /> : <ChevronDown className="w-5 h-5 shrink-0 text-teal-600" />}
                </button>
                {isOpen && <p className="px-5 pb-5 text-sm sm:text-base leading-relaxed text-slate-600">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
