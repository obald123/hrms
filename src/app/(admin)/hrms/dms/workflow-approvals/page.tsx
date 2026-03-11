"use client";

import { useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import InputField from "@/components/form/input/InputField";

type ApprovalRequest = {
  id: string;
  documentName: string;
  submittedBy: string;
  department: string;
  submittedDate: string;
  purpose: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  approvedBy?: string;
  approvalDate?: string;
};

const mockRequests: ApprovalRequest[] = [
  {
    id: "AR001",
    documentName: "New_Employee_Handbook_2026.pdf",
    submittedBy: "HR Manager",
    department: "Human Resources",
    submittedDate: "2026-03-04",
    purpose: "Annual handbook update with new policies",
    status: "PENDING",
  },
  {
    id: "AR002",
    documentName: "Updated_Compensation_Policy.docx",
    submittedBy: "Finance Lead",
    department: "Finance",
    submittedDate: "2026-03-03",
    purpose: "Salary structure adjustments for 2026",
    status: "APPROVED",
    approvedBy: "CFO",
    approvalDate: "2026-03-04",
  },
  {
    id: "AR003",
    documentName: "Remote_Work_Guidelines.pdf",
    submittedBy: "Operations Manager",
    department: "Operations",
    submittedDate: "2026-03-02",
    purpose: "New remote work policy implementation",
    status: "REJECTED",
    rejectionReason: "Needs revision on security protocols",
  },
  {
    id: "AR004",
    documentName: "Travel_Expense_Policy.xlsx",
    submittedBy: "Finance Manager",
    department: "Finance",
    submittedDate: "2026-03-01",
    purpose: "Updated travel reimbursement rates",
    status: "PENDING",
  },
  {
    id: "AR005",
    documentName: "Training_Schedule_Q1.docx",
    submittedBy: "HR Director",
    department: "Human Resources",
    submittedDate: "2026-02-28",
    purpose: "Q1 employee training programs",
    status: "APPROVED",
    approvedBy: "CEO",
    approvalDate: "2026-03-01",
  },
  {
    id: "AR006",
    documentName: "Health_Safety_Protocol.pdf",
    submittedBy: "Compliance Officer",
    department: "Compliance",
    submittedDate: "2026-02-25",
    purpose: "Updated health and safety requirements",
    status: "REJECTED",
    rejectionReason: "Incomplete risk assessment section",
  },
  {
    id: "AR007",
    documentName: "IT_Security_Standards.docx",
    submittedBy: "IT Manager",
    department: "IT",
    submittedDate: "2026-02-20",
    purpose: "New cybersecurity compliance standards",
    status: "APPROVED",
    approvedBy: "CTO",
    approvalDate: "2026-02-25",
  },
];

export default function Page() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(mockRequests);
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED">(
    "PENDING"
  );
  const [search, setSearch] = useState("");

  const stats = useMemo(
    () => ({
      pending: requests.filter((r) => r.status === "PENDING").length,
      approved: requests.filter((r) => r.status === "APPROVED").length,
      rejected: requests.filter((r) => r.status === "REJECTED").length,
    }),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    let result = requests.filter((r) => r.status === activeTab);

    if (search.trim()) {
      result = result.filter(
        (r) =>
          r.documentName.toLowerCase().includes(search.toLowerCase()) ||
          r.submittedBy.toLowerCase().includes(search.toLowerCase()) ||
          r.department.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [requests, activeTab, search]);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "APPROVED" as const,
              approvedBy: "Current User",
              approvalDate: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
  };

  const handleReject = (id: string, reason: string) => {
    if (!reason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "REJECTED" as const,
              rejectionReason: reason,
            }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending Approvals
              </p>
              <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Waiting for action
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Approved Documents
              </p>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.approved}
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
            Successfully approved
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rejected Documents
              </p>
              <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.rejected}
              </p>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l6-6m0 0l-6-6m6 6l6 6m-6-6l-6 6"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Needs revision
          </p>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            {["PENDING", "APPROVED", "REJECTED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "PENDING" | "APPROVED" | "REJECTED")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab === "PENDING" ? "Pending Approvals" : tab === "APPROVED" ? "Approved" : "Rejected"}
              </button>
            ))}
          </div>
        </div>

        {/* Search Filter */}
        <ComponentCard title="Filter" desc="Search approval requests">
          <InputField
            type="text"
            placeholder="Search by document, submitter, or department..."
            defaultValue={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </ComponentCard>

        {/* Requests Table */}
        <ComponentCard
          title={
            activeTab === "PENDING"
              ? "Pending Approvals"
              : activeTab === "APPROVED"
              ? "Approved Documents"
              : "Rejected Documents"
          }
        >
          {filteredRequests.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No {activeTab.toLowerCase()} requests found
              </p>
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                    Document Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                    Submitted By
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                    Department
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                    Purpose
                  </th>
                  {activeTab === "APPROVED" && (
                    <>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                        Approved By
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                        Approval Date
                      </th>
                    </>
                  )}
                  {activeTab === "REJECTED" && (
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                      Rejection Reason
                    </th>
                  )}
                  {activeTab === "PENDING" && (
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-gray-100 dark:border-gray-700/50"
                  >
                    <td className="px-3 py-3 text-xs dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {request.documentName}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                      {request.submittedBy}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                      {request.department}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                      {request.submittedDate}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                      {request.purpose}
                    </td>
                    {activeTab === "APPROVED" && (
                      <>
                        <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                          {request.approvedBy}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                          {request.approvalDate}
                        </td>
                      </>
                    )}
                    {activeTab === "REJECTED" && (
                      <td className="px-3 py-3 text-xs text-red-600 dark:text-red-400">
                        {request.rejectionReason}
                      </td>
                    )}
                    {activeTab === "PENDING" && (
                      <td className="px-3 py-3 text-xs flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="rounded-md bg-green-50 px-2 py-1 font-medium text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                        >
                          Approve
                        </button>
                        <RejectButton
                          onReject={(reason) => handleReject(request.id, reason)}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}

function RejectButton({
  onReject,
}: {
  onReject: (reason: string) => void;
}) {
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <>
      <button
        onClick={() => setShowReasonModal(true)}
        className="rounded-md bg-red-50 px-2 py-1 font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
      >
        Reject
      </button>

      {showReasonModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Rejection Reason
            </h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setReason("");
                }}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReject(reason);
                  setShowReasonModal(false);
                  setReason("");
                }}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
