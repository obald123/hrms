"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface PayrollRecord {
  id: string;
  employee_name: string;
  employee_email: string;
  position: string;
  department: string;
  base_salary: string;
  allowances: string;
  deductions: string;
  net_salary: string;
  payment_date: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "ON_HOLD";
}

const statusClasses: Record<PayrollRecord["status"], string> = {
  PENDING: "text-yellow-600 dark:text-yellow-400",
  PAID: "text-green-600 dark:text-green-400",
  OVERDUE: "text-red-600 dark:text-red-400",
  ON_HOLD: "text-gray-600 dark:text-gray-400"
};

const mockPayroll: PayrollRecord[] = [
  {
    id: "1",
    employee_name: "Ahmed Al-Rashid",
    employee_email: "ahmed.rashid@email.com",
    position: "Senior Backend Engineer",
    department: "Engineering",
    base_salary: "SAR 20,000",
    allowances: "SAR 3,000",
    deductions: "SAR 2,500",
    net_salary: "SAR 20,500",
    payment_date: "2026-03-05",
    status: "PAID"
  },
  {
    id: "2",
    employee_name: "Sarah Mohammed",
    employee_email: "sarah.m@email.com",
    position: "UX Designer",
    department: "Design",
    base_salary: "SAR 15,000",
    allowances: "SAR 2,000",
    deductions: "SAR 1,800",
    net_salary: "SAR 15,200",
    payment_date: "2026-03-05",
    status: "PAID"
  },
  {
    id: "3",
    employee_name: "Omar Abdullah",
    employee_email: "omar.abdullah@email.com",
    position: "Frontend Developer",
    department: "Engineering",
    base_salary: "SAR 17,000",
    allowances: "SAR 2,500",
    deductions: "SAR 2,000",
    net_salary: "SAR 17,500",
    payment_date: "2026-03-10",
    status: "PENDING"
  },
  {
    id: "4",
    employee_name: "Nora Abdullah",
    employee_email: "nora.abdullah@email.com",
    position: "UX Designer",
    department: "Design",
    base_salary: "SAR 15,500",
    allowances: "SAR 2,000",
    deductions: "SAR 1,900",
    net_salary: "SAR 15,600",
    payment_date: "2026-03-02",
    status: "OVERDUE"
  },
  {
    id: "5",
    employee_name: "Layla Ibrahim",
    employee_email: "layla.ibrahim@email.com",
    position: "Product Manager",
    department: "Product",
    base_salary: "SAR 22,000",
    allowances: "SAR 3,500",
    deductions: "SAR 2,800",
    net_salary: "SAR 22,700",
    payment_date: "2026-03-05",
    status: "PAID"
  },
  {
    id: "6",
    employee_name: "Khalid Saeed",
    employee_email: "khalid.s@email.com",
    position: "DevOps Engineer",
    department: "Engineering",
    base_salary: "SAR 19,000",
    allowances: "SAR 2,800",
    deductions: "SAR 2,300",
    net_salary: "SAR 19,500",
    payment_date: "2026-03-05",
    status: "PAID"
  },
  {
    id: "7",
    employee_name: "Maha Salem",
    employee_email: "maha.salem@email.com",
    position: "Data Analyst",
    department: "Analytics",
    base_salary: "SAR 14,000",
    allowances: "SAR 1,800",
    deductions: "SAR 1,600",
    net_salary: "SAR 14,200",
    payment_date: "2026-03-12",
    status: "PENDING"
  }
];

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>(mockPayroll);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "PAID" | "OVERDUE" | "ON_HOLD">("ALL");

  const filtered = useMemo(() => {
    let result = payroll;

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((record) => record.status === statusFilter);
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((record) => {
        return (
          record.employee_name.toLowerCase().includes(q) ||
          record.employee_email.toLowerCase().includes(q) ||
          record.position.toLowerCase().includes(q) ||
          record.department.toLowerCase().includes(q)
        );
      });
    }

    return result.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
  }, [payroll, search, statusFilter]);

  const handleProcessPayment = (id: string) => {
    setPayroll(payroll.map((record) => (record.id === id ? { ...record, status: "PAID" as const } : record)));
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Payroll Management" desc="Process and manage employee salaries and payments">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee, position, or department"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as any)}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>
      </ComponentCard>

      <ComponentCard title="Payroll Records">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No payroll records found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Position</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Base Salary</th>
                  <th className="px-3 py-2 font-medium">Allowances</th>
                  <th className="px-3 py-2 font-medium">Deductions</th>
                  <th className="px-3 py-2 font-medium">Net Salary</th>
                  <th className="px-3 py-2 font-medium">Payment Date</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{record.employee_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{record.employee_email}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{record.position}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{record.department}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300 font-medium">{record.base_salary}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300 font-medium">{record.allowances}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300 font-medium">{record.deductions}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300 font-bold">{record.net_salary}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(record.payment_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${statusClasses[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/hrms/payroll/${record.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          View
                        </Link>
                        {record.status === "PENDING" && (
                          <button
                            onClick={() => handleProcessPayment(record.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            Process
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
