import Image from "next/image";
export default function InspectionProcess() {
  const steps = [
    {
      title: "Upload X-Ray",
      description: "Upload a photo of your X-Ray results",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      ),
    },
    {
      title: "Choose Doctor",
      description: "Choose a specialist doctor",
      icon: (
        <Image
          src="/landing/how-it-works/choosedoctor.png"
          alt="verified icon"
          height={26}
          width={26}
          className="object-contain"
        />
      ),
    },
    {
      title: "Give a Note",
      description: "Add symptom notes",
      icon: (
        <Image
          src="/landing/how-it-works/note.png"
          alt="note icon"
          height={26}
          width={26}
          className="object-contain"
        />
      ),
    },
    {
      title: "AI Detection",
      description: "AI analyzes images",
      icon: (
        <Image
          src="/landing/how-it-works/brain.png"
          alt="brain icon"
          height={26}
          width={26}
          className="object-contain"
        />
      ),
    },
    {
      title: "Final Result",
      description: "Receive verified results",
      icon: (
        <Image
          src="/landing/how-it-works/verified.png"
          alt="verified icon"
          height={26}
          width={26}
          className="object-contain"
        />
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-slate-50">
      <div className="max-w-[1440px] w-full mx-auto px-6 xl:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-texts tracking-tight">
            Inspection Process
          </h2>
          <p className="text-base md:text-xl text-textt mt-4 leading-relaxed font-medium">
            Easy and fast in 5 simple steps
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-12 sm:[&>*]:w-[calc(50%-1rem)] md:grid md:grid-cols-5 md:[&>*]:w-auto">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group w-full sm:w-auto">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-5 shadow-lg shadow-blue-500/10 transition-transform duration-300 group-hover:scale-110">
                {step.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-texts tracking-tight">{step.title}</h3>
              <p className="text-sm md:text-base text-textt mt-2 leading-relaxed font-medium max-w-[200px] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
