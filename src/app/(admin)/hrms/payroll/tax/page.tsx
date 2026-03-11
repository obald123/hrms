"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface TaxRecord {
  id: string;
  employee_name: string;
  employee_email: string;
  department: string;
  taxable_income: number;
  tax_rate: number;
  tax_amount: number;
  tax_period: string;
  status: "PENDING" | "FILED" | "EXEMPT";
}

const statusClasses: Record<TaxRecord["status"], string> = {
  PENDING: "text-yellow-600 dark:text-yellow-400",
  FILED: "text-green-600 dark:text-green-400",
  EXEMPT: "text-gray-600 dark:text-gray-400"
};

const mockTaxRecords: TaxRecord[] = [
  {
    id: "TX-001",
    employee_name: "Jean Kabera",
    employee_email: "jean.kabera@company.com",
    department: "Engineering",
    taxable_income: 1000000,
    tax_rate: 0.3,
    tax_amount: 300000,
    tax_period: "2026-03",
    status: "PENDING"
  },
  {
    id: "TX-002",
    employee_name: "Marie Mukiza",
    employee_email: "marie.mukiza@company.com",
    department: "Design",
    taxable_income: 820000,
    tax_rate: 0.25,
    tax_amount: 205000,
    tax_period: "2026-03",
    status: "FILED"
  },
  {
    id: "TX-003",
    employee_name: "Pierre Niyigaba",
    employee_email: "pierre.niyigaba@company.com",
    department: "Engineering",
    taxable_income: 900000,
    tax_rate: 0.3,
    tax_amount: 270000,
    tax_period: "2026-03",
    status: "PENDING"
  },
  {
    id: "TX-004",
    employee_name: "Yvonne Iradukunda",
    employee_email: "yvonne.iradukunda@company.com",
    department: "Product",
    taxable_income: 1130000,
    tax_rate: 0.3,
    tax_amount: 339000,
    tax_period: "2026-02",
    status: "FILED"
  },
  {
    id: "TX-005",
    employee_name: "David Ndagijimana",
    employee_email: "david.ndagijimana@company.com",
    department: "Engineering",
    taxable_income: 960000,
    tax_rate: 0.3,
    tax_amount: 288000,
    tax_period: "2026-02",
    status: "EXEMPT"
  },
  {
    id: "TX-006",
    employee_name: "Grace Uwacu",
    employee_email: "grace.uwacu@company.com",
    department: "Analytics",
    taxable_income: 770000,
    tax_rate: 0.2,
    tax_amount: 154000,
    tax_period: "2026-03",
    status: "PENDING"
  },
  {
    id: "TX-007",
    employee_name: "Victor Habimana",
    employee_email: "victor.habimana@company.com",
    department: "Human Resources",
    taxable_income: 860000,
    tax_rate: 0.25,
    tax_amount: 215000,
    tax_period: "2026-01",
    status: "FILED"
  }
];

export default function Page() {
  const [records, setRecords] = useState<TaxRecord[]>(mockTaxRecords);
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TaxRecord["status"]>("ALL");

  const filtered = useMemo(() => {
    let result = records;

    if (periodFilter !== "ALL") {
      result = result.filter((record) => record.tax_period === periodFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((record) => record.status === statusFilter);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((record) => {
        return (
          record.employee_name.toLowerCase().includes(query) ||
          record.employee_email.toLowerCase().includes(query) ||
          record.department.toLowerCase().includes(query)
        );
      });
    }

    return result.sort((a, b) => b.tax_period.localeCompare(a.tax_period));
  }, [records, search, periodFilter, statusFilter]);

  const handleMarkFiled = (id: string) => {
    setRecords((current) =>
      current.map((record) => (record.id === id ? { ...record, status: "FILED" } : record))
    );
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Tax Management" desc="Review tax records, filing status, and monthly tax periods">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee, email, or department"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={periodFilter}
            onChange={(event) => setPeriodFilter(event.target.value)}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="ALL">All Periods</option>
            <option value="2026-03">Mar 2026</option>
            <option value="2026-02">Feb 2026</option>
            <option value="2026-01">Jan 2026</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "ALL" | TaxRecord["status"])}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="FILED">Filed</option>
            <option value="EXEMPT">Exempt</option>
          </select>
        </div>
      </ComponentCard>

      <ComponentCard title="Tax Records">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No tax records found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Taxable Income</th>
                  <th className="px-3 py-2 font-medium">Tax Rate</th>
                  <th className="px-3 py-2 font-medium">Tax Amount</th>
                  <th className="px-3 py-2 font-medium">Period</th>
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
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{record.department}</td>
                    <td className="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">RWF {record.taxable_income.toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{(record.tax_rate * 100).toFixed(0)}%</td>
                    <td className="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">RWF {record.tax_amount.toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{record.tax_period}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${statusClasses[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/hrms/payroll/tax/${record.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          View
                        </Link>
                        {record.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleMarkFiled(record.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            Mark Filed
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
