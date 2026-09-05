"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  Waves,
  ShieldCheck,
  Eye,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  Sun,
  Camera,
  Heart,
  Users,
  MapPin,
  Sparkles,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Award,
  Calendar,
  Zap,
} from "lucide-react";

// Kayak types dataset
const KAYAK_TYPES = [
  {
    id: "single",
    name: "Single Sit-On-Top Kayak",
    tag: "Most Popular",
    price: 600,
    unit: "per hour",
    capacity: "1 Person",
    skill: "Beginner Friendly",
    description:
      "Ergonomic, lightweight sit-on-top kayak with molded footwells and backrest. Perfect for gliding at your own pace over shallow coral reefs.",
    features: [
      "Ergonomic Back Support",
      "Lightweight Carbon Paddle",
      "Pro-grade Lifejacket Included",
      "Shallow Reef Escort",
    ],
    image: "/images/kayaking.jpg",
  },
  {
    id: "double",
    name: "Tandem Double Kayak",
    tag: "Couples & Friends",
    price: 1000,
    unit: "per hour",
    capacity: "2 Persons",
    skill: "All Skill Levels",
    description:
      "Double sit-on-top kayak designed for dual paddling. Ideal for couples, friends, or a parent with a child exploring the turquoise lagoon.",
    features: [
      "Synchronized Dual Paddles",
      "Extra Stability Hull",
      "Dry Bag Compartment",
      "Ideal for Couples & Duo Paddlers",
    ],
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "glass",
    name: "Crystal Transparent Glass Kayak",
    tag: "VIP Underwater View",
    price: 1500,
    unit: "per 45 mins",
    capacity: "1 - 2 Persons",
    skill: "Easy",
    description:
      "100% see-through polycarbonate clear kayak. Gives you an unhindered 360° window to view sea turtles, coral formations, and colorful tropical fish below.",
    features: [
      "100% Clear Polycarbonate Hull",
      "Unmatched Drone & Underwater Photography",
      "Direct Turtle & Coral Viewing",
      "Includes Waterproof Camera Strap",
    ],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sunset",
    name: "Golden Hour Sunset Kayak Tour",
    tag: "Guided Expedition",
    price: 2500,
    unit: "per couple (2 hrs)",
    capacity: "Group / Couple",
    skill: "Guided Escort",
    description:
      "Guided evening paddling session out into the open lagoon to watch the sun set over the horizon. Includes complimentary HD drone photos.",
    features: [
      "2-Hour Guided Lagoon Journey",
      "Complimentary HD Aerial Drone Photo",
      "Sunset Refreshments on Sandbar",
      "Expert Marine Guide Escort",
    ],
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
  },
];

// Top Islands dataset
const KAYAK_LOCATIONS = [
  {
    name: "Kalpeni Island Lagoon",
    badge: "#1 Kayaking Destination",
    highlights: "2.8 km Massive Shallow Lagoon & Islets",
    description:
      "Kalpeni features one of Lakshadweep's largest turquoise lagoons, completely enclosed by coral reefs. You can kayak across to small uninhabited islets like Tilakkam and Pitti.",
    image: "/images/kalpeni_island.jpg",
  },
  {
    name: "Agatti Island Beach Bay",
    badge: "Crystal Clear Shoreline",
    highlights: "Airport Lagoon & Gentle Shallow Reefs",
    description:
      "Kayak directly off Agatti's powdery white sand beach. Water visibility exceeds 30 meters, allowing you to see stingrays and colorful coral beds right beneath your kayak.",
    image: "/images/agatti_island.jpg",
  },
  {
    name: "Bangaram Island Atoll",
    badge: "Uninhabited Luxury",
    highlights: "Bioluminescent Lagoon & Sandbars",
    description:
      "Paddling in Bangaram is like floating over an emerald pool. Explore nearby sandbars like Parali 1 & 2 where wild sea turtles swim right beside your kayak.",
    image: "/images/bangaram_island.jpg",
  },
  {
    name: "Kavaratti Water Sports Bay",
    badge: "Full Service Hub",
    highlights: "Water Sports Complex & Certified Safety",
    description:
      "Kavaratti offers full equipment rentals with safety rescue boat coverage, certified instructors, and shallow calm bays ideal for beginners.",
    image: "/images/kavaratti_island.jpg",
  },
];

// Kayaking FAQs
const KAYAK_FAQS = [
  {
    q: "Do I need prior kayaking experience to try this in Lakshadweep?",
    a: "No experience is needed! Lakshadweep lagoons are naturally protected by outer coral reefs, creating calm, mirror-like shallow waters (1-3 meters depth). Our guides provide a 5-minute safety briefing before launch.",
  },
  {
    q: "Is kayaking safe for non-swimmers?",
    a: "Yes, 100%! High-flotation CE-certified lifejackets are mandatory for all paddlers. Additionally, our kayaks stay within calm shallow lagoon boundaries accompanied by safety staff.",
  },
  {
    q: "What is a Transparent Clear Kayak and how is it different?",
    a: "Clear kayaks are made of military-grade transparent polycarbonate. You can look straight down through the bottom of your kayak to see marine life and coral reefs clearly without needing a snorkel mask!",
  },
  {
    q: "Are life jackets and equipment included in the rental price?",
    a: "Yes, all rentals include lightweight carbon paddles, safety life vests, dry bags for valuables, and on-ground safety briefing.",
  },
  {
    q: "What should I wear for kayaking?",
    a: "We recommend comfortable swimwear, UV protection rashguard, sun hat, sunglasses with a neck strap, and reef-safe sunscreen. Water shoes or flip-flops are helpful for sandbars.",
  },
];

export default function KayakingExperiencePage() {
  // Booking Calculator state
  const [selectedIsland, setSelectedIsland] = useState("Agatti Island");
  const [selectedKayak, setSelectedKayak] = useState("single");
  const [paddlerCount, setPaddlerCount] = useState(2);
  const [durationHours, setDurationHours] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const activeKayakObj =
    KAYAK_TYPES.find((k) => k.id === selectedKayak) || KAYAK_TYPES[0];

  // Dynamic price calculation
  const estimatedPrice = activeKayakObj.price * durationHours * Math.ceil(paddlerCount / (selectedKayak === "double" ? 2 : 1));

  const whatsappMessage = encodeURIComponent(
    `Hello Lakshadweep Heritage Holidays! I want to book a Kayaking Experience.\n\n` +
      `📍 Island: ${selectedIsland}\n` +
      `🛶 Kayak Type: ${activeKayakObj.name}\n` +
      `👥 Paddlers: ${paddlerCount}\n` +
      `⏱️ Duration: ${durationHours} Hour(s)\n` +
      `📅 Date: ${selectedDate || "Flexible"}\n` +
      `💰 Est. Amount: ₹${estimatedPrice.toLocaleString("en-IN")}\n\n` +
      `Please confirm slot availability!`
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      <Header />

      <main className="flex-grow pt-20">
        {/* ================= HERO BANNER SECTION ================= */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 px-4">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/kayaking.jpg"
              alt="Kayaking in Lakshadweep turquoise lagoon"
              fill
              priority
              className="object-cover object-center scale-105 filter contrast-105"
            />
            {/* Multi-stage gradient overlays for readability and luxury vibe */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 backdrop-blur-md px-4 py-2 rounded-full w-fit">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-300">
                  LAKSHADWEEP WATER ADVENTURE
                </span>
              </div>

              <h1 className="font-serif-custom text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg">
                Lagoon Kayaking <br />
                <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                  In Paradise Waters
                </span>
              </h1>

              <p className="text-slate-200 text-lg sm:text-xl font-normal max-w-2xl leading-relaxed drop-shadow-md">
                Glide across hyper-clear turquoise lagoons, float over vibrant coral gardens, and spot sea turtles directly beneath your kayak in Lakshadweep&apos;s untouched island sanctuaries.
              </p>

              {/* Stats Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                  <div className="text-2xl font-extrabold text-cyan-300">30m+</div>
                  <div className="text-xs text-slate-300 font-medium">Water Visibility</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                  <div className="text-2xl font-extrabold text-teal-300">1 - 3m</div>
                  <div className="text-xs text-slate-300 font-medium">Calm Lagoon Depth</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                  <div className="text-2xl font-extrabold text-amber-300">100%</div>
                  <div className="text-xs text-slate-300 font-medium">Safety Vests Included</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                  <div className="text-2xl font-extrabold text-emerald-300">4.9/5</div>
                  <div className="text-xs text-slate-300 font-medium">Top Rated Activity</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#booking-calculator"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-2xl text-base shadow-xl shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>Book Kayak Experience</span>
                </a>

                <a
                  href={`https://wa.me/919995554321?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-6 py-4 rounded-2xl text-base backdrop-blur-md transition-all hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Feature Card Highlight */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-5">
                  <Image
                    src="/images/kayaking.jpg"
                    alt="Red kayak in clear turquoise water"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-teal-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    As Seen In Photos
                  </div>
                </div>
                <h3 className="font-serif-custom text-2xl font-bold text-white mb-2">
                  Unreal Water Clarity
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Experience paddling over crystal clear waters so transparent that your red kayak appears to float effortlessly in mid-air above the sandy lagoon floor.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <MapPin className="w-4 h-4" /> Agatti, Kalpeni & Bangaram
                  </span>
                  <span className="text-amber-300 font-semibold">Starting from ₹600/hr</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY KAYAKING IN LAKSHADWEEP IS SPECIAL ================= */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-400 bg-teal-950 border border-teal-800 px-4 py-1.5 rounded-full inline-block mb-4">
              WHY YOU CANNOT MISS THIS
            </span>
            <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              The Ultimate Lagoon Paddle Experience
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Unlike river or high-wave ocean kayaking, Lakshadweep offers shallow enclosed coral lagoons with zero currents, zero pollution, and glass-like water clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl hover:border-teal-500/50 hover:bg-slate-800/90 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">30m+ Crystal Visibility</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Watch coral reefs, sea anemones, and schools of blue tang fish directly below your hull without underwater gear.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl hover:border-cyan-500/50 hover:bg-slate-800/90 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Transparent Clear Kayaks</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Rent our 100% see-through polycarbonate kayaks for an unbelievable 360-degree view into the turquoise ocean life.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl hover:border-amber-500/50 hover:bg-slate-800/90 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">100% Safe for Non-Swimmers</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Protected by natural reef barriers, the water stays shallow (3-5 feet) and wave-free. Certified safety vests are provided.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-800/90 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-6 group-hover:scale-110 transition-transform">
                <Sun className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Golden Hour Sunset Tours</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Paddle during sunset when the sky glows pink and gold against the calm mirror water. Pure romantic magic!
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl hover:border-emerald-500/50 hover:bg-slate-800/90 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Drone & Photography</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Capture iconic aerial top-down drone shots of your red kayak floating in turquoise waters to make your memories unforgettable.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl hover:border-rose-500/50 hover:bg-slate-800/90 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-300 mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Islet & Sandbar Hopping</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Kayak across shallow lagoons to reach uninhabited sandbars like Bangaram Parali and Kalpeni islets.
              </p>
            </div>
          </div>
        </section>

        {/* ================= KAYAK MODELS & PRICING ================= */}
        <section className="py-20 px-4 bg-slate-950/80 border-y border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950 border border-cyan-800 px-4 py-1.5 rounded-full inline-block mb-3">
                  RENTAL & EXPEDITION OPTIONS
                </span>
                <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-white tracking-tight">
                  Choose Your Kayak Experience
                </h2>
              </div>
              <p className="text-slate-400 text-sm sm:text-base max-w-md">
                Select from single sit-on-top kayaks, tandem double kayaks for couples, or transparent glass kayaks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {KAYAK_TYPES.map((kayak) => (
                <div
                  key={kayak.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-teal-500/50 transition-all duration-300 shadow-xl group"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={kayak.image}
                        alt={kayak.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      <span className="absolute top-3 right-3 bg-teal-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                        {kayak.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-serif-custom text-xl font-bold text-white mb-2">
                        {kayak.name}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        {kayak.description}
                      </p>

                      {/* Specs */}
                      <div className="flex items-center gap-3 text-xs text-slate-300 mb-4 pb-4 border-b border-slate-800">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-cyan-400" /> {kayak.capacity}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" /> {kayak.skill}
                        </span>
                      </div>

                      {/* Bullet list */}
                      <ul className="flex flex-col gap-2 mb-6 text-xs text-slate-300">
                        {kayak.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pricing footer */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-auto">
                    <div>
                      <div className="text-xs text-slate-400">Rate</div>
                      <div className="text-xl font-bold text-amber-300">
                        ₹{kayak.price.toLocaleString("en-IN")}
                        <span className="text-xs font-normal text-slate-400">/{kayak.unit}</span>
                      </div>
                    </div>

                    <a
                      href="#booking-calculator"
                      onClick={() => setSelectedKayak(kayak.id)}
                      className="inline-flex items-center gap-1 bg-teal-500/20 hover:bg-teal-500 hover:text-slate-950 text-teal-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-teal-500/30"
                    >
                      <span>Select</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= TOP KAYAKING SPOTS IN LAKSHADWEEP ================= */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-teal-400 bg-teal-950 border border-teal-800 px-4 py-1.5 rounded-full inline-block mb-3">
              PREMIER KAYAKING DESTINATIONS
            </span>
            <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Where to Kayak in Lakshadweep
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Explore the best island lagoons offering untouched coral gardens and shallow sandbars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {KAYAK_LOCATIONS.map((loc, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/60 rounded-3xl overflow-hidden flex flex-col lg:flex-row hover:border-teal-500/50 transition-all duration-300 shadow-xl group"
              >
                <div className="relative h-64 lg:h-auto lg:w-2/5 shrink-0 overflow-hidden">
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                </div>

                <div className="p-6 lg:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-xs font-bold text-cyan-300 uppercase bg-cyan-950 border border-cyan-800 px-3 py-1 rounded-full inline-block mb-3">
                      {loc.badge}
                    </span>
                    <h3 className="font-serif-custom text-2xl font-bold text-white mb-2">
                      {loc.name}
                    </h3>
                    <div className="text-xs font-semibold text-amber-300 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{loc.highlights}</span>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                      {loc.description}
                    </p>
                  </div>

                  <a
                    href="#booking-calculator"
                    onClick={() => setSelectedIsland(loc.name.split(" ")[0] + " Island")}
                    className="inline-flex items-center gap-2 text-teal-300 hover:text-white text-xs font-bold group-hover:translate-x-1 transition-transform"
                  >
                    <span>Book Kayaking on {loc.name.split(" ")[0]}</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= INTERACTIVE BOOKING CALCULATOR ================= */}
        <section
          id="booking-calculator"
          className="py-20 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800"
        >
          <div className="max-w-5xl mx-auto bg-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Glowing Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3.5 py-1.5 rounded-full inline-block mb-3">
                  INSTANT QUOTE & AVAILABILITY
                </span>
                <h2 className="font-serif-custom text-3xl sm:text-4xl font-bold text-white">
                  Customize Your Kayaking Package
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  Select your island, kayak model, and duration to calculate estimated pricing and book via WhatsApp!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Controls Form */}
                <div className="flex flex-col gap-5">
                  {/* Select Island */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-400" /> Select Target Island
                    </label>
                    <select
                      value={selectedIsland}
                      onChange={(e) => setSelectedIsland(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
                    >
                      <option value="Agatti Island">Agatti Island (Airport Beach)</option>
                      <option value="Bangaram Island">Bangaram Island (Resort Atoll)</option>
                      <option value="Kalpeni Island">Kalpeni Island (Giant Lagoon)</option>
                      <option value="Kavaratti Island">Kavaratti Island (Water Sports Center)</option>
                    </select>
                  </div>

                  {/* Select Kayak Model */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-cyan-400" /> Select Kayak Model
                    </label>
                    <select
                      value={selectedKayak}
                      onChange={(e) => setSelectedKayak(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      {KAYAK_TYPES.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name} — ₹{k.price}/{k.unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Number of Paddlers & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" /> Paddlers
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={paddlerCount}
                        onChange={(e) => setPaddlerCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-400" /> Hours
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={durationHours}
                        onChange={(e) => setDurationHours(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400" /> Preferred Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Live Summary Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">
                      Booking Summary
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Destination:</span>
                        <span className="font-semibold text-white">{selectedIsland}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Kayak Model:</span>
                        <span className="font-semibold text-cyan-300">{activeKayakObj.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Paddlers:</span>
                        <span className="font-semibold text-white">{paddlerCount} Person(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration:</span>
                        <span className="font-semibold text-white">{durationHours} Hour(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Equipment & Vests:</span>
                        <span className="font-semibold text-emerald-400">Included Free</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-xs text-slate-400">Estimated Total</div>
                      <div className="text-3xl font-extrabold text-amber-300">
                        ₹{estimatedPrice.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <a
                      href={`https://wa.me/919995554321?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl text-center shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5 fill-slate-950 text-emerald-500" />
                      <span>Book Slot on WhatsApp</span>
                    </a>

                    <a
                      href="tel:+919995554321"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl text-center text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4 text-cyan-400" />
                      <span>Call Tour Specialist: +91 9995554321</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SAFETY & INCLUSIONS ================= */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 bg-teal-950 border border-teal-800 px-4 py-1.5 rounded-full inline-block mb-3">
                PEACE OF MIND
              </span>
              <h2 className="font-serif-custom text-3xl sm:text-4xl font-bold text-white mb-6">
                Safety First & Complete Equipment Standard
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                At Lakshadweep Heritage Holidays, your safety and comfort are our top priority. We use imported marine-grade kayaks and certified safety gear inspected daily.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
                  <ShieldCheck className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">CE-Certified High Buoyancy Vests</h4>
                    <p className="text-slate-400 text-xs mt-1">
                      Lightweight, ergonomic lifejackets provided for all adults and children. Mandatory for every session.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
                  <Users className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Dedicated Safety Boat Escort</h4>
                    <p className="text-slate-400 text-xs mt-1">
                      For long lagoon excursions and sandbar tours, a rescue boat accompanies the kayak group.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
                  <Award className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Pre-Launch Technique Briefing</h4>
                    <p className="text-slate-400 text-xs mt-1">
                      Our certified local instructors guide you on proper paddle stroke, turning, and shallow water navigation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Box */}
            <div className="relative h-[420px] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
                alt="Safe Kayaking setup"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
                  RECOMMENDED CHECKLIST
                </div>
                <div className="text-white font-bold text-sm mb-2">What to Bring:</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <span>✔ Sun Hat & UV Sunglasses</span>
                  <span>✔ Reef-Safe Sunscreen</span>
                  <span>✔ Rashguard / Swim Shorts</span>
                  <span>✔ Waterproof Phone Pouch</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
        <section className="py-20 px-4 bg-slate-950/90 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950 border border-cyan-800 px-4 py-1.5 rounded-full inline-block mb-3">
                GOT QUESTIONS?
              </span>
              <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-white">
                Kayaking FAQs
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {KAYAK_FAQS.map((faq, i) => {
                const isOpen = activeFaq === i;
                return (
                  <div
                    key={i}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : i)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-teal-400 shrink-0" />
                        <span className="font-bold text-white text-base sm:text-lg">
                          {faq.q}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? "rotate-90 text-teal-400" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-0 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 mt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= FINAL CALL TO ACTION ================= */}
        <section className="py-20 px-4 max-w-7xl mx-auto text-center">
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-900 border border-teal-500/30 rounded-3xl p-10 sm:p-16 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-700 px-4 py-1.5 rounded-full">
                READY TO PADDLE IN PARADISE?
              </span>
              <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Book Your Lakshadweep Kayaking Adventure Today
              </h2>
              <p className="text-slate-300 text-base sm:text-lg font-normal">
                Combine your kayaking session with permit assistance, resort transfers, and full island tour packages from Lakshadweep Heritage Holidays.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <a
                  href={`https://wa.me/919995554321?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-slate-950 text-emerald-500" />
                  <span>Chat & Reserve on WhatsApp</span>
                </a>
                <Link
                  href="/packages"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-base backdrop-blur-md transition-all hover:scale-105"
                >
                  Explore All Holiday Packages
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
