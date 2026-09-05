import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExperiencesSection from "@/components/ExperiencesSection";

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20 bg-slate-900 text-white">
      <Header />
      <main className="flex-grow">
        <ExperiencesSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
