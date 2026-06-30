"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSavedSession, apiFetch, getMediaUrl, useSafeImageSrc } from "@/utils/api";
import Link from "next/link";

function XrayImage({ src, alt }: { src: string; alt: string }) {
  const safeSrc = useSafeImageSrc(src, "/common/xray-base.png");
  return <Image src={safeSrc} alt={alt} fill className="object-contain p-1" />;
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
  xrayPreview: string;
  symptoms?: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Patient");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [totalScans, setTotalScans] = useState(0);
  const [verifiedScans, setVerifiedScans] = useState(0);
  const [pendingScans, setPendingScans] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [latestResults, setLatestResults] = useState<any[]>([]);

  useEffect(() => {
    const session = getSavedSession();
    if (!session || session.role !== "patient") {
      router.push("/");
      return;
    }
    setUserName(session.name);
    setUserId(session.userId);

    async function fetchDashboard() {
      try {
        const res = await apiFetch("/dashboard/patient");
        if (res.success && res.data && res.data.dashboard) {
          const d = res.data.dashboard;
          setTotalScans(d.totalScans || 0);
          setVerifiedScans(d.verifiedResults || 0);
          setPendingScans(d.pendingVerification || 0);
          
          if (d.currentAnalysis) {
            setCurrentAnalysis({
              id: d.currentAnalysis.id,
              scanId: d.currentAnalysis.ref_code || d.currentAnalysis.scan_code || "REF-XC",
              uploadDate: d.currentAnalysis.createdAt || d.currentAnalysis.created_at,
              aiPrediction: d.currentAnalysis.prediction_label,
              ctrRatio: d.currentAnalysis.ctr_ratio != null ? String(d.currentAnalysis.ctr_ratio) : "0.50",
              heartSize: d.currentAnalysis.heart_size || "Normal",
              status: "Pending",
              doctorName: d.currentAnalysis.doctor?.full_name || "Assigned Specialist",
              xrayPreview: getMediaUrl(d.currentAnalysis.image_path) || "/common/xray-base.png"
            });
          } else {
            setCurrentAnalysis(null);
          }
          
          if (Array.isArray(d.latestResults)) {
            setLatestResults(d.latestResults.map((item: any) => ({
              id: item.id,
              scanId: item.ref_code || item.scan_code || "REF-XC",
              uploadDate: item.createdAt || item.created_at,
              aiPrediction: item.prediction_label,
              ctrRatio: item.ctr_ratio != null ? String(item.ctr_ratio) : "0.50",
              heartSize: item.heart_size || "Normal",
              status: "Verified",
              doctorName: item.doctor?.full_name || "Assigned Specialist",
              xrayPreview: getMediaUrl(item.image_path) || "/common/xray-base.png"
            })));
          }
        }
      } catch (err) {
        console.error("Failed to load patient dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, [router]);

  const completionRate = totalScans > 0 ? Math.round((verifiedScans / totalScans) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-6 md:gap-10 animate-in fade-in duration-500 bg-[#F7FAFF] min-h-screen p-1">
      
      {/* Welcome Area */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-[28px] font-black text-[#111C2D]">Good morning, {userName.split(" ")[0]}</h1>
        <p className="text-sm font-medium text-textt">Here is an overview of your cardiac health analysis.</p>
      </div>

      {/* Stats cards matching Figma borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
        <div className="bg-white rounded-[24px] p-6 border-l-[6px] border-l-[#2170FD] border-t border-r border-b border-[#DEE8FF] shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-[#DEE8FF] rounded-full flex items-center justify-center text-[#2170FD]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-textt">Total Scans</h3>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-[32px] font-black text-texts leading-none">{totalScans}</span>
              <span className="text-xs font-bold text-[#2170FD] mb-1">All time</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border-l-[6px] border-l-[#2170FD] border-t border-r border-b border-[#DEE8FF] shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-[#DEE8FF] rounded-full flex items-center justify-center text-[#2170FD]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-textt">Verified Results</h3>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-[32px] font-black text-texts leading-none">{verifiedScans}</span>
              <span className="text-xs font-bold text-[#2170FD] mb-1">{completionRate}% completion rate</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border-l-[6px] border-l-[#2170FD] border-t border-r border-b border-[#DEE8FF] shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-[#DEE8FF] rounded-full flex items-center justify-center text-[#2170FD]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-textt">Pending Verification</h3>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-[32px] font-black text-texts leading-none">{pendingScans}</span>
              <span className="text-xs font-bold text-[#2170FD] mb-1">In progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Analysis */}
      {currentAnalysis ? (
        <div className="bg-white border border-[#DEE8FF] rounded-[24px] border-l-[6px] border-l-[#2170FD] shadow-sm flex flex-col p-8 gap-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-[60px] h-[60px] bg-[#0047AD] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md shadow-[#0047AD]/10">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="3" x2="12" y2="21" />
                  <path d="M12 6C9 6 6 7 6 9c0 1.5 2 2 6 2" />
                  <path d="M12 6C15 6 18 7 18 9c0 1.5-2 2-6 2" />
                  <path d="M12 12C9 12 6 13 6 15c0 1.5 2 2 6 2" />
                  <path d="M12 12C15 12 18 13 18 15c0 1.5-2 2-6 2" />
                  <path d="M12 17C9 17 7 18 7 19.5" />
                  <path d="M12 17C15 17 17 18 17 19.5" />
                  <line x1="9" y1="13" x2="15" y2="13" strokeWidth="2.5" stroke="#FFFFFF" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="text-[22px] font-black text-[#111C2D] tracking-tight leading-none">Current Analysis</h2>
                <span className="text-sm font-semibold text-[#5A6E85]">Chest X-Ray ID: #{currentAnalysis.scanId}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-[#DEE8FF] text-[#1D4ED8] px-4 py-2 rounded-full w-fit self-start md:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2170FD] animate-pulse" />
              <span className="text-xs font-bold tracking-tight">Waiting for doctor&apos;s verification</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full sm:w-[240px] h-[240px] relative rounded-[24px] overflow-hidden border border-slate-200 shadow-sm bg-black shrink-0">
              <XrayImage src={currentAnalysis.xrayPreview || "/common/xray-base.png"} alt="Chest X-Ray" />
            </div>

            <div className="flex-1 w-full flex flex-col">
              <span className="text-[11px] font-bold text-[#64748B] tracking-wider uppercase mb-3">Metrics Detected</span>
              
              <div className="flex flex-col gap-3">
                <div className="bg-[#DEE8FF] rounded-[10px] h-[46px] px-5 flex items-center justify-between text-sm font-semibold text-[#1F2937]">
                  <span>Cardiothoracic Ratio</span>
                  <span className="text-[#0047AD] font-extrabold">{currentAnalysis.ctrRatio}</span>
                </div>
                
                <div className="bg-[#DEE8FF] rounded-[10px] h-[46px] px-5 flex items-center justify-between text-sm font-semibold text-[#1F2937]">
                  <span>AI Findings</span>
                  <span className="text-[#0047AD] font-extrabold">{currentAnalysis.aiPrediction}</span>
                </div>

                <div className="bg-[#DEE8FF] rounded-[10px] h-[46px] px-5 flex items-center justify-between text-sm font-semibold text-[#1F2937]">
                  <span>Heart Size</span>
                  <span className="text-[#0047AD] font-extrabold">{currentAnalysis.heartSize}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#DEE8FF] rounded-[24px] border-l-[6px] border-l-[#2170FD] shadow-sm flex flex-col items-center justify-center p-8 gap-4 text-center">
          <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center text-[#2170FD]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-[#111C2D]">No Pending Scans</h3>
            <p className="text-sm text-textt max-w-md">You do not have any scans waiting for clinical verification. Run a new scan to analyze your chest X-ray.</p>
          </div>
          <Link href="/patient/detection" className="bg-[#2170FD] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors shadow-md shadow-[#2170FD]/10">
            Start AI Detection
          </Link>
        </div>
      )}

      {/* Two-Column Layout (Inspection Progress & Latest Results) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        
        {/* Left Column: Inspection Progress */}
        <div className="lg:col-span-7 bg-white border border-[#DEE8FF] rounded-[24px] border-l-[6px] border-l-[#2170FD] p-6 shadow-sm flex flex-col gap-6">
          <h2 className="text-lg font-black text-[#111C2D]">Inspection Progress</h2>
          
          <div className="flex flex-col gap-4">
            {currentAnalysis ? (
              <div className="bg-[#DEE8FF] rounded-[16px] p-4 flex gap-4 items-center">
                <div className="w-12 h-12 bg-[#2170FD] rounded-xl flex items-center justify-center text-white shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-[#111C2D]">Scan #{currentAnalysis.scanId}</span>
                      <span className="text-xs font-semibold text-textt">Waiting for doctor verification</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-semibold text-textt">Recently</span>
                      <span className="text-xs font-black text-[#111C2D]">80%</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#DEE8FF] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2170FD] h-full rounded-full w-[80%]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#64748B] font-bold">
                No active inspections in progress.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Latest Results */}
        <div className="lg:col-span-5 bg-white border border-[#DEE8FF] rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
          <h2 className="text-lg font-black text-[#111C2D]">Latest Results</h2>
          
          <div className="flex flex-col gap-3">
            {latestResults.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#64748B] font-bold">
                No verified scan reports yet.
              </div>
            ) : (
              latestResults.map((item) => (
                <div key={item.id} className="bg-[#DEE8FF] border border-[#DEE8FF] rounded-[16px] p-4 flex gap-4 items-center">
                  <div className="w-10 h-10 bg-[#2170FD] rounded-xl flex items-center justify-center text-white shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-[#111C2D] hover:underline cursor-pointer" onClick={() => router.push(`/patient/detection?id=${item.id}`)}>
                        Scan #{item.scanId}
                      </span>
                      <span className="text-[11px] font-semibold text-textt">{item.aiPrediction}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-textt">
                      {item.uploadDate ? new Date(item.uploadDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "Recently"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
