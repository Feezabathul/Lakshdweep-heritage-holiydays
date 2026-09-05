import React from "react";

export default function AccommodationSection() {
  return (
    <section id="accommodation" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-sky-700 mb-8">
          Accommodation
        </h2>
        {/* Intro text */}
        <p className="text-center text-lg text-gray-600 mb-12">
          Discover comfortable beachfront homestays, premium beach resorts, and standard rooms across the beautiful islands of Lakshadweep. Each stay is selected to provide an authentic island experience with comfort and convenience.
        </p>
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Homestay Card */}
          <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-white">
            <img
              src="/images/homestay.jpg"
              alt="Beach Front Homestay"
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
              <span className="text-sm font-medium text-sky-500 uppercase">Homestay</span>
              <h3 className="text-xl font-semibold text-sky-800 mt-2 mb-2">Beach Front Homestay</h3>
              <p className="text-gray-600 flex-1 mb-4">
                Experience Lakshadweep like a local with comfortable beach-front stays, warm hospitality and an authentic island atmosphere.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Beach front location</li>
                <li>Local island experience</li>
                <li>Comfortable rooms</li>
                <li>Authentic hospitality</li>
                <li>Budget-friendly</li>
              </ul>
            </div>
          </div>
          {/* Resort Card */}
          <div className="relative flex flex-col h-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-white">
            <img
              src="/images/resort.jpg"
              alt="Beach Resort"
              className="h-48 w-full object-cover"
            />
            {/* Premium badge */}
            <div className="absolute top-2 left-2 bg-sky-700 text-white text-xs font-semibold px-2 py-0.5 rounded">
              PREMIUM STAY
            </div>
            <div className="p-4 flex flex-col flex-1">
              <span className="text-sm font-medium text-sky-500 uppercase">Resort</span>
              <h3 className="text-xl font-semibold text-sky-800 mt-2 mb-2">Beach Resort</h3>
              <p className="text-gray-600 flex-1 mb-4">
                Relax in a beautiful beach resort with premium surroundings, stunning ocean views, modern comfort and memorable tropical experiences.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Beach resort</li>
                <li>Premium accommodation</li>
                <li>Ocean views</li>
                <li>Ideal for couples &amp; honeymooners</li>
                <li>Enhanced comfort</li>
              </ul>
            </div>
          </div>
          {/* Standard Rooms Card */}
          <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-white">
            <img
              src="/images/standard_rooms.jpg"
              alt="Beach Front Standard Rooms"
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
              <span className="text-sm font-medium text-sky-500 uppercase">Standard Rooms</span>
              <h3 className="text-xl font-semibold text-sky-800 mt-2 mb-2">Beach Front Standard Rooms</h3>
              <p className="text-gray-600 flex-1 mb-4">
                Clean, comfortable and practical beach-front rooms for travelers looking for a convenient and affordable stay in Lakshadweep.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Beach front location</li>
                <li>Clean &amp; comfortable</li>
                <li>Essential amenities</li>
                <li>Family-friendly</li>
                <li>Affordable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

