"use client";

import { useEffect, useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { ApiClientError } from "@/lib/api-client";
import { employeesService, type Employee } from "@/lib/services/employees";
import { departmentsService, type Department } from "@/lib/services/departments";

const statusClasses: Record<Employee["employment_status"], string> = {
  PROBATION: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  SUSPENDED: "bg-red-100 text-red-700",
  RESIGNED: "bg-slate-100 text-slate-700",
  TERMINATED: "bg-rose-100 text-rose-700"
};

const selectStyles = `
  select {
    color-scheme: light;
  }
  
  .dark select {
    color-scheme: dark;
  }
  
  .dark select option {
    background-color: #1f2937;
    color: #f3f4f6;
  }
  
  select option {
    background-color: #ffffff;
    color: #000000;
  }
`;

export default function EmployeesListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const response = await departmentsService.list({ page: 1, limit: 100 });
        setDepartments(response.data);
      } catch {
        setDepartments([]);
      }
    };

    void loadFilters();
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await employeesService.list({
          page,
          limit: 10,
          ...(departmentId ? { department_id: departmentId } : {})
        });

        setEmployees(response.data);
        setTotalPages(response.pagination.totalPages || 1);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError("Failed to load employees.");
        }
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [departmentId, page]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(q) ||
        employee.employee_code.toLowerCase().includes(q) ||
        employee.email.toLowerCase().includes(q)
      );
    });
  }, [employees, search]);

  return (
    <div className="space-y-6">
      <style>{selectStyles}</style>
      <ComponentCard title="Employees" desc="Directory synced with HRMS backend">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, code, or email"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={departmentId}
            onChange={(event) => {
              setDepartmentId(event.target.value);
              setPage(1);
            }}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs disabled:opacity-50 dark:border-gray-700 dark:text-white"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">Page {page} / {Math.max(totalPages, 1)}</span>
            <button
              type="button"
              onClick={() => setPage((current) => (current < totalPages ? current + 1 : current))}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs disabled:opacity-50 dark:border-gray-700 dark:text-white"
            >
              Next
            </button>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Employee Records">
        {loading ? <p className="text-sm text-gray-500">Loading employees...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {!loading && !error && filtered.length === 0 ? <p className="text-sm text-gray-500">No employees found.</p> : null}

        {!loading && !error && filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Code</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Position</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((employee) => (
                  <tr key={employee.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-100">{employee.first_name} {employee.last_name}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{employee.employee_code}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{employee.email}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{employee.current_assignment?.department_name ?? "-"}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{employee.current_assignment?.position_title ?? "-"}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[employee.employment_status]}`}>
                        {employee.employment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </ComponentCard>
    </div>
  );
}
