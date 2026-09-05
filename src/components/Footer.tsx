import Link from "next/link";
import { Compass, Phone, Mail, MapPin, Clock3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-tight">
                  Lakshadweep <span className="text-orange-400">Heritage</span>
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">
                  Holidays • Your Travel Partner
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your premier specialized travel agency for Lakshadweep island tours. Providing end-to-end permit assistance, resort reservations, water adventures, and flight transfers.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.instagram.com/lakshadweepheritageholidays?igsh=MWc3MGV2bXFxejY3#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-base font-bold tracking-wide">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link href="/#packages" className="hover:text-teal-400 transition-colors">Packages</Link></li>
              <li><Link href="/#islands" className="hover:text-teal-400 transition-colors">Islands</Link></li>
              <li><Link href="/#why-us" className="hover:text-teal-400 transition-colors">Why Choose Us</Link></li>
              <li><Link href="/#about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-teal-400 transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Popular Islands & Experiences */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-base font-bold tracking-wide">Water Experiences</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li><Link href="/experiences/kayaking" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors flex items-center gap-1.5"><span>Kayaking Lagoon Tour</span><span className="bg-teal-500/20 text-teal-300 text-[10px] px-1.5 py-0.5 rounded font-bold">HOT</span></Link></li>
              <li><Link href="/experiences#scuba-diving" className="hover:text-teal-400 transition-colors">Scuba Diving</Link></li>
              <li><Link href="/experiences#snorkeling" className="hover:text-teal-400 transition-colors">Snorkeling</Link></li>
              <li><Link href="/islands#kalpeni" className="hover:text-teal-400 transition-colors">Kalpeni Kayak Haven</Link></li>
              <li><Link href="/islands#bangaram" className="hover:text-teal-400 transition-colors">Bangaram Atoll</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-base font-bold tracking-wide">Contact Us</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <span>lakshadweep heritage holidays kavaratti island</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>9037532124</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>lakshadweepheritageholidays@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock3 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>10 AM – 6 PM(Monday to Friday)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Lakshadweep Heritage Holidays. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="/permit-info" className="hover:text-slate-400 transition-colors">Permit Info</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
