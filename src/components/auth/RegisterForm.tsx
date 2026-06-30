"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader, InputField } from "./Shared";
import { apiFetch, saveSession } from "@/utils/api";

export default function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Consume backend register API
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password, confirmPassword, role: "patient" }),
      });

      if (res.success && res.data) {
        router.push("/?auth=sign-in");
        return;
      }

      setErrorMsg(res.error || "Registration failed.");
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <AuthHeader title="Register Now" subtitle="Start your heart health journey" />
      <form onSubmit={handleRegister} className="w-full">
        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center font-medium border border-red-100">
            {errorMsg}
          </div>
        )}
        <InputField
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e: any) => setFullName(e.target.value)}
        />
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />
        <InputField
          label="Confirm Password"
          type="password"
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(e: any) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-bold rounded-lg py-3 mt-4 hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-75"
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>

        <div className="flex items-center gap-4 my-4 w-full">
          <div className="h-[1px] flex-grow bg-bgelem/60"></div>
          <span className="text-sm text-textt font-medium">Or</span>
          <div className="h-[1px] flex-grow bg-bgelem/60"></div>
        </div>

        <Link
          href="?auth=sign-up-doctor"
          className="w-full flex justify-center border border-primary text-primary font-bold rounded-lg py-2.5 hover:bg-primary/5 transition-colors text-sm"
        >
          Register as a Doctor
        </Link>
      </form>
      <p className="text-sm text-texts mt-6 font-medium">
        Already have an account?{" "}
        <Link href="?auth=sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
