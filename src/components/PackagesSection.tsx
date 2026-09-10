import { Package } from "@/data/travelData";
import { createClient } from "@/lib/supabase/server";
import PackageCard from "./PackageCard";

type DatabasePackage = {
  id: string;
  name?: string | null;
  duration?: string | null;
  price?: number | null;
  image_url?: string | null;
  description?: string | null;
  inclusions?: string[] | null;
  exclusions?: string[] | null;
};

function toPackage(item: DatabasePackage): Package {
  return {
    id: item.id,
    name: item.name || "Untitled package",
    duration: item.duration || "Flexible duration",
    price: item.price || 0,
    image_url: item.image_url || "/images/kalpeni_island.jpg",
    description: item.description || "A carefully planned Lakshadweep island holiday.",
    inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
    exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
  };
}

async function getPackages(): Promise<Package[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select("id, name, description, duration, price, image_url, inclusions, exclusions")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return (data as DatabasePackage[]).map(toPackage);
    }
  } catch {
    // Keep public page running safely
  }

  return [];
}

export default async function PackagesSection() {
  const packages = await getPackages();

  return (
    <section id="packages" className="py-20 sm:py-28 bg-sky-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-4 py-1.5 rounded-full mb-4 border border-sky-200">
            CURATED TRAVEL PACKAGES
          </span>
          <h2 className="font-serif-custom text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Discover Our Travel Packages
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl font-normal">
            Thoughtfully designed holidays for couples, families and adventure seekers.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
