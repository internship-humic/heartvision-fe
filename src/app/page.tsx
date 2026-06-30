import Navbar from "@/components/layouts/Navbar";
import Hero from "@/components/sections/Hero";
import WhyChoose from "@/components/sections/WhyChoose";
import IndonesiaDetection from "@/components/sections/IndonesiaDetection";
import InspectionProcess from "@/components/sections/InspectionProcess";
import OurCardiologist from "@/components/sections/OurCardiologist";
import Footer from "@/components/layouts/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow ">
        <Hero />
        <WhyChoose />
        <IndonesiaDetection />
        <InspectionProcess />
        <OurCardiologist />
      </main>
      <Footer />
    </div>
  );
}
