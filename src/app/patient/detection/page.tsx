// Halaman deteksi AI (5 langkah)
// Menangani alur upload X-ray, pemanggilan API deteksi, pemilihan dokter, penulisan gejala, dan hasil akhir.

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSavedSession, apiFetch } from "@/utils/api";
import DetectionStepper from "./components/DetectionStepper";
import Upload from "./steps/Upload";
import Detect from "./steps/Detect";
import ChooseDoctor from "./steps/ChooseDoctor";
import GiveNote from "./steps/GiveNote";
import FinalResult from "./steps/FinalResult";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
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
}

function DetectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("Patient");
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiResult, setAiResult] = useState<{ prediction: string; ctrRatio: string; heartSize: string } | null>(null);
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [predictionId, setPredictionId] = useState<string | null>(null);

  useEffect(() => {
    const session = getSavedSession();
    if (session) {
      setUserId(session.userId);
      setUserName(session.name);
    }
    
    if (idParam) {
      setCurrentStep(5);
    } else {
      setCurrentStep(1);
    }
  }, [idParam]);

  const handleFileSelect = (file: File) => {
    setValidationError(null);

    if (file.size > 5 * 1024 * 1024) {
      setValidationError("File size exceeds 5MB limit.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setValidationError("Invalid file type. Please upload an image.");
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
      setCurrentStep(2);
      uploadAndAnalyze(file);
    };
    reader.readAsDataURL(file);
  };

  // Upload gambar X-ray ke backend untuk dianalisis oleh AI
  const uploadAndAnalyze = async (file: File) => {
    setIsAiProcessing(true);
    setAiProgress(0);
    setAiResult(null);
    setValidationError(null);

    // TODO [AI]: Ganti loading palsu di bawah ini dengan progres real-time (misal pake WebSocket / SSE)
    let progressVal = 0;
    const progressInterval = setInterval(() => {
      progressVal = Math.min(progressVal + 5, 95);
      setAiProgress(progressVal);
    }, 150);

    try {
      const formData = new FormData();
      formData.append("xray", file);

      // TODO [AI]: Tambahin parameter tambahan di sini kalau model AI butuh info umur/gender
      const res = await apiFetch("/predictions/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (res.success && res.data && res.data.prediction) {
        setAiProgress(100);
        setIsAiProcessing(false);
        const pred = res.data.prediction;
        setPredictionId(pred.id);

        // TODO [AI]: Map field output model baru dari BE di sini kalau ada
        setAiResult({
          prediction: pred.prediction_label,
          ctrRatio: pred.ctr_ratio != null ? String(pred.ctr_ratio) : "0.50",
          heartSize: pred.heart_size || "Normal",
        });
      } else {
        throw new Error(res.error || "Analysis failed");
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsAiProcessing(false);
      setValidationError(err.message || "Failed to analyze X-ray image.");
      setCurrentStep(1);
    }
  };

  const [isSubmittingNotes, setIsSubmittingNotes] = useState(false);

  const handleSubmitFinal = async () => {
    if (!aiResult || !selectedDoctor || !predictionId || isSubmittingNotes) return;

    setIsSubmittingNotes(true);
    try {
      const res = await apiFetch(`/predictions/${predictionId}/notes`, {
        method: "PUT",
        body: JSON.stringify({ notes: symptoms || "No symptoms listed." }),
      });

      if (res.success) {
        router.push(`/patient/detection?id=${predictionId}`);
      } else {
        alert(res.error || "Failed to submit symptoms/notes.");
        setIsSubmittingNotes(false);
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit symptoms/notes.");
      setIsSubmittingNotes(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      <DetectionStepper currentStep={currentStep} />

      {currentStep === 1 && (
        <Upload
          onFileSelect={handleFileSelect}
          validationError={validationError}
          uploadedFile={uploadedFile}
        />
      )}

      {currentStep === 2 && (
        <Detect
          filePreview={filePreview}
          isProcessing={isAiProcessing}
          progress={aiProgress}
          result={aiResult}
          onNext={() => setCurrentStep(3)}
          onCancel={() => {
            setUploadedFile(null);
            setFilePreview("");
            setCurrentStep(1);
          }}
        />
      )}

      {currentStep === 3 && (
        <ChooseDoctor
          selectedDoctor={selectedDoctor}
          onSelectDoctor={setSelectedDoctor}
          onNext={() => setCurrentStep(4)}
          predictionId={predictionId}
        />
      )}

      {currentStep === 4 && (
        <GiveNote
          symptoms={symptoms}
          onChangeSymptoms={setSymptoms}
          onSubmit={handleSubmitFinal}
          selectedDoctorName={selectedDoctor?.name}
          selectedDoctorSpecialty={selectedDoctor?.specialty}
          selectedDoctorImage={selectedDoctor?.image}
          onChangeDoctor={() => setCurrentStep(3)}
          isSubmitting={isSubmittingNotes}
        />
      )}

      {currentStep === 5 && (
        <FinalResult scanIdParam={idParam} />
      )}
    </div>
  );
}

export default function DetectionPage() {
  return (
    <Suspense fallback={<div className="w-full h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#2170FD] border-t-transparent rounded-full animate-spin"></div></div>}>
      <DetectionContent />
    </Suspense>
  );
}
