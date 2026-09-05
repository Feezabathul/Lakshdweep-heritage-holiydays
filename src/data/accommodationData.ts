export interface Accommodation {
  id: string;
  category: string;
  title: string;
  description: string;
  highlights: string[];
  image: string; // path relative to /images
  badge?: string;
}

export const ACCOMMODATION_DATA: Accommodation[] = [
  {
    id: "homestay",
    category: "BEACH FRONT HOMESTAY",
    title: "Homestay",
    description: "Experience Lakshadweep like a local with comfortable beach-front stays, warm hospitality and an authentic island atmosphere.",
    highlights: [
      "Beach front location",
      "Local island experience",
      "Comfortable rooms",
      "Authentic hospitality",
      "Budget-friendly option",
    ],
    image: "/images/homestay.jpg",
  },
  {
    id: "resort",
    category: "BEACH RESORT",
    title: "Resort",
    description: "Relax in a beautiful beach resort with premium surroundings, stunning island views, modern comfort and memorable tropical experiences.",
    highlights: [
      "Beach resort",
      "Premium accommodation",
      "Beautiful ocean surroundings",
      "Ideal for couples & honeymooners",
      "Enhanced comfort",
    ],
    image: "/images/resort.jpg",
    badge: "PREMIUM STAY",
  },
  {
    id: "standard",
    category: "BEACH FRONT STANDARD ROOMS",
    title: "Standard Rooms",
    description: "Clean, comfortable and practical beach-front rooms for travelers looking for a convenient and affordable stay in Lakshadweep.",
    highlights: [
      "Beach front location",
      "Clean & comfortable",
      "Essential amenities",
      "Family-friendly",
      "Affordable",
    ],
    image: "/images/standard_rooms.jpg",
  },
];
