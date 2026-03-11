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
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
}

const typeClasses: Record<Interview["type"], string> = {
  ONLINE: "text-blue-600 dark:text-blue-400",
  PHYSICAL: "text-purple-600 dark:text-purple-400"
};

const statusClasses: Record<Interview["status"], string> = {
  SCHEDULED: "text-green-600 dark:text-green-400",
  COMPLETED: "text-gray-600 dark:text-gray-400",
  CANCELLED: "text-red-600 dark:text-red-400",
  RESCHEDULED: "text-orange-600 dark:text-orange-400"
};

const mockInterviews: Interview[] = [
  {
    id: "1",
    candidate_name: "Ahmed Al-Rashid",
    candidate_email: "ahmed.rashid@email.com",
    job_title: "Senior Backend Engineer",
    interviewer: "Dr. Khalid Mohammed",
    date: "2026-03-10",
    time: "10:00 AM",
    type: "ONLINE",
    meeting_link: "https://meet.google.com/abc-defg-hij",
    status: "SCHEDULED"
  },
  {
    id: "2",
    candidate_name: "Sarah Mohammed",
    candidate_email: "sarah.m@email.com",
    job_title: "UX Designer",
    interviewer: "Ms. Fatima Hassan",
    date: "2026-03-08",
    time: "02:00 PM",
    type: "PHYSICAL",
    location: "Office - Conference Room A",
    status: "SCHEDULED"
  },
  {
    id: "3",
    candidate_name: "Omar Abdullah",
    candidate_email: "omar.abdullah@email.com",
    job_title: "Frontend Developer",
    interviewer: "Mr. Hassan Ali",
    date: "2026-03-12",
    time: "11:30 AM",
    type: "ONLINE",
    meeting_link: "https://zoom.us/j/123456789",
    status: "SCHEDULED"
  },
  {
    id: "4",
    candidate_name: "Nora Abdullah",
    candidate_email: "nora.abdullah@email.com",
    job_title: "UX Designer",
    interviewer: "Ms. Fatima Hassan",
    date: "2026-03-06",
    time: "03:00 PM",
    type: "ONLINE",
    meeting_link: "https://teams.microsoft.com/l/meetup",
    status: "SCHEDULED"
  },
  {
    id: "5",
    candidate_name: "Layla Ibrahim",
    candidate_email: "layla.ibrahim@email.com",
    job_title: "Product Manager",
    interviewer: "Mr. Yousef Ahmed",
    date: "2026-02-28",
    time: "09:00 AM",
    type: "ONLINE",
    meeting_link: "https://meet.google.com/xyz-defg-hij",
    status: "COMPLETED"
  },
  {
    id: "6",
    candidate_name: "Khalid Saeed",
    candidate_email: "khalid.s@email.com",
    job_title: "DevOps Engineer",
    interviewer: "Dr. Khalid Mohammed",
    date: "2026-02-25",
    time: "01:00 PM",
    type: "PHYSICAL",
    location: "Office - Conference Room B",
    status: "COMPLETED"
  },
  {
    id: "7",
    candidate_name: "Maha Salem",
    candidate_email: "maha.salem@email.com",
    job_title: "Data Analyst",
    interviewer: "Ms. Reem Al-Mutairi",
    date: "2026-02-20",
    time: "10:30 AM",
    type: "ONLINE",
    meeting_link: "https://meet.google.com/pqr-stuv-wxy",
    status: "COMPLETED"
  }
];

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = useMemo(() => {
    let result = interviews;

    // Filter by status
    if (statusFilter === "UPCOMING") {
      result = result.filter((interview) => {
        const interviewDate = new Date(interview.date);
        return interviewDate >= today && interview.status === "SCHEDULED";
      });
    } else if (statusFilter === "PAST") {
      result = result.filter((interview) => {
        const interviewDate = new Date(interview.date);
        return interviewDate < today || interview.status === "COMPLETED" || interview.status === "CANCELLED";
      });
    }

    // Filter by type
    if (typeFilter) {
      result = result.filter((interview) => interview.type === typeFilter);
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((interview) => {
        return (
          interview.candidate_name.toLowerCase().includes(q) ||
          interview.job_title.toLowerCase().includes(q) ||
          interview.interviewer.toLowerCase().includes(q)
        );
      });
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [interviews, search, typeFilter, statusFilter, today]);

  const handleCancel = (id: string) => {
    setInterviews(interviews.map((interview) => (interview.id === id ? { ...interview, status: "CANCELLED" as const } : interview)));
  };

  const handleReschedule = (id: string) => {
    setInterviews(interviews.map((interview) => (interview.id === id ? { ...interview, status: "RESCHEDULED" as const } : interview)));
  };

  const canPerformAction = (interview: Interview) => {
    return interview.status === "SCHEDULED";
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Interviews" desc="Manage and track all candidate interviews">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by candidate, job, or interviewer"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="">All types</option>
            <option value="ONLINE">Online</option>
            <option value="PHYSICAL">Physical</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as any)}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="ALL">All Interviews</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="PAST">Past</option>
          </select>
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
                  <th className="px-3 py-2 font-medium">Job</th>
                  <th className="px-3 py-2 font-medium">Interviewer</th>
                  <th className="px-3 py-2 font-medium">Date & Time</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Meeting Link / Location</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((interview) => (
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
                        <p className="text-gray-800 dark:text-gray-100">
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
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {interview.type === "ONLINE" && interview.meeting_link ? (
                        <a
                          href={interview.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs underline"
                        >
                          Join Meeting
                        </a>
                      ) : (
                        <span className="text-xs">{interview.location || "-"}</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${statusClasses[interview.status]}`}>
                        {interview.status}
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
                        {canPerformAction(interview) && (
                          <div className="relative group">
                            <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                              Actions
                            </button>
                            <div className="absolute right-0 mt-1 w-32 rounded-lg border border-gray-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 dark:border-gray-600 dark:bg-gray-800">
                              <button
                                onClick={() => handleReschedule(interview.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancel(interview.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
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
