export type AccommodationType = "Homestay" | "Resort" | "Standard Rooms";

export interface Accommodation {
  id: string;
  image_url: string;
  accommodation_type: AccommodationType;
  heading: string;
  description_points: string[];
}

export const ACCOMMODATION_DATA: Accommodation[] = [
  {
    id: "homestay",
    accommodation_type: "Homestay",
    heading: "Beach Front Homestay",
    image_url: "/images/homestay.jpg",
    description_points: [
      "Beach front location",
      "Local island experience",
      "Comfortable rooms",
      "Authentic hospitality",
      "Budget-friendly option",
    ],
  },
  {
    id: "resort",
    accommodation_type: "Resort",
    heading: "Beach Resort",
    image_url: "/images/resort.jpg",
    description_points: [
      "Beach resort",
      "Premium accommodation",
      "Beautiful ocean surroundings",
      "Ideal for couples & honeymooners",
      "Enhanced comfort",
    ],
  },
  {
    id: "standard",
    accommodation_type: "Standard Rooms",
    heading: "Beach Front Standard Rooms",
    image_url: "/images/standard_rooms.jpg",
    description_points: [
      "Beach front location",
      "Clean & comfortable",
      "Essential amenities",
      "Family-friendly",
      "Affordable",
    ],
  },
];
