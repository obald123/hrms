"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  job_title: string;
  score: number;
  skills_match: number;
  experience: string;
  status: "SCREENING" | "INTERVIEW" | "SHORTLISTED" | "REJECTED" | "HIRED";
  applied_date: string;
}

const statusClasses: Record<Candidate["status"], string> = {
  SCREENING: "text-blue-600 dark:text-blue-400",
  INTERVIEW: "text-purple-600 dark:text-purple-400",
  SHORTLISTED: "text-green-600 dark:text-green-400",
  REJECTED: "text-red-600 dark:text-red-400",
  HIRED: "text-emerald-600 dark:text-emerald-400"
};

const mockCandidates: Candidate[] = [
  { id: "1", name: "Ahmed Al-Rashid", email: "ahmed.rashid@email.com", phone: "+966 50 123 4567", job_title: "Senior Backend Engineer", score: 92, skills_match: 95, experience: "8 years", status: "SHORTLISTED", applied_date: "2026-03-01" },
  { id: "2", name: "Sarah Mohammed", email: "sarah.m@email.com", phone: "+966 55 234 5678", job_title: "UX Designer", score: 88, skills_match: 90, experience: "5 years", status: "INTERVIEW", applied_date: "2026-02-28" },
  { id: "3", name: "Omar Abdullah", email: "omar.abdullah@email.com", phone: "+966 50 345 6789", job_title: "Frontend Developer", score: 85, skills_match: 88, experience: "6 years", status: "SHORTLISTED", applied_date: "2026-02-27" },
  { id: "4", name: "Fatima Hassan", email: "fatima.hassan@email.com", phone: "+966 55 456 7890", job_title: "Data Analyst", score: 80, skills_match: 82, experience: "4 years", status: "INTERVIEW", applied_date: "2026-02-25" },
  { id: "5", name: "Khalid Saeed", email: "khalid.s@email.com", phone: "+966 50 567 8901", job_title: "DevOps Engineer", score: 78, skills_match: 80, experience: "7 years", status: "SCREENING", applied_date: "2026-02-24" },
  { id: "6", name: "Layla Ibrahim", email: "layla.ibrahim@email.com", phone: "+966 55 678 9012", job_title: "Product Manager", score: 75, skills_match: 78, experience: "5 years", status: "SCREENING", applied_date: "2026-02-22" },
  { id: "7", name: "Yousef Ali", email: "yousef.ali@email.com", phone: "+966 50 789 0123", job_title: "HR Manager", score: 70, skills_match: 72, experience: "3 years", status: "REJECTED", applied_date: "2026-02-20" },
];

export default function CandidateRankingPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  const filtered = useMemo(() => {
    let result = candidates;

    if (status) {
      result = result.filter((candidate) => candidate.status === status as any);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((candidate) => {
        return (
          candidate.name.toLowerCase().includes(q) ||
          candidate.email.toLowerCase().includes(q) ||
          candidate.job_title.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [candidates, search, status]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedCandidates = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleShortlist = (id: string) => {
    setCandidates(candidates.map((candidate) => (candidate.id === id ? { ...candidate, status: "SHORTLISTED" as const } : candidate)));
  };

  const handleScheduleInterview = (id: string) => {
    setCandidates(candidates.map((candidate) => (candidate.id === id ? { ...candidate, status: "INTERVIEW" as const } : candidate)));
  };

  const handleReject = (id: string) => {
    setCandidates(candidates.map((candidate) => (candidate.id === id ? { ...candidate, status: "REJECTED" as const } : candidate)));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-orange-600 dark:text-orange-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Candidate Ranking" desc="AI-powered candidate assessment and ranking">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, or job title"
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
            <option value="SCREENING">Screening</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SHORTLISTED">Shortlisted</option>
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

      <ComponentCard title="Candidate Records">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No candidates found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Candidate Name</th>
                  <th className="px-3 py-2 font-medium">Job Applied</th>
                  <th className="px-3 py-2 font-medium">Score</th>
                  <th className="px-3 py-2 font-medium">Skills Match</th>
                  <th className="px-3 py-2 font-medium">Experience</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCandidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{candidate.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.email}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{candidate.job_title}</td>
                    <td className="px-3 py-3">
                      <span className={`font-semibold ${getScoreColor(candidate.score)}`}>
                        {candidate.score}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{candidate.skills_match}%</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{candidate.experience}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${statusClasses[candidate.status]}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/hrms/recruitment/candidates/${candidate.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          View
                        </Link>
                        <div className="relative group">
                          <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                            Actions
                          </button>
                          <div className="absolute right-0 mt-1 w-36 rounded-lg border border-gray-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 dark:border-gray-600 dark:bg-gray-800">
                            {candidate.status !== "SHORTLISTED" && candidate.status !== "HIRED" && (
                              <button
                                onClick={() => handleShortlist(candidate.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                              >
                                Shortlist
                              </button>
                            )}
                            {candidate.status !== "INTERVIEW" && candidate.status !== "REJECTED" && (
                              <button
                                onClick={() => handleScheduleInterview(candidate.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                Schedule Interview
                              </button>
                            )}
                            {candidate.status !== "REJECTED" && (
                              <button
                                onClick={() => handleReject(candidate.id)}
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
