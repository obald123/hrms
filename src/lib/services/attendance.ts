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

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  shift_id: string | null;
  date: string;
  check_in: string | null;
  check_out: string | null;
  check_in_type: "BIOMETRIC" | "GPS" | "MANUAL" | null;
  check_out_type: "BIOMETRIC" | "GPS" | "MANUAL" | null;
  status: "PRESENT" | "LATE" | "ABSENT" | "HALF_DAY";
  late_minutes: number;
  is_absent: boolean;
  created_at: string;
  employee: {
    first_name: string;
    last_name: string;
    employee_code: string;
  };
}

export interface AttendanceSummary {
  date: string;
  totals: {
    employees: number;
    active: number;
  };
  attendance: {
    present: number;
    absent: number;
    late: number;
    attendanceRate: number;
  };
  breakdown: Record<string, number>;
}

export interface ShiftRecord {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  grace_minutes: number;
  is_night: boolean;
  created_at: string;
  updated_at: string;
  _count: {
    rotations: number;
  };
}

export interface OvertimeRecord {
  id: string;
  employee_id: string;
  date: string;
  hours: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  employee: {
    first_name: string;
    last_name: string;
    employee_code: string;
  };
}

export interface LeaveRequestRecord {
  id: string;
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  reason: string | null;
  approved_by_id: string | null;
  created_at: string;
  updated_at: string;
  employee: {
    first_name: string;
    last_name: string;
    employee_code: string;
  };
  leave_type: {
    name: string;
  };
}

export interface LeaveTypeRecord {
  id: string;
  name: string;
  policy: {
    name: string;
  };
}

export interface LeavePolicyRecord {
  id: string;
  name: string;
  days_per_year: number;
  allow_carry_forward: boolean;
  max_carry_days: number | null;
  requires_approval: boolean;
}

export interface MyTodayAttendance {
  employee_id: string;
  attendance: AttendanceRecord | null;
}

export const attendanceService = {
  list: (params: { page?: number; limit?: number; employee_id?: string; date_from?: string; date_to?: string } = {}) => {
    const normalized = {
      ...params,
      ...(params.limit !== undefined ? { limit: clampLimit(params.limit) } : {})
    };
    const query = new URLSearchParams();
    Object.entries(normalized).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<AttendanceRecord>>(`/api/attendance${suffix}`);
  },

  checkIn: (payload: {
    employee_id: string;
    shift_id?: string;
    date?: string;
    check_in?: string;
    check_in_type?: "BIOMETRIC" | "GPS" | "MANUAL";
    latitude?: number;
    longitude?: number;
  }) => apiClient.post<AttendanceRecord>("/api/attendance/check-in", payload),

  checkOut: (
    attendanceId: string,
    payload: {
      check_out?: string;
      check_out_type?: "BIOMETRIC" | "GPS" | "MANUAL";
      latitude?: number;
      longitude?: number;
    }
  ) => apiClient.post<AttendanceRecord>(`/api/attendance/${attendanceId}/check-out`, payload),

  summary: (params: { date?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.date) {
      query.set("date", params.date);
    }
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<AttendanceSummary>(`/api/attendance/summary${suffix}`);
  },

  listShifts: (params: { page?: number; limit?: number; search?: string } = {}) => {
    const normalized = {
      ...params,
      ...(params.limit !== undefined ? { limit: clampLimit(params.limit) } : {})
    };
    const query = new URLSearchParams();
    Object.entries(normalized).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<ShiftRecord>>(`/api/attendance/shifts${suffix}`);
  },

  createShift: (payload: {
    name: string;
    start_time: string;
    end_time: string;
    grace_minutes?: number;
    is_night?: boolean;
  }) => apiClient.post<ShiftRecord>("/api/attendance/shifts", payload),

  listOvertime: (params: {
    page?: number;
    limit?: number;
    employee_id?: string;
    date_from?: string;
    date_to?: string;
    approved?: boolean;
  } = {}) => {
    const normalized = {
      ...params,
      ...(params.limit !== undefined ? { limit: clampLimit(params.limit) } : {})
    };
    const query = new URLSearchParams();
    Object.entries(normalized).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<OvertimeRecord>>(`/api/attendance/overtime${suffix}`);
  },

  createOvertime: (payload: { employee_id: string; date: string; hours: number }) =>
    apiClient.post<OvertimeRecord>("/api/attendance/overtime", payload),

  approveOvertime: (overtimeId: string) => apiClient.patch<null>(`/api/attendance/overtime/${overtimeId}/approve`),

  listLeaveRequests: (params: {
    page?: number;
    limit?: number;
    employee_id?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    date_from?: string;
    date_to?: string;
  } = {}) => {
    const normalized = {
      ...params,
      ...(params.limit !== undefined ? { limit: clampLimit(params.limit) } : {})
    };
    const query = new URLSearchParams();
    Object.entries(normalized).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<LeaveRequestRecord>>(`/api/attendance/leave-requests${suffix}`);
  },

  listLeaveTypes: (params: { page?: number; limit?: number } = {}) => {
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
    return apiClient.get<PaginatedResponse<LeaveTypeRecord>>(`/api/attendance/leave-types${suffix}`);
  },

  listLeavePolicies: (params: { page?: number; limit?: number } = {}) => {
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
    return apiClient.get<PaginatedResponse<LeavePolicyRecord>>(`/api/attendance/leave-policies${suffix}`);
  },

  createLeaveType: (payload: { name: string; policy_id?: string }) =>
    apiClient.post<LeaveTypeRecord>("/api/attendance/leave-types", payload),

  createLeaveRequest: (payload: {
    employee_id: string;
    leave_type_id: string;
    start_date: string;
    end_date: string;
    total_days: number;
    reason?: string;
  }) => apiClient.post<LeaveRequestRecord>("/api/attendance/leave-requests", payload),

  updateLeaveRequestStatus: (leaveRequestId: string, payload: { status: "APPROVED" | "REJECTED" | "CANCELLED" }) =>
    apiClient.patch<null>(`/api/attendance/leave-requests/${leaveRequestId}/status`, payload),

  myToday: () => apiClient.get<MyTodayAttendance>("/api/attendance/me/today"),

  checkInSelf: (payload: {
    shift_id?: string;
    date?: string;
    check_in?: string;
    check_in_type?: "BIOMETRIC" | "GPS" | "MANUAL";
    latitude?: number;
    longitude?: number;
  }) => apiClient.post<AttendanceRecord>("/api/attendance/me/check-in", payload),

  checkOutSelf: (payload: {
    check_out?: string;
    check_out_type?: "BIOMETRIC" | "GPS" | "MANUAL";
    latitude?: number;
    longitude?: number;
  }) => apiClient.post<AttendanceRecord>("/api/attendance/me/check-out", payload)
};
