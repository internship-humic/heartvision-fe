"use client";

import React, { useState } from "react";
import { apiFetch } from "@/utils/api";

interface EditProfileProps {
  isOpen: boolean;
  currentProfile: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    bloodType?: string;
    allergies?: string;
    address?: string;
  };
  onClose: () => void;
  onSave: (updated: any) => void;
}

export default function EditProfile({ isOpen, currentProfile, onClose, onSave }: EditProfileProps) {
  const [name, setName] = useState(currentProfile.name);
  const [email] = useState(currentProfile.email);
  const [phone, setPhone] = useState(currentProfile.phone);
  
  // Format dob to YYYY-MM-DD for native input[type=date] initialization
  const [dob, setDob] = useState(() => {
    if (!currentProfile.dob) return "";
    try {
      const parsedDate = new Date(currentProfile.dob);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split("T")[0];
      }
    } catch {}
    return currentProfile.dob;
  });
  
  const [bloodType, setBloodType] = useState(currentProfile.bloodType || "");
  const [allergies, setAllergies] = useState(currentProfile.allergies || "");
  const [address, setAddress] = useState(currentProfile.address || "");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrorMsg("Full Name is required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    let formattedDob = dob;
    try {
      const parsedDate = new Date(dob);
      if (!isNaN(parsedDate.getTime())) {
        formattedDob = parsedDate.toISOString().split("T")[0];
      }
    } catch {}

    try {
      const res = await apiFetch("/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: name,
          phone,
          dateOfBirth: formattedDob,
          bloodType,
          allergies,
          address,
        }),
      });

      if (!res.success) {
        setErrorMsg(res.error || "Failed to update profile.");
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.warn("Backend offline or error:", err);
    } finally {
      setLoading(false);
      onSave({
        name,
        email,
        phone,
        dob: formattedDob,
        bloodType,
        allergies,
        address,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-bgelem/40 shadow-2xl relative flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-6 border-b border-bgelem/25 flex justify-between items-center bg-fbc rounded-t-2xl">
          <h3 className="text-base font-bold text-texts">Personal Information</h3>
          <button onClick={onClose} className="text-textt hover:text-rose-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-[10px] font-bold text-textt uppercase">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-bgelem/50 rounded-xl px-4 py-2.5 text-xs text-texts focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-semibold"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-[10px] font-bold text-textt uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-bgelem/50 rounded-xl px-4 py-2.5 text-xs text-textt focus:outline-none transition-all font-semibold bg-slate-50 cursor-not-allowed"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-[10px] font-bold text-textt uppercase">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-bgelem/50 rounded-xl px-4 py-2.5 text-xs text-texts focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-semibold"
              />
            </div>

            {/* Date of Birth (Calendar Picker) */}
            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-[10px] font-bold text-textt uppercase">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border border-bgelem/50 rounded-xl px-4 py-2 text-xs text-texts focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-semibold bg-white"
              />
            </div>

            {/* Blood Type */}
            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-[10px] font-bold text-textt uppercase">Blood Type</label>
              <input
                type="text"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full border border-bgelem/50 rounded-xl px-4 py-2.5 text-xs text-texts focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-semibold"
                placeholder="e.g. O+"
              />
            </div>

            {/* Allergies */}
            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-[10px] font-bold text-textt uppercase">Allergies</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full border border-bgelem/50 rounded-xl px-4 py-2.5 text-xs text-texts focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-semibold"
                placeholder="e.g. None"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5 sm:col-span-2 col-span-1">
              <label className="text-[10px] font-bold text-textt uppercase">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full border border-bgelem/50 rounded-xl px-4 py-2.5 text-xs text-texts focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-semibold leading-relaxed"
                placeholder="Enter your address..."
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl py-3.5 text-xs transition-all shadow-md shadow-primary/10 cursor-pointer disabled:opacity-75 mt-4"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
