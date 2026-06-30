"use client";

import { useState } from "react";
import Image from "next/image";

export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center mb-8">

      <div className=" flex items-center justify-center">
        <Image
          src="/common/logo-blue.png"
          alt="HeartVision Logo"
          height={70}
          width={70}
          className="object-contain"
          priority
        />
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-texts tracking-tight">{title}</h2>
      <p className="text-sm md:text-base text-texts mt-2 font-medium">{subtitle}</p>
    </div>
  );
}

export function InputField({ label, type, placeholder, value, onChange }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5 mb-4 w-full">
      <label className="text-xs md:text-sm font-semibold text-texts">{label}</label>
      <div className="relative w-full">
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full border border-bgelem/80 rounded-lg px-4 py-2.5 text-sm md:text-base text-texts focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-textt hover:text-primary transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 10.677a2 2 0 002.823 2.823M7.362 7.561C4.68 9.273 3 12 3 12c0 0 5.4 9 9 9 2.059 0 3.97-.639 5.545-1.724M17.94 17.94C19.743 16.536 21 14.52 21 12c0 0-5.4-9-9-9-1.22 0-2.395.23-3.48.64" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
