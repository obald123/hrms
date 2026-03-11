"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

type ReviewStatus = "PENDING_SELF" | "MANAGER_REVIEW" | "CALIBRATION" | "COMPLETED";
type Priority = "HIGH" | "MEDIUM" | "LOW";

interface ReviewCycleStage {
  label: string;
  completed: number;
  total: number;
}

interface DepartmentAlignment {
  name: string;
  objectiveCompletion: number;
  reviewCompletion: number;
}

interface ReviewItem {
  id: string;
  employee: string;
  department: string;
  manager: string;
  dueDate: string;
  score: number | null;
  status: ReviewStatus;
  priority: Priority;
}

const cycleStages: ReviewCycleStage[] = [
  { label: "Self Assessment", completed: 134, total: 160 },
  { label: "Manager Review", completed: 102, total: 160 },
  { label: "Calibration", completed: 56, total: 160 },
  { label: "Final Sign-Off", completed: 29, total: 160 }
];

const alignment: DepartmentAlignment[] = [
  { name: "Engineering", objectiveCompletion: 84, reviewCompletion: 72 },
  { name: "Product", objectiveCompletion: 79, reviewCompletion: 68 },
  { name: "Sales", objectiveCompletion: 71, reviewCompletion: 59 },
  { name: "Operations", objectiveCompletion: 63, reviewCompletion: 48 },
  { name: "People & Culture", objectiveCompletion: 91, reviewCompletion: 86 }
];

const reviews: ReviewItem[] = [
  {
    id: "RV-221",
    employee: "Aline Mukamana",
    department: "Engineering",
    manager: "Patrick Ndayambaje",
    dueDate: "2026-03-11",
    score: 4.6,
    status: "MANAGER_REVIEW",
    priority: "HIGH"
  },
  {
    id: "RV-219",
    employee: "Jean Bosco Iradukunda",
    department: "Sales",
    manager: "Clarisse Uwimana",
    dueDate: "2026-03-14",
    score: 4.2,
    status: "PENDING_SELF",
    priority: "MEDIUM"
  },
  {
    id: "RV-214",
    employee: "Alice Nishimwe",
    department: "People & Culture",
    manager: "Yvette Ingabire",
    dueDate: "2026-03-09",
    score: null,
    status: "CALIBRATION",
    priority: "HIGH"
  },
  {
    id: "RV-207",
    employee: "Diane Mukeshimana",
    department: "Product",
    manager: "Robert Ndayizeye",
    dueDate: "2026-03-20",
    score: 3.9,
    status: "PENDING_SELF",
    priority: "LOW"
  },
  {
    id: "RV-198",
    employee: "Sam Kabera",
    department: "Operations",
    manager: "Michel Nsengiyumva",
    dueDate: "2026-03-07",
    score: 4.8,
    status: "COMPLETED",
    priority: "MEDIUM"
  },
  {
    id: "RV-194",
    employee: "Grace Uwamahoro",
    department: "Engineering",
    manager: "Patrick Ndayambaje",
    dueDate: "2026-03-18",
    score: 4.1,
    status: "MANAGER_REVIEW",
    priority: "HIGH"
  }
];

const statusLabel: Record<ReviewStatus, string> = {
  PENDING_SELF: "Pending Self",
  MANAGER_REVIEW: "Manager Review",
  CALIBRATION: "Calibration",
  COMPLETED: "Completed"
};

const statusColor: Record<ReviewStatus, "warning" | "info" | "primary" | "success"> = {
  PENDING_SELF: "warning",
  MANAGER_REVIEW: "info",
  CALIBRATION: "primary",
  COMPLETED: "success"
};

const priorityColor: Record<Priority, "error" | "warning" | "success"> = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "success"
};

export default function PerformanceDashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "ALL">("ALL");

  const metrics = useMemo(() => {
    const total = reviews.length;
    const completed = reviews.filter((item) => item.status === "COMPLETED").length;
    const calibration = reviews.filter((item) => item.status === "CALIBRATION").length;
    const pendingManager = reviews.filter((item) => item.status === "MANAGER_REVIEW").length;

    return [
      {
        label: "Review Completion",
        value: `${Math.round((completed / total) * 100)}%`,
        subtitle: `${completed}/${total} employees completed`
      },
      {
        label: "Manager Reviews",
        value: String(pendingManager),
        subtitle: "Awaiting manager inputs"
      },
      {
        label: "Calibration Queue",
        value: String(calibration),
        subtitle: "Ready for panel discussion"
      },
      {
        label: "Recognition This Month",
        value: "126",
        subtitle: "+19% vs previous month"
      }
    ];
  }, []);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews
      .filter((item) => {
        if (statusFilter !== "ALL" && item.status !== statusFilter) {
          return false;
        }

        if (!query) {
          return true;
        }

        return (
          item.employee.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.manager.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Performance Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track review cycle progress, department alignment, and recognition trends.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => router.push("/hrms/performance/reviews")}>
            Open Reviews
          </Button>
          <Button size="sm" onClick={() => router.push("/hrms/performance/okrs")}>
            View OKRs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{metric.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ComponentCard title="Review Cycle Progress" desc="Current cycle completion by stage">
            <div className="space-y-4">
              {cycleStages.map((stage) => {
                const percent = Math.round((stage.completed / stage.total) * 100);
                return (
                  <div key={stage.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stage.label}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{percent}%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-2 rounded-full bg-brand-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {stage.completed} of {stage.total} completed
                    </p>
                  </div>
                );
              })}
            </div>
          </ComponentCard>
        </div>

        <ComponentCard title="Recognition Highlights" desc="Peer recognition this quarter">
          <div className="space-y-3">
            <RecognitionItem
              employee="Aline Mukamana"
              note="Recognized for mentoring junior engineers during release week."
              tag="Leadership"
            />
            <RecognitionItem
              employee="Jean Bosco Iradukunda"
              note="Exceeded quarterly pipeline target by 24%."
              tag="Results"
            />
            <RecognitionItem
              employee="Alice Nishimwe"
              note="Standardized onboarding templates across teams."
              tag="Collaboration"
            />
          </div>
        </ComponentCard>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ComponentCard title="Department Alignment" desc="Objective completion vs review completion">
            <div className="space-y-4">
              {alignment.map((department) => (
                <div key={department.name} className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{department.name}</p>
                  <div className="mt-3 space-y-3">
                    <ProgressLine label="Objectives" value={department.objectiveCompletion} tone="bg-blue-500" />
                    <ProgressLine label="Reviews" value={department.reviewCompletion} tone="bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>

        <ComponentCard title="Action Center" desc="Quick actions for this cycle">
          <div className="space-y-3">
            <Button size="sm" className="w-full" onClick={() => router.push("/hrms/performance/reviews")}>
              Send Review Reminders
            </Button>
            <Button size="sm" variant="outline" className="w-full" onClick={() => router.push("/hrms/performance/recognition")}>
              Manage Recognition
            </Button>
            <Button size="sm" variant="outline" className="w-full" onClick={() => router.push("/hrms/performance/succession")}>
              Open Succession Plans
            </Button>
          </div>
          <div className="rounded-xl border border-dashed border-gray-300 p-3 dark:border-gray-700">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Review Window</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Closes on March 25, 2026</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">12 teams still need manager sign-off.</p>
          </div>
        </ComponentCard>
      </div>

      <ComponentCard title="Employees In Current Cycle" desc="Search and prioritize pending reviews">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee, department, manager, ID"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as ReviewStatus | "ALL")}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_SELF">Pending Self</option>
            <option value="MANAGER_REVIEW">Manager Review</option>
            <option value="CALIBRATION">Calibration</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <p className="text-sm text-gray-500">No matching review records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500 dark:border-gray-700">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Manager</th>
                  <th className="px-3 py-2 font-medium">Due Date</th>
                  <th className="px-3 py-2 font-medium">Score</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 text-sm dark:border-gray-800">
                    <td className="px-3 py-3">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{item.employee}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.id}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{item.department}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{item.manager}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(item.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {item.score === null ? "-" : `${item.score.toFixed(1)} / 5`}
                    </td>
                    <td className="px-3 py-3">
                      <Badge size="sm" color={statusColor[item.status]}>
                        {statusLabel[item.status]}
                      </Badge>
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

function ProgressLine({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{value}%</p>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
        <div className={`h-2 rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function RecognitionItem({ employee, note, tag }: { employee: string; note: string; tag: string }) {
  return (
    <div className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{employee}</p>
        <Badge size="sm" color="primary">
          {tag}
        </Badge>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{note}</p>
    </div>
  );
}
