import { SessionData } from "./types";

/**
 * Client-side session retrieval
 */
export function getSavedSession(): SessionData | null {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem("hv_session");
  if (!session) return null;
  try {
    const parsed = JSON.parse(session);
    if (parsed && typeof parsed.userId === "string" && typeof parsed.role === "string") {
      parsed.name = String(parsed.name).replace(/<[^>]*>/g, ""); // stored XSS sanitization
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Client-side session saving
 */
export function saveSession(
  userId: string,
  role: "doctor" | "patient",
  name: string,
  accessToken?: string,
  refreshToken?: string
) {
  if (typeof window === "undefined") return;
  const sanitizedName = String(name).replace(/<[^>]*>/g, "");
  localStorage.setItem(
    "hv_session",
    JSON.stringify({
      userId: String(userId).replace(/[^\w-]/g, ""),
      role,
      name: sanitizedName,
      accessToken,
      refreshToken,
    })
  );
}

