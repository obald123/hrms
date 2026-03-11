"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: "DRAFT" | "APPROVED" | "PUBLISHED";
  applicants: number;
  createdDate: string;
  employment_type: string;
  salary_range_min: number;
  salary_range_max: number;
}

const statusClasses: Record<Job["status"], string> = {
  DRAFT: "text-gray-600 dark:text-gray-400",
  APPROVED: "text-orange-600 dark:text-orange-400",
  PUBLISHED: "text-green-600 dark:text-green-400"
};

const mockJobs: Job[] = [
  { id: "1", title: "Senior Backend Engineer", department: "Engineering", location: "Riyadh, Saudi Arabia", status: "PUBLISHED", applicants: 12, createdDate: "2026-03-01", employment_type: "PERMANENT", salary_range_min: 12000, salary_range_max: 18000 },
  { id: "2", title: "UX Designer", department: "Design", location: "Remote", status: "APPROVED", applicants: 8, createdDate: "2026-02-28", employment_type: "PERMANENT", salary_range_min: 8000, salary_range_max: 12000 },
  { id: "3", title: "Product Manager", department: "Product", location: "Riyadh, Saudi Arabia", status: "DRAFT", applicants: 0, createdDate: "2026-02-25", employment_type: "PERMANENT", salary_range_min: 10000, salary_range_max: 16000 },
  { id: "4", title: "Frontend Developer", department: "Engineering", location: "Hybrid", status: "PUBLISHED", applicants: 18, createdDate: "2026-02-20", employment_type: "PERMANENT", salary_range_min: 9000, salary_range_max: 14000 },
  { id: "5", title: "Data Analyst", department: "Analytics", location: "Remote", status: "APPROVED", applicants: 5, createdDate: "2026-02-15", employment_type: "CONTRACT", salary_range_min: 7000, salary_range_max: 11000 },
  { id: "6", title: "DevOps Engineer", department: "Engineering", location: "Hybrid", status: "PUBLISHED", applicants: 15, createdDate: "2026-02-10", employment_type: "PERMANENT", salary_range_min: 11000, salary_range_max: 17000 },
  { id: "7", title: "HR Manager", department: "Human Resources", location: "Riyadh, Saudi Arabia", status: "DRAFT", applicants: 3, createdDate: "2026-02-08", employment_type: "PERMANENT", salary_range_min: 9500, salary_range_max: 15500 },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  const filtered = useMemo(() => {
    let result = jobs;

    if (status) {
      result = result.filter((job) => job.status === status as any);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((job) => {
        return (
          job.title.toLowerCase().includes(q) ||
          job.department.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [jobs, search, status]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedJobs = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleApprove = (id: string) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, status: "APPROVED" as const } : job)));
  };

  const handlePublish = (id: string) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, status: "PUBLISHED" as const } : job)));
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Job Postings" desc="Manage and track all job openings">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by title, department, or location"
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
            <option value="DRAFT">Draft</option>
            <option value="APPROVED">Approved</option>
            <option value="PUBLISHED">Published</option>
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

      <ComponentCard title="Job Records">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No jobs found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Job Title</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Location</th>
                  <th className="px-3 py-2 font-medium">Employment Type</th>
                  <th className="px-3 py-2 font-medium">Salary Range</th>
                  <th className="px-3 py-2 font-medium">Applicants</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-100">{job.title}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{job.department}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{job.location}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{job.employment_type}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      SAR {(job.salary_range_min / 1000).toFixed(0)}K - {(job.salary_range_max / 1000).toFixed(0)}K
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{job.applicants}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${statusClasses[job.status]}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/hrms/recruitment/applicants?job=${job.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          View
                        </Link>
                        <Link
                          href={`/hrms/recruitment/jobs/${job.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                          Edit
                        </Link>
                        <div className="relative group">
                          <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                            More
                          </button>
                          <div className="absolute right-0 mt-1 w-32 rounded-lg border border-gray-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 dark:border-gray-600 dark:bg-gray-800">
                            {job.status === "DRAFT" && (
                              <button
                                onClick={() => handleApprove(job.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                              >
                                Approve
                              </button>
                            )}
                            {job.status === "APPROVED" && (
                              <button
                                onClick={() => handlePublish(job.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                              >
                                Publish
                              </button>
                            )}
                            <button className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg">
                              Delete
                            </button>
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
