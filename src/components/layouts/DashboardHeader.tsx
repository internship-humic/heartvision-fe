"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { getSavedSession, apiFetch, getMediaUrl, useSafeImageSrc } from "@/utils/api";

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const [userName, setUserName] = useState("John Doe");
  const [role, setRole] = useState("patient");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const safeAvatarSrc = useSafeImageSrc(avatarUrl || "/landing/female-doctor-hero-white.png");

  useEffect(() => {
    const session = getSavedSession();
    if (session) {
      setUserName(session.name);
      setRole(session.role);
    }

    const avatarKey = session ? `hv_avatar_${session.userId}` : "hv_avatar";

    // Load avatar from localStorage cache first
    const cachedAvatar = localStorage.getItem(avatarKey);
    if (cachedAvatar) {
      setAvatarUrl(cachedAvatar);
    } else {
      setAvatarUrl(null);
    }

    // Then fetch from API for freshest data
    async function loadAvatar() {
      try {
        const res = await apiFetch("/users/profile");
        if (res.success) {
          const photo = res.data?.user?.doctorProfile?.profile_photo;
          if (photo) {
            const url = getMediaUrl(photo);
            setAvatarUrl(url);
            localStorage.setItem(avatarKey, url);
          } else {
            setAvatarUrl(null);
            localStorage.removeItem(avatarKey);
          }
        }
      } catch {
        // Fallback to cache or default
      }
    }
    if (session?.role === "doctor") {
      loadAvatar();
    }

    // Listen for avatar updates from profile page
    const handleAvatarUpdate = () => {
      const updated = localStorage.getItem(avatarKey);
      setAvatarUrl(updated);
    };
    window.addEventListener("avatar-updated", handleAvatarUpdate);
    return () => window.removeEventListener("avatar-updated", handleAvatarUpdate);
  }, []);

  const isPatient = pathname.startsWith("/patient");

  const getPageTitle = () => {
    const patientId = params.patientId as string;
    if (patientId && pathname.includes("/doctor/queue/")) {
      return "Approval AI detection";
    }

    if (pathname.includes("/dashboard")) {
      return "Dashboard";
    }
    if (pathname.includes("/history")) {
      return "Result History";
    }
    if (pathname.includes("/queue")) {
      return "Verification Queue";
    }
    if (pathname.includes("/patient-history")) {
      return "Patient History";
    }
    if (pathname.includes("/profile")) {
      return "Profile";
    }
    if (pathname.includes("/doctors")) {
      return "Doctor List";
    }
    if (pathname.includes("/detection")) {
      return "Detection";
    }
    return "HeartVision";
  };

  return (
    <header className="h-16 bg-fbc border-b border-bgelem/40 flex items-center justify-between px-6 md:px-8 sticky top-0 z-20 w-full">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="min-[854px]:hidden p-2 text-texts hover:bg-slate-100 rounded-lg focus:outline-none cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Page Title */}
        <h2 className="text-xl font-bold text-texts tracking-tight">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={() => router.push(isPatient ? "/patient/profile" : "/doctor/profile")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer text-left focus:outline-none"
        >
          <div className="text-right">
            <div className="text-sm font-bold text-texts leading-none">{userName}</div>
            <div className="text-[11px] text-textt font-semibold mt-1.5">
              {role === "doctor" ? "Doctor" : "Patient"}
            </div>
          </div>

          {/* Avatar Circle */}
          {role === "doctor" ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-primary/5 flex items-center justify-center shrink-0">
              <Image
                key={safeAvatarSrc || "default-header-avatar"}
                src={safeAvatarSrc}
                alt="User Profile"
                fill
                unoptimized
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2170FD] font-bold text-base shrink-0">
              {userName.charAt(0)}
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
