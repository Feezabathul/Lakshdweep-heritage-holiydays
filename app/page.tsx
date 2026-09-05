import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PackagesSection from "@/components/PackagesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ExperiencesSection from "@/components/ExperiencesSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import { ContactContent } from "./contact/page";


import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-sky-50 font-sans selection:bg-sky-600 selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Section 2 & 3: Hero + Floating Trip Planner */}
        <Hero />

        <div className="h-8 bg-gradient-to-b from-white via-sky-50 to-sky-100 border-t border-b border-sky-100/80" />

        {/* Section 6: Popular Packages */}
        <PackagesSection />

        {/* Section 7: Why Choose Us */}
        <WhyChooseUs />

        {/* Section 8: Experiences Section */}
        <ExperiencesSection />

        {/* Section 9: About Section */}
        <AboutSection />

        {/* Section 10: Frequently Asked Questions */}
        <FAQSection />

        {/* Section 11: Package Enquiry */}
        <ContactContent />

      </main>

      {/* Section 12: Footer */}
      <Footer />

      {/* Section 13: Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
