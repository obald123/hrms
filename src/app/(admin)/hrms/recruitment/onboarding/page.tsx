"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface OnboardingEmployee {
  id: string;
  employee_name: string;
  employee_email: string;
  position: string;
  department: string;
  start_date: string;
  manager: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";
  progress: number;
  tasks_completed: number;
  total_tasks: number;
}

const statusClasses: Record<OnboardingEmployee["status"], string> = {
  NOT_STARTED: "text-gray-600 dark:text-gray-400",
  IN_PROGRESS: "text-blue-600 dark:text-blue-400",
  COMPLETED: "text-green-600 dark:text-green-400",
  DELAYED: "text-red-600 dark:text-red-400"
};

const getProgressColor = (progress: number) => {
  if (progress === 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

const mockEmployees: OnboardingEmployee[] = [
  {
    id: "1",
    employee_name: "Ahmed Al-Rashid",
    employee_email: "ahmed.rashid@email.com",
    position: "Senior Backend Engineer",
    department: "Engineering",
    start_date: "2026-03-01",
    manager: "Dr. Khalid Mohammed",
    status: "IN_PROGRESS",
    progress: 65,
    tasks_completed: 13,
    total_tasks: 20
  },
  {
    id: "2",
    employee_name: "Sarah Mohammed",
    employee_email: "sarah.m@email.com",
    position: "UX Designer",
    department: "Design",
    start_date: "2026-02-15",
    manager: "Ms. Fatima Hassan",
    status: "COMPLETED",
    progress: 100,
    tasks_completed: 18,
    total_tasks: 18
  },
  {
    id: "3",
    employee_name: "Omar Abdullah",
    employee_email: "omar.abdullah@email.com",
    position: "Frontend Developer",
    department: "Engineering",
    start_date: "2026-03-05",
    manager: "Mr. Hassan Ali",
    status: "NOT_STARTED",
    progress: 10,
    tasks_completed: 1,
    total_tasks: 20
  },
  {
    id: "4",
    employee_name: "Nora Abdullah",
    employee_email: "nora.abdullah@email.com",
    position: "UX Designer",
    department: "Design",
    start_date: "2026-02-01",
    manager: "Ms. Fatima Hassan",
    status: "DELAYED",
    progress: 45,
    tasks_completed: 8,
    total_tasks: 18
  },
  {
    id: "5",
    employee_name: "Layla Ibrahim",
    employee_email: "layla.ibrahim@email.com",
    position: "Product Manager",
    department: "Product",
    start_date: "2026-02-20",
    manager: "Mr. Yousef Ahmed",
    status: "IN_PROGRESS",
    progress: 80,
    tasks_completed: 16,
    total_tasks: 20
  },
  {
    id: "6",
    employee_name: "Khalid Saeed",
    employee_email: "khalid.s@email.com",
    position: "DevOps Engineer",
    department: "Engineering",
    start_date: "2026-02-10",
    manager: "Dr. Khalid Mohammed",
    status: "COMPLETED",
    progress: 100,
    tasks_completed: 20,
    total_tasks: 20
  },
  {
    id: "7",
    employee_name: "Maha Salem",
    employee_email: "maha.salem@email.com",
    position: "Data Analyst",
    department: "Analytics",
    start_date: "2026-03-03",
    manager: "Ms. Reem Al-Mutairi",
    status: "IN_PROGRESS",
    progress: 35,
    tasks_completed: 7,
    total_tasks: 20
  }
];

export default function OnboardingPage() {
  const [employees, setEmployees] = useState<OnboardingEmployee[]>(mockEmployees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED">("ALL");

  const filtered = useMemo(() => {
    let result = employees;

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((emp) => emp.status === statusFilter);
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((emp) => {
        return (
          emp.employee_name.toLowerCase().includes(q) ||
          emp.employee_email.toLowerCase().includes(q) ||
          emp.position.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q)
        );
      });
    }

    return result.sort((a, b) => {
      // Sort by progress (incomplete first)
      if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;
      if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });
  }, [employees, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: employees.length,
      completed: employees.filter((e) => e.status === "COMPLETED").length,
      inProgress: employees.filter((e) => e.status === "IN_PROGRESS").length,
      delayed: employees.filter((e) => e.status === "DELAYED").length,
      notStarted: employees.filter((e) => e.status === "NOT_STARTED").length
    };
  }, [employees]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <StatCard label="Total Employees" value={stats.total.toString()} />
        <StatCard label="Completed" value={stats.completed.toString()} />
        <StatCard label="In Progress" value={stats.inProgress.toString()} />
        <StatCard label="Delayed" value={stats.delayed.toString()} />
        <StatCard label="Not Started" value={stats.notStarted.toString()} />
      </div>

      <ComponentCard title="Employee Onboarding" desc="Track and manage employee onboarding progress">
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
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="DELAYED">Delayed</option>
          </select>
        </div>
      </ComponentCard>

      <ComponentCard title="Onboarding Records">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No employees found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Position</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Start Date</th>
                  <th className="px-3 py-2 font-medium">Manager</th>
                  <th className="px-3 py-2 font-medium">Progress</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{emp.employee_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{emp.employee_email}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{emp.position}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{emp.department}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(emp.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{emp.manager}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(emp.progress)}`}
                            style={{ width: `${emp.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-10">
                          {emp.progress}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {emp.tasks_completed}/{emp.total_tasks} tasks
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${statusClasses[emp.status]}`}>
                        {emp.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/hrms/recruitment/onboarding/${emp.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          View
                        </Link>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}
