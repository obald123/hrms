import { apiClient } from "@/lib/api-client";

export interface Position {
  id: string;
  department_id: string;
  title: string;
  code: string;
  level: number;
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

interface AssignPositionPayload {
  employee_id: string;
  department_id: string;
  position_id: string;
  manager_employee_id?: string;
  start_date: string;
}

interface CreatePositionPayload {
  department_id: string;
  title: string;
  code: string;
  level: number;
  is_active?: boolean;
}

export const positionsService = {
  list: (params: { page?: number; limit?: number; department_id?: string } = {}): Promise<PaginatedResponse<Position>> => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<Position>>(`/api/positions${suffix}`);
  },

  create: (payload: CreatePositionPayload): Promise<Position> =>
    apiClient.post<Position>("/api/positions", payload),

  assign: (payload: AssignPositionPayload): Promise<{ id: string }> =>
    apiClient.post<{ id: string }>("/api/positions/assignments", payload)
};
