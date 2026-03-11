import { apiClient } from "@/lib/api-client";
import { authStorage } from "@/lib/auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type EmploymentStatus = "PROBATION" | "CONFIRMED" | "SUSPENDED" | "RESIGNED" | "TERMINATED";

export interface CompanyWorkforceRecord {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  employment_status: EmploymentStatus;
  hire_date: string;
  is_active: boolean;
  created_at: string;
  current_assignment: {
    department_id: string;
    department_name: string;
    position_id: string;
    position_title: string;
    manager_employee_id: string | null;
    manager_name: string | null;
  } | null;
}

export interface CompanyTimelineEvent {
  id: number;
  type: "anniversary" | "onboarding" | "event";
  title: string;
  user: string;
  role: string;
  date: string;
  time: string;
  impact: string;
  location?: string;
  attendees?: number;
  status: "Live" | "Scheduled" | "Upcoming";
}

export interface CompanyOrgChartResponse {
  leader: CompanyWorkforceRecord | null;
  departments: Array<{
    department_name: string;
    head: CompanyWorkforceRecord;
    headcount: number;
  }>;
  metrics: {
    total_nodes: number;
    span_index: number;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const companyService = {
  listWorkforce: (params: {
    page?: number;
    limit?: number;
    search?: string;
    department_id?: string;
    employment_status?: EmploymentStatus;
  } = {}): Promise<PaginatedResponse<CompanyWorkforceRecord>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<CompanyWorkforceRecord>>(`/api/company/workforce${suffix}`);
  },

  listTimeline: (params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<CompanyTimelineEvent>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<CompanyTimelineEvent>>(`/api/company/timeline${suffix}`);
  },

  getOrgChart: (): Promise<CompanyOrgChartResponse> => apiClient.get<CompanyOrgChartResponse>("/api/company/org-chart"),

  downloadWorkforceCsv: async (params: {
    search?: string;
    department_id?: string;
    employment_status?: EmploymentStatus;
  } = {}): Promise<{ blob: Blob; fileName: string }> => {
    const snapshot = authStorage.get();
    const token = snapshot?.tokens.access_token;
    if (!token) {
      throw new Error("Unauthorized");
    }

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";

    const response = await fetch(`${API_BASE_URL}/api/company/workforce/export${suffix}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      throw new Error("Failed to export workforce CSV");
    }

    const disposition = response.headers.get("content-disposition") ?? "";
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const fileName = match?.[1] ?? "company-workforce.csv";
    const blob = await response.blob();
    return { blob, fileName };
  },

  downloadTimelineCsv: async (params: { search?: string } = {}): Promise<{ blob: Blob; fileName: string }> => {
    const snapshot = authStorage.get();
    const token = snapshot?.tokens.access_token;
    if (!token) {
      throw new Error("Unauthorized");
    }

    const query = new URLSearchParams();
    if (params.search) {
      query.set("search", params.search);
    }
    const suffix = query.toString() ? `?${query.toString()}` : "";

    const response = await fetch(`${API_BASE_URL}/api/company/timeline/export${suffix}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      throw new Error("Failed to export timeline CSV");
    }

    const disposition = response.headers.get("content-disposition") ?? "";
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const fileName = match?.[1] ?? "company-timeline.csv";
    const blob = await response.blob();
    return { blob, fileName };
  }
};
