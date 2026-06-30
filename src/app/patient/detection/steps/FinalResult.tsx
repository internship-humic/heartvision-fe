"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSavedSession, apiFetch, getMediaUrl, useSafeImageSrc } from "@/utils/api";

function XrayImage({ src, alt }: { src: string; alt: string }) {
  const safeSrc = useSafeImageSrc(src, "/common/xray-base.png");
  return <Image src={safeSrc} alt={alt} fill className="object-contain p-1 opacity-80" />;
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
  doctorSpecialty: string;
  symptoms: string;
  xrayPreview: string;
  doctorNotes?: string;
  verifiedAt?: string;
  aiAccuracyConfirmed?: boolean;
  ecgRequired?: boolean;
}

interface FinalResultProps {
  scanIdParam: string | null;
}

export default function FinalResult({ scanIdParam }: FinalResultProps) {
  const [userName, setUserName] = useState("Patient");
  const [scan, setScan] = useState<ScanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const session = getSavedSession();
    if (session) {
      setUserName(session.name);
    }

    if (!scanIdParam) {
      setIsLoading(false);
      setErrorMsg("No scan ID provided.");
      return;
    }

    async function fetchScanDetail() {
      try {
        const res = await apiFetch(`/predictions/${scanIdParam}`);
        if (res.success && res.data && res.data.prediction) {
          const item = res.data.prediction;
          const isVerified = item.status === "verified";

          setScan({
            id: item.id,
            scanId: item.ref_code || item.scan_code || `REF-${item.id.substring(0, 5).toUpperCase()}-XC`,
            uploadDate: item.created_at || item.createdAt || new Date().toISOString(),
            aiPrediction: item.prediction_label || "Normal",
            ctrRatio: item.ctr_ratio != null ? String(item.ctr_ratio) : "0.50",
            heartSize: item.heart_size || "Normal",
            status: isVerified ? "Verified" : "Pending",
            doctorName: item.doctor?.full_name ? `Dr. ${item.doctor.full_name}` : "Assigned Specialist",
            doctorSpecialty: item.doctor?.doctorProfile?.subspecialist || "Cardiologist",
            symptoms: item.patient_notes || item.notes || "No symptoms listed.",
            xrayPreview: getMediaUrl(item.image_path) || "/common/xray-base.png",
            doctorNotes: item.doctor_notes || "",
            verifiedAt: item.verified_at || "",
            aiAccuracyConfirmed: item.ai_accuracy_confirmed ?? undefined,
            ecgRequired: item.ecg_required ?? undefined,
          });
        } else {
          setErrorMsg(res.error || "Failed to load scan details.");
        }
      } catch (err: any) {
        console.error("Failed to fetch scan detail:", err);
        setErrorMsg(err.message || "Failed to load scan details from backend.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchScanDetail();
  }, [scanIdParam]);

  if (isLoading) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2170FD] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#2170FD]">Loading scan details...</span>
        </div>
      </div>
    );
  }

  if (errorMsg || !scan) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center text-rose-500">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#64748B]">{errorMsg || "Scan not found."}</p>
        <Link href="/patient/dashboard" className="text-sm font-bold text-[#2170FD] hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isPending = scan.status === "Pending";

  if (isPending) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8 mt-4 items-stretch">
        {/* Left Column: Awaiting Verification */}
        <div className="lg:col-span-7 bg-white border border-[#DEE8FF] rounded-[24px] border-l-[6px] border-l-[#2170FD] p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center text-center gap-6 min-h-[400px] lg:min-h-[500px]">

          {/* Custom Document & Reload Icon Wrapper */}
          <div className="relative w-28 h-28 bg-[#F4F8FF] rounded-full flex items-center justify-center border border-[#DEE8FF] shadow-sm">
            <svg className="w-12 h-12 text-[#2170FD]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-[#EAF2FC] border border-[#DEE8FF] rounded-full flex items-center justify-center text-[#2170FD] shadow-sm animate-spin-slow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-[24px] font-black text-[#111C2D] tracking-tight">Awaiting Verification</h2>
            <p className="text-sm font-semibold text-[#64748B] max-w-md leading-relaxed">
              The AI analysis and your clinical notes have been forwarded to <span className="text-[#2170FD] font-bold">{scan.doctorName}</span>. Your diagnostic report is currently under professional review to ensure the highest accuracy.
            </p>
          </div>

          {/* Assigned Doctor Badge Card */}
          <div className="border border-slate-100 bg-white shadow-sm p-4 rounded-2xl flex items-center gap-4 w-full max-w-[340px]">
            <div className="w-12 h-12 rounded-full overflow-hidden relative border border-slate-200 shrink-0 bg-[#EAF2FC] flex items-center justify-center text-[#2170FD] font-bold text-sm">
              {scan.doctorName.replace("Dr. ", "").slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left flex flex-col gap-0.5">
              <span className="text-sm font-black text-[#111C2D]">{scan.doctorName}</span>
              <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wide">{scan.doctorSpecialty}</span>
            </div>
          </div>

          <Link
            href="/patient/dashboard"
            className="mt-4 px-8 py-3.5 border border-[#DEE8FF] hover:bg-slate-50 text-[#111C2D] font-black rounded-xl text-sm transition-all"
          >
            Return to Dashboard
          </Link>
        </div>

        {/* Right Column: Preliminary AI Findings */}
        <div className="lg:col-span-5 bg-white border border-[#DEE8FF] rounded-[24px] border-l-[6px] border-l-[#2170FD] p-6 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[16px] font-black text-[#111C2D]">Preliminary AI Findings</h3>
            <span className="text-[10px] font-black bg-[#EAF2FC] text-[#2170FD] border border-[#DEE8FF] px-2.5 py-1 rounded-[6px] tracking-wide uppercase">
              Unverified
            </span>
          </div>

          {/* Metric Rows */}
          <div className="flex flex-col gap-3">
            <div className="bg-[#EAF2FC] rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#2170FD]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="text-xs font-black text-[#111C2D]">CTR Ratio</span>
              </div>
              <span className="text-sm font-black text-[#2170FD]">{scan.ctrRatio}</span>
            </div>

            <div className="bg-[#EAF2FC] rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#2170FD]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <span className="text-xs font-black text-[#111C2D]">AI Prediction</span>
              </div>
              <span className="text-sm font-black text-[#64748B]">{scan.aiPrediction}</span>
            </div>

            <div className="bg-[#EAF2FC] rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#2170FD]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-black text-[#111C2D]">Cardiac Contour</span>
              </div>
              <span className="text-sm font-black text-[#64748B]">{scan.heartSize}</span>
            </div>
          </div>

          {/* Symptoms note card */}
          <div className="bg-[#F4F8FF] border border-[#DEE8FF] rounded-[16px] p-5 flex flex-col gap-2 mt-2">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Symptoms Note</span>
            <p className="text-xs font-semibold text-[#4B5563] leading-relaxed italic">
              &quot;{scan.symptoms}&quot;
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verified Final View
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8 mt-4 items-start animate-in fade-in duration-500">

      {/* Left Column: Cardiological Assessment Report */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-white border border-[#DEE8FF] rounded-[24px] p-5 sm:p-8 shadow-sm flex flex-col gap-6 sm:gap-8">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#10B981] mb-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">Verified Report</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111C2D] tracking-tight">Cardiological Assessment</h2>
              <span className="text-xs font-bold text-textt tracking-wide uppercase mt-1">
                {scan.verifiedAt ? new Date(scan.verifiedAt).toLocaleDateString() : new Date(scan.uploadDate).toLocaleDateString()}
              </span>
            </div>

            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold text-textt uppercase tracking-wide">Ref ID</span>
              <span className="text-xs font-mono font-bold text-[#111C2D] bg-[#F3F4F6] px-2.5 py-1 rounded border border-[#E5E7EB]">
                {scan.scanId}
              </span>
            </div>
          </div>

          {/* Doctor Assessment Box */}
          <div className="bg-[#F4F8FF] border border-[#DEE8FF] rounded-[20px] p-6 border-l-[6px] border-l-[#2170FD] flex flex-col gap-5">
            <h3 className="text-xs font-bold text-[#2170FD] uppercase tracking-widest leading-none">Doctor&apos;s Clinical Assessment</h3>
            <p className="text-sm font-semibold text-[#4B5563] leading-relaxed italic">
              &quot;{scan.doctorNotes || "No clinical notes provided."}&quot;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-[#DEE8FF] mt-2">
              <div className="w-10 h-10 rounded-full overflow-hidden relative border border-slate-100 shrink-0 bg-[#EAF2FC] flex items-center justify-center text-[#2170FD] font-bold text-xs">
                {scan.doctorName.replace("Dr. ", "").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-[#111C2D]">{scan.doctorName}</span>
                <span className="text-[10px] font-bold text-textt uppercase">{scan.doctorSpecialty}</span>
              </div>
            </div>
          </div>

          {/* Lower Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* AI Findings */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-textt uppercase tracking-wider">AI Findings Summary</h4>
              <div className="bg-slate-50 border border-slate-100 rounded-[16px] p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-semibold text-[#4B5563]">
                  <span>Cardiomegaly Index</span>
                  <span className="text-rose-600 font-black">{scan.ctrRatio}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-[#4B5563]">
                  <span>AI Prediction</span>
                  <span className="text-[#2170FD] font-black">{scan.aiPrediction}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-[#4B5563]">
                  <span>Heart Size</span>
                  <span className="text-emerald-600 font-black">{scan.heartSize}</span>
                </div>
              </div>
            </div>

            {/* Doctor Confirmations */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-textt uppercase tracking-wider">Doctor&apos;s Confirmation</h4>
              <div className="bg-slate-50 border border-slate-100 rounded-[16px] p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-semibold text-[#4B5563]">
                  <span>AI Accuracy</span>
                  {scan.aiAccuracyConfirmed !== false ? (
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-rose-600 font-black text-[10px]">No</span>
                  )}
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-[#4B5563]">
                  <span>ECG Required</span>
                  <span className="text-[#2170FD] font-black">{scan.ecgRequired ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Column: Reference & Profile */}
      <div className="lg:col-span-5 flex flex-col gap-6">

        {/* X-Ray Image Preview */}
        <div className="bg-white border border-[#DEE8FF] rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-xs font-bold text-textt uppercase tracking-widest">Original X-Ray Reference</h3>
          <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            <XrayImage src={scan.xrayPreview || "/common/xray-base.png"} alt="Chest X-Ray Reference" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[9px] font-bold text-white tracking-widest uppercase">
              Enhanced Contrast View
            </div>
          </div>
        </div>

        {/* Patient Profile Details */}
        <div className="bg-white border border-[#DEE8FF] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
          <h3 className="text-xs font-bold text-textt uppercase tracking-widest">Patient Profile</h3>

          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 bg-[#EAF2FC] text-[#2170FD] rounded-full flex items-center justify-center font-black text-lg">
              {userName.charAt(0)}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-black text-[#111C2D]">{userName}</span>
              <span className="text-[10px] font-bold text-textt uppercase">Patient</span>
            </div>
          </div>

          <Link
            href="/patient/dashboard"
            className="w-full py-3 bg-[#EAF2FC] text-[#2170FD] hover:bg-[#DEE8FF] font-black rounded-xl text-center text-sm transition-colors mt-2"
          >
            Return to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
