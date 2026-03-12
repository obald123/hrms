import { ApiClientError, apiClient } from "@/lib/api-client";
import { authStorage } from "@/lib/auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://hrms2026.dtecsoftwaresolutions.com";

type JobStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "PUBLISHED" | "CLOSED";

export interface JobPosting {
  id: string;
  title: string;
  employment_type: "PERMANENT" | "CONTRACT" | "INTERN" | "CONSULTANT";
  location: string;
  status: JobStatus;
  created_at: string;
  published_at: string | null;
  department: {
    name: string;
  };
  position: {
    title: string;
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

export interface ListJobsParams {
  page?: number;
  limit?: number;
  status?: JobStatus;
  search?: string;
}

export interface JobApplicant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: "APPLIED" | "SCREENING" | "SHORTLISTED" | "INTERVIEW" | "OFFERED" | "HIRED" | "REJECTED";
  ai_score: number | null;
  applied_at: string;
  updated_at: string;
}

export type ApplicantFileType = "resume" | "cover-letter";

export interface ListApplicantsParams {
  page?: number;
  limit?: number;
  status?: JobApplicant["status"];
  search?: string;
}

interface RankCandidateResult {
  applicant_id: string;
  overall_score: number;
}

interface InterviewPayload {
  applicant_id: string;
  interviewer_user_id: string;
  scheduled_at: string;
  duration_minutes: number;
  location_or_meeting_link: string;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export interface InterviewRecord {
  id: string;
  applicant_id: string;
  interviewer_user_id: string;
  scheduled_at: string;
  duration_minutes: number;
  location_or_meeting_link: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  created_at: string;
  updated_at: string;
  applicant: {
    first_name: string;
    last_name: string;
    email: string;
    job_posting: {
      title: string;
    };
  };
  interviewer_user: {
    full_name: string;
    email: string;
  };
}

export interface InterviewerRecord {
  id: string;
  full_name: string;
  email: string;
  role: {
    name: string;
  };
}

interface GenerateOfferPayload {
  template_id: string;
  offered_salary: number;
  start_date: string;
}

interface CreateJobPayload {
  department_id: string;
  position_id: string;
  title: string;
  description: string;
  employment_type: "PERMANENT" | "CONTRACT" | "INTERN" | "CONSULTANT";
  location: string;
  salary_range_min?: number;
  salary_range_max?: number;
  status?: "DRAFT" | "PENDING_APPROVAL";
  stages?: Array<{ name: string; order: number }>;
}

export interface OfferRecord {
  id: string;
  applicant_id: string;
  template_id: string;
  offered_salary: number;
  start_date: string;
  status: "SENT" | "ACCEPTED" | "DECLINED";
  sent_at: string;
  accepted_at: string | null;
  declined_at: string | null;
  generated_pdf_url: string | null;
  created_at: string;
  updated_at: string;
  applicant: {
    first_name: string;
    last_name: string;
    email: string;
    job_posting: {
      title: string;
      department: {
        name: string;
      };
    };
  };
  template: {
    name: string;
  };
}

export interface OfferTemplateRecord {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface OnboardingRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: "OFFERED" | "HIRED";
  updated_at: string;
  applied_at: string;
  hired_employee_id: string | null;
  job_posting: {
    title: string;
    department: {
      name: string;
    };
  };
  offer_letters: Array<{
    id: string;
    status: "SENT" | "ACCEPTED" | "DECLINED";
    start_date: string;
    sent_at: string;
    accepted_at: string | null;
  }>;
}

export interface CareerJob {
  id: string;
  company_id: string;
  title: string;
  description: string;
  employment_type: "PERMANENT" | "CONTRACT" | "INTERN" | "CONSULTANT";
  location: string;
  salary_range_min: number | string | null;
  salary_range_max: number | string | null;
  published_at: string | null;
  department: {
    id: string;
    name: string;
  };
  position: {
    id: string;
    title: string;
  };
}

export interface ListCareersParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
}

export interface CareerApplicationPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  resume_file_name: string;
  resume_file_base64: string;
  resume_mime_type?: string;
  cover_letter_file_name: string;
  cover_letter_file_base64: string;
  cover_letter_mime_type?: string;
}

export const atsService = {
  listJobs: (params: ListJobsParams = {}): Promise<PaginatedResponse<JobPosting>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<JobPosting>>(`/api/jobs${suffix}`);
  },

  listJobApplicants: (jobId: string, params: ListApplicantsParams = {}): Promise<PaginatedResponse<JobApplicant>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<JobApplicant>>(`/api/jobs/${jobId}/applicants${suffix}`);
  },

  updateApplicantStatus: (
    applicantId: string,
    payload: { status: JobApplicant["status"]; stage_id?: string }
  ): Promise<JobApplicant> => apiClient.patch<JobApplicant>(`/api/applicants/${applicantId}/status`, payload),

  rankCandidates: (jobId: string): Promise<RankCandidateResult[]> =>
    apiClient.post<RankCandidateResult[]>(`/api/jobs/${jobId}/rank-candidates`),

  createJob: (payload: CreateJobPayload): Promise<{ id: string }> =>
    apiClient.post<{ id: string }>("/api/jobs", payload),

  approveJob: (jobId: string): Promise<{ id: string; status: string }> =>
    apiClient.post<{ id: string; status: string }>(`/api/jobs/${jobId}/approve`),

  publishJob: (jobId: string): Promise<{ id: string; status: string }> =>
    apiClient.post<{ id: string; status: string }>(`/api/jobs/${jobId}/publish`),

  createInterview: (payload: InterviewPayload): Promise<{ id: string }> =>
    apiClient.post<{ id: string }>("/api/interviews", payload),

  listInterviews: (params: {
    page?: number;
    limit?: number;
    status?: InterviewRecord["status"];
    applicant_id?: string;
    interviewer_user_id?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  } = {}): Promise<PaginatedResponse<InterviewRecord>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<InterviewRecord>>(`/api/interviews${suffix}`);
  },

  listInterviewers: (params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<InterviewerRecord>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<InterviewerRecord>>(`/api/interviewers${suffix}`);
  },

  generateOffer: (applicantId: string, payload: GenerateOfferPayload): Promise<{ id: string; status: string }> =>
    apiClient.post<{ id: string; status: string }>(`/api/offers/${applicantId}/generate`, payload),

  acceptOffer: (offerId: string): Promise<{ employeeId: string }> =>
    apiClient.post<{ employeeId: string }>(`/api/offers/${offerId}/accept`),

  listOffers: (params: {
    page?: number;
    limit?: number;
    status?: OfferRecord["status"];
    applicant_id?: string;
    search?: string;
  } = {}): Promise<PaginatedResponse<OfferRecord>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<OfferRecord>>(`/api/offers${suffix}`);
  },

  listOfferTemplates: (params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<OfferTemplateRecord>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<OfferTemplateRecord>>(`/api/offer-templates${suffix}`);
  },

  listOnboarding: (params: { page?: number; limit?: number; status?: OnboardingRecord["status"]; search?: string } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<OnboardingRecord>>(`/api/onboarding${suffix}`);
  },

  updateOffer: (
    offerId: string,
    payload: {
      offered_salary?: number;
      start_date?: string;
    }
  ): Promise<OfferRecord> => apiClient.patch<OfferRecord>(`/api/offers/${offerId}`, payload),

  resendOffer: (offerId: string): Promise<OfferRecord> => apiClient.post<OfferRecord>(`/api/offers/${offerId}/resend`),

  deleteOffer: (offerId: string): Promise<null> => apiClient.delete<null>(`/api/offers/${offerId}`),

  listCareers: (params: ListCareersParams = {}): Promise<PaginatedResponse<CareerJob>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<PaginatedResponse<CareerJob>>(`/careers${suffix}`, { auth: false });
  },

  getCareerJob: (jobId: string): Promise<CareerJob> => apiClient.get<CareerJob>(`/careers/${jobId}`, { auth: false }),

  applyCareer: async (jobId: string, payload: CareerApplicationPayload): Promise<{ id: string; status: string; applied_at: string }> => {
    try {
      return await apiClient.post<{ id: string; status: string; applied_at: string }>(`/careers/${jobId}/apply`, payload, { auth: false });
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 404) {
        return apiClient.post<{ id: string; status: string; applied_at: string }>(`/public/jobs/${jobId}/apply`, payload, { auth: false });
      }

      throw error;
    }
  },

  downloadApplicantFile: async (applicantId: string, fileType: ApplicantFileType): Promise<{ blob: Blob; fileName: string }> => {
    const snapshot = authStorage.get();
    const token = snapshot?.tokens.access_token;
    if (!token) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(`${API_BASE_URL}/api/applicants/${applicantId}/files/${fileType}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(payload?.message ?? "Failed to download file");
    }

    const disposition = response.headers.get("content-disposition") ?? "";
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const fileName = match?.[1] ?? `${fileType}-${applicantId}`;
    const blob = await response.blob();
    return { blob, fileName };
  }
};

export type ApplicantWithJob = JobApplicant & {
  job_id: string;
  job_title: string;
  department_name: string;
  position_title: string;
};

export const listApplicantsAcrossJobs = async (): Promise<ApplicantWithJob[]> => {
  const jobsResponse = await atsService.listJobs({ page: 1, limit: 100 });
  const jobs = jobsResponse.data;

  const applicantsPerJob = await Promise.all(
    jobs.map(async (job) => {
      const applicants = await atsService.listJobApplicants(job.id, { page: 1, limit: 100 });
      return applicants.data.map((applicant) => ({
        ...applicant,
        job_id: job.id,
        job_title: job.title,
        department_name: job.department.name,
        position_title: job.position.title
      }));
    })
  );

  return applicantsPerJob.flat();
};
