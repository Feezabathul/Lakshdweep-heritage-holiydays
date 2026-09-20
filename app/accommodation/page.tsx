import Header from "@/components/Header";
import AccommodationSection from "@/components/AccommodationSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function AccommodationPage() {
  return (
    <div
      className="min-h-screen flex flex-col pt-20 font-sans selection:bg-teal-600 selection:text-white"
      style={{ backgroundColor: "#dcf6ed" }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Accommodation Section */}
        <AccommodationSection className="bg-transparent" />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
