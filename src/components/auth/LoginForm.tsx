"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader, InputField } from "./Shared";
import { apiFetch, saveSession } from "@/utils/api";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Consume backend login API
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data) {
        const { user, accessToken, refreshToken } = res.data;
        saveSession(user.id, user.role, user.full_name, accessToken, refreshToken);

        // Close modal and redirect based on role
        if (user.role === "doctor") {
          router.push(`/doctor/dashboard`);
        } else {
          router.push(`/patient/dashboard`);
        }
        return;
      }

      setErrorMsg(res.error || "Invalid email or password.");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <AuthHeader title="Welcome back!" subtitle="Sign in to your HeartVision account" />
      <form onSubmit={handleLogin} className="w-full">
        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center font-medium border border-red-100">
            {errorMsg}
          </div>
        )}
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
          placeholder="Enter your password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-bold rounded-lg py-3 mt-4 hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-75"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-sm text-texts mt-6 font-medium">
        Don't have an account?{" "}
        <Link href="?auth=sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
