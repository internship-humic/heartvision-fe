import { Card } from "@/components/ui/Card";

export default function WhyChoose() {
  const cards = [
    {
      title: "Accurate & Reliable",
      description:
        "AI technology with 98% accuracy that has been validated by thousands of medical cases.",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Fast & Efficient",
      description: "Analysis results in minutes, no need to wait for days.",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Supported by Expert Doctors",
      description: "Each AI result is verified by an experienced cardiologist.",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-[1440px] w-full mx-auto px-6 xl:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-texts tracking-tight">
            Why choose HeartVision?
          </h2>
          <p className="text-base md:text-xl text-textt mt-4 md:mt-6 leading-relaxed font-semibold">
            We present the best solution for early detection of heart disease with the latest AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <Card key={i} className="flex flex-col items-center text-center p-8 bg-white border border-bgelem/40 shadow-sm">
              <div className="w-14 h-14 bg-bgelem/30 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-bgelem/40">
                {card.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-texts tracking-tight">{card.title}</h3>
              <p className="text-base md:text-lg text-textt mt-3 md:mt-4 leading-relaxed font-medium">{card.description}</p>

            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
