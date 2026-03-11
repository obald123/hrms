"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

type OkrStatus = "ON_TRACK" | "AT_RISK" | "OFF_TRACK" | "COMPLETED";
type KeyResultStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";

interface KeyResultItem {
  title: string;
  progress: number;
  status: KeyResultStatus;
}

interface OkrRecord {
  id: string;
  owner: string;
  department: string;
  objective: string;
  quarter: "Q1 2026" | "Q2 2026";
  status: OkrStatus;
  weight: number;
  keyResults: KeyResultItem[];
}

const okrRecords: OkrRecord[] = [
  {
    id: "OKR-301",
    owner: "Aline Mukamana",
    department: "Engineering",
    objective: "Increase platform reliability for payroll and attendance services",
    quarter: "Q1 2026",
    status: "ON_TRACK",
    weight: 35,
    keyResults: [
      { title: "Reduce Sev-1 incidents from 6 to 2", progress: 75, status: "IN_PROGRESS" },
      { title: "Achieve 99.9% API uptime", progress: 88, status: "IN_PROGRESS" },
      { title: "Automate rollback workflows", progress: 100, status: "COMPLETED" }
    ]
  },
  {
    id: "OKR-302",
    owner: "Jean Bosco Iradukunda",
    department: "Sales",
    objective: "Improve enterprise conversion from qualified HR leads",
    quarter: "Q1 2026",
    status: "AT_RISK",
    weight: 20,
    keyResults: [
      { title: "Increase demo-to-proposal ratio to 52%", progress: 41, status: "IN_PROGRESS" },
      { title: "Close 8 annual contracts", progress: 37, status: "IN_PROGRESS" },
      { title: "Reduce proposal turnaround to <48h", progress: 22, status: "NOT_STARTED" }
    ]
  },
  {
    id: "OKR-303",
    owner: "Alice Nishimwe",
    department: "People & Culture",
    objective: "Strengthen performance review quality and calibration consistency",
    quarter: "Q1 2026",
    status: "ON_TRACK",
    weight: 15,
    keyResults: [
      { title: "100% manager calibration training", progress: 100, status: "COMPLETED" },
      { title: "Raise review completion to 90%", progress: 82, status: "IN_PROGRESS" },
      { title: "Publish score quality rubric", progress: 95, status: "IN_PROGRESS" }
    ]
  },
  {
    id: "OKR-304",
    owner: "Diane Mukeshimana",
    department: "Product",
    objective: "Launch self-service performance goals module for all departments",
    quarter: "Q1 2026",
    status: "OFF_TRACK",
    weight: 30,
    keyResults: [
      { title: "Finalize goal setting UX", progress: 80, status: "IN_PROGRESS" },
      { title: "Release manager workflow", progress: 26, status: "IN_PROGRESS" },
      { title: "Roll out to 5 pilot teams", progress: 0, status: "NOT_STARTED" }
    ]
  },
  {
    id: "OKR-305",
    owner: "Sam Kabera",
    department: "Operations",
    objective: "Improve internal process SLAs for employee lifecycle actions",
    quarter: "Q2 2026",
    status: "COMPLETED",
    weight: 10,
    keyResults: [
      { title: "Reduce onboarding cycle from 6 to 3 days", progress: 100, status: "COMPLETED" },
      { title: "Reduce approval lag by 40%", progress: 100, status: "COMPLETED" },
      { title: "Publish SLA dashboard", progress: 100, status: "COMPLETED" }
    ]
  }
];

const statusLabel: Record<OkrStatus, string> = {
  ON_TRACK: "On Track",
  AT_RISK: "At Risk",
  OFF_TRACK: "Off Track",
  COMPLETED: "Completed"
};

const statusColor: Record<OkrStatus, "success" | "warning" | "error" | "primary"> = {
  ON_TRACK: "success",
  AT_RISK: "warning",
  OFF_TRACK: "error",
  COMPLETED: "primary"
};

const krLabel: Record<KeyResultStatus, string> = {
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
  NOT_STARTED: "Not Started"
};

export default function PerformanceOkrsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<OkrStatus | "ALL">("ALL");

  const departments = useMemo(() => {
    return Array.from(new Set(okrRecords.map((okr) => okr.department))).sort();
  }, []);

  const summary = useMemo(() => {
    const total = okrRecords.length;
    const onTrack = okrRecords.filter((item) => item.status === "ON_TRACK").length;
    const atRisk = okrRecords.filter((item) => item.status === "AT_RISK" || item.status === "OFF_TRACK").length;

    const weightedProgress = Math.round(
      okrRecords.reduce((sum, item) => sum + getOkrProgress(item) * item.weight, 0) /
        okrRecords.reduce((sum, item) => sum + item.weight, 0)
    );

    return { total, onTrack, atRisk, weightedProgress };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return okrRecords.filter((item) => {
      if (departmentFilter !== "ALL" && item.department !== departmentFilter) {
        return false;
      }

      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }

      if (!q) {
        return true;
      }

      return (
        item.objective.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    });
  }, [departmentFilter, query, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">OKRs (Objectives & Key Results)</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Align teams around measurable goals and track quarter outcomes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => router.push("/hrms/performance/dashboard")}>
            Back To Dashboard
          </Button>
          <Button size="sm" onClick={() => router.push("/hrms/performance/reviews")}>
            Open Reviews
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total OKRs" value={String(summary.total)} note="Active portfolios" />
        <MetricCard label="On Track" value={String(summary.onTrack)} note="Healthy execution" />
        <MetricCard label="At Risk" value={String(summary.atRisk)} note="Need intervention" />
        <MetricCard label="Weighted Progress" value={`${summary.weightedProgress}%`} note="Across all teams" />
      </div>

      <ComponentCard title="Filters" desc="Search and narrow down objective portfolios">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by objective, owner, or ID"
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
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as OkrStatus | "ALL")}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="ON_TRACK">On Track</option>
            <option value="AT_RISK">At Risk</option>
            <option value="OFF_TRACK">Off Track</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </ComponentCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ComponentCard title="OKR Portfolio" desc={`Showing ${filtered.length} objectives`}>
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-500">No OKRs match your current filters.</p>
            ) : (
              <div className="space-y-4">
                {filtered.map((item) => {
                  const progress = getOkrProgress(item);
                  return (
                    <div key={item.id} className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.objective}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{item.owner}</span>
                            <span>{item.department}</span>
                            <span>{item.quarter}</span>
                            <span>{item.id}</span>
                          </div>
                        </div>
                        <Badge size="sm" color={statusColor[item.status]}>
                          {statusLabel[item.status]}
                        </Badge>
                      </div>

                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Overall progress</p>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{progress}%</p>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className={`h-2 rounded-full ${progressBarClass(progress)}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {item.keyResults.map((kr) => (
                          <div key={kr.title} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/30">
                            <div className="mb-1 flex items-center justify-between gap-2">
                              <p className="text-xs text-gray-700 dark:text-gray-300">{kr.title}</p>
                              <Badge size="sm" color={krBadgeColor(kr.status)}>
                                {krLabel[kr.status]}
                              </Badge>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className={`h-1.5 rounded-full ${progressBarClass(kr.progress)}`}
                                style={{ width: `${kr.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ComponentCard>
        </div>

        <ComponentCard title="Execution Snapshot" desc="Distribution by completion bands">
          <div className="space-y-3">
            <SnapshotRow label="Strong (>= 80%)" count={countByBand(okrRecords, "STRONG")} tone="bg-green-500" />
            <SnapshotRow label="Moderate (50-79%)" count={countByBand(okrRecords, "MODERATE")} tone="bg-blue-500" />
            <SnapshotRow label="Lagging (< 50%)" count={countByBand(okrRecords, "LAGGING")} tone="bg-red-500" />
          </div>

          <div className="rounded-xl border border-dashed border-gray-300 p-3 dark:border-gray-700">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Recommended Action</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              Prioritize at-risk Sales and Product objectives in this week&apos;s manager sync.
            </p>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}

function getOkrProgress(item: OkrRecord): number {
  return Math.round(item.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / item.keyResults.length);
}

function progressBarClass(value: number): string {
  if (value >= 80) {
    return "bg-green-500";
  }

  if (value >= 50) {
    return "bg-blue-500";
  }

  return "bg-red-500";
}

function krBadgeColor(status: KeyResultStatus): "success" | "info" | "light" {
  if (status === "COMPLETED") {
    return "success";
  }

  if (status === "IN_PROGRESS") {
    return "info";
  }

  return "light";
}

function countByBand(records: OkrRecord[], band: "STRONG" | "MODERATE" | "LAGGING"): number {
  return records.filter((item) => {
    const progress = getOkrProgress(item);
    if (band === "STRONG") {
      return progress >= 80;
    }
    if (band === "MODERATE") {
      return progress >= 50 && progress < 80;
    }
    return progress < 50;
  }).length;
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

function SnapshotRow({ label, count, tone }: { label: string; count: number; tone: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{count}</p>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
        <div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.max(10, count * 20)}%` }} />
      </div>
    </div>
  );
}
