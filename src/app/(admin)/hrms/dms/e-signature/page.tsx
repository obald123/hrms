"use client";

import { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";

interface SignatureRequest {
  id: string;
  documentName: string;
  documentId: string;
  sentBy: string;
  sentTo: string;
  sentDate: string;
  dueDate: string;
  status: "pending" | "signed" | "rejected" | "expired";
  signers: {
    name: string;
    email: string;
    status: "pending" | "signed" | "rejected";
    signedDate?: string;
  }[];
}

interface Stats {
  pending: number;
  completed: number;
  expired: number;
}

const mockSignatureRequests: SignatureRequest[] = [
  {
    id: "sig-001",
    documentName: "Employment Contract - John Doe",
    documentId: "doc-101",
    sentBy: "HR Manager",
    sentTo: "john.doe@example.com",
    sentDate: "2026-03-01",
    dueDate: "2026-03-08",
    status: "pending",
    signers: [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        status: "pending",
      },
      {
        name: "HR Director",
        email: "hr.director@example.com",
        status: "pending",
      },
    ],
  },
  {
    id: "sig-002",
    documentName: "NDA - Jane Smith",
    documentId: "doc-102",
    sentBy: "Legal Department",
    sentTo: "jane.smith@example.com",
    sentDate: "2026-02-25",
    dueDate: "2026-03-04",
    status: "signed",
    signers: [
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        status: "signed",
        signedDate: "2026-02-27",
      },
      {
        name: "Legal Officer",
        email: "legal.officer@example.com",
        status: "signed",
        signedDate: "2026-02-28",
      },
    ],
  },
  {
    id: "sig-003",
    documentName: "Promotion Letter - Robert Johnson",
    documentId: "doc-103",
    sentBy: "HR Manager",
    sentTo: "robert.johnson@example.com",
    sentDate: "2026-02-20",
    dueDate: "2026-02-27",
    status: "expired",
    signers: [
      {
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        status: "pending",
      },
    ],
  },
  {
    id: "sig-004",
    documentName: "Confidentiality Agreement - Alice Williams",
    documentId: "doc-104",
    sentBy: "Compliance",
    sentTo: "alice.williams@example.com",
    sentDate: "2026-02-28",
    dueDate: "2026-03-07",
    status: "pending",
    signers: [
      {
        name: "Alice Williams",
        email: "alice.williams@example.com",
        status: "pending",
      },
    ],
  },
  {
    id: "sig-005",
    documentName: "Performance Review Form - Michael Brown",
    documentId: "doc-105",
    sentBy: "HR Manager",
    sentTo: "michael.brown@example.com",
    sentDate: "2026-02-22",
    dueDate: "2026-03-01",
    status: "signed",
    signers: [
      {
        name: "Michael Brown",
        email: "michael.brown@example.com",
        status: "signed",
        signedDate: "2026-02-24",
      },
      {
        name: "Department Head",
        email: "dept.head@example.com",
        status: "signed",
        signedDate: "2026-02-25",
      },
    ],
  },
];

const getStatusColor = (
  status: "pending" | "signed" | "rejected" | "expired"
) => {
  switch (status) {
    case "pending":
      return "text-yellow-600 dark:text-yellow-400";
    case "signed":
      return "text-green-600 dark:text-green-400";
    case "rejected":
      return "text-red-600 dark:text-red-400";
    case "expired":
      return "text-orange-600 dark:text-orange-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

const getStatusBgColor = (
  status: "pending" | "signed" | "rejected" | "expired"
) => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 dark:bg-yellow-900/10";
    case "signed":
      return "bg-green-50 dark:bg-green-900/10";
    case "rejected":
      return "bg-red-50 dark:bg-red-900/10";
    case "expired":
      return "bg-orange-50 dark:bg-orange-900/10";
    default:
      return "bg-gray-50 dark:bg-gray-900/10";
  }
};

export default function ESignaturePage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "signed" | "expired"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SignatureRequest | null>(
    null
  );
  const [stats, setStats] = useState<Stats>({
    pending: 0,
    completed: 0,
    expired: 0,
  });

  useEffect(() => {
    const pendingCount = mockSignatureRequests.filter(
      (r) => r.status === "pending"
    ).length;
    const completedCount = mockSignatureRequests.filter(
      (r) => r.status === "signed"
    ).length;
    const expiredCount = mockSignatureRequests.filter(
      (r) => r.status === "expired"
    ).length;

    setStats({
      pending: pendingCount,
      completed: completedCount,
      expired: expiredCount,
    });
  }, []);

  const filteredRequests = mockSignatureRequests.filter((request) => {
    const matchesTab =
      activeTab === "all" || request.status === activeTab;
    const matchesSearch =
      request.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.sentTo.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleSendForSignature = () => {
    setShowSendModal(false);
    alert("Document sent for signature successfully!");
  };

  const handleRemindSigner = (requestId: string) => {
    alert(`Reminder sent to signer for request ${requestId}`);
  };

  const handleResendDocument = (requestId: string) => {
    alert(`Document resent for request ${requestId}`);
  };

  const handleCancelRequest = (requestId: string) => {
    alert(`Signature request ${requestId} cancelled`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending Signatures
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
            Awaiting signature
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completed Signatures
              </p>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.completed}
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
            Successfully signed
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Expired Requests
              </p>
              <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats.expired}
              </p>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4m0 0l3-3m-3 3l-3-3M3.172 5.172a4 4 0 015.656 0L12 6.343l3.172-3.171a4 4 0 115.656 5.656L12 17.657l-8.828-8.829a4 4 0 010-5.656z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Signature requests expired
          </p>
        </div>
      </div>

      {/* Send for Signature Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => setShowSendModal(true)}
        >
          Send for Signature
        </Button>
      </div>

      {/* Filter and Status Cards */}
      <ComponentCard
        title="Signature Status"
        desc="Track all signature requests and their status"
      >
        {/* Filter Card */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <InputField
              type="text"
              placeholder="Search by document name or recipient..."
              defaultValue={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-8">
            {(
              ["all", "pending", "signed", "expired"] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Document Name
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Sent To
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Sent Date
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Due Date
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {request.documentName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {request.sentTo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(request.sentDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(request.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBgColor(request.status)} ${getStatusColor(request.status)}`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailsModal(true);
                        }}
                        className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        View
                      </button>
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleRemindSigner(request.id)
                            }
                            className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                          >
                            Remind
                          </button>
                          <button
                            onClick={() =>
                              handleCancelRequest(request.id)
                            }
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {request.status === "expired" && (
                        <button
                          onClick={() =>
                            handleResendDocument(request.id)
                          }
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Resend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No signature requests found
          </div>
        )}
      </ComponentCard>

      {/* Send for Signature Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
      >
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Send Document for Signature
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Document
            </label>
            <select className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-white/5 dark:text-white">
              <option>Select a document...</option>
              <option>Employment Contract</option>
              <option>NDA</option>
              <option>Offer Letter</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Recipient Email
            </label>
            <input
              type="email"
              placeholder="recipient@example.com"
              className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Due Date
            </label>
            <input
              type="date"
              className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Message to Recipient
            </label>
            <textarea
              placeholder="Add a message..."
              rows={4}
              className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setShowSendModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendForSignature}
          >
            Send for Signature
          </Button>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Signature Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    Document
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedRequest.documentName}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <p
                    className={`text-sm font-medium ${getStatusColor(selectedRequest.status)}`}
                  >
                    {selectedRequest.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    Sent Date
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(selectedRequest.sentDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    Due Date
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(selectedRequest.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                <p className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Signers
                </p>
                <div className="space-y-3">
                  {selectedRequest.signers.map((signer, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {signer.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {signer.email}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium uppercase ${
                            signer.status === "signed"
                              ? "text-green-600 dark:text-green-400"
                              : signer.status === "rejected"
                              ? "text-red-600 dark:text-red-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          {signer.status}
                        </span>
                      </div>
                      {signer.signedDate && (
                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          Signed: {new Date(signer.signedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
