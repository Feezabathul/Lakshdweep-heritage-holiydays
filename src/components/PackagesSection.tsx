import { PACKAGES_DATA, Package } from "@/data/travelData";
import { unstable_noStore as noStore } from "next/cache";
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

export const revalidate = 0;

function normalizeName(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function toPackage(item: DatabasePackage): Package {
  const nameKey = normalizeName(item.name || "");
  const livePackage = PACKAGES_DATA.find((packageItem) => {
    const pKey = normalizeName(packageItem.name);
    return (
      pKey === nameKey ||
      (nameKey.includes("honeymoon") && pKey.includes("honeymoon")) ||
      (nameKey.includes("kalpeni") && pKey.includes("kalpeni")) ||
      (nameKey.includes("agatti") && pKey.includes("agatti")) ||
      (nameKey.includes("family") && pKey.includes("family"))
    );
  });

  const inclusions =
    Array.isArray(item.inclusions) && item.inclusions.length > 0
      ? item.inclusions
      : livePackage?.inclusions || [];

  const exclusions =
    Array.isArray(item.exclusions) && item.exclusions.length > 0
      ? item.exclusions
      : livePackage?.exclusions || [];

  return {
    id: item.id,
    name: item.name || livePackage?.name || "Untitled package",
    duration: item.duration || livePackage?.duration || "Flexible duration",
    price: item.price || livePackage?.price || 0,
    image_url: item.image_url || livePackage?.image_url || "/images/kalpeni_island.jpg",
    description:
      item.description ||
      livePackage?.description ||
      "A carefully planned Lakshadweep island holiday.",
    inclusions,
    exclusions,
    isPopular: livePackage?.isPopular,
  };
}

async function getPackages(): Promise<Package[]> {
  noStore();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select(
        "id, name, description, duration, price, image_url, inclusions, exclusions"
      )
      .order("created_at", { ascending: false });

    if (error) {
      // Log as warning so it doesn't appear as a hard crash in the console
      console.warn(
        "Supabase packages fetch error (falling back to static data):",
        error.message
      );
      return PACKAGES_DATA;
    }

    if (data && data.length > 0) {
      return (data as DatabasePackage[]).map(toPackage);
    }
  } catch (err) {
    // Network-level failure (e.g. "fetch failed") — silently use static data
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Supabase unreachable, using static package data:",
        err instanceof Error ? err.message : err
      );
    }
  }

  return PACKAGES_DATA;
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
