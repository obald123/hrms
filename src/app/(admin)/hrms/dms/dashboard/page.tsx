"use client";

import { useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";

type DocumentRecord = {
  id: string;
  name: string;
  type: string;
  department: string;
  uploadedBy: string;
  dateUploaded: string;
  size: number;
  status: "ACTIVE" | "ARCHIVED" | "PENDING_REVIEW";
};

const mockDocuments: DocumentRecord[] = [
  {
    id: "D001",
    name: "Employee Contract - Jean Kabera",
    type: "Contract",
    department: "Sales",
    uploadedBy: "HR Admin",
    dateUploaded: "2026-03-04",
    size: 2.5,
    status: "ACTIVE",
  },
  {
    id: "D002",
    name: "Performance Review Q1 2026",
    type: "Review",
    department: "HR",
    uploadedBy: "Manager",
    dateUploaded: "2026-03-03",
    size: 1.8,
    status: "PENDING_REVIEW",
  },
  {
    id: "D003",
    name: "Tax Documentation FY2025",
    type: "Compliance",
    department: "Finance",
    uploadedBy: "Finance Lead",
    dateUploaded: "2026-03-02",
    size: 5.2,
    status: "ACTIVE",
  },
  {
    id: "D004",
    name: "Company Policy Manual 2026",
    type: "Policy",
    department: "Admin",
    uploadedBy: "HR Director",
    dateUploaded: "2026-02-28",
    size: 3.1,
    status: "ACTIVE",
  },
  {
    id: "D005",
    name: "Budget Proposal 2026 Q2",
    type: "Financial",
    department: "Finance",
    uploadedBy: "CFO",
    dateUploaded: "2026-02-27",
    size: 4.6,
    status: "PENDING_REVIEW",
  },
  {
    id: "D006",
    name: "Old Payroll Archive 2024",
    type: "Archive",
    department: "Finance",
    uploadedBy: "Finance Clerk",
    dateUploaded: "2026-01-15",
    size: 12.4,
    status: "ARCHIVED",
  },
];

export default function Page() {
  const [documents] = useState<DocumentRecord[]>(mockDocuments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredDocuments = useMemo(() => {
    let result = documents;

    if (search.trim()) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.department.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "ALL") {
      result = result.filter((d) => d.type === typeFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((d) => d.status === statusFilter);
    }

    return result;
  }, [documents, search, typeFilter, statusFilter]);

  const stats = [
    {
      label: "Total Documents",
      value: documents.length,
      change: "+12%",
      positive: true,
    },
    {
      label: "Pending Review",
      value: documents.filter((d) => d.status === "PENDING_REVIEW").length,
      change: "+5%",
      positive: false,
    },
    {
      label: "Archived",
      value: documents.filter((d) => d.status === "ARCHIVED").length,
      change: "-2%",
      positive: true,
    },
    {
      label: "Total Storage",
      value: `${(documents.reduce((sum, d) => sum + d.size, 0)).toFixed(1)} MB`,
      change: "+8%",
      positive: false,
    },
  ];

  const documentTypes = [
    { type: "Contract", count: documents.filter((d) => d.type === "Contract").length },
    { type: "Review", count: documents.filter((d) => d.type === "Review").length },
    { type: "Policy", count: documents.filter((d) => d.type === "Policy").length },
    { type: "Financial", count: documents.filter((d) => d.type === "Financial").length },
    { type: "Compliance", count: documents.filter((d) => d.type === "Compliance").length },
  ];

  const documentStatuses = [
    { status: "Active", count: documents.filter((d) => d.status === "ACTIVE").length, percent: 67 },
    { status: "Pending", count: documents.filter((d) => d.status === "PENDING_REVIEW").length, percent: 17 },
    { status: "Archived", count: documents.filter((d) => d.status === "ARCHIVED").length, percent: 17 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const colors = [
            "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500",
            "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500",
            "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500",
            "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500",
          ];
          const textColors = [
            "text-blue-600 dark:text-blue-400",
            "text-yellow-600 dark:text-yellow-400",
            "text-purple-600 dark:text-purple-400",
            "text-green-600 dark:text-green-400",
          ];
          return (
            <div
              key={index}
              className={`rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] transition-all hover:shadow-lg dark:hover:shadow-lg/10`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    stat.positive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                from last month
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Document Types */}
        <ComponentCard title="Document Types Breakdown">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {documentTypes.map((item, index) => {
              const bgColors = [
                "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10",
                "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/10",
                "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/10",
                "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-900/10",
                "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/10",
              ];
              const textColors = [
                "text-blue-600 dark:text-blue-400",
                "text-purple-600 dark:text-purple-400",
                "text-green-600 dark:text-green-400",
                "text-yellow-600 dark:text-yellow-400",
                "text-red-600 dark:text-red-400",
              ];
              return (
                <div
                  key={index}
                  className={`${bgColors[index]} rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-md transition-all`}
                >
                  <p className={`text-xs font-medium text-gray-600 dark:text-gray-400 mb-2`}>
                    {item.type}
                  </p>
                  <p className={`text-3xl font-bold ${textColors[index]}`}>
                    {item.count}
                  </p>
                </div>
              );
            })}
          </div>
        </ComponentCard>

        {/* Document Status Distribution */}
        <ComponentCard title="Document Status Distribution">
          <div className="grid grid-cols-3 gap-4">
            {documentStatuses.map((item, index) => {
              const statusConfig = [
                { bgColor: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/10", textColor: "text-green-600 dark:text-green-400", borderColor: "border-green-200 dark:border-green-800" },
                { bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-900/10", textColor: "text-yellow-600 dark:text-yellow-400", borderColor: "border-yellow-200 dark:border-yellow-800" },
                { bgColor: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-900/10", textColor: "text-gray-600 dark:text-gray-400", borderColor: "border-gray-200 dark:border-gray-700" },
              ];
              const config = statusConfig[index];
              return (
                <div
                  key={index}
                  className={`${config.bgColor} rounded-xl border ${config.borderColor} p-4 text-center hover:shadow-md transition-all`}
                >
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
                    {item.status}
                  </p>
                  <p className={`text-2xl font-bold ${config.textColor} mb-2`}>
                    {item.count}
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="relative w-12 h-12">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
                        <circle
                          cx="25"
                          cy="25"
                          r="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-300 dark:text-gray-600"
                        />
                        <circle
                          cx="25"
                          cy="25"
                          r="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${(item.percent / 100) * 138.23} 138.23`}
                          className={config.textColor}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
                        {item.percent}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ComponentCard>
      </div>

      {/* Filter and Recent Documents */}
      <ComponentCard title="Filter" desc="Search and filter documents">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search by document name, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 outline-none dark:border-gray-700 dark:bg-gray-900/50 dark:placeholder-gray-500 dark:text-white"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900/50 dark:text-white"
          >
            <option value="ALL">All Types</option>
            <option value="Contract">Contract</option>
            <option value="Review">Review</option>
            <option value="Policy">Policy</option>
            <option value="Financial">Financial</option>
            <option value="Compliance">Compliance</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900/50 dark:text-white"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </ComponentCard>

      <ComponentCard title="Recent Documents">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                Document Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                Type
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                Size
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                Uploaded
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => (
              <tr
                key={doc.id}
                className="border-b border-gray-100 dark:border-gray-700/50"
              >
                <td className="px-3 py-3 text-xs dark:text-gray-300">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {doc.name}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {doc.uploadedBy}
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                  {doc.type}
                </td>
                <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                  {doc.size} MB
                </td>
                <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                  {doc.dateUploaded}
                </td>
                <td className="px-3 py-3 text-xs">
                  {doc.status === "ACTIVE" && (
                    <span className="text-green-600 font-semibold dark:text-green-400">
                      Active
                    </span>
                  )}
                  {doc.status === "PENDING_REVIEW" && (
                    <span className="text-yellow-600 font-semibold dark:text-yellow-400">
                      Pending Review
                    </span>
                  )}
                  {doc.status === "ARCHIVED" && (
                    <span className="text-gray-600 font-semibold dark:text-gray-400">
                      Archived
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-xs space-x-2 flex">
                  <button className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                    View
                  </button>
                  <button className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ComponentCard>
    </div>
  );
}
