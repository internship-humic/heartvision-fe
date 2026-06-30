import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Card } from "@/components/ui/Card";
import { inspectionSteps, StepIcon } from "@/components/sections/inspectionStepsData";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Navbar />

      <main className="flex-grow flex flex-col">
        <section className="w-full bg-bgelem py-40 relative overflow-hidden flex-grow">
          {/* Decorative blurred circles */}
          <div className="absolute top-[5%] right-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px] opacity-60 pointer-events-none" />
          <div className="absolute top-[45%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px] opacity-50 pointer-events-none" />
          <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px] opacity-60 pointer-events-none" />

          <div className="max-w-[1440px] w-full mx-auto px-6 xl:px-8 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-extrabold text-texts tracking-tight">
                Inspection Process
              </h1>
              <p className="text-base md:text-lg text-textt mt-4 font-semibold">
                Simple, fast, and accurate heart disease detection in 5 easy steps
              </p>
            </div>

            <div className="flex flex-col gap-6 md:gap-10">
              {inspectionSteps.map((step) => {
                const isLeft = step.align === "left";
                return (
                  <Card
                    key={step.id}
                    className={`flex flex-col ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-6 md:gap-8 items-center md:items-start p-6 md:p-8 bg-white border border-bgelem/40 shadow-xl ${isLeft ? "border-l-[8px] border-l-primary mr-auto" : "border-r-[8px] border-r-primary ml-auto"} w-full max-w-[1024px]`}
                    hoverable
                  >
                    {/* Icon Block */}
                    <div className="relative shrink-0 mt-2 md:mt-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <StepIcon step={step} />
                      </div>
                      <div
                        className={`absolute -top-3 ${isLeft ? "-right-3" : "-left-3"} w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center text-primary font-bold text-sm md:text-base shadow-sm`}
                      >
                        {step.id}
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className={`flex flex-col ${isLeft ? "text-left" : "text-left md:text-right"} w-full`}>
                      <h2 className="text-2xl font-bold text-texts mb-3 tracking-tight">
                        {step.title}
                      </h2>
                      <p className="text-base text-textt leading-relaxed font-medium">
                        {step.description}
                      </p>
                      <div className={`flex flex-wrap gap-2 mt-5 ${isLeft ? "justify-start" : "justify-start md:justify-end"}`}>
                        {step.badges.map((badge) => (
                          <span
                            key={badge}
                            className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
