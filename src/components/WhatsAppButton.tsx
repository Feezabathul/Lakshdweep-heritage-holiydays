"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919037532124?text=Hi!%20I%20want%20to%20plan%20a%20trip%20to%20Lakshadweep."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with Lakshadweep Heritage Holidays"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-600/40 animate-whatsapp-pulse transition-all transform hover:scale-105 active:scale-95"
    >
      <MessageCircle className="w-6 h-6 fill-current stroke-[1.5]" />
      <span className="hidden sm:inline text-xs font-extrabold tracking-wide uppercase">
        Chat on WhatsApp
      </span>
    </a>
  );
}
