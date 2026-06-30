import Image from "next/image";
import { Card } from "@/components/ui/Card";

export default function OurCardiologist() {
  const doctors = [
    {
      name: "Dr. Heartly, Sp.JP",
      specialty: "Interventional Cardiologist",
      image: "/landing/dr_hearty.png",
    },
    {
      name: "Dr. Sarah Wijaya",
      specialty: "Cardiac Imaging Specialist",
      image: "/landing/dr_sarah.png",
    },
    {
      name: "Dr. Anton Susanto",
      specialty: "Pediatric Cardiology Consultant",
      image: "/landing/dr_anton.png",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-bgelem/20">
      <div className="max-w-[1440px] w-full mx-auto px-6 xl:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-texts tracking-tight">
            Our Cardiologist
          </h2>
          <p className="text-base md:text-xl text-textt mt-4 leading-relaxed font-medium">
            Our team of experienced and certified doctors is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doctor, i) => (
            <Card key={i} className="p-0 flex flex-col overflow-hidden bg-white">
              <div className="relative w-full aspect-[4/5] bg-bgelem/10">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 350px"
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-texts tracking-tight">
                  {doctor.name}
                </h3>
                <p className="text-base md:text-lg text-textt font-medium mt-1">
                  {doctor.specialty}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
