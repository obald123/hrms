import { apiClient } from "@/lib/api-client";

export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  employment_status: "PROBATION" | "CONFIRMED" | "SUSPENDED" | "RESIGNED" | "TERMINATED";
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

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListEmployeesParams {
  page?: number;
  limit?: number;
  department_id?: string;
  position_id?: string;
  employment_status?: Employee["employment_status"];
}

export interface CreateEmployeePayload {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  hire_date?: string;
  probation_end_date?: string;
  employment_status?: Employee["employment_status"];
  department_id?: string;
  position_id?: string;
  manager_employee_id?: string;
  position_start_date?: string;
  base_salary?: number;
  salary_grade_id?: string;
  salary_effective_from?: string;
}

export const employeesService = {
  list: (params: ListEmployeesParams = {}): Promise<PaginatedResponse<Employee>> => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<Employee>>(`/api/employees${suffix}`);
  },

  create: (payload: CreateEmployeePayload): Promise<Employee> => apiClient.post<Employee>("/api/employees", payload)
};
