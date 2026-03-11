"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface Interview {
  id: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  interviewer: string;
  date: string;
  time: string;
  type: "ONLINE" | "PHYSICAL";
  meeting_link?: string;
  location?: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  notes?: string;
}

const statusClasses: Record<Interview["status"], string> = {
  SCHEDULED: "text-blue-600 dark:text-blue-400",
  COMPLETED: "text-green-600 dark:text-green-400",
  CANCELLED: "text-red-600 dark:text-red-400",
  NO_SHOW: "text-orange-600 dark:text-orange-400"
};

const typeClasses: Record<Interview["type"], string> = {
  ONLINE: "text-purple-600 dark:text-purple-400",
  PHYSICAL: "text-cyan-600 dark:text-cyan-400"
};

const mockInterviews: Interview[] = [
  { id: "1", candidate_name: "Ahmed Al-Rashid", candidate_email: "ahmed.rashid@email.com", job_title: "Senior Backend Engineer", interviewer: "Mohammed Hassan", date: "2026-03-10", time: "10:00 AM", type: "ONLINE", meeting_link: "https://meet.google.com/abc-defg-hij", status: "SCHEDULED" },
  { id: "2", candidate_name: "Sarah Mohammed", candidate_email: "sarah.m@email.com", job_title: "UX Designer", interviewer: "Fatima Ali", date: "2026-03-12", time: "02:00 PM", type: "ONLINE", meeting_link: "https://zoom.us/j/123456789", status: "SCHEDULED" },
  { id: "3", candidate_name: "Omar Abdullah", candidate_email: "omar.abdullah@email.com", job_title: "Frontend Developer", interviewer: "Khalid Saeed", date: "2026-03-15", time: "11:00 AM", type: "PHYSICAL", location: "Head Office, Meeting Room 3", status: "SCHEDULED" },
  { id: "4", candidate_name: "Nora Ibrahim", candidate_email: "nora.ibrahim@email.com", job_title: "Product Manager", interviewer: "Layla Hassan", date: "2026-03-08", time: "03:00 PM", type: "ONLINE", meeting_link: "https://meet.google.com/xyz-mnop-qrs", status: "SCHEDULED" },
  { id: "5", candidate_name: "Faisal Yousef", candidate_email: "faisal.y@email.com", job_title: "Data Analyst", interviewer: "Abdullah Rashid", date: "2026-02-28", time: "10:00 AM", type: "ONLINE", meeting_link: "https://teams.microsoft.com/l/meetup", status: "COMPLETED" },
  { id: "6", candidate_name: "Maha Salem", candidate_email: "maha.salem@email.com", job_title: "DevOps Engineer", interviewer: "Yousef Ahmed", date: "2026-02-25", time: "02:30 PM", type: "PHYSICAL", location: "Head Office, Meeting Room 1", status: "COMPLETED" },
  { id: "7", candidate_name: "Hassan Ali", candidate_email: "hassan.ali@email.com", job_title: "HR Manager", interviewer: "Reem Abdullah", date: "2026-02-20", time: "09:00 AM", type: "ONLINE", meeting_link: "https://zoom.us/j/987654321", status: "NO_SHOW" },
];

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = useMemo(() => {
    let result = interviews;

    // Filter by upcoming/past
    if (filterType === "UPCOMING") {
      result = result.filter((interview) => {
        const interviewDate = new Date(interview.date);
        return interviewDate >= today && interview.status === "SCHEDULED";
      });
    } else if (filterType === "PAST") {
      result = result.filter((interview) => {
        const interviewDate = new Date(interview.date);
        return interviewDate < today || interview.status !== "SCHEDULED";
      });
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((interview) => {
        return (
          interview.candidate_name.toLowerCase().includes(q) ||
          interview.candidate_email.toLowerCase().includes(q) ||
          interview.job_title.toLowerCase().includes(q) ||
          interview.interviewer.toLowerCase().includes(q)
        );
      });
    }

    // Sort by date (upcoming first)
    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return result;
  }, [interviews, search, filterType, today]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedInterviews = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleComplete = (id: string) => {
    setInterviews(interviews.map((interview) => (interview.id === id ? { ...interview, status: "COMPLETED" as const } : interview)));
  };

  const handleCancel = (id: string) => {
    setInterviews(interviews.map((interview) => (interview.id === id ? { ...interview, status: "CANCELLED" as const } : interview)));
  };

  const handleReschedule = (id: string) => {
    // In real app, this would open a modal or navigate to reschedule page
    alert(`Reschedule interview ${id}`);
  };

  const upcomingCount = interviews.filter((i) => {
    const interviewDate = new Date(i.date);
    return interviewDate >= today && i.status === "SCHEDULED";
  }).length;

  const pastCount = interviews.filter((i) => {
    const interviewDate = new Date(i.date);
    return interviewDate < today || i.status !== "SCHEDULED";
  }).length;

  return (
    <div className="space-y-6">
      <ComponentCard title="Interviews" desc="Schedule and manage candidate interviews">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by candidate, job, or interviewer"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={filterType}
            onChange={(event) => {
              setFilterType(event.target.value as any);
              setPage(1);
            }}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="ALL">All Interviews ({interviews.length})</option>
            <option value="UPCOMING">Upcoming ({upcomingCount})</option>
            <option value="PAST">Past Interviews ({pastCount})</option>
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

      <ComponentCard title="Interview Records">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No interviews found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Candidate</th>
                  <th className="px-3 py-2 font-medium">Job Title</th>
                  <th className="px-3 py-2 font-medium">Interviewer</th>
                  <th className="px-3 py-2 font-medium">Date & Time</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Location / Link</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInterviews.map((interview) => (
                  <tr key={interview.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{interview.candidate_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{interview.candidate_email}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{interview.job_title}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{interview.interviewer}</td>
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {new Date(interview.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{interview.time}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${typeClasses[interview.type]}`}>
                        {interview.type}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {interview.type === "ONLINE" && interview.meeting_link ? (
                        <a
                          href={interview.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Join Meeting
                        </a>
                      ) : (
                        <span className="text-xs text-gray-600 dark:text-gray-300">{interview.location || "-"}</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${statusClasses[interview.status]}`}>
                        {interview.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/hrms/recruitment/interviews/${interview.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          View
                        </Link>
                        <div className="relative group">
                          <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                            Actions
                          </button>
                          <div className="absolute right-0 mt-1 w-36 rounded-lg border border-gray-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 dark:border-gray-600 dark:bg-gray-800">
                            {interview.status === "SCHEDULED" && (
                              <>
                                <button
                                  onClick={() => handleComplete(interview.id)}
                                  className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                                >
                                  Mark Complete
                                </button>
                                <button
                                  onClick={() => handleReschedule(interview.id)}
                                  className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => handleCancel(interview.id)}
                                  className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {interview.status !== "SCHEDULED" && (
                              <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">No actions available</p>
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
