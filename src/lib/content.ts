import { createClient } from "./supabase/client";

export interface HomepageContent {
  heroHeading: string;
  heroDescription: string;
  ctaText: string;
  aboutText: string;
  whyChooseUs: string;
}

export interface AboutContent {
  heading: string;
  description: string;
  image: string;
}

export interface ContactContentData {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  heroHeading: "Discover Paradise, Beyond the Ordinary.",
  heroDescription: "Curated island escapes, water adventures, and unforgettable travel experiences with end-to-end permit support.",
  ctaText: "Explore Packages",
  aboutText: "With over a decade of dedicated service, Lakshadweep Heritage Holidays specializes in crafting effortless, unforgettable island vacations. We take care of every detail—from entry permits and inter-island boat transfers to beachfront resort stays and aquatic excursions.",
  whyChooseUs: "Navigating Lakshadweep permits, vessel schedules, and island accommodations requires deep local knowledge. As native islanders based in Agatti, Kavaratti & Kalpeni, we make your journey seamless from Kochi/ Goa to your final island footprint.",
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  heading: "Authentic Lakshadweep Hospitality by Native Islanders",
  description: "Lakshadweep Heritage Holidays is a premier, registered island travel agency in Lakshadweep. Founded with a vision to make this untouched Indian archipelago accessible, comfortable, and memorable for travelers. We understand that visiting Lakshadweep requires careful planning — from securing mandatory entry permits and coordinating vessel movements to selecting eco-friendly beach resorts. Our native team manages every detail behind the scenes, so you can simply step onto the white sands and relax.",
  image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=85",
};

export const DEFAULT_CONTACT_CONTENT: ContactContentData = {
  phone: "9037532124",
  whatsapp: "9037532124",
  email: "lakshadweepheritageholidays@gmail.com",
  address: "lakshadweep heritage holidays kavaratti island",
  businessHours: "Mon – Sat: 8:00 AM – 9:00 PM IST",
};

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I get an entry permit to visit Lakshadweep?",
    answer: "An entry permit issued by the Lakshadweep Administration is mandatory for all Indian tourists. Lakshadweep Heritage Holidays handles 100% of your permit process! You only need to submit your valid ID proof (Aadhaar/Passport) and Passport Size Photo. We process all government paperwork seamlessly.",
    display_order: 1,
    is_enabled: true,
  },
  {
    id: "faq-2",
    question: "What is the best time to visit Lakshadweep?",
    answer: "The ideal time is from September to May. During these months, the sea is calm, lagoons are turquoise blue with high underwater visibility, and temperature ranges comfortably between 22°C to 32°C. June to September is the monsoon season with Rough Sea and rainfall.",
    display_order: 2,
    is_enabled: true,
  },
  {
    id: "faq-3",
    question: "What is included in your travel packages?",
    answer: "Our all-inclusive packages cover: Lakshadweep Entry Permit approval & documentation · Airport pickup & inter-island high-speed boat transfers · AC Standard Beach Front Rooms / Beach resorts / cottages accommodation · Breakfast, Lunch & Dinner (Fresh sea food & vegetarian options) · Complimentary snorkelling, Glass bottomed boat ride & kayaking sessions · 24/7 Local island guide support.",
    display_order: 3,
    is_enabled: true,
  },
  {
    id: "faq-4",
    question: "Are water sports suitable for non-swimmers?",
    answer: "Yes! Activities like Glass-bottomed boat ride, kayaking, shallow lagoon snorkelling, and Discovery Scuba Diving are 100% safe for non-swimmers. Certified life jackets are mandatory and certified PADI divemasters accompany you individually in shallow waters.",
    display_order: 4,
    is_enabled: true,
  },
];

// Key Map
const KEY_MAP = {
  homepage: {
    heroHeading: "homepage_hero_heading",
    heroDescription: "homepage_hero_description",
    ctaText: "homepage_cta_text",
    aboutText: "homepage_about_text",
    whyChooseUs: "homepage_why_choose_us",
  },
  about: {
    heading: "about_heading",
    description: "about_description",
    image: "about_image",
  },
  contact: {
    phone: "contact_phone",
    whatsapp: "contact_whatsapp",
    email: "contact_email",
    address: "contact_address",
    businessHours: "contact_business_hours",
  },
};

/**
 * Fetch key-value site content map from Supabase with safe fallback to defaults
 */
export async function getSiteContentMap(): Promise<Record<string, string>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data || data.length === 0) {
      return {};
    }
    const map: Record<string, string> = {};
    for (const item of data) {
      if (item.key) map[item.key] = item.value ?? "";
    }
    return map;
  } catch (err) {
    console.warn("Failed to fetch site_content from Supabase, using fallback static data.", err);
    return {};
  }
}

/**
 * Get Homepage Content
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  const map = await getSiteContentMap();
  return {
    heroHeading: map[KEY_MAP.homepage.heroHeading] ?? DEFAULT_HOMEPAGE_CONTENT.heroHeading,
    heroDescription: map[KEY_MAP.homepage.heroDescription] ?? DEFAULT_HOMEPAGE_CONTENT.heroDescription,
    ctaText: map[KEY_MAP.homepage.ctaText] ?? DEFAULT_HOMEPAGE_CONTENT.ctaText,
    aboutText: map[KEY_MAP.homepage.aboutText] ?? DEFAULT_HOMEPAGE_CONTENT.aboutText,
    whyChooseUs: map[KEY_MAP.homepage.whyChooseUs] ?? DEFAULT_HOMEPAGE_CONTENT.whyChooseUs,
  };
}

/**
 * Get About Content
 */
export async function getAboutContent(): Promise<AboutContent> {
  const map = await getSiteContentMap();
  return {
    heading: map[KEY_MAP.about.heading] ?? DEFAULT_ABOUT_CONTENT.heading,
    description: map[KEY_MAP.about.description] ?? DEFAULT_ABOUT_CONTENT.description,
    image: map[KEY_MAP.about.image] ?? DEFAULT_ABOUT_CONTENT.image,
  };
}

/**
 * Get Contact Content
 */
export async function getContactContent(): Promise<ContactContentData> {
  const map = await getSiteContentMap();
  return {
    phone: map[KEY_MAP.contact.phone] ?? DEFAULT_CONTACT_CONTENT.phone,
    whatsapp: map[KEY_MAP.contact.whatsapp] ?? DEFAULT_CONTACT_CONTENT.whatsapp,
    email: map[KEY_MAP.contact.email] ?? DEFAULT_CONTACT_CONTENT.email,
    address: map[KEY_MAP.contact.address] ?? DEFAULT_CONTACT_CONTENT.address,
    businessHours: map[KEY_MAP.contact.businessHours] ?? DEFAULT_CONTACT_CONTENT.businessHours,
  };
}

/**
 * Save Homepage Content to Supabase
 */
export async function saveHomepageContent(content: HomepageContent): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const rows = [
      { key: KEY_MAP.homepage.heroHeading, value: content.heroHeading },
      { key: KEY_MAP.homepage.heroDescription, value: content.heroDescription },
      { key: KEY_MAP.homepage.ctaText, value: content.ctaText },
      { key: KEY_MAP.homepage.aboutText, value: content.aboutText },
      { key: KEY_MAP.homepage.whyChooseUs, value: content.whyChooseUs },
    ];
    const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: msg };
  }
}

/**
 * Save About Content to Supabase
 */
export async function saveAboutContent(content: AboutContent): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const rows = [
      { key: KEY_MAP.about.heading, value: content.heading },
      { key: KEY_MAP.about.description, value: content.description },
      { key: KEY_MAP.about.image, value: content.image },
    ];
    const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: msg };
  }
}

/**
 * Save Contact Content to Supabase
 */
export async function saveContactContent(content: ContactContentData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const rows = [
      { key: KEY_MAP.contact.phone, value: content.phone },
      { key: KEY_MAP.contact.whatsapp, value: content.whatsapp },
      { key: KEY_MAP.contact.email, value: content.email },
      { key: KEY_MAP.contact.address, value: content.address },
      { key: KEY_MAP.contact.businessHours, value: content.businessHours },
    ];
    const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: msg };
  }
}

/**
 * Fetch FAQs from Supabase (or fallback to static)
 */
export async function getFaqs(onlyEnabled = false): Promise<FAQItem[]> {
  try {
    const supabase = createClient();
    let query = supabase.from("faqs").select("*").order("display_order", { ascending: true });
    if (onlyEnabled) {
      query = query.eq("is_enabled", true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (onlyEnabled) {
        return DEFAULT_FAQS.filter((f) => f.is_enabled);
      }
      return DEFAULT_FAQS;
    }
    return data as FAQItem[];
  } catch (err) {
    console.warn("Failed to fetch faqs from Supabase, using fallback static data.", err);
    if (onlyEnabled) {
      return DEFAULT_FAQS.filter((f) => f.is_enabled);
    }
    return DEFAULT_FAQS;
  }
}

/**
 * Add a new FAQ
 */
export async function addFaq(question: string, answer: string): Promise<{ success: boolean; data?: FAQItem; error?: string }> {
  try {
    const existing = await getFaqs();
    const maxOrder = existing.reduce((max, f) => Math.max(max, f.display_order || 0), 0);

    const supabase = createClient();
    const payload = {
      question,
      answer,
      display_order: maxOrder + 1,
      is_enabled: true,
    };
    const { data, error } = await supabase.from("faqs").insert(payload).select().single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as FAQItem };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: msg };
  }
}

/**
 * Update an existing FAQ
 */
export async function updateFaq(id: string, updates: Partial<Pick<FAQItem, "question" | "answer" | "display_order" | "is_enabled">>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("faqs").update(updates).eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: msg };
  }
}

/**
 * Delete a FAQ
 */
export async function deleteFaq(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: msg };
  }
}

/**
 * Reorder FAQs (swap display_order)
 */
export async function reorderFaqs(faqsInNewOrder: FAQItem[]): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const updates = faqsInNewOrder.map((faq, index) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      is_enabled: faq.is_enabled,
      display_order: index + 1,
    }));
    const { error } = await supabase.from("faqs").upsert(updates, { onConflict: "id" });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: msg };
  }
}

/**
 * Seed default content into Supabase if empty or missing
 */
export async function seedDefaultContent(): Promise<{ success: boolean; error?: string }> {
  try {
    await saveHomepageContent(DEFAULT_HOMEPAGE_CONTENT);
    await saveAboutContent(DEFAULT_ABOUT_CONTENT);
    await saveContactContent(DEFAULT_CONTACT_CONTENT);

    const supabase = createClient();
    for (const faq of DEFAULT_FAQS) {
      const { id, ...rest } = faq;
      await supabase.from("faqs").upsert({ ...rest, id }, { onConflict: "id" });
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: msg };
  }
}
