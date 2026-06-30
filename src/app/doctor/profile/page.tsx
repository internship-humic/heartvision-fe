"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch, getSavedSession, clearSession, getMediaUrl, useSafeImageSrc } from "@/utils/api";
import EditProfile from "@/components/modal/EditProfile";
import EditSchedule from "@/components/modal/EditSchedule";
import ChangePassword from "@/components/modal/ChangePassword";
import AvatarUploadDialog from "@/components/modal/AvatarUploadDialog";

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

interface DoctorProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  bloodType: string;
  allergies: string;
  address: string;
  schedule: { day: string; time: string }[];
  avatarUrl?: string;
}

export default function DoctorProfilePage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<DoctorProfile>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    bloodType: "",
    allergies: "",
    address: "",
    schedule: [],
  });

  const safeProfileAvatar = useSafeImageSrc(profile.avatarUrl || "/landing/female-doctor-hero-white.png");

  // Modal toggle states
  const [activeModal, setActiveModal] = useState<"edit-profile" | "edit-schedule" | "change-password" | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {
    const session = getSavedSession();
    let activeUserId = "doctor-default";
    if (session) {
      setProfile((prev) => ({ ...prev, name: session.name }));
      activeUserId = session.userId;
      setDoctorId(`#${session.userId.substring(0, 8).toUpperCase()}`);
    }

    async function loadProfile() {
      try {
        const currentSession = getSavedSession();
        const res = await apiFetch(`/users/profile`);
        if (res.success && res.data && res.data.user) {
          const u = res.data.user;
          const scheduleList = u.doctorProfile?.schedules?.map((sched: any) => {
            const start = formatDateToWeekday(sched.start_date || "Monday");
            const end = formatDateToWeekday(sched.end_date || "Wednesday");
            const sTime = sched.start_time ? sched.start_time.substring(0, 5) : "09:00";
            const eTime = sched.end_time ? sched.end_time.substring(0, 5) : "15:00";
            return {
              day: `${start} - ${end}`,
              time: `${sTime} - ${eTime}`
            };
          }) || [];

          setProfile({
            name: u.full_name || (currentSession ? currentSession.name : ""),
            email: u.email || "",
            phone: u.phone || "",
            dob: u.date_of_birth || "",
            bloodType: u.blood_type || "",
            allergies: u.allergies || "",
            address: u.address || "",
            schedule: scheduleList,
            avatarUrl: u.doctorProfile?.profile_photo ? getMediaUrl(u.doctorProfile.profile_photo) : undefined,
          });

          // Sync avatar to localStorage for cross-component usage (e.g., DashboardHeader)
          const avatarKey = currentSession ? `hv_avatar_${currentSession.userId}` : "hv_avatar";
          if (u.doctorProfile?.profile_photo) {
            const avatarUrl = getMediaUrl(u.doctorProfile.profile_photo);
            localStorage.setItem(avatarKey, avatarUrl);
            window.dispatchEvent(new Event("avatar-updated"));
          } else {
            localStorage.removeItem(avatarKey);
            window.dispatchEvent(new Event("avatar-updated"));
          }
        }
      } catch (err) {
        console.warn("Failed to load doctor profile from backend.", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await apiFetch("/users/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.success && res.data?.doctorProfile) {
        const updatedPhoto = res.data.doctorProfile.profile_photo;
        const newAvatarUrl = getMediaUrl(updatedPhoto);
        setProfile((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
        // Sync avatar across components (e.g., DashboardHeader) via localStorage
        const session = getSavedSession();
        const avatarKey = session ? `hv_avatar_${session.userId}` : "hv_avatar";
        localStorage.setItem(avatarKey, newAvatarUrl);
        window.dispatchEvent(new Event("avatar-updated"));
      } else {
        throw new Error(res.error || "Failed to upload avatar.");
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to upload avatar.");
    }
  };

  const handleProfileUpdate = (updatedProfile: Partial<DoctorProfile>) => {
    setProfile((prev) => ({ ...prev, ...updatedProfile }));
    setActiveModal(null);
  };

  const handleScheduleUpdate = (updatedSchedule: { day: string; time: string }[]) => {
    setProfile((prev) => ({ ...prev, schedule: updatedSchedule }));
    setActiveModal(null);
  };

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-texts tracking-tight">My Profile</h2>
          <p className="text-xs md:text-sm text-textt font-medium">Manage your personal information and settings</p>
        </div>
        <div className="w-full flex flex-col gap-6 animate-pulse">
          <div className="h-32 bg-slate-200/50 rounded-2xl w-full" />
          <div className="h-64 bg-slate-200/50 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-texts tracking-tight">My Profile</h2>
        <p className="text-xs md:text-sm text-textt font-medium">
          Manage your personal information and settings
        </p>
      </div>

      {/* Profile Info Header Card */}
      <div className="bg-fbc border border-bgelem/30 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Picture with edit button */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-primary/20 bg-primary/5 relative">
              <Image
                key={safeProfileAvatar || "default-avatar"}
                src={safeProfileAvatar}
                alt="Doctor Profile"
                fill
                unoptimized
                className="object-cover object-top rounded-full"
              />
            </div>
            <button
              onClick={() => setIsAvatarDialogOpen(true)}
              className="absolute bottom-0 right-0 bg-texts text-white p-2 rounded-full border-2 border-white shadow hover:bg-texts/90 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </button>
          </div>

          {/* Text & Primary Actions */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-texts">{profile.name}</h3>
            <p className="text-xs text-textt mt-1 font-semibold">Doctor ID: {doctorId}</p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
              <button
                onClick={() => setActiveModal("edit-profile")}
                className="bg-texts text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-texts/90 transition-all cursor-pointer shadow-sm shadow-texts/10"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setActiveModal("edit-schedule")}
                className="bg-texts text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-texts/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-texts/10"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Status card right */}
        <div className="bg-[#EAF2FC] border border-primary/10 px-8 py-5 rounded-2xl flex flex-col items-center justify-center shrink-0 w-full sm:w-auto">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Status</span>
          <span className="text-sm font-bold text-primary mt-1">Aktif</span>
        </div>
      </div>

      {/* Grid details sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Personal Information */}
        <div className="lg:col-span-7 bg-fbc border-l-4 border-l-primary rounded-r-2xl p-6 shadow-sm">
          <h4 className="text-sm font-bold text-texts tracking-tight mb-6">Personal Information</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">Full Name</span>
              <p className="font-bold text-texts text-xs mt-1">{profile.name.replace("Dr. ", "").replace(", Sp.Jp.", "").replace(", Sp.JP", "")}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">Email</span>
              <p className="font-bold text-texts text-xs mt-1">{profile.email}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">Phone Number</span>
              <p className="font-bold text-texts text-xs mt-1">{profile.phone}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">Date of Birth</span>
              <p className="font-bold text-texts text-xs mt-1">{profile.dob}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">Blood Type</span>
              <p className="font-bold text-texts text-xs mt-1">{profile.bloodType}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">Allergies</span>
              <p className="font-bold text-texts text-xs mt-1">{profile.allergies}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">Address</span>
              <p className="font-bold text-texts text-xs mt-1 leading-relaxed">{profile.address}</p>
            </div>
          </div>
        </div>

        {/* Right Column details */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active Schedule Card */}
          <div className="bg-fbc border-l-4 border-l-primary rounded-r-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-texts tracking-tight mb-4">Active Schedule</h4>
            {profile.schedule.map((item, idx) => (
              <div key={idx} className="flex flex-col mt-2">
                <span className="text-[10px] font-bold text-textt uppercase tracking-wider">{item.day}</span>
                <span className="text-xl font-extrabold text-texts mt-1">{item.time}</span>
              </div>
            ))}
          </div>

          {/* Change Password Card */}
          <div className="bg-fbc border border-bgelem/30 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-texts tracking-tight">Change Password</h4>
              <button
                onClick={() => setActiveModal("change-password")}
                className="bg-primary text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-primary/95 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-primary/10"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change
              </button>
            </div>
            <p className="text-[10px] text-textt font-medium leading-relaxed">
              Keep your account secure by using a strong password and updating it regularly.
            </p>
          </div>

          {/* Logout button bottom right aligned */}
          <button
            onClick={handleLogout}
            className="border border-rose-300 text-rose-600 hover:bg-rose-50 px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </div>

      {/* Render Modal dialog overlays dynamically */}
      {activeModal === "edit-profile" && (
        <EditProfile
          isOpen={true}
          currentProfile={profile}
          onClose={() => setActiveModal(null)}
          onSave={handleProfileUpdate}
        />
      )}
      {activeModal === "edit-schedule" && (
        <EditSchedule
          isOpen={true}
          currentSchedule={profile.schedule}
          onClose={() => setActiveModal(null)}
          onSave={handleScheduleUpdate}
        />
      )}
      {activeModal === "change-password" && (
        <ChangePassword
          isOpen={true}
          onClose={() => setActiveModal(null)}
        />
      )}
      {isAvatarDialogOpen && (
        <AvatarUploadDialog
          isOpen={true}
          currentAvatarUrl={safeProfileAvatar}
          onClose={() => setIsAvatarDialogOpen(false)}
          onUpload={handleAvatarUpload}
        />
      )}
    </div>
  );
}
