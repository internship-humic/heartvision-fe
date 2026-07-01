import { useState, useEffect } from "react";
import { ApiResponse } from "./types";
import { getSavedSession, saveSession } from "./session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

/**
 * Helper to resolve backend filesystem paths to accessible HTTP URLs
 */
export function getMediaUrl(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const normalized = path.replace(/\\/g, "/");
  const uploadsIndex = normalized.indexOf("uploads/");
  if (uploadsIndex !== -1) {
    const relativePath = normalized.substring(uploadsIndex);
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
    const domain = apiBase.replace(/\/api$/, "");
    return `${domain}/${relativePath}`;
  }
  return path;
}

/**
 * Enhanced apiFetch with custom timeout and transparent JWT refresh logic
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const sanitizedEndpoint = endpoint.replace(/\.\./g, "");
  const url = `${API_BASE_URL}${sanitizedEndpoint}`;

  // Set up 30s timeout (supports large X-ray uploads)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("X-Requested-With", "XMLHttpRequest");

  // Attach Bearer token if session exists
  const session = getSavedSession();
  if (session?.accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "same-origin",
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Dynamic JWT Token Refresh implementation
    if (response.status === 401 && endpoint !== "/auth/refresh-token") {
      if (session?.refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({ refreshToken: session.refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshResult = await refreshResponse.json();
            if (refreshResult?.success && refreshResult?.data?.accessToken) {
              const newAccessToken = refreshResult.data.accessToken;
              saveSession(session.userId, session.role, session.name, newAccessToken, session.refreshToken);

              // Retry original call with new token
              const retryHeaders = new Headers(options.headers || {});
              if (!(options.body instanceof FormData) && !retryHeaders.has("Content-Type")) {
                retryHeaders.set("Content-Type", "application/json");
              }
              retryHeaders.set("X-Requested-With", "XMLHttpRequest");
              retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

              return apiFetch(endpoint, { ...options, headers: retryHeaders });
            }
          }
        } catch (refreshErr) {
          console.warn("Auth token refresh request failed:", refreshErr);
        }
      }

      // Logout on refresh failure or expired refresh token
      if (typeof window !== "undefined") {
        localStorage.removeItem("hv_session");
      }
    }

    const contentType = response.headers.get("content-type");
    let data: any = {};
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { text: await response.text() };
    }

    if (!response.ok) {
      let errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
      if (data.errors && Array.isArray(data.errors)) {
        const details = data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
        errorMessage += ` (${details})`;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    // Wrap backend response format
    return {
      success: true,
      data: data.data || data,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn("API Fetch warning/offline:", error);

    const isTimeout = error.name === "AbortError";
    return {
      success: false,
      error: isTimeout
        ? "Request timed out."
        : error.message || "Network error. Please make sure the backend server is running.",
    };
  }
}

/**
 * Custom React hook to fetch remote images via client-side fetch (which bypasses
 * Helmet's CORP Cross-Origin-Resource-Policy same-origin restriction using CORS).
 */
export function useSafeImageSrc(src: string | undefined | null, fallback = "/landing/female-doctor-hero-white.png"): string {
  const [resolvedSrc, setResolvedSrc] = useState<string>(() => {
    if (!src) return fallback;
    const isRemote = src.startsWith("http://") || src.startsWith("https://");
    if (!isRemote || src.startsWith("data:") || src.startsWith("blob:")) {
      return src;
    }
    return src;
  });

  useEffect(() => {
    if (!src) {
      setResolvedSrc(fallback);
      return;
    }

    const cleanSrc: string = src;

    // Only fetch remote HTTP/HTTPS images to bypass CORP
    const isRemote = cleanSrc.startsWith("http://") || cleanSrc.startsWith("https://");
    if (!isRemote || cleanSrc.startsWith("data:") || cleanSrc.startsWith("blob:")) {
      setResolvedSrc(cleanSrc);
      return;
    }

    let active = true;
    let objectUrl = "";

    async function fetchImage() {
      try {
        const res = await fetch(cleanSrc, {
          method: "GET",
          credentials: "omit",
        });
        if (!res.ok) throw new Error("Failed to load image");
        const blob = await res.blob();
        if (active) {
          objectUrl = URL.createObjectURL(blob);
          setResolvedSrc(objectUrl);
        }
      } catch {
        if (active) {
          setResolvedSrc(fallback);
        }
      }
    }

    fetchImage();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src, fallback]);

  return resolvedSrc;
}

/**
 * Client-side session clearing
 */
export function clearSession() {
  if (typeof window === "undefined") return;
  const session = getSavedSession();
  const token = session?.refreshToken;
  const userId = session?.userId;

  localStorage.removeItem("hv_session");
  if (userId) {
    localStorage.removeItem(`hv_avatar_${userId}`);
  }
  localStorage.removeItem("hv_avatar");

  if (token) {
    apiFetch("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: token }),
    }).catch(() => { });
  }
}

