import { apiClient } from "@/lib/api-client";

export interface Department {
  id: string;
  name: string;
  code: string;
  parent_department_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface CreateDepartmentPayload {
  name: string;
  code: string;
  parent_department_id?: string;
  is_active?: boolean;
}

export const departmentsService = {
  list: (params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Department>> => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<Department>>(`/api/departments${suffix}`);
  },

  create: (payload: CreateDepartmentPayload): Promise<Department> =>
    apiClient.post<Department>("/api/departments", payload)
};
