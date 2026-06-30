export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SessionData {
  userId: string;
  role: "doctor" | "patient";
  name: string;
  accessToken?: string;
  refreshToken?: string;
}
