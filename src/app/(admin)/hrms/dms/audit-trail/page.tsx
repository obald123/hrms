"use client";

import { useState, useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";

interface AuditLog {
  id: string;
  action: "created" | "modified" | "deleted" | "viewed" | "downloaded" | "shared";
  user: string;
  userRole: string;
  documentName: string;
  documentId: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "log-001",
    action: "created",
    user: "John Smith",
    userRole: "HR Manager",
    documentName: "Employee Handbook 2026",
    documentId: "doc-101",
    timestamp: "2026-03-05T14:30:00Z",
    details: "Document created and uploaded",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log-002",
    action: "modified",
    user: "Jane Doe",
    userRole: "Manager",
    documentName: "Compensation Policy",
    documentId: "doc-102",
    timestamp: "2026-03-05T13:15:00Z",
    details: "Salary section updated",
    ipAddress: "192.168.1.105",
    changes: [
      { field: "salary_range", oldValue: "30000-50000", newValue: "32000-55000" },
    ],
  },
  {
    id: "log-003",
    action: "shared",
    user: "Robert Johnson",
    userRole: "Administrator",
    documentName: "Remote Work Guidelines",
    documentId: "doc-103",
    timestamp: "2026-03-05T12:00:00Z",
    details: "Document shared with Finance department",
    ipAddress: "192.168.1.110",
  },
  {
    id: "log-004",
    action: "downloaded",
    user: "Alice Williams",
    userRole: "Employee",
    documentName: "Travel Expense Policy",
    documentId: "doc-104",
    timestamp: "2026-03-05T11:45:00Z",
    details: "Document downloaded for offline access",
    ipAddress: "192.168.1.115",
  },
  {
    id: "log-005",
    action: "viewed",
    user: "Michael Brown",
    userRole: "Compliance Officer",
    documentName: "Health & Safety Protocol",
    documentId: "doc-105",
    timestamp: "2026-03-05T10:30:00Z",
    details: "Document viewed",
    ipAddress: "192.168.1.120",
  },
  {
    id: "log-006",
    action: "deleted",
    user: "Sarah Davis",
    userRole: "Administrator",
    documentName: "Outdated Policy (Draft)",
    documentId: "doc-106",
    timestamp: "2026-03-04T16:20:00Z",
    details: "Archived outdated document",
    ipAddress: "192.168.1.125",
  },
  {
    id: "log-007",
    action: "modified",
    user: "James Wilson",
    userRole: "HR Director",
    documentName: "Training Schedule Q1",
    documentId: "doc-107",
    timestamp: "2026-03-04T15:00:00Z",
    details: "Training dates updated",
    ipAddress: "192.168.1.130",
    changes: [
      { field: "start_date", oldValue: "2026-03-10", newValue: "2026-03-15" },
    ],
  },
];

const getActionColor = (action: string) => {
  switch (action) {
    case "created":
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    case "modified":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    case "deleted":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    case "viewed":
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    case "downloaded":
      return "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    case "shared":
      return "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case "created":
      return "✓";
    case "modified":
      return "✎";
    case "deleted":
      return "✕";
    case "viewed":
      return "👁";
    case "downloaded":
      return "↓";
    case "shared":
      return "↗";
    default:
      return "•";
  }
};

export default function AuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month">("all");
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const stats = useMemo(() => {
    return {
      total: mockAuditLogs.length,
      today: mockAuditLogs.filter((log) => {
        const logDate = new Date(log.timestamp).toDateString();
        const today = new Date().toDateString();
        return logDate === today;
      }).length,
    };
  }, []);

  const filteredLogs = useMemo(() => {
    let results = mockAuditLogs.filter((log) => {
      const matchesSearch =
        log.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userRole.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = !selectedAction || log.action === selectedAction;

      const logDate = new Date(log.timestamp);
      const now = new Date();
      let matchesDate = true;

      if (dateRange === "today") {
        matchesDate = logDate.toDateString() === now.toDateString();
      } else if (dateRange === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = logDate >= weekAgo;
      } else if (dateRange === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = logDate >= monthAgo;
      }

      return matchesSearch && matchesAction && matchesDate;
    });

    return results.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [searchTerm, selectedAction, dateRange]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Audit Logs
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total}
              </p>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            All recorded actions
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Today's Activities
              </p>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.today}
              </p>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Actions recorded today
          </p>
        </div>
      </div>

      {/* Filters */}
      <ComponentCard title="Filter Audit Logs" desc="Search and filter audit trail records">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by document, user, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 outline-none dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-500 dark:text-white"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap">
              {["all", "today", "week", "month"].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range as "all" | "today" | "week" | "month")}
                  className={`px-3 py-1 text-sm rounded-full font-medium transition capitalize ${
                    dateRange === range
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {range === "all" ? "All Time" : range}
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedAction(null)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                  selectedAction === null
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                All Actions
              </button>
              {["created", "modified", "deleted", "viewed", "downloaded", "shared"].map((action) => (
                <button
                  key={action}
                  onClick={() => setSelectedAction(action)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition capitalize ${
                    selectedAction === action
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Audit Logs Table */}
      <ComponentCard title="Audit Trail" desc={`Showing ${filteredLogs.length} log${filteredLogs.length !== 1 ? "s" : ""}`}>
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No audit logs found matching your criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Action
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Document
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Timestamp
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      <div>
                        <p className="font-medium">{log.user}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {log.userRole}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {log.documentName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
                        className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
                      >
                        {showDetails === log.id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Details Section */}
            {showDetails && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                {filteredLogs.find((log) => log.id === showDetails) && (
                  <div className="space-y-3">
                    {(() => {
                      const log = filteredLogs.find((l) => l.id === showDetails)!;
                      return (
                        <>
                          <div>
                            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                              Details
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">
                              {log.details}
                            </p>
                          </div>
                          {log.ipAddress && (
                            <div>
                              <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                                IP Address
                              </p>
                              <p className="text-sm text-gray-900 dark:text-white mt-1 font-mono">
                                {log.ipAddress}
                              </p>
                            </div>
                          )}
                          {log.changes && log.changes.length > 0 && (
                            <div>
                              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">
                                Changes
                              </p>
                              <div className="space-y-2">
                                {log.changes.map((change, idx) => (
                                  <div
                                    key={idx}
                                    className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700"
                                  >
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {change.field}
                                    </p>
                                    <p className="text-red-600 dark:text-red-400">
                                      Old: {change.oldValue}
                                    </p>
                                    <p className="text-green-600 dark:text-green-400">
                                      New: {change.newValue}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ComponentCard>
    </div>
  );
}
