"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface SalaryStructureRecord {
  id: string;
  employee_name: string;
  employee_email: string;
  department: string;
  grade: string;
  base_salary: number;
  allowances: number;
  effective_date: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
}

const statusClasses: Record<SalaryStructureRecord["status"], string> = {
  ACTIVE: "text-green-600 dark:text-green-400",
  DRAFT: "text-yellow-600 dark:text-yellow-400",
  ARCHIVED: "text-gray-600 dark:text-gray-400"
};

const mockSalaryStructures: SalaryStructureRecord[] = [
  {
    id: "SS-001",
    employee_name: "Jean Kabera",
    employee_email: "jean.kabera@company.com",
    department: "Engineering",
    grade: "G7",
    base_salary: 850000,
    allowances: 150000,
    effective_date: "2026-03-01",
    status: "ACTIVE"
  },
  {
    id: "SS-002",
    employee_name: "Marie Mukiza",
    employee_email: "marie.mukiza@company.com",
    department: "Design",
    grade: "G5",
    base_salary: 720000,
    allowances: 100000,
    effective_date: "2026-02-15",
    status: "ACTIVE"
  },
  {
    id: "SS-003",
    employee_name: "Pierre Niyigaba",
    employee_email: "pierre.niyigaba@company.com",
    department: "Engineering",
    grade: "G6",
    base_salary: 780000,
    allowances: 120000,
    effective_date: "2026-03-10",
    status: "DRAFT"
  },
  {
    id: "SS-004",
    employee_name: "Yvonne Iradukunda",
    employee_email: "yvonne.iradukunda@company.com",
    department: "Product",
    grade: "G8",
    base_salary: 950000,
    allowances: 180000,
    effective_date: "2026-01-20",
    status: "ACTIVE"
  },
  {
    id: "SS-005",
    employee_name: "David Ndagijimana",
    employee_email: "david.ndagijimana@company.com",
    department: "Engineering",
    grade: "G6",
    base_salary: 820000,
    allowances: 140000,
    effective_date: "2025-12-01",
    status: "ARCHIVED"
  },
  {
    id: "SS-006",
    employee_name: "Grace Uwacu",
    employee_email: "grace.uwacu@company.com",
    department: "Analytics",
    grade: "G4",
    base_salary: 680000,
    allowances: 90000,
    effective_date: "2026-02-01",
    status: "ACTIVE"
  },
  {
    id: "SS-007",
    employee_name: "Victor Habimana",
    employee_email: "victor.habimana@company.com",
    department: "Human Resources",
    grade: "G5",
    base_salary: 750000,
    allowances: 110000,
    effective_date: "2026-03-05",
    status: "DRAFT"
  }
];

export default function Page() {
  const [records, setRecords] = useState<SalaryStructureRecord[]>(mockSalaryStructures);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | SalaryStructureRecord["status"]>("ALL");

  const filtered = useMemo(() => {
    let result = records;

    if (gradeFilter !== "ALL") {
      result = result.filter((record) => record.grade === gradeFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((record) => record.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((record) => {
        return (
          record.employee_name.toLowerCase().includes(q) ||
          record.employee_email.toLowerCase().includes(q) ||
          record.department.toLowerCase().includes(q) ||
          record.grade.toLowerCase().includes(q)
        );
      });
    }

    return result.sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime());
  }, [records, search, gradeFilter, statusFilter]);

  const handleActivate = (id: string) => {
    setRecords((current) => current.map((record) => (record.id === id ? { ...record, status: "ACTIVE" } : record)));
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Salary Structure" desc="Manage salary grades, base salary, and allowances">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee, email, department, or grade"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={gradeFilter}
            onChange={(event) => setGradeFilter(event.target.value)}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="ALL">All Grades</option>
            <option value="G4">G4</option>
            <option value="G5">G5</option>
            <option value="G6">G6</option>
            <option value="G7">G7</option>
            <option value="G8">G8</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "ALL" | SalaryStructureRecord["status"])}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </ComponentCard>

      <ComponentCard title="Salary Structure Records">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No salary structure records found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Grade</th>
                  <th className="px-3 py-2 font-medium">Base Salary</th>
                  <th className="px-3 py-2 font-medium">Allowances</th>
                  <th className="px-3 py-2 font-medium">Effective Date</th>
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
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{record.grade}</td>
                    <td className="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">RWF {record.base_salary.toLocaleString()}</td>
                    <td className="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">RWF {record.allowances.toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(record.effective_date).toLocaleDateString("en-US", {
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
                          href={`/hrms/payroll/salary-structure/${record.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          View
                        </Link>
                        {record.status !== "ACTIVE" && (
                          <button
                            type="button"
                            onClick={() => handleActivate(record.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            Activate
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
