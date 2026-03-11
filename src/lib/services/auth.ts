import { apiClient } from "@/lib/api-client";

export interface AuthUser {
  id: string;
  company_slug: string;
  role_id: string;
  full_name: string;
  email: string;
  permissions: string[];
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface LoginPayload {
  company_slug: string;
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  role_id: string;
  full_name: string;
}

export const authService = {
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>("/api/auth/login", payload, { auth: false }),

  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>("/api/auth/register", payload, { auth: false }),

  logout: (refreshToken: string): Promise<null> =>
    apiClient.post<null>("/api/auth/logout", { refresh_token: refreshToken }, { auth: false })
};
