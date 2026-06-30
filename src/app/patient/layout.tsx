"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/layouts/DashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import { getSavedSession } from "@/utils/api";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Session verification & role protection
    const session = getSavedSession();
    if (!session || session.role !== "patient") {
      console.warn("Unauthorized access. Redirecting to home...");
      router.push("/?auth=sign-in");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!mounted || !authorized) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-texts">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-content flex">
      {/* Sidebar - fixed left */}
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-grow min-[854px]:pl-[250px] flex flex-col min-h-screen bg-content min-w-0">
        {/* AppBar header with Suspense boundary */}
        <Suspense fallback={<div className="h-20 bg-fbc border-b border-bgelem/40"></div>}>
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
        </Suspense>

        {/* Subpage Content */}
        <main className="flex-grow p-4 md:p-6 lg:p-10 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
