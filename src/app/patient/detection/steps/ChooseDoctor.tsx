import React, { useState, useEffect } from "react";
import Image from "next/image";
import { apiFetch, getMediaUrl, useSafeImageSrc } from "@/utils/api";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience?: string;
  verified?: boolean;
}

interface ChooseDoctorProps {
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
  onNext: () => void;
  predictionId?: string | null;
}

function DoctorAvatar({ src, alt }: { src: string; alt: string }) {
  const safeSrc = useSafeImageSrc(src);
  return <Image src={safeSrc} alt={alt} fill className="object-cover object-top" />;
}

export default function ChooseDoctor({
  selectedDoctor,
  onSelectDoctor,
  onNext,
  predictionId,
}: ChooseDoctorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await apiFetch("/doctors");
        if (res.success && res.data && Array.isArray(res.data.doctors)) {
          const mapped = res.data.doctors.map((doc: any) => ({
            id: doc.user?.id || doc.user_id,
            name: doc.user?.full_name || "Dr. HeartVision Specialist",
            specialty: doc.subspecialist || "Cardiologist",
            image: getMediaUrl(doc.profile_photo) || "/landing/female-doctor-hero-white.png",
            experience: "8 years",
            verified: true,
          }));
          setDoctors(mapped);
        }
      } catch (err) {
        console.error("Failed to load doctors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage) || 1;
  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (doctors.length > 0) {
      console.log("DEBUG doctors list:", doctors);
    }
  }, [doctors]);

  const handleSelect = async (doc: Doctor) => {
    if (predictionId) {
      try {
        const res = await apiFetch(`/predictions/${predictionId}/select-doctor`, {
          method: "PUT",
          body: JSON.stringify({ doctorId: doc.id }),
        });
        
        if (!res.success) {
          console.error("Select doctor API failed:", res.error);
          alert(`Failed to select doctor: ${res.error}`);
          return; // Stop and don't move to the next step
        }
      } catch (err: any) {
        console.error("Select doctor API exception:", err);
        alert(`Failed to select doctor: ${err.message}`);
        return; // Stop and don't move to the next step
      }
    }
    
    onSelectDoctor(doc);
    onNext();
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 bg-white border border-[#E2E8F0] rounded-2xl">
        <div className="w-10 h-10 border-4 border-[#2170FD] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#64748B]">Loading heart specialists...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-2">
      {/* Search Bar */}
      <div className="relative w-full max-w-[400px]">
        <svg className="w-4 h-4 text-[#9CA3AF] absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search for doctor's name..."
          className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#2170FD] transition-all text-[#111C2D] font-medium"
        />
      </div>

      {/* Doctor Cards Grid - 3 columns */}
      {currentDoctors.length === 0 ? (
        <div className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-white border border-[#E2E8F0] rounded-2xl">
          <div className="w-16 h-16 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#2170FD]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <h3 className="text-sm font-bold text-[#111C2D]">Belum ada dokter</h3>
            <p className="text-xs text-[#64748B] max-w-xs">Saat ini belum ada dokter spesialis yang terdaftar di sistem. Silakan coba lagi nanti.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentDoctors.map((doc) => {
            const isSelected = selectedDoctor?.id === doc.id;
            return (
              <div
                key={doc.id}
                className={`bg-white border rounded-2xl p-6 flex flex-col items-center gap-3 transition-all ${
                  isSelected
                    ? "border-[#2170FD] shadow-md"
                    : "border-[#E2E8F0] hover:border-[#2170FD]/40 hover:shadow-sm"
                }`}
              >
                {/* Doctor Avatar */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-50 shrink-0">
                  <DoctorAvatar src={doc.image} alt={doc.name} />
                  {/* Online indicator */}
                  <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#22C55E] rounded-full border-2 border-white" />
                </div>

                {/* Doctor Info */}
                <div className="flex flex-col items-center gap-0.5 text-center">
                  <h4 className="text-sm font-bold text-[#111C2D]">{doc.name}</h4>
                  <p className="text-xs text-[#64748B] font-medium">{doc.specialty}</p>
                </div>

                {/* Experience & Verified badges */}
                <div className="flex items-center gap-3 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {doc.experience || "8 years"}
                  </span>
                  {doc.verified && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-[#2170FD]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>

                {/* Select Doctor Button */}
                <button
                  onClick={() => handleSelect(doc)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#2170FD] text-white"
                      : "bg-[#F0F5FF] text-[#2170FD] hover:bg-[#E0EAFF]"
                  }`}
                >
                  Select Doctor
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-sm text-[#64748B] hover:text-[#111C2D] disabled:opacity-40 cursor-pointer font-medium"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              currentPage === page
                ? "bg-[#2170FD] text-white"
                : "text-[#64748B] hover:bg-[#F0F5FF]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="text-sm text-[#64748B] hover:text-[#111C2D] disabled:opacity-40 cursor-pointer font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
}
