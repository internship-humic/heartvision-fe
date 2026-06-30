"use client";

import React, { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  bgClass?: string;
}

export default function InfoCard({
  title,
  icon,
  children,
  className = "",
  bgClass = "bg-[#EAF2FC]"
}: InfoCardProps) {
  return (
    <div
      className={`border border-[#DEE8FF] rounded-[24px] border-l-[6px] border-l-[#2170FD] p-6 shadow-sm flex gap-4 ${bgClass} ${className}`}
    >
      {icon && (
        <div className="text-[#2170FD] shrink-0 mt-0.5">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-black text-[#111C2D] flex items-center gap-2">8
          {title}
        </h3>
        <div className="text-xs font-semibold text-[#4B5563] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
