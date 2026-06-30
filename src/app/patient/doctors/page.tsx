"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DoctorProfileModal from "@/components/modal/DoctorProfileModal";
import { apiFetch, getMediaUrl, useSafeImageSrc } from "@/utils/api";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience?: string;
  verified?: boolean;
  image: string;
  about?: string;
  schedule?: string;
  scheduleTime?: string;
}

const formatDateToWeekday = (dateStr: string) => {
  if (!dateStr) return "";
  const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  if (weekdays.includes(dateStr.toLowerCase())) {
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  }
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-US", { weekday: "long" });
    }
  } catch (e) {}
  return dateStr;
};

function DoctorAvatar({ src, alt }: { src: string; alt: string }) {
  const safeSrc = useSafeImageSrc(src);
  return <Image src={safeSrc} alt={alt} fill className="object-cover object-top" />;
}

export default function DoctorList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        // Use the newly imported apiFetch and getMediaUrl
        const res = await apiFetch("/doctors");
        if (res.success && res.data && Array.isArray(res.data.doctors)) {
          const mapped = res.data.doctors.map((doc: any) => ({
            id: doc.user?.id || doc.user_id || doc.id,
            name: doc.user?.full_name || "Dr. HeartVision Specialist",
            specialty: doc.subspecialist || "Cardiologist",
            image: getMediaUrl(doc.profile_photo) || "/landing/female-doctor-hero-white.png",
            experience: `${doc.experience_years || 8} years`,
            verified: doc.is_verified ?? true,
            about: doc.about || "Experienced cardiologist dedicated to providing the best cardiac care.",
            schedule: doc.schedules && doc.schedules.length > 0
              ? `${formatDateToWeekday(doc.schedules[0].start_date) || 'Monday'} - ${formatDateToWeekday(doc.schedules[0].end_date) || 'Wednesday'}`
              : undefined,
            scheduleTime: doc.schedules && doc.schedules.length > 0
              ? `${doc.schedules[0].start_time ? doc.schedules[0].start_time.substring(0, 5) : '09:00'} - ${doc.schedules[0].end_time ? doc.schedules[0].end_time.substring(0, 5) : '15:00'}`
              : undefined,
          }));
          setDoctors(mapped);
        } else {
          setDoctors([]);
        }
      } catch (err) {
        console.error("Failed to load doctors:", err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  // Filtering logic
  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage) || 1;
  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Loading State */}
      {loading ? (
        <div className="w-full h-96 flex flex-col items-center justify-center gap-3 bg-white border border-[#E2E8F0] rounded-2xl">
          <div className="w-10 h-10 border-4 border-[#2170FD] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#64748B]">Loading heart specialists...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-[#111C2D]">Choose a Specialist Doctor</h2>
            <p className="text-sm text-[#64748B] font-normal">
              Choose an expert cardiologist to verify your AI analysis results for greater diagnostic accuracy.
            </p>
          </div>

          {/* Search Bar */}
      <div className="relative w-full max-w-[420px]">
        <svg className="w-4 h-4 text-[#9CA3AF] absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search for doctor's name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#2170FD] transition-all text-[#111C2D] font-medium"
        />
      </div>

      {/* Doctor Cards Grid - 3 columns */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 flex flex-col items-center text-center max-w-xl mx-auto w-full">
          <p className="text-sm font-medium text-[#64748B]">No doctors match your search.</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 bg-[#2170FD] hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col items-center gap-3 hover:shadow-sm transition-shadow"
            >
              {/* Doctor Avatar */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-50 shrink-0">
                <DoctorAvatar src={doctor.image} alt={doctor.name} />
                {/* Online indicator */}
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#22C55E] rounded-full border-2 border-white" />
              </div>

              {/* Doctor Info */}
              <div className="flex flex-col items-center gap-0.5 text-center">
                <h4 className="text-sm font-bold text-[#111C2D]">{doctor.name}</h4>
                <p className="text-xs text-[#64748B] font-medium">{doctor.specialty}</p>
              </div>

              {/* Experience & Verified badges */}
              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  {doctor.experience || "8 years"}
                </span>
                {doctor.verified && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#2170FD]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>

              {/* View Profile Button - matches Figma */}
              <button
                onClick={() => handleViewProfile(doctor)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-[#EAF2FC] text-[#2170FD] hover:bg-[#DBEAFE] transition-all cursor-pointer"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}

        </>
      )}

      {/* Doctor Profile Modal */}
      <DoctorProfileModal
        isOpen={isModalOpen}
        doctor={selectedDoctor}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
