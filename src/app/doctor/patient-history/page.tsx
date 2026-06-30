"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getSavedSession } from "@/utils/api";

interface QueueItem {
  id: string;
  scanCode: string;
  date: string;
  findingsTitle: string;
  findingsDesc: string;
  patientName: string;
  status: "Pending" | "Verified";
  findingsColor: "rose" | "emerald" | "amber";
}

export default function PatientHistory() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<"All" | "Verified" | "Pending">("All");
  const [historyList, setHistoryList] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  useEffect(() => {
    const session = getSavedSession();
    if (!session || session.role !== "doctor") {
      router.push("/");
      return;
    }

    async function loadHistory() {
      setIsLoading(true);
      try {
        const res = await apiFetch("/verifications/history");
        if (res.success && res.data && Array.isArray(res.data.predictions)) {
          const mapped: QueueItem[] = res.data.predictions.map((item: any) => {
            const label = item.prediction_label || "Normal";
            const isCardiomegaly = label.toLowerCase().includes("cardiomegaly") || label.toLowerCase().includes("high") || label.toLowerCase().includes("attention");
            const isBorderline = label.toLowerCase().includes("borderline");

            let color: "rose" | "emerald" | "amber" = "emerald";
            let desc = "No significant abnormalities detected.";
            if (isCardiomegaly) {
              color = "rose";
              desc = "Possible Left Ventricular Hypertrophy";
            } else if (isBorderline) {
              color = "amber";
              desc = "Mild Cardiomegaly detected.";
            }

            return {
              id: item.id,
              scanCode: item.ref_code || item.scan_code || `REF-${item.id.substring(0, 5).toUpperCase()}-XC`,
              date: item.verified_at ? new Date(item.verified_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : (item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Recently"),
              findingsTitle: label,
              findingsDesc: desc,
              patientName: item.patient?.full_name || "Unknown Patient",
              status: item.status === "verified" ? "Verified" : "Pending",
              findingsColor: color
            };
          });
          setHistoryList(mapped);
        }
      } catch (err) {
        console.error("Failed to load doctor patient history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, [router]);

  const filteredHistory = historyList.filter((item) => {
    if (filterType === "All") return true;
    return item.status === filterType;
  });

  const totalEntries = filteredHistory.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col gap-6">
      {/* Title Block */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-texts tracking-tight">Examination history</h2>
        <p className="text-xs md:text-sm text-textt font-medium">
          Manage and review patient cardiac analysis results digitally.
        </p>
      </div>

      {/* Filter Badges row */}
      <div className="flex items-center gap-1 bg-[#EAF2FC] p-1 rounded-xl w-fit border border-[#D2E2F5]/30">
        {(["All", "Verified", "Pending"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${filterType === type
              ? "bg-white text-primary shadow-sm"
              : "text-texts hover:text-primary"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main Table Box */}
      <div className="bg-fbc border border-primary rounded-2xl shadow-sm overflow-hidden flex flex-col w-full min-w-0">
        <div className="overflow-x-auto w-full min-w-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EAF2FC] border-b border-[#D2E2F5]">
                <th className="px-6 py-4.5 text-xs font-bold text-primary uppercase tracking-wider">Date & ID</th>
                <th className="px-6 py-4.5 text-xs font-bold text-primary uppercase tracking-wider">AI Findings</th>
                <th className="px-6 py-4.5 text-xs font-bold text-primary uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4.5 text-xs font-bold text-primary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4.5 text-xs font-bold text-primary uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D2E2F5]/40">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs font-bold text-[#2170FD]">
                    <div className="flex flex-col items-center justify-center gap-3 py-4">
                      <div className="w-8 h-8 border-4 border-[#2170FD] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-semibold">Loading patient history...</span>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs font-bold text-textt">
                    No history logs found for status &quot;{filterType}&quot;.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Date & ID */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm text-texts">{item.date}</div>
                      <div className="text-[10px] text-textt font-medium mt-0.5">{item.scanCode}</div>
                    </td>

                    {/* AI Findings */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-texts">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${item.findingsColor === "rose" ? "bg-rose-500" :
                          item.findingsColor === "amber" ? "bg-amber-500" : "bg-emerald-500"
                          }`}></span>
                        {item.findingsTitle}
                      </div>
                      <div className="text-[10px] text-textt font-medium mt-0.5">{item.findingsDesc}</div>
                    </td>

                    {/* Patient */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                          {item.patientName.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-texts">{item.patientName}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-textt">
                        {item.status === "Verified" ? (
                          <>
                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-emerald-600">Verified</span>
                          </>
                        ) : (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0">
                               <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            </span>
                            <span>Pending</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          if (item.status === "Verified") {
                            router.push(`/doctor/queue/${item.id}/result`);
                          } else {
                            router.push(`/doctor/queue/${item.id}`);
                          }
                        }}
                        className="inline-flex items-center justify-center p-1.5 rounded hover:bg-primary/5 transition-all text-primary cursor-pointer"
                        title="Analyze details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & pagination */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#EAF2FC] border-t border-[#D2E2F5]">
          <span className="text-xs font-semibold text-textt">
            Showing {totalEntries > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, totalEntries)} of {totalEntries} results
          </span>
          <div className="flex items-center border border-bgelem/40 rounded-lg overflow-hidden bg-fbc">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 hover:bg-slate-100 border-r border-bgelem/40 text-textt disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 hover:bg-slate-100 text-textt disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

