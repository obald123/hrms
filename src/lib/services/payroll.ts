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

export type PayrollPeriodStatus = "OPEN" | "PROCESSING" | "CLOSED";
export type PayrollRunStatus = "DRAFT" | "FINALIZED";

export interface PayrollPeriodRecord {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: PayrollPeriodStatus;
  created_at: string;
  updated_at: string;
  _count?: {
    payroll_runs: number;
  };
}

export interface PayrollRunRecord {
  id: string;
  payroll_period_id: string;
  status: PayrollRunStatus;
  processed_by_user_id: string;
  processed_at: string;
  created_at: string;
  payroll_period: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: PayrollPeriodStatus;
  };
}

export interface PayrollEntryRecord {
  id: string;
  employee_id: string;
  gross_salary: number | string;
  total_earnings: number | string;
  total_deductions: number | string;
  net_salary: number | string;
  created_at: string;
  employee: {
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  components: Array<{
    id: string;
    salary_component_id: string;
    amount: number | string;
    created_at: string;
    salary_component: {
      code: string;
      name: string;
      type: "EARNING" | "DEDUCTION";
    };
  }>;
}

export interface PayrollSummary {
  periods: {
    total: number;
    open: number;
    processing: number;
    closed: number;
  };
  runs: {
    total: number;
    draft: number;
    finalized: number;
  };
  latest_run: PayrollRunRecord | null;
  totals: {
    employee_count: number;
    gross_salary: number;
    total_earnings: number;
    total_deductions: number;
    net_salary: number;
  };
}

export interface PayrollLoanRecord {
  id: string;
  employee_id: string;
  loan_type: string;
  principal_amount: number | string;
  disbursed_amount: number | string;
  outstanding_amount: number | string;
  interest_rate: number | string;
  tenure_months: number;
  monthly_emi: number | string;
  sanctioned_date: string;
  status: "ACTIVE" | "CLOSED" | "REJECTED";
  notes: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  employee: {
    employee_code: string;
    first_name: string;
    last_name: string;
  };
}

export interface ReimbursementRecord {
  id: string;
  employee_id: string;
  expense_type: string;
  description: string;
  amount: number | string;
  expense_date: string;
  invoice_no: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by_user_id: string | null;
  created_at: string;
  updated_at: string;
  employee: {
    employee_code: string;
    first_name: string;
    last_name: string;
  };
}

export const payrollService = {
  listPeriods: (params: { page?: number; limit?: number; status?: PayrollPeriodStatus } = {}) => {
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
    return apiClient.get<PaginatedResponse<PayrollPeriodRecord>>(`/api/payroll/periods${suffix}`);
  },

  getPeriod: (periodId: string) => apiClient.get<PayrollPeriodRecord>(`/api/payroll/period/${periodId}`),

  createPeriod: (payload: { name: string; start_date: string; end_date: string }) =>
    apiClient.post<PayrollPeriodRecord>("/api/payroll/period", payload),

  runPayroll: (periodId: string) => apiClient.post<PayrollRunRecord>(`/api/payroll/run/${periodId}`),

  listRuns: (params: { page?: number; limit?: number; period_id?: string; status?: PayrollRunStatus } = {}) => {
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
    return apiClient.get<PaginatedResponse<PayrollRunRecord>>(`/api/payroll/runs${suffix}`);
  },

  finalizeRun: (runId: string) => apiClient.post<PayrollRunRecord>(`/api/payroll/run/${runId}/finalize`),

  getRun: (runId: string) => apiClient.get<PayrollRunRecord>(`/api/payroll/run/${runId}`),

  listEntries: (runId: string, params: { page?: number; limit?: number; employee_id?: string } = {}) => {
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
    return apiClient.get<PaginatedResponse<PayrollEntryRecord>>(`/api/payroll/run/${runId}/entries${suffix}`);
  },

  summary: (params: { run_id?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.run_id) {
      query.set("run_id", params.run_id);
    }
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PayrollSummary>(`/api/payroll/summary${suffix}`);
  },

  listLoans: (params: {
    page?: number;
    limit?: number;
    employee_id?: string;
    status?: "ACTIVE" | "CLOSED" | "REJECTED";
    search?: string;
  } = {}) => {
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
    return apiClient.get<PaginatedResponse<PayrollLoanRecord>>(`/api/payroll/loans${suffix}`);
  },

  createLoan: (payload: {
    employee_id: string;
    loan_type: string;
    principal_amount: number;
    disbursed_amount?: number;
    interest_rate: number;
    tenure_months: number;
    monthly_emi?: number;
    sanctioned_date: string;
    notes?: string;
  }) => apiClient.post<PayrollLoanRecord>("/api/payroll/loans", payload),

  updateLoanStatus: (
    loanId: string,
    payload: { status: "ACTIVE" | "CLOSED" | "REJECTED"; outstanding_amount?: number; notes?: string }
  ) => apiClient.patch<null>(`/api/payroll/loans/${loanId}/status`, payload),

  listReimbursements: (params: {
    page?: number;
    limit?: number;
    employee_id?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
    expense_type?: string;
    search?: string;
  } = {}) => {
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
    return apiClient.get<PaginatedResponse<ReimbursementRecord>>(`/api/payroll/reimbursements${suffix}`);
  },

  createReimbursement: (payload: {
    employee_id: string;
    expense_type: string;
    description: string;
    amount: number;
    expense_date: string;
    invoice_no?: string;
    notes?: string;
  }) => apiClient.post<ReimbursementRecord>("/api/payroll/reimbursements", payload),

  updateReimbursementStatus: (
    reimbursementId: string,
    payload: { status: "PENDING" | "APPROVED" | "REJECTED" | "PAID"; notes?: string }
  ) => apiClient.patch<null>(`/api/payroll/reimbursements/${reimbursementId}/status`, payload)
};
