"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSavedSession } from "@/utils/api";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [session, setSession] = useState<{ userId: string; role: "doctor" | "patient"; name: string } | null>(null);

  useEffect(() => {
    setSession(getSavedSession());
  }, []);

  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "How it works", href: "/how-it-works" },
  ];

  const authLinks = session
    ? [
        {
          name: "Dashboard",
          href: session.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard",
        },
      ]
    : [
        { name: "Sign in", href: "?auth=sign-in" },
        { name: "Sign up", href: "?auth=sign-up" },
      ];

  const navLinks = [...baseLinks, ...authLinks];

  // helper untuk menentukan link yg aktif
  const getActiveLink = () => {
    if (pathname === "/about") return "About us";
    if (pathname === "/how-it-works") return "How it works";
    if (pathname.includes("/dashboard")) return "Dashboard";
    return "Home";
  };

  const activeLink = getActiveLink();

  return (
    <div id="fixed-navbar-wrapper" className="fixed top-0 left-0 right-0 z-50 px-6 xl:px-0 py-6 flex flex-col items-center">
      <nav className="max-w-[1440px] w-full h-[80px] bg-primary rounded-full px-8 flex items-center justify-between shadow-xl shadow-primary/30 text-white relative z-50">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="rounded-full p-1.5 flex items-center justify-center">
            <Image
              src="/common/logo.png"
              alt="HeartVision Logo"
              height={40}
              width={40}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold text-lg md:text-2xl tracking-tight text-white">HeartVision</span>
        </Link>

        {/* desktop nav */}
        <div className="hidden lg:flex items-center gap-1 lg:gap-6 text-lg font-medium">
          {navLinks.map((link) => {
            const isActive = activeLink === link.name;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3 py-1.5 transition-all duration-200 cursor-pointer ${isActive ? "text-white font-bold" : "text-white/80 hover:text-white"
                  }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* mobile menu dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden mt-2 w-full max-w-[1440px] bg-primary rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white animate-in slide-in-from-top-5 duration-200">
          {navLinks.map((link) => {
            const isActive = activeLink === link.name;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10 text-white/80"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
