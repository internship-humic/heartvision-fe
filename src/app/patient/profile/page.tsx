"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getSavedSession, clearSession } from "@/utils/api";
import ChangePassword from "@/components/modal/ChangePassword";
import EditProfile from "@/components/modal/EditProfile";

interface PatientProfileData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  bloodType: string;
  allergies: string;
  address: string;
}

export default function PatientProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PatientProfileData>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    bloodType: "",
    allergies: "",
    address: "",
  });

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [totalScans, setTotalScans] = useState(0);

  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const session = getSavedSession();
    if (session) {
      setPatientId(`#${session.userId.substring(0, 8).toUpperCase()}`);
      loadProfile();

      // Count scans via backend predictions endpoint
      apiFetch("/predictions").then((res) => {
        if (res.success && res.data && Array.isArray(res.data.predictions)) {
          setTotalScans(res.data.predictions.length);
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await apiFetch("/users/profile");
      if (res.success && res.data && res.data.user) {
        const u = res.data.user;
        setProfile({
          name: u.full_name || "",
          email: u.email || "",
          phone: u.phone || "",
          dob: u.date_of_birth || "",
          bloodType: u.blood_type || "",
          allergies: u.allergies || "",
          address: u.address || "",
        });
      }
    } catch (err) {
      console.warn("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleProfileUpdate = (updated: any) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
    setIsEditOpen(false);
  };

  const handleLogout = () => {
    clearSession();
    router.push("/?auth=sign-in");
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-6 animate-pulse">
        <div className="h-32 bg-slate-200/50 rounded-2xl w-full" />
        <div className="h-64 bg-slate-200/50 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-[#111C2D]">My Profile</h2>
        <p className="text-sm text-[#64748B] font-normal">Manage your personal information and settings</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar - Large Initial */}
          <div className="w-20 h-20 rounded-full bg-[#EFF6FF] border-2 border-[#DBEAFE] flex items-center justify-center text-[#2170FD] font-bold text-3xl shrink-0">
            {profile.name.charAt(0)}
          </div>

          {/* Name & ID + Edit button */}
          <div className="flex flex-col gap-1 text-center sm:text-left items-center sm:items-start">
            <h3 className="text-lg font-bold text-[#111C2D]">{profile.name}</h3>
            <p className="text-sm text-[#64748B]">Patient ID: {patientId}</p>
            <button
              onClick={() => setIsEditOpen(true)}
              className="mt-1 flex items-center gap-1.5 bg-[#2170FD] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer w-fit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats: Total Scan & Status */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
          <div className="flex-1 sm:flex-none flex flex-col items-center gap-1 px-6 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Total Scan</span>
            <span className="text-lg font-bold text-[#2170FD]">{totalScans}</span>
          </div>
          <div className="flex-1 sm:flex-none flex flex-col items-center gap-1 px-6 py-3 border border-[#E2E8F0] rounded-xl bg-[#EAF2FC]">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Status</span>
            <span className="text-lg font-bold text-[#2170FD]">Aktif</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Personal Info + Change Password */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Personal Information Card */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#111C2D] mb-5">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-medium">Full Name</span>
              <span className="text-sm font-medium text-[#111C2D]">{profile.name}</span>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-medium">Email</span>
              <span className="text-sm font-medium text-[#111C2D]">{profile.email}</span>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-medium">Phone Number</span>
              <span className="text-sm font-medium text-[#111C2D]">{profile.phone}</span>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-medium">Date of Birth</span>
              <span className="text-sm font-medium text-[#111C2D]">{profile.dob}</span>
            </div>

            {/* Blood Type */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-medium">Blood Type</span>
              <span className="text-sm font-medium text-[#111C2D]">{profile.bloodType}</span>
            </div>

            {/* Allergies */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-medium">Allergies</span>
              <span className="text-sm font-medium text-[#111C2D]">{profile.allergies}</span>
            </div>

            {/* Address - Full width */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs text-[#94A3B8] font-medium">Address</span>
              <span className="text-sm font-medium text-[#111C2D]">{profile.address}</span>
            </div>
          </div>
        </div>

        {/* Change Password Card + Logout */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Change Password */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111C2D]">Change Password</h3>
              <button
                onClick={() => setIsPasswordOpen(true)}
                className="flex items-center gap-1.5 bg-[#2170FD] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Change
              </button>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Keep your account secure by using a strong password and updating it regularly.
            </p>
          </div>

          {/* Logout Button */}
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#DC2626] border border-[#DC2626] hover:bg-red-50 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePassword isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} />

      {/* Edit Profile Modal */}
      <EditProfile
        isOpen={isEditOpen}
        currentProfile={profile}
        onClose={() => setIsEditOpen(false)}
        onSave={handleProfileUpdate}
      />
    </div>
  );
}
