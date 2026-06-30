"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("./LoginForm"), {
  loading: () => <div className="text-center py-4 text-sm font-medium text-textt">Loading form...</div>,
});
const RegisterForm = dynamic(() => import("./RegisterForm"), {
  loading: () => <div className="text-center py-4 text-sm font-medium text-textt">Loading form...</div>,
});
const RegisterDoctorForm = dynamic(() => import("./RegisterDoctorForm"), {
  loading: () => <div className="text-center py-4 text-sm font-medium text-textt">Loading form...</div>,
});

export default function AuthModal() {
  const searchParams = useSearchParams();
  const authType = searchParams.get("auth");

  useEffect(() => {
    const navbar = document.getElementById("fixed-navbar-wrapper");
    if (authType) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
      if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "unset";
      if (navbar) navbar.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "unset";
      if (navbar) navbar.style.paddingRight = "0px";
    };
  }, [authType]);

  const handleClose = useCallback(() => {
    // Remove ?auth= from URL and fire popstate so Next.js re-reads the URL
    const url = new URL(window.location.href);
    url.searchParams.delete("auth");
    const cleanUrl = url.pathname + url.search;
    window.history.pushState({ ...window.history.state }, "", cleanUrl);
    window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
  }, []);

  if (!authType) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 transition-all"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[480px] flex justify-center animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white w-full rounded-[24px] shadow-2xl relative border border-bgelem/40 max-h-[90vh] overflow-hidden flex flex-col">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-texts hover:text-primary transition-colors z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {authType === "sign-in" && <LoginForm />}
            {authType === "sign-up" && <RegisterForm />}
            {authType === "sign-up-doctor" && <RegisterDoctorForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
