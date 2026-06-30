"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import HeroCircles from "@/components/ui/HeroCircles";
import { useRouter } from "next/navigation";
import { getSavedSession } from "@/utils/api";

export default function Hero() {
  const router = useRouter();

  const handleStartAnalysis = () => {
    const session = getSavedSession();
    if (session) {
      if (session.role === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/patient/detection");
      }
    } else {
      router.push("/?auth=sign-in");
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 pb-16 md:pb-0 bg-bgelem">
      <div className="max-w-[1440px] w-full mx-auto px-6 xl:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-12 items-stretch min-h-[auto] md:min-h-[500px] lg:min-h-[800px]">

          {/* Kolom kiri: text + stats */}
          <div className="md:col-span-7 lg:col-span-6 flex flex-col justify-between items-start text-left z-20 pt-10 md:pt-16 lg:pt-30 pb-0">

            {/* Text + CTA */}
            <div className="pb-16">
              <h1 className="text-4xl sm:text-5xl md:text-[44px] lg:text-[72px] xl:text-[84px] font-extrabold text-[#000000] tracking-tight leading-[1.1] md:leading-[1.15]">
                Early Detection of <br />
                Heart Disease with AI
              </h1>
              <p className="mt-6 lg:mt-8 text-base sm:text-lg md:text-[18px] lg:text-[22px] xl:text-[24px] text-textt leading-relaxed max-w-2xl font-medium">
                Advanced artificial intelligence technology accurately and quickly analyzes your heart X-ray
                results, verified directly by trusted specialists and experts. Protect your heart health
                starting today.
              </p>
              <Button variant="primary" size="lg" className="mt-8" onClick={handleStartAnalysis}>
                Start Analysis
              </Button>
            </div>

            {/* Stats card — selalu horizontal 3 kolom 1 baris dengan ukuran font responsif */}
            <div className="relative mt-12 md:mt-auto bg-white flex flex-row items-center justify-between gap-1 sm:gap-4 md:gap-5 lg:gap-10 w-full rounded-3xl p-4 sm:p-6 md:rounded-none md:w-[calc(100%+50vw)] md:-ml-[50vw] md:pl-[50vw] md:pr-8 md:py-10 z-20 shadow-xl md:shadow-none">
              <div className="hidden md:block absolute top-0 right-0 h-full w-[50px] lg:w-[90px] translate-x-full pointer-events-none select-none text-white fill-current">
                <svg viewBox="0 0 137 181" className="w-full h-full" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M98.4749 129.113C101.423 173.157 149.776 175.57 98.4749 181C44.0887 181 0 140.482 0 90.5C0 40.5182 44.0887 0 98.4749 0C185.156 4.22333 98.4749 79.1316 98.4749 129.113Z" fill="white" />
                  <rect width="97.8852" height="181" fill="white" />
                </svg>
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0 z-10">
                <div className="text-base min-[360px]:text-lg min-[390px]:text-xl sm:text-3xl md:text-[30px] lg:text-[40px] font-extrabold text-black leading-none mb-1 sm:mb-2">98%</div>
                <div className="text-[7.5px] min-[360px]:text-[8.5px] min-[390px]:text-[10px] sm:text-sm md:text-[14px] lg:text-[20px] text-black font-medium whitespace-normal sm:whitespace-nowrap leading-tight">Success Rate</div>
              </div>

              <div className="w-px h-8 sm:h-16 md:h-20 bg-gray-300 z-10 shrink-0" />

              <div className="flex-1 text-center sm:text-left min-w-0 z-10">
                <div className="text-base min-[360px]:text-lg min-[390px]:text-xl sm:text-3xl md:text-[30px] lg:text-[40px] font-extrabold text-black leading-none mb-1 sm:mb-2">10k+</div>
                <div className="text-[7.5px] min-[360px]:text-[8.5px] min-[390px]:text-[10px] sm:text-sm md:text-[14px] lg:text-[20px] text-black font-medium whitespace-normal sm:whitespace-nowrap leading-tight">Patients Treated</div>
              </div>

              <div className="w-px h-8 sm:h-16 md:h-20 bg-gray-300 z-10 shrink-0" />

              <div className="flex-1 text-center sm:text-left min-w-0 z-10">
                <div className="text-base min-[360px]:text-lg min-[390px]:text-xl sm:text-3xl md:text-[30px] lg:text-[40px] font-extrabold text-black leading-none mb-1 sm:mb-2">50+</div>
                <div className="text-[7.5px] min-[360px]:text-[8.5px] min-[390px]:text-[10px] sm:text-sm md:text-[14px] lg:text-[20px] text-black font-medium whitespace-normal sm:whitespace-nowrap leading-tight">Specialists</div>
              </div>
            </div>
          </div>

          {/* Kolom kanan: gambar dokter (sembunyi di mobile/phone, tampil di tablet/md+ di kanan dengan padding kiri) */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-6 relative items-end justify-end self-end w-full h-[500px] md:h-full min-h-[400px] lg:min-h-[750px] z-10 mt-0 md:pl-6 lg:pl-0">
            <HeroCircles />

            <div className="relative w-full h-full max-w-[500px] md:max-w-none lg:max-w-[800px] z-10 select-none pointer-events-none ml-auto mr-0">
              <Image
                src="/landing/female-doctor-hero-white.png"
                alt="Female Doctor Smiling"
                fill
                unoptimized
                className="object-contain object-bottom md:object-right-bottom"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}
