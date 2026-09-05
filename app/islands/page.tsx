import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import IslandsSection from "@/components/IslandsSection";

export default function IslandsPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Header />
      <main className="flex-grow">
        <IslandsSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
