"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  job_title: string;
  department: string;
  applied_date: string;
  resume_score: number;
  status: "NEW" | "REVIEWING" | "INTERVIEW_SCHEDULED" | "REJECTED" | "HIRED";
  source: string;
}

const statusClasses: Record<Applicant["status"], string> = {
  NEW: "text-blue-600 dark:text-blue-400",
  REVIEWING: "text-yellow-600 dark:text-yellow-400",
  INTERVIEW_SCHEDULED: "text-purple-600 dark:text-purple-400",
  REJECTED: "text-red-600 dark:text-red-400",
  HIRED: "text-green-600 dark:text-green-400"
};

const mockApplicants: Applicant[] = [
  { id: "1", name: "Mohammed Ahmed", email: "mohammed.a@email.com", phone: "+966 50 111 2222", job_title: "Senior Backend Engineer", department: "Engineering", applied_date: "2026-03-04", resume_score: 88, status: "REVIEWING", source: "LinkedIn" },
  { id: "2", name: "Nora Abdullah", email: "nora.abdullah@email.com", phone: "+966 55 222 3333", job_title: "UX Designer", department: "Design", applied_date: "2026-03-03", resume_score: 92, status: "INTERVIEW_SCHEDULED", source: "Company Website" },
  { id: "3", name: "Faisal Ibrahim", email: "faisal.i@email.com", phone: "+966 50 333 4444", job_title: "Frontend Developer", department: "Engineering", applied_date: "2026-03-02", resume_score: 85, status: "REVIEWING", source: "Indeed" },
  { id: "4", name: "Maha Salem", email: "maha.salem@email.com", phone: "+966 55 444 5555", job_title: "Data Analyst", department: "Analytics", applied_date: "2026-03-01", resume_score: 78, status: "NEW", source: "LinkedIn" },
  { id: "5", name: "Hassan Yousef", email: "hassan.y@email.com", phone: "+966 50 555 6666", job_title: "Product Manager", department: "Product", applied_date: "2026-02-28", resume_score: 90, status: "INTERVIEW_SCHEDULED", source: "Referral" },
  { id: "6", name: "Reem Al-Mutairi", email: "reem.mutairi@email.com", phone: "+966 55 666 7777", job_title: "DevOps Engineer", department: "Engineering", applied_date: "2026-02-27", resume_score: 82, status: "REVIEWING", source: "Company Website" },
  { id: "7", name: "Abdullah Saeed", email: "abdullah.s@email.com", phone: "+966 50 777 8888", job_title: "HR Manager", department: "HR", applied_date: "2026-02-26", resume_score: 65, status: "REJECTED", source: "LinkedIn" },
];

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  const filtered = useMemo(() => {
    let result = applicants;

    if (status) {
      result = result.filter((applicant) => applicant.status === status as any);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((applicant) => {
        return (
          applicant.name.toLowerCase().includes(q) ||
          applicant.email.toLowerCase().includes(q) ||
          applicant.job_title.toLowerCase().includes(q) ||
          applicant.department.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [applicants, search, status]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedApplicants = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleReview = (id: string) => {
    setApplicants(applicants.map((applicant) => (applicant.id === id ? { ...applicant, status: "REVIEWING" as const } : applicant)));
  };

  const handleScheduleInterview = (id: string) => {
    setApplicants(applicants.map((applicant) => (applicant.id === id ? { ...applicant, status: "INTERVIEW_SCHEDULED" as const } : applicant)));
  };

  const handleReject = (id: string) => {
    setApplicants(applicants.map((applicant) => (applicant.id === id ? { ...applicant, status: "REJECTED" as const } : applicant)));
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Job Applicants" desc="Manage and track all job applications">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, job, or department"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="">All statuses</option>
            <option value="NEW">New</option>
            <option value="REVIEWING">Reviewing</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="REJECTED">Rejected</option>
            <option value="HIRED">Hired</option>
          </select>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs disabled:opacity-50 dark:border-gray-700 dark:text-white"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Page {page} / {Math.max(totalPages, 1)}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => (current < totalPages ? current + 1 : current))}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs disabled:opacity-50 dark:border-gray-700 dark:text-white"
            >
              Next
            </button>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Applicant Records">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No applicants found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Applicant Name</th>
                  <th className="px-3 py-2 font-medium">Job Applied</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Resume Score</th>
                  <th className="px-3 py-2 font-medium">Applied Date</th>
                  <th className="px-3 py-2 font-medium">Source</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplicants.map((applicant) => (
                  <tr key={applicant.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{applicant.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{applicant.email}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{applicant.job_title}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{applicant.department}</td>
                    <td className="px-3 py-3">
                      <span className={`font-semibold ${getScoreColor(applicant.resume_score)}`}>
                        {applicant.resume_score}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(applicant.applied_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{applicant.source}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${statusClasses[applicant.status]}`}>
                        {applicant.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/hrms/recruitment/applicants/${applicant.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          View
                        </Link>
                        <div className="relative group">
                          <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                            Actions
                          </button>
                          <div className="absolute right-0 mt-1 w-36 rounded-lg border border-gray-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 dark:border-gray-600 dark:bg-gray-800">
                            {applicant.status === "NEW" && (
                              <button
                                onClick={() => handleReview(applicant.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                              >
                                Start Review
                              </button>
                            )}
                            {applicant.status !== "INTERVIEW_SCHEDULED" && applicant.status !== "REJECTED" && (
                              <button
                                onClick={() => handleScheduleInterview(applicant.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                Schedule Interview
                              </button>
                            )}
                            {applicant.status !== "REJECTED" && (
                              <button
                                onClick={() => handleReject(applicant.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>
    </div>
  );
}
