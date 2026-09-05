"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    question: "How do I get an entry permit to visit Lakshadweep?",
    answer: "An entry permit issued by the Lakshadweep Administration is mandatory for all Indian tourists. Lakshadweep Heritage Holidays handles the permit process and documentation for you.",
  },
  {
    question: "What is the best time to visit Lakshadweep?",
    answer: "The ideal time is from September to May, when the sea is calm, the lagoons are clear, and the weather is comfortable for island activities.",
  },
  {
    question: "What is included in your travel packages?",
    answer: "Packages can include entry permits, airport pickup, inter-island transfers, accommodation, meals, water activities, and local guide support.",
  },
  {
    question: "Are water sports suitable for non-swimmers?",
    answer: "Yes. Kayaking, glass-bottom boat rides, shallow lagoon snorkeling, and discovery scuba diving can be arranged safely with certified guides and life jackets.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="bg-sky-50 rounded-2xl border border-sky-100">
                <button
                  type="button"
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
