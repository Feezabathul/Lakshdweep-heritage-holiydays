import Header from "@/components/Header";
import AccommodationSection from "@/components/AccommodationSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function AccommodationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sky-50 font-sans selection:bg-sky-600 selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Accommodation Section */}
        <AccommodationSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
