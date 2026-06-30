import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import AuthModal from "@/components/auth/AuthModal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HeartVision - Early Detection of Heart Disease with AI",
  description:
    "Advanced artificial intelligence technology accurately and quickly analyzes your heart X-ray results, verified directly by trusted specialists and experts.",
  keywords: ["HeartVision", "AI Heart Detection", "Cardiology AI", "Heart X-Ray Analysis", "Health Tech Indonesia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-full flex flex-col bg-background text-foreground`}>
        {children}
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
      </body>
    </html>
  );
}
