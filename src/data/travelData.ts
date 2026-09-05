export interface Island {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  highlights: string[];
  slug: string;
}

export interface Package {
  id: string;
  title: string;
  category: string;
  duration: string;
  startingPrice: string;
  image: string;
  description: string;
  highlights: string[];
  isPopular?: boolean;
  slug: string;
}

export interface Experience {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  slug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

export interface TrustStat {
  value: string;
  label: string;
  sublabel: string;
}

export const ISLANDS_DATA: Island[] = [
  {
    id: "agatti",
    name: "Agatti Island",
    tagline: "The Gateway to Paradise",
    description: "Home to Lakshadweep's main airport, Agatti features an idyllic 6 km lagoon of crystal waters, coconut palm fringes, and vibrant coral reefs.",
    image: "/images/agatti_island.jpg",
    highlights: ["Airport Gateway", "Glass Bottom Boats", "Clear Lagoon"],
    slug: "agatti",
  },
  {
    id: "bangaram",
    name: "Bangaram Island",
    tagline: "Uninhabited Jewel of the Ocean",
    description: "A teardrop-shaped paradise surrounded by a shallow lagoon, calm turquoise sea, and white sandy beaches ideal for serene relaxation.",
    image: "/images/bangaram_island.jpg",
    highlights: ["Sandbar Excursions", "Bioluminescent Lagoon", "Luxury Vibe"],
    slug: "bangaram",
  },
  {
    id: "kavaratti",
    name: "Kavaratti Island",
    tagline: "Administrative & Cultural Hub",
    description: "The capital island boasting rich maritime heritage, marine aquarium, traditional wood-carved mosques, and tranquil water sports bays.",
    image: "/images/kavaratti_island.jpg",
    highlights: ["Marine Aquarium", "Heritage Site", "Water Sports Center"],
    slug: "kavaratti",
  },
  {
    id: "kalpeni",
    name: "Kalpeni Island",
    tagline: "Lagoon of Coral Debris",
    description: "Renowned for its massive turquoise lagoon, scenic coral debris shoreline, and small islet extensions ideal for kayaking and swimming.",
    image: "/images/kalpeni_island.jpg",
    highlights: ["Giant Coral Reefs", "Islet Hopping", "Kayaking Haven"],
    slug: "kalpeni",
  },
];

export const PACKAGES_DATA: Package[] = [
  {
    id: "kalpeni-adventure",
    title: "Kalpeni Island Adventure Package",
    category: "Island Escape",
    duration: "3 Nights / 4 Days",
    startingPrice: "₹11,399",
    image: "/images/kalpeni_island.jpg",
    description: "Thrill-filled itinerary with Sightseeing and Water Adventure",
    highlights: [],
    slug: "kalpeni-adventure",
  },
  {
    id: "agatti-adventure",
    title: "Agatti Island Adventure Package",
    category: "Popular Getaway",
    duration: "3 Nights / 4 Days",
    startingPrice: "₹12,499",
    image: "/images/agatti_island.jpg",
    description: "Explore the Beauty of Gateway of Lakshadweep",
    highlights: [],
    slug: "agatti-adventure",
  },
  {
    id: "honeymoon-paradise",
    title: "Honeymoon in Paradise.(Agatti/ Kavaratti/ Kalpeni)",
    category: "Romantic Luxury",
    duration: "3 Nights / 4 Days",
    startingPrice: "₹29,999",
    image: "/images/honeymoon.jpg",
    description: "Secluded premium, private beach candlelight dinner & sunset cruise.",
    highlights: [],
    isPopular: true,
    slug: "honeymoon-paradise",
  },
  {
    id: "family-holiday",
    title: "Family Island Holiday(Agatti/ Kavaratti/Kalpeni).",
    category: "Family Special",
    duration: "3 Nights / 4 Days",
    startingPrice: "₹13,399",
    image: "/images/family_island_holiday.jpg",
    description: "Safe, fun-filled family vacation with shallow lagoon activities.",
    highlights: [],
    slug: "family-holiday",
  },
];

export const EXPERIENCES_DATA: Experience[] = [
  {
    id: "scuba-diving",
    title: "Scuba Diving",
    subtitle: "Explore vibrant coral gardens & marine life",
    image: "/images/scuba_diving.jpg",
    slug: "scuba-diving",
  },
  {
    id: "snorkeling",
    title: "Snorkeling",
    subtitle: "Swim with sea turtles in shallow lagoons",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    slug: "snorkeling",
  },
  {
    id: "kayaking",
    title: "Kayaking & Paddleboarding",
    subtitle: "Glide through transparent turquoise waters",
    image: "/images/kayaking.jpg",
    slug: "kayaking",
  },
  {
    id: "water-sports",
    title: "Water Sports",
    subtitle: "Jet ski, banana rides, & windsurfing thrill",
    image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80",
    slug: "water-sports",
  },
  {
    id: "island-hopping",
    title: "Island Hopping",
    subtitle: "Discover uninhabited sandbars & islets",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    slug: "island-hopping",
  },
  {
    id: "beach-experiences",
    title: "Beach Experiences",
    subtitle: "Romantic dinners & sunset lagoon walks",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
    slug: "beach-experiences",
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "t1",
    name: "Rajesh & Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Our Lakshadweep honeymoon arranged by Lakshadweep Heritage Holidays was flawless. The permit approval was handled seamlessly, and Bangaram island was pure magic!",
    verified: true,
    date: "February 2026",
  },
  {
    id: "t2",
    name: "Anand Nair",
    location: "Kochi",
    rating: 5,
    comment: "Local island expertise truly makes all the difference! From Agatti airport pickup to our scuba sessions in Kalpeni, every detail was professionally organized.",
    verified: true,
    date: "January 2026",
  },
  {
    id: "t3",
    name: "David & Sarah Miller",
    location: "Bangalore",
    rating: 5,
    comment: "Hands down the best travel agency for Lakshadweep. Transparent pricing, prompt WhatsApp communication, and stunning resort arrangements. Highly recommended!",
    verified: true,
    date: "February 2026",
  },
];

export const TRUST_STATS: TrustStat[] = [
  {
    value: "10+",
    label: "Years Experience",
    sublabel: "Dedicated to Lakshadweep Tourism",
  },
  {
    value: "1000+",
    label: "Happy Travelers",
    sublabel: "Unforgettable Island Journeys",
  },
  {
    value: "End-to-End",
    label: "Permit Support",
    sublabel: "Hassle-Free Heritage Assistance",
  },
  {
    value: "Local",
    label: "Island Expertise",
    sublabel: "On-Ground Native Support Team",
  },
];
