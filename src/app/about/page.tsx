import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* Section 1: About, Stats, and Vision-Mission */}
        <section className="w-full bg-bgelem py-40 relative overflow-hidden">
          <div className="max-w-[1440px] w-full mx-auto px-6 xl:px-8 relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-extrabold text-texts tracking-tight leading-tight">
                About HeartVision
              </h1>
              <p className="text-base md:text-lg text-textt mt-6 max-w-3xl mx-auto leading-relaxed font-semibold">
                We are an innovative platform that combines AI technology with medical
                expertise to provide accurate and reliable early detection of heart disease.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="flex flex-col items-center text-center p-8 bg-white border border-bgelem/40 shadow-sm" hoverable={true}>
                <div className="text-[40px] font-extrabold text-primary leading-none mb-3">98%</div>
                <h3 className="text-lg font-bold text-texts tracking-tight">Detection Accuracy</h3>
                <p className="text-sm text-textt mt-2 leading-relaxed font-medium">
                  Validated by thousands of medical cases
                </p>
              </Card>

              <Card className="flex flex-col items-center text-center p-8 bg-white border border-bgelem/40 shadow-sm" hoverable={true}>
                <div className="text-[40px] font-extrabold text-primary leading-none mb-3">50+</div>
                <h3 className="text-lg font-bold text-texts tracking-tight">Expert Cardiologists</h3>
                <p className="text-sm text-textt mt-2 leading-relaxed font-medium">
                  Board-certified specialists
                </p>
              </Card>

              <Card className="flex flex-col items-center text-center p-8 bg-white border border-bgelem/40 shadow-sm" hoverable={true}>
                <div className="text-[40px] font-extrabold text-primary leading-none mb-3">10K+</div>
                <h3 className="text-lg font-bold text-texts tracking-tight">Patients Served</h3>
                <p className="text-sm text-textt mt-2 leading-relaxed font-medium">
                  Trusted by communities nationwide
                </p>
              </Card>
            </div>

            {/* Vision & Mission Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-8 bg-white border border-bgelem/40 shadow-sm flex flex-col justify-start" hoverable={true}>
                <h3 className="text-2xl font-bold text-texts mb-4 tracking-tight">Our Vision</h3>
                <p className="text-base text-textt leading-relaxed font-medium">
                  To become the leading AI-based early heart disease detection platform in Indonesia,
                  helping millions of people live healthier and better quality lives through accessible
                  and trusted technology.
                </p>
              </Card>

              <Card className="p-8 bg-white border border-bgelem/40 shadow-sm flex flex-col justify-start" hoverable={true}>
                <h3 className="text-2xl font-bold text-texts mb-6 tracking-tight">Our Mission</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-base text-textt font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm shadow-primary/30">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span>Provide easy access to heart disease detection technology for all</span>
                  </li>
                  <li className="flex items-start gap-3 text-base text-textt font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm shadow-primary/30">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span>Raise public awareness about the importance of early detection</span>
                  </li>
                  <li className="flex items-start gap-3 text-base text-textt font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm shadow-primary/30">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span>Connect patients with the best cardiologists</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 2: Our Core Values */}
        <section className="w-full bg-white py-16 md:py-24 relative overflow-hidden border-y border-bgelem/40">
          <div className="max-w-[1440px] w-full mx-auto px-6 xl:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-texts tracking-tight">Our Core Values</h2>
              <p className="text-base text-textt mt-3 font-semibold">Principles that guide everything we do</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="flex flex-col items-center text-center p-8 border border-bgelem/40 shadow-sm" hoverable={true}>
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-bgelem/40 text-primary">
                  <Image
                    src="/landing/about-us/accuracy.png"
                    alt="note icon"
                    height={28}
                    width={28}
                    className="object-contain"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <h3 className="text-xl font-bold text-texts tracking-tight">Accuracy</h3>
                <p className="text-sm text-textt mt-3 leading-relaxed font-medium">
                  We are committed to delivering accurate analysis results with cutting-edge AI technology
                </p>
              </Card>

              <Card className="flex flex-col items-center text-center p-8 border border-bgelem/40 shadow-sm" hoverable={true}>
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-bgelem/40 text-primary">
                  <Image
                    src="/landing/about-us/shield.png"
                    alt="note icon"
                    height={20}
                    width={20}
                    className="object-contain"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <h3 className="text-xl font-bold text-texts tracking-tight">Trust</h3>
                <p className="text-sm text-textt mt-3 leading-relaxed font-medium">
                  Patient privacy and data security are our top priorities
                </p>
              </Card>

              <Card className="flex flex-col items-center text-center p-8 bg-[#f7faff] border border-bgelem/40 shadow-sm" hoverable={true}>
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-bgelem/40 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-texts tracking-tight">Innovation</h3>
                <p className="text-sm text-textt mt-3 leading-relaxed font-medium">
                  Continuously innovating to provide better healthcare solutions
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 3: Our Story */}
        <section className="w-full bg-bgelem py-16 md:py-24 relative overflow-hidden">
          {/* Two blurred circles at top-right and bottom-left of the entire screen width */}
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-primary rounded-full blur-[100px] opacity-70 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary rounded-full blur-[100px] opacity-70 pointer-events-none" />

          <div className="max-w-[1440px] w-full mx-auto px-6 xl:px-8 relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-texts tracking-tight text-center mb-12">
              Our Story
            </h2>

            <Card className="max-w-[840px] w-full mx-auto p-8 md:p-12 bg-white border border-bgelem/40 shadow-xl" hoverable={false}>
              <div className="space-y-6 text-base text-textt leading-relaxed font-medium">
                <p>
                  HeartVision was founded by a group of medical professionals and technology experts
                  who share the same vision: to make heart disease detection more accessible to the general public.
                </p>
                <p>
                  Starting from personal experiences of seeing many cases of heart disease detected too
                  late, we developed this platform to provide a fast, accurate, and affordable solution.
                </p>
                <p>
                  By combining the latest artificial intelligence with the expertise of cardiologists,
                  we continue to innovate to provide better healthcare services for all.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 4: Our Developer */}
        <section className="w-full bg-white py-16 md:py-24 relative overflow-hidden border-t border-bgelem/20">
          <div className="max-w-[1440px] w-full mx-auto px-6 xl:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-texts tracking-tight">
                Our Developer
              </h2>
              <p className="text-sm text-textt mt-2 font-semibold">
                The people behind HeartVision
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Fadhli */}
              <Card className="flex flex-col items-center text-center p-8 bg-[#f7faff] border border-bgelem/40 shadow-sm" hoverable={true}>
                <div className="relative w-28 h-28 mb-6 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src="/landing/about-us/Fe-dev.jpg"
                    alt="Fadhli Muhammad Dzaki"
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <h3 className="text-xl font-bold text-texts tracking-tight">Fadhli Muhammad Dzaki</h3>
                <p className="text-sm font-bold text-primary mt-1">Frontend Developer</p>
                <p className="text-sm text-textt mt-4 leading-relaxed font-medium min-h-[72px]">
                  Transforms designs into responsive and interactive user interfaces for a seamless user experience.
                </p>
                <div className="flex gap-4 mt-6 justify-center">
                  <a href="https://www.linkedin.com/in/fadhli-muhammad-dzaki/" className="text-texts hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                  <a href="https://github.com/Fadhli12-zak" className="text-texts hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                  <a href="fadhlimudzak@gmail.com" className="text-texts hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </a>
                </div>
              </Card>

              {/* Card 2: Roji */}
              <Card className="flex flex-col items-center text-center p-8 bg-[#f7faff] border border-bgelem/40 shadow-sm" hoverable={true}>
                <div className="relative w-28 h-28 mb-6 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src="/landing/about-us/Be-dev.jpg"
                    alt="Roji Ihsan Azmi"
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <h3 className="text-xl font-bold text-texts tracking-tight">Roji Ihsan Azmi</h3>
                <p className="text-sm font-bold text-primary mt-1">Backend Developer</p>
                <p className="text-sm text-textt mt-4 leading-relaxed font-medium min-h-[72px]">
                  Develops secure and scalable server-side systems to power the application.
                </p>
                <div className="flex gap-4 mt-6 justify-center">
                  <a href="https://www.linkedin.com/in/roji-ihsan-azmi/" className="text-texts hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                  <a href="https://github.com/rojisanmi" className="text-texts hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                  <a href="rojiihsan21@gmail.com" className="text-texts hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </a>
                </div>
              </Card>

              {/* Card 3: Intan */}
              <Card className="flex flex-col items-center text-center p-8 bg-[#f7faff] border border-bgelem/40 shadow-sm" hoverable={true}>
                <div className="relative w-28 h-28 mb-6 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src="/landing/about-us/UIUX.jpg"
                    alt="Intan Nur Aini"
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <h3 className="text-xl font-bold text-texts tracking-tight">Intan Nur Aini</h3>
                <p className="text-sm font-bold text-primary mt-1">UI/UX Designer</p>
                <p className="text-sm text-textt mt-4 leading-relaxed font-medium min-h-[72px]">
                  Designing intuitive and accessible experiences that empower users to manage their health.
                </p>
                <div className="flex gap-4 mt-6 justify-center">
                  <a href="https://www.linkedin.com/in/intan-nuraini-3789472a1/" className="text-texts hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                  <a href="https://github.com/IntanNurAini1" className="text-texts hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                  <a href="intan.nuraini2005@gmail.com" className="text-texts hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
