"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { getSavedSession } from "@/utils/api";

export default function IndonesiaDetection() {
  const router = useRouter();

  const handleMoreInfo = () => {
    const session = getSavedSession();
    if (session) {
      if (session.role === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    } else {
      router.push("/?auth=sign-in");
    }
  };

  return (
    <section className="py-20 bg-bgelem/40 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 xl:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl lg:text-[56px] font-extrabold text-texts tracking-tight leading-[1.15]">
          Indonesia's Most Trusted Heart Detection Platform
        </h2>
        <p className="mt-8 md:mt-10 text-base sm:text-lg md:text-xl lg:text-[22px] text-texts/80 leading-relaxed font-medium">
          HeartVision is an innovative platform that combines artificial intelligence (AI) technology with
          the expertise of cardiologists to provide accurate, fast, and accessible early detection of
          heart disease. We are committed to helping Indonesians live healthier lives by providing access
          to cutting-edge healthcare technologies typically only available in large hospitals.
        </p>
        <div className="mt-10 flex justify-center">
          <Button variant="primary" size="lg" onClick={handleMoreInfo}>
            More Information
          </Button>
        </div>
      </div>
    </section>
  );
}
