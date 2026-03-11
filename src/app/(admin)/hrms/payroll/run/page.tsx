"use client";

import { useState, useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
}

const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Jean Kabera",
    email: "jean.kabera@company.com",
    position: "Senior Backend Engineer",
    department: "Engineering",
    base_salary: 850000,
    allowances: 150000,
    deductions: 85000,
    net_salary: 915000,
  },
  {
    id: "EMP002",
    name: "Marie Mukiza",
    email: "marie.mukiza@company.com",
    position: "UX Designer",
    department: "Design",
    base_salary: 720000,
    allowances: 100000,
    deductions: 72000,
    net_salary: 748000,
  },
  {
    id: "EMP003",
    name: "Pierre Niyigaba",
    email: "pierre.niyigaba@company.com",
    position: "Frontend Developer",
    department: "Engineering",
    base_salary: 780000,
    allowances: 120000,
    deductions: 78000,
    net_salary: 822000,
  },
  {
    id: "EMP004",
    name: "Yvonne Iradukunda",
    email: "yvonne.iradukunda@company.com",
    position: "Product Manager",
    department: "Product",
    base_salary: 950000,
    allowances: 180000,
    deductions: 95000,
    net_salary: 1035000,
  },
  {
    id: "EMP005",
    name: "David Ndagijimana",
    email: "david.ndagijimana@company.com",
    position: "DevOps Engineer",
    department: "Engineering",
    base_salary: 820000,
    allowances: 140000,
    deductions: 82000,
    net_salary: 878000,
  },
  {
    id: "EMP006",
    name: "Grace Uwacu",
    email: "grace.uwacu@company.com",
    position: "Data Analyst",
    department: "Analytics",
    base_salary: 680000,
    allowances: 90000,
    deductions: 68000,
    net_salary: 702000,
  },
  {
    id: "EMP007",
    name: "Victor Habimana",
    email: "victor.habimana@company.com",
    position: "HR Manager",
    department: "Human Resources",
    base_salary: 750000,
    allowances: 110000,
    deductions: 75000,
    net_salary: 785000,
  },
];

export default function Page() {
  const [payrollMonth, setPayrollMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return mockEmployees;
    const q = search.trim().toLowerCase();
    return mockEmployees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.position.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
    );
  }, [search]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((employee) => selectedEmployees.includes(employee.id));

  const totalSelected = selectedEmployees.length;
  const payrollMonthLabel = payrollMonth
    ? new Date(`${payrollMonth}-01`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "selected month";

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedEmployees((previous) =>
        previous.filter((employeeId) => !filtered.some((employee) => employee.id === employeeId))
      );
    } else {
      setSelectedEmployees((previous) => {
        const set = new Set(previous);
        filtered.forEach((employee) => set.add(employee.id));
        return Array.from(set);
      });
    }
  };

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleRunPayroll = () => {
    if (selectedEmployees.length === 0) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      setTimeout(() => setProcessed(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Payroll Period Selection */}
      <ComponentCard
        title="Payroll Run Filters"
        desc="Select payroll month and find employees to include in this run"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payroll Month
            </label>
            <input
              type="month"
              value={payrollMonth}
              onChange={(e) => setPayrollMonth(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search Employees
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or department"
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>
      </ComponentCard>

      {/* Employee Selection Table */}
      <ComponentCard title="Employee Selection" desc="Pick employees to include in this payroll run">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No employees found.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Selected: <span className="font-semibold">{totalSelected}</span> employee(s)
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50"
                >
                  {allFilteredSelected ? "Unselect All" : "Select All"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEmployees([])}
                  disabled={selectedEmployees.length === 0}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleRunPayroll}
                  disabled={processing || selectedEmployees.length === 0}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing ? "Processing..." : `Run Payroll (${totalSelected})`}
                </button>
              </div>
            </div>

            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Position</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Payroll Month</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => handleSelectEmployee(emp.id)}
                    className={`border-b border-gray-100 text-sm cursor-pointer ${
                      selectedEmployees.includes(emp.id)
                        ? "bg-blue-50/60 dark:bg-blue-900/20"
                        : ""
                    }`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => handleSelectEmployee(emp.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {emp.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {emp.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {emp.position}
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {emp.department}
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {payrollMonthLabel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>

      {/* Success Message */}
      {processed && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            ✓ Payroll processed successfully for {totalSelected} employee(s)
          </p>
        </div>
      )}
    </div>
  );
}
