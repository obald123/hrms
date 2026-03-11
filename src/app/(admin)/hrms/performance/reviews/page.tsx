"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

type ReviewStage = "SELF" | "MANAGER" | "CALIBRATION" | "COMPLETE";
type ReviewResult = "EXCEPTIONAL" | "STRONG" | "MEETS" | "NEEDS_SUPPORT";
type ReviewPriority = "HIGH" | "MEDIUM" | "LOW";

interface ReviewRecord {
  id: string;
  employee: string;
  department: string;
  manager: string;
  cycle: string;
  stage: ReviewStage;
  score: number | null;
  result: ReviewResult | null;
  dueDate: string;
  lastUpdated: string;
  priority: ReviewPriority;
}

const reviewRecords: ReviewRecord[] = [
  {
    id: "REV-410",
    employee: "Aline Mukamana",
    department: "Engineering",
    manager: "Patrick Ndayambaje",
    cycle: "Annual 2026",
    stage: "MANAGER",
    score: 4.6,
    result: "EXCEPTIONAL",
    dueDate: "2026-03-11",
    lastUpdated: "2026-03-08",
    priority: "HIGH"
  },
  {
    id: "REV-407",
    employee: "Jean Bosco Iradukunda",
    department: "Sales",
    manager: "Clarisse Uwimana",
    cycle: "Annual 2026",
    stage: "SELF",
    score: null,
    result: null,
    dueDate: "2026-03-14",
    lastUpdated: "2026-03-05",
    priority: "MEDIUM"
  },
  {
    id: "REV-404",
    employee: "Alice Nishimwe",
    department: "People & Culture",
    manager: "Yvette Ingabire",
    cycle: "Annual 2026",
    stage: "CALIBRATION",
    score: 4.3,
    result: "STRONG",
    dueDate: "2026-03-09",
    lastUpdated: "2026-03-09",
    priority: "HIGH"
  },
  {
    id: "REV-399",
    employee: "Diane Mukeshimana",
    department: "Product",
    manager: "Robert Ndayizeye",
    cycle: "Annual 2026",
    stage: "SELF",
    score: 3.8,
    result: "MEETS",
    dueDate: "2026-03-20",
    lastUpdated: "2026-03-07",
    priority: "LOW"
  },
  {
    id: "REV-396",
    employee: "Sam Kabera",
    department: "Operations",
    manager: "Michel Nsengiyumva",
    cycle: "Annual 2026",
    stage: "COMPLETE",
    score: 4.8,
    result: "EXCEPTIONAL",
    dueDate: "2026-03-07",
    lastUpdated: "2026-03-06",
    priority: "MEDIUM"
  },
  {
    id: "REV-392",
    employee: "Grace Uwamahoro",
    department: "Engineering",
    manager: "Patrick Ndayambaje",
    cycle: "Annual 2026",
    stage: "MANAGER",
    score: 4.1,
    result: "STRONG",
    dueDate: "2026-03-18",
    lastUpdated: "2026-03-08",
    priority: "HIGH"
  },
  {
    id: "REV-389",
    employee: "Kevin Mutesi",
    department: "Finance",
    manager: "Brenda Umutoni",
    cycle: "Annual 2026",
    stage: "COMPLETE",
    score: 3.6,
    result: "MEETS",
    dueDate: "2026-03-04",
    lastUpdated: "2026-03-03",
    priority: "LOW"
  }
];

const stageLabel: Record<ReviewStage, string> = {
  SELF: "Self Assessment",
  MANAGER: "Manager Review",
  CALIBRATION: "Calibration",
  COMPLETE: "Completed"
};

const stageColor: Record<ReviewStage, "warning" | "info" | "primary" | "success"> = {
  SELF: "warning",
  MANAGER: "info",
  CALIBRATION: "primary",
  COMPLETE: "success"
};

const resultLabel: Record<ReviewResult, string> = {
  EXCEPTIONAL: "Exceptional",
  STRONG: "Strong",
  MEETS: "Meets",
  NEEDS_SUPPORT: "Needs Support"
};

const resultColor: Record<ReviewResult, "success" | "primary" | "info" | "error"> = {
  EXCEPTIONAL: "success",
  STRONG: "primary",
  MEETS: "info",
  NEEDS_SUPPORT: "error"
};

const priorityColor: Record<ReviewPriority, "error" | "warning" | "success"> = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "success"
};

export default function PerformanceReviewsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [stageFilter, setStageFilter] = useState<ReviewStage | "ALL">("ALL");

  const departments = useMemo(() => {
    return Array.from(new Set(reviewRecords.map((item) => item.department))).sort();
  }, []);

  const metrics = useMemo(() => {
    const total = reviewRecords.length;
    const completed = reviewRecords.filter((item) => item.stage === "COMPLETE").length;
    const managerQueue = reviewRecords.filter((item) => item.stage === "MANAGER").length;
    const avgScore = (
      reviewRecords
        .filter((item) => item.score !== null)
        .reduce((sum, item) => sum + (item.score ?? 0), 0) /
      reviewRecords.filter((item) => item.score !== null).length
    ).toFixed(1);

    const dueThisWeek = reviewRecords.filter((item) => {
      if (item.stage === "COMPLETE") {
        return false;
      }
      const days = daysUntil(item.dueDate);
      return days >= 0 && days <= 7;
    }).length;

    return { total, completed, managerQueue, avgScore, dueThisWeek };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return reviewRecords
      .filter((item) => {
        if (departmentFilter !== "ALL" && item.department !== departmentFilter) {
          return false;
        }

        if (stageFilter !== "ALL" && item.stage !== stageFilter) {
          return false;
        }

        if (!q) {
          return true;
        }

        return (
          item.employee.toLowerCase().includes(q) ||
          item.manager.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [departmentFilter, search, stageFilter]);

  const pipeline = useMemo(() => {
    return [
      { stage: "SELF" as const, count: reviewRecords.filter((item) => item.stage === "SELF").length },
      { stage: "MANAGER" as const, count: reviewRecords.filter((item) => item.stage === "MANAGER").length },
      { stage: "CALIBRATION" as const, count: reviewRecords.filter((item) => item.stage === "CALIBRATION").length },
      { stage: "COMPLETE" as const, count: reviewRecords.filter((item) => item.stage === "COMPLETE").length }
    ];
  }, []);

  const pendingActions = useMemo(() => {
    return reviewRecords
      .filter((item) => item.stage !== "COMPLETE")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Performance Reviews</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage review progress, ratings, and completion timelines.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => router.push("/hrms/performance/dashboard")}>
            Back To Dashboard
          </Button>
          <Button size="sm" onClick={() => router.push("/hrms/performance/okrs")}>
            Open OKRs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total Reviews" value={String(metrics.total)} note="In current cycle" />
        <MetricCard label="Completed" value={String(metrics.completed)} note="Finalized forms" />
        <MetricCard label="Manager Queue" value={String(metrics.managerQueue)} note="Needs manager action" />
        <MetricCard label="Average Score" value={`${metrics.avgScore}/5`} note="Scored reviews only" />
        <MetricCard label="Due In 7 Days" value={String(metrics.dueThisWeek)} note="Upcoming deadlines" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ComponentCard title="Review Pipeline" desc="Current distribution by review stage">
            <div className="space-y-4">
              {pipeline.map((row) => {
                const percent = Math.round((row.count / reviewRecords.length) * 100);
                return (
                  <div key={row.stage}>
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stageLabel[row.stage]}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{row.count}</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{percent}% of all reviews</p>
                  </div>
                );
              })}
            </div>
          </ComponentCard>
        </div>

        <ComponentCard title="Pending Actions" desc="Most urgent reviews to follow up">
          <div className="space-y-3">
            {pendingActions.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.employee}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.id} • {item.department}</p>
                  </div>
                  <Badge size="sm" color={priorityColor[item.priority]}>
                    {item.priority}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{stageLabel[item.stage]}</span>
                  <span>Due {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>

      <ComponentCard title="Review Records" desc="Search and filter current review cycle">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee, manager, or ID"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="ALL">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <select
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value as ReviewStage | "ALL")}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="ALL">All Stages</option>
            <option value="SELF">Self Assessment</option>
            <option value="MANAGER">Manager Review</option>
            <option value="CALIBRATION">Calibration</option>
            <option value="COMPLETE">Completed</option>
          </select>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            Showing {filtered.length} of {reviewRecords.length} reviews
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No review records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500 dark:border-gray-700">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Manager</th>
                  <th className="px-3 py-2 font-medium">Cycle</th>
                  <th className="px-3 py-2 font-medium">Score</th>
                  <th className="px-3 py-2 font-medium">Result</th>
                  <th className="px-3 py-2 font-medium">Stage</th>
                  <th className="px-3 py-2 font-medium">Due Date</th>
                  <th className="px-3 py-2 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 text-sm dark:border-gray-800">
                    <td className="px-3 py-3">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{item.employee}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.id}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{item.department}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{item.manager}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{item.cycle}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {item.score === null ? "-" : `${item.score.toFixed(1)} / 5`}
                    </td>
                    <td className="px-3 py-3">
                      {item.result ? (
                        <Badge size="sm" color={resultColor[item.result]}>
                          {resultLabel[item.result]}
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Pending</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Badge size="sm" color={stageColor[item.stage]}>
                        {stageLabel[item.stage]}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(item.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <Badge size="sm" color={priorityColor[item.priority]}>
                        {item.priority}
                      </Badge>
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

function daysUntil(dateIso: string): number {
  const today = new Date();
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const target = new Date(dateIso).getTime();
  return Math.floor((target - current) / (1000 * 60 * 60 * 24));
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{note}</p>
    </div>
  );
}
