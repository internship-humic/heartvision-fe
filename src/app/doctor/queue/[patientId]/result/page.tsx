"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch, getMediaUrl, useSafeImageSrc } from "@/utils/api";

function VerificationResultContent() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const scanId = patientId || "REF-99281-XC";

  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [ctrRatio, setCtrRatio] = useState("");
  const [aiAccuracyConfirmed, setAiAccuracyConfirmed] = useState(true);
  const [ecgRequired, setEcgRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [patient, setPatient] = useState({
    name: "",
    bloodType: "",
    allergies: "",
    avatarInitials: ""
  });
  const [doctor, setDoctor] = useState({
    name: "",
    title: ""
  });
  const [xrayUrl, setXrayUrl] = useState("/common/xray-base.png");
  const safeXrayUrl = useSafeImageSrc(xrayUrl, "/common/xray-base.png");

  useEffect(() => {
    async function loadVerifiedResult() {
      try {
        const res = await apiFetch(`/verifications/${scanId}`);
        if (res.success && res.data && res.data.prediction) {
          const item = res.data.prediction;
          setNotes(item.doctor_notes || "No clinical notes provided.");
          setDiagnosis(item.doctor_assessment || item.prediction_label || "Normal");
          setDateStr(item.verified_at ? new Date(item.verified_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : (item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently"));
          setCtrRatio(item.ctr_ratio != null ? String(item.ctr_ratio) : "0.50");
          setAiAccuracyConfirmed(item.ai_accuracy_confirmed ?? true);
          setEcgRequired(item.ecg_required ?? false);
          
          setPatient({
            name: item.patient?.full_name || "Unknown Patient",
            bloodType: item.patient?.blood_type || "Not Specified",
            allergies: item.patient?.allergies || "Not Specified",
            avatarInitials: item.patient?.full_name ? item.patient.full_name.slice(0, 2).toUpperCase() : "PT"
          });
          
          setDoctor({
            name: item.doctor?.full_name ? `Dr. ${item.doctor.full_name}` : "Assigned Specialist",
            title: item.doctor?.doctorProfile?.subspecialist || "Cardiologist Specialist"
          });
          
          setXrayUrl(getMediaUrl(item.image_path) || "/common/xray-base.png");
        }
      } catch (err) {
        console.error("Failed to load verification result from backend:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadVerifiedResult();
  }, [scanId]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-fbc rounded-2xl border border-bgelem/40">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-textt">Loading verified report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Assessment Report */}
      <div className="lg:col-span-8 bg-fbc border border-bgelem/30 rounded-2xl p-6 shadow-sm flex flex-col">
        {/* Verified Report Header Badge Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bgelem/25 pb-4 mb-5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            VERIFIED REPORT
          </div>
          <span className="text-[10px] text-textt font-bold">Ref ID: {scanId.substring(0, 8)}</span>
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Final Medical Conclusion</span>
        </div>
        {/* Cardiological Assessment Title */}
        <h2 className="text-xl font-bold text-texts tracking-tight">Cardiological Assessment ({diagnosis})</h2>
        <p className="text-[11px] text-textt font-semibold mt-1">
          Analysis completed on {dateStr}
        </p>

        {/* Doctor's Clinical Assessment Box */}
        <div className="mt-6">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Doctor&apos;s Clinical Assessment</span>

          <div className="bg-[#EBF3FC] border border-primary/5 p-6 rounded-xl mt-3 flex flex-col gap-4">
            <p className="text-xs text-texts font-medium italic leading-relaxed">
              &quot;{notes}&quot;
            </p>

            <div className="flex items-center gap-3 border-t border-primary/10 pt-4 mt-2">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {doctor.name.replace("Dr. ", "").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs font-bold text-texts">{doctor.name}</h4>
                <p className="text-[9px] text-textt font-semibold mt-0.5">{doctor.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Split Cards: Summary & Confirmation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Card 1: AI Findings Summary */}
          <div className="bg-fbc border border-bgelem/35 rounded-xl p-4 flex flex-col gap-3">
            <h4 className="text-[9px] font-bold text-textt uppercase tracking-wider">AI Findings Summary</h4>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-textt">Cardiomegaly Index</span>
                <span className="font-bold text-rose-600">{ctrRatio}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-textt">AI Predicted Label</span>
                <span className="font-bold text-primary">{diagnosis}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Doctor's Confirmation */}
          <div className="bg-fbc border border-bgelem/35 rounded-xl p-4 flex flex-col gap-3">
            <h4 className="text-[9px] font-bold text-textt uppercase tracking-wider">Doctor&apos;s Confirmation</h4>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-textt">AI Accuracy Confirmed</span>
                {aiAccuracyConfirmed ? (
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="font-bold text-rose-600 text-[10px]">No</span>
                )}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-textt">ECG Required</span>
                <span className="font-bold text-primary">{ecgRequired ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: References */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Original X-Ray Card */}
        <div className="bg-fbc border border-bgelem/30 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-texts tracking-tight mb-4">Original X-ray Reference</h3>

          <div className="relative w-full aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {xrayUrl ? (
              <Image
                src={safeXrayUrl}
                alt="Scan Reference"
                fill
                className="object-contain opacity-70"
              />
            ) : (
              <div className="text-xs text-textt">No image available</div>
            )}
            <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-[8px] font-mono font-bold text-white/90 px-2 py-1 rounded">
              ENHANCED CONTRAST VIEW
            </span>
          </div>
        </div>

        {/* Patient Profile Card */}
        <div className="bg-fbc border border-bgelem/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-bold text-texts tracking-tight">Patient Profile</h3>
          <div className="flex items-center gap-4 border-b border-bgelem/25 pb-4">
            <div className="w-12 h-12 rounded-full bg-[#EAF2FC] text-primary font-bold text-sm flex items-center justify-center shrink-0 animate-pulse">
              {patient.avatarInitials}
            </div>
            <div>
              <h4 className="text-sm font-bold text-texts">{patient.name}</h4>
              <p className="text-[10px] text-textt font-semibold mt-0.5">Patient</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textt">Blood Type</span>
            <span className="font-bold text-texts">{patient.bloodType}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-textt">Allergies</span>
            <span className="font-bold text-texts">{patient.allergies}</span>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push("/doctor/queue")}
          className="w-full bg-fbc border border-bgelem hover:bg-slate-50 text-texts font-bold rounded-xl py-3.5 text-xs transition-all text-center cursor-pointer flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to List Request
        </button>
      </div>
    </div>
  );
}

export default function VerificationResult() {
  return (
    <Suspense fallback={
      <div className="w-full h-96 flex items-center justify-center bg-fbc rounded-2xl border border-bgelem/40">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-textt">Loading assessment report...</p>
        </div>
      </div>
    }>
      <VerificationResultContent />
    </Suspense>
  );
}
