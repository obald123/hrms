"use client";

import { useState } from "react";

interface JobOpening {
  id: number;
  title: string;
  department: string;
  applicants: number;
  status: "open" | "closed" | "on-hold";
  postedDate: string;
}

interface Candidate {
  id: number;
  name: string;
  position: string;
  appliedDate: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected";
  score: number;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (id: number) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];
  return colors[id % colors.length];
};

export default function RecruitmentDashboard() {
  const [jobOpenings] = useState<JobOpening[]>([
    { id: 1, title: "Senior Developer", department: "Engineering", applicants: 24, status: "open", postedDate: "2026-02-01" },
    { id: 2, title: "UX Designer", department: "Design", applicants: 18, status: "open", postedDate: "2026-02-15" },
    { id: 3, title: "Product Manager", department: "Product", applicants: 12, status: "open", postedDate: "2026-02-20" },
    { id: 4, title: "Data Analyst", department: "Analytics", applicants: 16, status: "closed", postedDate: "2026-01-15" },
    { id: 5, title: "DevOps Engineer", department: "Engineering", applicants: 8, status: "on-hold", postedDate: "2026-02-25" },
  ]);

  const [candidates] = useState<Candidate[]>([
    { id: 1, name: "Alice Johnson", position: "Senior Developer", appliedDate: "2026-03-04", status: "interview", score: 92 },
    { id: 2, name: "Bob Smith", position: "UX Designer", appliedDate: "2026-03-03", status: "screening", score: 85 },
    { id: 3, name: "Carol Williams", position: "Product Manager", appliedDate: "2026-03-02", status: "offer", score: 88 },
    { id: 4, name: "David Brown", position: "Senior Developer", appliedDate: "2026-03-01", status: "interview", score: 87 },
    { id: 5, name: "Emma Davis", position: "Data Analyst", appliedDate: "2026-02-28", status: "rejected", score: 62 },
  ]);

  const stats = {
    openPositions: jobOpenings.filter(j => j.status === "open").length,
    totalApplicants: jobOpenings.reduce((sum, j) => sum + j.applicants, 0),
    interviewing: candidates.filter(c => c.status === "interview").length,
    hired: candidates.filter(c => c.status === "offer").length,
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; label: string }> = {
      open: { bg: "bg-green-100", text: "text-green-700", label: "Open" },
      closed: { bg: "bg-gray-100", text: "text-gray-700", label: "Closed" },
      "on-hold": { bg: "bg-orange-100", text: "text-orange-700", label: "On Hold" },
    };
    return colors[status] || colors.open;
  };

  const getCandidateStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; label: string }> = {
      applied: { bg: "bg-blue-100", text: "text-blue-700", label: "Applied" },
      screening: { bg: "bg-orange-100", text: "text-orange-700", label: "Screening" },
      interview: { bg: "bg-purple-100", text: "text-purple-700", label: "Interview" },
      offer: { bg: "bg-green-100", text: "text-green-700", label: "Offer" },
      rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
    };
    return colors[status] || colors.applied;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruitment Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Track and manage your recruitment pipeline</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-green-300 bg-gradient-to-br from-green-50 to-green-100/50 p-6 shadow-sm dark:border-green-900/30 dark:from-green-900/30 dark:to-green-900/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Open Positions</p>
              <p className="mt-2 text-3xl font-bold text-green-700 dark:text-green-300">{stats.openPositions}</p>
            </div>
            <div className="rounded-xl bg-green-200 p-2 dark:bg-green-900/50">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 shadow-sm dark:border-blue-900/30 dark:from-blue-900/30 dark:to-blue-900/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Applicants</p>
              <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.totalApplicants}</p>
            </div>
            <div className="rounded-xl bg-blue-200 p-2 dark:bg-blue-900/50">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.488M15 7a4 4 0 11-8 0 4 4 0 018 0zM6 20h12a6 6 0 006-6V9a6 6 0 00-6-6H6a6 6 0 00-6 6v5a6 6 0 006 6z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 shadow-sm dark:border-purple-900/30 dark:from-purple-900/30 dark:to-purple-900/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">In Interview</p>
              <p className="mt-2 text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.interviewing}</p>
            </div>
            <div className="rounded-xl bg-purple-200 p-2 dark:bg-purple-900/50">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v12m0 0l-4-4m4 4l4-4m6-12v12m0 0l-4-4m4 4l4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 shadow-sm dark:border-orange-900/30 dark:from-orange-900/30 dark:to-orange-900/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Offers Extended</p>
              <p className="mt-2 text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.hired}</p>
            </div>
            <div className="rounded-xl bg-orange-200 p-2 dark:bg-orange-900/50">
              <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m6 0h-2m2 13H8a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v14a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Job Openings */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Job Openings</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {jobOpenings.map((job) => {
              const statusColor = getStatusColor(job.status);
              return (
                <div key={job.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{job.title}</p>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{job.department}</p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        Posted: {new Date(job.postedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${statusColor.bg} ${statusColor.text}`}>
                        {statusColor.label}
                      </span>
                      <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">{job.applicants}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">applicants</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recruitment Pipeline */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Pipeline Overview</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {["applied", "screening", "interview", "offer"].map((stage) => {
                const count = candidates.filter(c => c.status === stage).length;
                const percentage = (count / candidates.length) * 100;
                const stageLabel = stage.charAt(0).toUpperCase() + stage.slice(1);
                
                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stageLabel}</p>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 transition-all"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Candidates */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Candidate</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Position</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Applied Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Score</th>
              </tr>
            </thead>
            <tbody>
              {candidates.slice(0, 5).map((candidate) => {
                const statusColor = getCandidateStatusColor(candidate.status);
                return (
                  <tr key={candidate.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(candidate.id)}`}>
                          {getInitials(candidate.name)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-700 dark:text-gray-300">{candidate.position}</td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-900 dark:text-gray-100">
                      {new Date(candidate.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-lg px-3 py-1 text-xs font-bold ${statusColor.bg} ${statusColor.text}`}>
                        {statusColor.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeDasharray={`${(candidate.score / 100) * 283} 283`}
                            className="text-blue-600 dark:text-blue-500 transition-all"
                          />
                        </svg>
                        <span className="absolute text-sm font-bold text-gray-900 dark:text-white">{candidate.score}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
