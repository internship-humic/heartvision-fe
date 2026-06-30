"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSavedSession, apiFetch, getMediaUrl, useSafeImageSrc } from "@/utils/api";

function DoctorAvatar({ src, alt }: { src: string; alt: string }) {
  const safeSrc = useSafeImageSrc(src, "/landing/female-doctor-hero-white.png");
  return <img src={safeSrc} alt={alt} className="w-full h-full object-cover object-top" />;
}

interface ScanData {
  id: string;
  scanId: string;
  uploadDate: string;
  aiPrediction: string;
  ctrRatio: string;
  heartSize: string;
  status: "Pending" | "Verified";
  doctorName: string;
  doctorAvatar: string;
  xrayPreview: string;
  symptoms?: string;
}

type FilterTab = "All" | "Verified" | "Pending";

export default function ResultHistory() {
  const router = useRouter();
  const [scans, setScans] = useState<ScanData[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 7;

  useEffect(() => {
    const session = getSavedSession();
    if (!session || session.role !== "patient") {
      router.push("/");
      return;
    }

    async function fetchHistory() {
      try {
        const res = await apiFetch("/predictions");
        if (res.success && res.data && Array.isArray(res.data.predictions)) {
          const mappedScans = res.data.predictions.map((item: any) => ({
            id: item.id,
            scanId: item.ref_code || item.scan_code || "REF-XC",
            uploadDate: item.createdAt || item.created_at,
            aiPrediction: item.prediction_label,
            ctrRatio: item.ctr_ratio != null ? String(item.ctr_ratio) : "0.50",
            heartSize: item.heart_size || "Normal",
            status: item.status === "verified" ? "Verified" : "Pending",
            doctorName: item.doctor?.full_name || "Assigned Specialist",
            doctorAvatar: getMediaUrl(item.doctor?.doctorProfile?.profile_photo) || "/landing/female-doctor-hero-white.png",
            xrayPreview: getMediaUrl(item.image_path) || "/common/xray-base.png",
          }));
          setScans(mappedScans);
        }
      } catch (err) {
        console.error("Failed to fetch scan history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, [router]);

  // Filter by tab
  const filteredScans = scans.filter(scan => {
    if (activeTab === "All") return true;
    return scan.status === activeTab;
  });

  // Pagination
  const totalEntries = filteredScans.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredScans.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (isoString: string) => {
    try {
      if (!isoString) return { date: "Baru saja", time: "" };
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return { date: "Baru saja", time: "" };

      const day = String(date.getDate()).padStart(2, '0');
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return { date: `${day} ${month} ${year}`, time: `${hours}:${minutes} WIB` };
    } catch {
      return { date: "-", time: "-" };
    }
  };

  // Get badge color for AI findings
  const getFindingsBadge = (prediction: string) => {
    const lower = prediction.toLowerCase();
    if (lower.includes("cardiomegaly") || lower.includes("high")) {
      return { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", label: "Cardiomegaly" };
    }
    if (lower.includes("normal") || lower.includes("healthy")) {
      return { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]", label: "Normal" };
    }
    if (lower.includes("borderline")) {
      return { bg: "bg-[#E0E7FF]", text: "text-[#4F46E5]", label: "Borderline" };
    }
    return { bg: "bg-[#F3F4F6]", text: "text-[#6B7280]", label: prediction };
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Title & Subtitle - directly on the main container bg */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-[#111C2D]">Examination history</h2>
        <p className="text-sm text-[#64748B] font-normal">View and manage your cardiac X-ray analysis results.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-[#EAF2FC] p-1 rounded-xl w-fit border border-[#D2E2F5]/30">
        {(["All", "Verified", "Pending"] as const).map((type) => (
          <button
            key={type}
            onClick={() => {
              setActiveTab(type);
              setCurrentPage(1);
            }}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === type
                ? "bg-white text-primary shadow-sm"
                : "text-texts hover:text-primary"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Table view with horizontal scroll on small screens */}
      <div className="w-full border border-primary rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead>
              <tr className="bg-[#EAF2FC] text-[#64748B] text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Scan ID</th>
                <th className="px-6 py-3.5">AI Findings</th>
                <th className="px-6 py-3.5">Specialist</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#64748B] text-sm">
                    <div className="flex flex-col items-center justify-center gap-3 py-4">
                      <div className="w-8 h-8 border-4 border-[#2170FD] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-semibold text-[#2170FD]">Loading your scan history...</span>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748B] text-sm">
                    No examination history found.
                  </td>
                </tr>
              ) : (
                currentItems.map((scan, idx) => {
                  const { date, time } = formatDate(scan.uploadDate);
                  const badge = getFindingsBadge(scan.aiPrediction);
                  const isVerified = scan.status === "Verified";

                  return (
                    <tr
                      key={scan.id}
                      className={`border-t border-[#EFF6FF] hover:bg-[#F8FAFC] transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-[#111C2D]">{date}</span>
                          <span className="text-xs text-[#94A3B8]">{time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#2170FD]">#{scan.scanId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 shrink-0">
                            <DoctorAvatar src={scan.doctorAvatar} alt={scan.doctorName} />
                          </div>
                          <span className="text-sm text-[#111C2D] font-medium">{scan.doctorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {isVerified ? (
                            <>
                              <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-semibold text-[#10B981]">Verified</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-medium text-[#64748B]">Pending</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/patient/detection?id=${scan.id}`)}
                          className="text-[#2170FD] hover:text-blue-700 transition-colors cursor-pointer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#EAF2FC] border-t border-primary">
          <span className="text-sm text-[#64748B]">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalEntries)} of {totalEntries} results
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-white disabled:opacity-40 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-white disabled:opacity-40 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
