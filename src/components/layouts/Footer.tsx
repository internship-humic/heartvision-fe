import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-textp text-white pt-16 pb-12 mt-auto">
      <div className="max-w-[1132px] w-full mx-auto px-6 xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-white/10">
          <div className="md:col-span-5 flex flex-col items-start">
            <span className="font-bold text-xl tracking-tight mb-4 text-white">HeartVision</span>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              An integrated heart health care center with international standards for the Indonesian people.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://humic.telkomuniversity.ac.id/"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-all duration-300"
                aria-label="Website"
              >
                <Image
                  src="/landing/globe.png"
                  alt="note icon"
                  height={10}
                  width={10}
                  className="object-contain"
                  priority
                />

              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-all duration-300"
                aria-label="Share"
              >
                <Image
                  src="/landing/share.png"
                  alt="note icon"
                  height={10}
                  width={10}
                  className="object-contain"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />

              </a>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col items-start">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Service</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-white/60 hover:text-white transition-colors">
                  Heart X-Ray Scan
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-white transition-colors">
                  AI Detection
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-white transition-colors">
                  Doctor verification
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-white transition-colors">
                  Medical Report
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col items-start">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-white/60">
                <svg
                  className="w-4 h-4 text-white/80 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:humic@telkomuniversity.ac.id"
                  className="hover:text-white transition-colors"
                >
                  humic@telkomuniversity.ac.id
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <svg
                  className="w-4 h-4 text-white/80 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href="tel:+6281234567890" className="hover:text-white transition-colors">
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <svg
                  className="w-4 h-4 text-white/80 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <a href="https://maps.app.goo.gl/HS5Je2YGHy7Jj9mJA" className="hover:text-white transition-colors">Jl. Telekomunikasi, Terusan Buahbatu, Sukapura, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40257.</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} HeartVision. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
