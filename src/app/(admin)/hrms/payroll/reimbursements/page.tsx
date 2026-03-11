"use client";

import { useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";

type ReimbursementRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: string;
  amount: number;
  description: string;
  dateSubmitted: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

const mockReimbursements: ReimbursementRecord[] = [
  {
    id: "R001",
    employeeId: "E101",
    employeeName: "Jean Kabera",
    department: "Sales",
    type: "TRAVEL",
    amount: 450000,
    description: "Business trip to Kigali - accommodation & transport",
    dateSubmitted: "2026-03-01",
    status: "PENDING",
  },
  {
    id: "R002",
    employeeId: "E102",
    employeeName: "Marie Mukiza",
    department: "HR",
    type: "MEALS",
    amount: 85000,
    description: "Team lunch during recruitment drive",
    dateSubmitted: "2026-02-28",
    status: "APPROVED",
  },
  {
    id: "R003",
    employeeId: "E103",
    employeeName: "Pierre Niyigaba",
    department: "IT",
    type: "ACCOMMODATION",
    amount: 320000,
    description: "Conference accommodation - tech summit",
    dateSubmitted: "2026-02-25",
    status: "APPROVED",
  },
  {
    id: "R004",
    employeeId: "E104",
    employeeName: "Yvonne Iradukunda",
    department: "Finance",
    type: "MEDICAL",
    amount: 150000,
    description: "Medical examination - annual checkup",
    dateSubmitted: "2026-02-20",
    status: "APPROVED",
  },
  {
    id: "R005",
    employeeId: "E105",
    employeeName: "David Ndagijimana",
    department: "Operations",
    type: "TRAVEL",
    amount: 380000,
    description: "Client visit - Muhanga",
    dateSubmitted: "2026-03-02",
    status: "PENDING",
  },
  {
    id: "R006",
    employeeId: "E106",
    employeeName: "Grace Uwacu",
    department: "Marketing",
    type: "OTHER",
    amount: 125000,
    description: "Event organization materials",
    dateSubmitted: "2026-02-18",
    status: "REJECTED",
  },
  {
    id: "R007",
    employeeId: "E107",
    employeeName: "Victor Habimana",
    department: "Sales",
    type: "MEALS",
    amount: 95000,
    description: "Client entertainment - dinner meeting",
    dateSubmitted: "2026-03-03",
    status: "PENDING",
  },
];

export default function Page() {
  const [reimbursements, setReimbursements] = useState<ReimbursementRecord[]>(mockReimbursements);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredReimbursements = useMemo(() => {
    let result = reimbursements;

    if (search.trim()) {
      result = result.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
          r.department.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "ALL") {
      result = result.filter((r) => r.type === typeFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((r) => r.status === statusFilter);
    }

    return result;
  }, [reimbursements, search, typeFilter, statusFilter]);

  const handleApprove = (id: string) => {
    setReimbursements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
    );
  };

  const handleReject = (id: string) => {
    setReimbursements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
    );
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Filter" desc="Search and filter reimbursement requests">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search by employee name, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 outline-none dark:border-gray-700 dark:bg-gray-900/50 dark:placeholder-gray-500"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900/50"
          >
            <option value="ALL">All Types</option>
            <option value="TRAVEL">Travel</option>
            <option value="MEALS">Meals</option>
            <option value="ACCOMMODATION">Accommodation</option>
            <option value="MEDICAL">Medical</option>
            <option value="OTHER">Other</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900/50"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </ComponentCard>

      <ComponentCard title="Reimbursement Requests">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                Employee
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                Type
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                Amount
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                Description
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
            {filteredReimbursements.map((reimbursement) => (
              <tr
                key={reimbursement.id}
                className="border-b border-gray-100 dark:border-gray-700/50"
              >
                <td className="px-3 py-3 text-xs dark:text-gray-300">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {reimbursement.employeeName}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {reimbursement.department}
                  </div>
                </td>
                <td className="px-3 py-3 text-xs dark:text-gray-300">
                  {reimbursement.type}
                </td>
                <td className="px-3 py-3 text-xs font-medium text-gray-900 dark:text-white">
                  {reimbursement.amount.toLocaleString("en-RW")} RWF
                </td>
                <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                  {reimbursement.description}
                </td>
                <td className="px-3 py-3 text-xs">
                  {reimbursement.status === "PENDING" && (
                    <span className="text-yellow-600 font-semibold dark:text-yellow-400">
                      Pending
                    </span>
                  )}
                  {reimbursement.status === "APPROVED" && (
                    <span className="text-green-600 font-semibold dark:text-green-400">
                      Approved
                    </span>
                  )}
                  {reimbursement.status === "REJECTED" && (
                    <span className="text-red-600 font-semibold dark:text-red-400">
                      Rejected
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-xs space-x-2 flex">
                  <button className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                    View
                  </button>
                  {reimbursement.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(reimbursement.id)}
                        className="rounded-md bg-green-50 px-2 py-1 font-medium text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(reimbursement.id)}
                        className="rounded-md bg-red-50 px-2 py-1 font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ComponentCard>
    </div>
  );
}
