import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PackagesSection from "@/components/PackagesSection";

export default function PackagesPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Header />
      <main className="flex-grow">
        <PackagesSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
