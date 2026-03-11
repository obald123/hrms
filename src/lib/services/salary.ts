import { apiClient } from "@/lib/api-client";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const clampLimit = (value?: number): number | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return Math.min(100, Math.max(1, value));
};

export interface SalaryGradeRecord {
  id: string;
  name: string;
  code: string;
  min_salary: number;
  max_salary: number;
  currency: string;
  created_at: string;
  updated_at: string;
  _count: {
    salaries: number;
  };
}

export const salaryService = {
  listGrades: (params: { page?: number; limit?: number } = {}) => {
    const normalized = {
      ...params,
      ...(params.limit !== undefined ? { limit: clampLimit(params.limit) } : {})
    };
    const query = new URLSearchParams();
    Object.entries(normalized).forEach(([key, value]) => {
      if (value !== undefined) {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<SalaryGradeRecord>>(`/api/salary/grades${suffix}`);
  },

  createGrade: (payload: {
    name: string;
    code: string;
    min_salary: number;
    max_salary: number;
    currency: string;
  }) => apiClient.post<SalaryGradeRecord>("/api/salary/grades", payload)
};

