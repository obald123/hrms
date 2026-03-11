"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface LoanRecord {
  id: string;
  employee_name: string;
  employee_email: string;
  loan_type: "SALARY_ADVANCE" | "PERSONAL" | "EDUCATION" | "EMERGENCY";
  principal_amount: number;
  outstanding_amount: number;
  monthly_emi: number;
  start_date: string;
  status: "ACTIVE" | "CLOSED" | "REJECTED";
}

const statusClasses: Record<LoanRecord["status"], string> = {
  ACTIVE: "text-blue-600 dark:text-blue-400",
  CLOSED: "text-green-600 dark:text-green-400",
  REJECTED: "text-red-600 dark:text-red-400"
};

const mockLoans: LoanRecord[] = [
  {
    id: "LN-001",
    employee_name: "Jean Kabera",
    employee_email: "jean.kabera@company.com",
    loan_type: "PERSONAL",
    principal_amount: 300000,
    outstanding_amount: 210000,
    monthly_emi: 30000,
    start_date: "2026-01-05",
    status: "ACTIVE"
  },
  {
    id: "LN-002",
    employee_name: "Marie Mukiza",
    employee_email: "marie.mukiza@company.com",
    loan_type: "SALARY_ADVANCE",
    principal_amount: 180000,
    outstanding_amount: 90000,
    monthly_emi: 18000,
    start_date: "2026-02-01",
    status: "ACTIVE"
  },
  {
    id: "LN-003",
    employee_name: "Pierre Niyigaba",
    employee_email: "pierre.niyigaba@company.com",
    loan_type: "EDUCATION",
    principal_amount: 420000,
    outstanding_amount: 0,
    monthly_emi: 35000,
    start_date: "2025-09-15",
    status: "CLOSED"
  },
  {
    id: "LN-004",
    employee_name: "Yvonne Iradukunda",
    employee_email: "yvonne.iradukunda@company.com",
    loan_type: "EMERGENCY",
    principal_amount: 220000,
    outstanding_amount: 220000,
    monthly_emi: 22000,
    start_date: "2026-03-01",
    status: "ACTIVE"
  },
  {
    id: "LN-005",
    employee_name: "David Ndagijimana",
    employee_email: "david.ndagijimana@company.com",
    loan_type: "PERSONAL",
    principal_amount: 260000,
    outstanding_amount: 0,
    monthly_emi: 26000,
    start_date: "2025-10-10",
    status: "CLOSED"
  },
  {
    id: "LN-006",
    employee_name: "Grace Uwacu",
    employee_email: "grace.uwacu@company.com",
    loan_type: "SALARY_ADVANCE",
    principal_amount: 150000,
    outstanding_amount: 150000,
    monthly_emi: 15000,
    start_date: "2026-03-03",
    status: "REJECTED"
  },
  {
    id: "LN-007",
    employee_name: "Victor Habimana",
    employee_email: "victor.habimana@company.com",
    loan_type: "EDUCATION",
    principal_amount: 500000,
    outstanding_amount: 375000,
    monthly_emi: 25000,
    start_date: "2026-01-20",
    status: "ACTIVE"
  }
];

export default function Page() {
  const [loans, setLoans] = useState<LoanRecord[]>(mockLoans);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | LoanRecord["status"]>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | LoanRecord["loan_type"]>("ALL");

  const filtered = useMemo(() => {
    let result = loans;

    if (statusFilter !== "ALL") {
      result = result.filter((loan) => loan.status === statusFilter);
    }

    if (typeFilter !== "ALL") {
      result = result.filter((loan) => loan.loan_type === typeFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((loan) => {
        return (
          loan.employee_name.toLowerCase().includes(q) ||
          loan.employee_email.toLowerCase().includes(q) ||
          loan.loan_type.toLowerCase().includes(q)
        );
      });
    }

    return result.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  }, [loans, search, statusFilter, typeFilter]);

  const handleCloseLoan = (id: string) => {
    setLoans((current) =>
      current.map((loan) =>
        loan.id === id ? { ...loan, status: "CLOSED", outstanding_amount: 0 } : loan
      )
    );
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Loan Management" desc="Track employee loans and repayment status">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee, email, or loan type"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as "ALL" | LoanRecord["loan_type"])}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="ALL">All Types</option>
            <option value="SALARY_ADVANCE">Salary Advance</option>
            <option value="PERSONAL">Personal</option>
            <option value="EDUCATION">Education</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "ALL" | LoanRecord["status"])}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </ComponentCard>

      <ComponentCard title="Loan Records">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No loans found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Principal</th>
                  <th className="px-3 py-2 font-medium">Outstanding</th>
                  <th className="px-3 py-2 font-medium">EMI</th>
                  <th className="px-3 py-2 font-medium">Start Date</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((loan) => (
                  <tr key={loan.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{loan.employee_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{loan.employee_email}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{loan.loan_type.replace("_", " ")}</td>
                    <td className="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">RWF {loan.principal_amount.toLocaleString()}</td>
                    <td className="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">RWF {loan.outstanding_amount.toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">RWF {loan.monthly_emi.toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(loan.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${statusClasses[loan.status]}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/hrms/payroll/loans/${loan.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          View
                        </Link>
                        {loan.status === "ACTIVE" && (
                          <button
                            type="button"
                            onClick={() => handleCloseLoan(loan.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            Close
                          </button>
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

