import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExperiencesSection from "@/components/ExperiencesSection";

export default function ExperiencesPage() {
  return (
    <div
      className="min-h-screen flex flex-col pt-20 relative selection:bg-teal-600 selection:text-white"
      style={{
        backgroundImage: `url('/images/ocean_water_bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />
      <main className="flex-grow">
        <ExperiencesSection className="bg-transparent" />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
