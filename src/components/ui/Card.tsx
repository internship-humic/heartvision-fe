import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export function Card({
  children,
  hoverable = true,
  className = "",
  ...props
}: CardProps) {
  const hasPadding = className.split(" ").some(
    (c) => c.startsWith("p-") || c.startsWith("px-") || c.startsWith("py-")
  );
  const paddingClass = hasPadding ? "" : "p-8";

  return (
    <div
      className={`bg-bgelem rounded-3xl border border-bgelem shadow-[0_10px_30px_rgba(33,112,253,0.04)] transition-all duration-300 ${hoverable ? "hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(33,112,253,0.08)]" : ""
        } ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
