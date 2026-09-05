import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Helper function to safely read .env.local without exposing values
function getEnvConfig() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found at project root.');
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars: Record<string, string> = {};

  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim();
        let val = trimmed.substring(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        envVars[key] = val;
      }
    }
  });

  const url = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    envVars.SUPABASE_SERVICE_ROLE_KEY ||
    envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase URL or Key is missing in .env.local');
  }

  return { url, key };
}

// Convert price string to numeric value (e.g. "₹11,399 / person" -> 11399)
function parsePrice(priceStr: string): number | null {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/[^0-9]/g, '');
  if (!cleaned) return null;
  const numericPrice = parseInt(cleaned, 10);
  return isNaN(numericPrice) ? null : numericPrice;
}

// Island data extracted from old Lakshadweep Heritage Holidays site
export const OLD_ISLANDS = [
  {
    name: 'Agatti',
    slug: 'agatti',
    description: 'Gateway island to Lakshadweep with beautiful lagoon and airport access.',
    status: 'Active',
  },
  {
    name: 'Kavaratti',
    slug: 'kavaratti',
    description: 'Capital island known for calm lagoons, marine aquarium, and water sports.',
    status: 'Active',
  },
  {
    name: 'Kalpeni',
    slug: 'kalpeni',
    description: 'Famous for its massive lagoon, coral debris beach, and uninhabited islets.',
    status: 'Active',
  },
];

// Package data extracted from old data.js (without base64 image strings)
export const OLD_PACKAGES = [
  {
    old_id: 'pkg1',
    title: 'Kalpeni Island Adventure Package',
    name: 'Kalpeni Island Adventure Package',
    duration: '3N / 4D',
    raw_price: '₹11,399 / person',
    price: parsePrice('₹11,399 / person'), // 11399
    category: 'adventure',
    tagline: 'Thrill-filled itinerary with Sightseeing and Water Adventure',
    description: 'Thrill-filled itinerary with Sightseeing and Water Adventure',
    rooms: 'Standard AC Rooms/Beach Resorts',
    food_preferences: 'All Meals Included (Veg/Non-Veg)',
    highlights: [
      'Pick up and Drop off.',
      'Entry Permit to Lakshadweep.',
      'Food and Accommodation(Beach Resort).',
      'Transportation in Island.',
      'Water Activities Including Kayaking, Snorkeling and Glass Bottomed Boat ride.',
      'Turtle Watch, Fish Watch & Coral Watch.',
      'Trip to Uninhabited Island(Pitti And Thilakam).',
      'Personal Tour Guide.',
    ],
    exclusions: [
      'Ship Ticket.',
      'Scuba Diving.',
      'Cheriyam trip(Uninhabited island).',
      'Night Fishing And Spot Grill.',
      'Personal Expenses.',
    ],
    status: 'Active',
    target_island_slug: 'kalpeni',
  },
  {
    old_id: 'pkg2',
    title: 'Agatti Island Adventure Package',
    name: 'Agatti Island Adventure Package',
    duration: '3N / 4D',
    raw_price: '₹12,499 / person',
    price: parsePrice('₹12,499 / person'), // 12499
    category: 'short',
    tagline: 'Explore the Beuaty of Gate Way of Lakshadweep',
    description: 'Explore the Beuaty of Gate Way of Lakshadweep',
    rooms: 'Home stays and standard rooms(A/C)',
    food_preferences: 'All Meals Included (Seafood Special available)',
    highlights: [
      'Pick up and Drop off.',
      'Entry Permit to Lakshadweep.',
      'Food and Accommodation.',
      'Transportation in Island.',
      'Water Activities Including Kayaking, Snorkeling and Glass Bottomed Boat ride.',
      'Turtle Watch, Fish Watch & Coral Watch.',
      'Trip to Uninhabited Island(Kalpitti).',
      'Personal Tour Guide.',
    ],
    exclusions: [
      'Ticket Charges.',
      'Scuba Dive and Other Water activities.',
      'Night Fishing And Spot Grill.',
      'Personal Expenses.',
    ],
    status: 'Active',
    target_island_slug: 'agatti',
  },
  {
    old_id: 'pkg3',
    title: 'Honeymoon in Paradise.(Agatti/ Kavaratti/ Kalpeni)',
    name: 'Honeymoon in Paradise.(Agatti/ Kavaratti/ Kalpeni)',
    duration: '3N / 4D',
    raw_price: '₹29,999 / couple',
    price: parsePrice('₹29,999 / couple'), // 29999
    category: 'romantic',
    tagline: 'Secluded premium, private beach candlelight dinner & sunset cruise.',
    description: 'Secluded premium, private beach candlelight dinner & sunset cruise.',
    rooms: 'Beachfront Accommodation.(Resort/Standard Rooms)',
    food_preferences: 'All Meals Included + 1 Candlelight Dinner',
    highlights: [
      'Pick up and Drop off.',
      'Entry Permit to Lakshadweep.',
      'Food and Accommodation(Beach Resort).',
      'Transportation in Island.',
      'Water Activities Including Kayaking, Snorkeling and Glass Bottomed Boat ride.',
      'Turtle Watch, Fish Watch & Coral Watch.',
      'Trip to Uninhabited Island.',
      'Beach View Candlelight Dinner.',
      'Personal Tour Guide.',
    ],
    exclusions: [
      'Ticket Charges.',
      'Scuba Dive and Other Water activities.',
      'Night Fishing And Spot Grill.',
      'Personal Expenses.',
    ],
    status: 'Active',
    target_island_slug: 'agatti',
  },
  {
    old_id: 'pkg4',
    title: 'Family Island Holiday(Agatti/ Kavaratti/Kalpeni).',
    name: 'Family Island Holiday(Agatti/ Kavaratti/Kalpeni).',
    duration: '3N / 4D',
    raw_price: '₹13,399 / Person',
    price: parsePrice('₹13,399 / Person'), // 13399
    category: 'family',
    tagline: 'Safe, fun-filled family vacation with shallow lagoon activities.',
    description: 'Safe, fun-filled family vacation with shallow lagoon activities.',
    rooms: 'Standard A/C Rooms / Connected Rooms',
    food_preferences: 'All Meals Included (Kid-friendly menu available)',
    highlights: [
      'Pick up and Drop off.',
      'Entry Permit to Lakshadweep.',
      'Food and Accommodation(Beach Resort).',
      'Transportation in Island.',
      'Water Activities Including Kayaking, Snorkeling and Glass Bottomed Boat ride.',
      'Turtle Watch, Fish Watch & Coral Watch.',
      'Trip to Uninhabited Island.',
      'Beach View Candlelight Dinner.',
      'Personal Tour Guide.',
    ],
    exclusions: [
      'Ticket Charges.',
      'Scuba Dive and Other Water activities.',
      'Night Fishing And Spot Grill.',
      'Personal Expenses.',
    ],
    status: 'Active',
    target_island_slug: 'agatti',
  },
];

export async function runMigration(dryRun = false) {
  const { url, key } = getEnvConfig();
  const supabase = createClient(url, key);

  console.log(`Starting Migration (dryRun = ${dryRun})...`);

  // 1. Migrate Islands
  const islandMap: Record<string, string> = {};

  for (const island of OLD_ISLANDS) {
    // Check if island already exists to prevent duplicate insertion
    const { data: existingIslands, error: checkErr } = await supabase
      .from('islands')
      .select('id, name, slug')
      .or(`name.eq."${island.name}",slug.eq."${island.slug}"`);

    if (checkErr) {
      console.warn(`Could not check existing island ${island.name}:`, checkErr.message);
    }

    if (existingIslands && existingIslands.length > 0) {
      console.log(`Island "${island.name}" already exists in database. Skipping insert.`);
      islandMap[island.slug] = existingIslands[0].id;
    } else {
      if (dryRun) {
        console.log(`[DRY RUN] Would insert island:`, island.name);
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('islands')
          .insert([island])
          .select('id')
          .single();

        if (insertErr) {
          console.error(`Failed to insert island ${island.name}:`, insertErr.message);
        } else if (inserted) {
          console.log(`Successfully inserted island "${island.name}" (ID: ${inserted.id})`);
          islandMap[island.slug] = inserted.id;
        }
      }
    }
  }

  // 2. Migrate Packages
  for (const pkg of OLD_PACKAGES) {
    // Check if package already exists by title/name
    const { data: existingPkgs, error: checkPkgErr } = await supabase
      .from('packages')
      .select('id, title, name')
      .or(`title.eq."${pkg.title}",name.eq."${pkg.name}"`);

    if (checkPkgErr) {
      console.warn(`Could not check existing package ${pkg.title}:`, checkPkgErr.message);
    }

    if (existingPkgs && existingPkgs.length > 0) {
      console.log(`Package "${pkg.title}" already exists in database. Skipping insert.`);
      continue;
    }

    const linkedIslandId = islandMap[pkg.target_island_slug] || null;

    const packageRecord = {
      title: pkg.title,
      name: pkg.name,
      tagline: pkg.tagline,
      description: pkg.description,
      duration: pkg.duration,
      price: pkg.price,
      raw_price: pkg.raw_price,
      category: pkg.category,
      status: pkg.status,
      highlights: pkg.highlights,
      exclusions: pkg.exclusions,
      rooms: pkg.rooms,
      food_preferences: pkg.food_preferences,
      island_id: linkedIslandId,
    };

    if (dryRun) {
      console.log(`[DRY RUN] Would insert package:`, pkg.title, `(Island ID: ${linkedIslandId})`);
    } else {
      const { data: insertedPkg, error: insertPkgErr } = await supabase
        .from('packages')
        .insert([packageRecord])
        .select('id')
        .single();

      if (insertPkgErr) {
        console.error(`Failed to insert package ${pkg.title}:`, insertPkgErr.message);
      } else if (insertedPkg) {
        console.log(`Successfully inserted package "${pkg.title}" (ID: ${insertedPkg.id})`);
      }
    }
  }

  console.log('Migration process completed.');
}
