import { authEvents, authStorage } from "@/lib/auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export class ApiClientError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: unknown;
  details?: unknown;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  retryOnUnauthorized?: boolean;
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return null as T;
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    const message = payload?.message ?? `Request failed with status ${response.status}`;
    throw new ApiClientError(message, response.status, payload?.details ?? null);
  }

  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    throw new ApiClientError("Invalid API response format", response.status, null);
  }

  if ("pagination" in payload) {
    return {
      data: payload.data,
      pagination: payload.pagination
    } as T;
  }

  return payload.data as T;
};

const refreshAccessToken = async (): Promise<boolean> => {
  const snapshot = authStorage.get();
  if (!snapshot?.tokens.refresh_token) {
    return false;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: snapshot.tokens.refresh_token })
  });

  if (!response.ok) {
    authStorage.clear();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(authEvents.signedOut));
    }
    return false;
  }

  const data = await parseResponse<{
    user: StoredUser;
    tokens: StoredTokens;
  }>(response);

  authStorage.set({
    user: data.user,
    tokens: data.tokens
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(authEvents.tokensUpdated));
  }

  return true;
};

type StoredUser = {
  id: string;
  company_slug: string;
  role_id: string;
  full_name: string;
  email: string;
  permissions: string[];
};

type StoredTokens = {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: string;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { body, auth = true, retryOnUnauthorized = true, headers, ...rest } = options;
  const snapshot = authStorage.get();
  const accessToken = snapshot?.tokens.access_token;

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(headers ?? {}),
    ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed";
    throw new ApiClientError(`Network error contacting ${API_BASE_URL}: ${message}`, 0, null);
  }

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      throw new ApiClientError("Unauthorized", 401, null);
    }

    return request<T>(path, { ...options, retryOnUnauthorized: false });
  }

  return parseResponse<T>(response);
};

export const apiClient = {
  get: <T>(path: string, options: Omit<RequestOptions, "method" | "body"> = {}) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) =>
    request<T>(path, { ...options, method: "POST", body }),

  patch: <T>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) =>
    request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options: Omit<RequestOptions, "method" | "body"> = {}) =>
    request<T>(path, { ...options, method: "DELETE" })
};
