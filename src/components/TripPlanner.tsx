"use client";

import { useState } from "react";
import { MapPin, Calendar, Users, Search, ChevronDown } from "lucide-react";

export default function TripPlanner() {
  const [destination, setDestination] = useState("Agatti");
  const [duration, setDuration] = useState("4 Nights / 5 Days");
  const [travelers, setTravelers] = useState("2 Travelers");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const packageSection = document.getElementById("packages");
    if (packageSection) {
      packageSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="planner" className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(14,116,144,0.12)] border border-sky-100/80 ring-1 ring-sky-100/70 transition-all duration-300 hover:shadow-[0_26px_60px_rgba(14,116,144,0.18)]">
        <form onSubmit={handleSearch} suppressHydrationWarning className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          {/* Destination */}
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-sky-50/80 hover:bg-sky-100/80 border border-sky-200/80 transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-200/40">
            <label className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>Destination</span>
            </label>
            <div className="relative flex items-center">
              <select
                suppressHydrationWarning
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-slate-900 font-semibold text-sm sm:text-base focus:outline-none appearance-none pr-6 cursor-pointer"
              >
                <option value="Agatti">Agatti Island</option>
                <option value="Bangaram">Bangaram Island</option>
                <option value="Kavaratti">Kavaratti Island</option>
                <option value="Kalpeni">Kalpeni Island</option>
              </select>
              <ChevronDown className="w-4 h-4 text-sky-500 absolute right-0 pointer-events-none group-hover:text-sky-700 transition-colors" />
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-sky-50/80 hover:bg-sky-100/80 border border-sky-200/80 transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-200/40">
            <label className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>Duration</span>
            </label>
            <div className="relative flex items-center">
              <select
                suppressHydrationWarning
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-transparent text-slate-900 font-semibold text-sm sm:text-base focus:outline-none appearance-none pr-6 cursor-pointer"
              >
                <option value="3 Nights / 4 Days">3 Nights / 4 Days</option>
                <option value="4 Nights / 5 Days">4 Nights / 5 Days</option>
                <option value="5 Nights / 6 Days">5 Nights / 6 Days</option>
              </select>
              <ChevronDown className="w-4 h-4 text-sky-500 absolute right-0 pointer-events-none group-hover:text-sky-700 transition-colors" />
            </div>
          </div>

          {/* Travelers */}
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-sky-50/80 hover:bg-sky-100/80 border border-sky-200/80 transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-200/40">
            <label className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>Travelers</span>
            </label>
            <div className="relative flex items-center">
              <select
                suppressHydrationWarning
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full bg-transparent text-slate-900 font-semibold text-sm sm:text-base focus:outline-none appearance-none pr-6 cursor-pointer"
              >
                <option value="1 Traveler">1 Traveler</option>
                <option value="2 Travelers">2 Travelers</option>
                <option value="3-4 Travelers">3-4 Travelers</option>
                <option value="5+ Travelers">5+ Travelers</option>
              </select>
              <ChevronDown className="w-4 h-4 text-sky-500 absolute right-0 pointer-events-none group-hover:text-sky-700 transition-colors" />
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full">
            <button
              type="submit"
              suppressHydrationWarning
              className="w-full h-[54px] bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white font-bold text-base rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/35 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] hover:-translate-y-0.5"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Find Packages</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
