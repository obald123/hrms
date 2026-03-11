"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import AvatarText from "@/components/ui/avatar/AvatarText";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

type RecognitionStatus = "APPROVED" | "PENDING" | "REJECTED";
type RecognitionCategory = "LEADERSHIP" | "INNOVATION" | "COLLABORATION" | "CUSTOMER" | "EXECUTION";

interface RecognitionItem {
  id: string;
  employeeName: string;
  department: string;
  nominatedBy: string;
  category: RecognitionCategory;
  message: string;
  points: number;
  reward: number;
  status: RecognitionStatus;
  date: string;
}

const recognitionItems: RecognitionItem[] = [
  {
    id: "RC-501",
    employeeName: "Aline Mukamana",
    department: "Engineering",
    nominatedBy: "Patrick Ndayambaje",
    category: "LEADERSHIP",
    message: "Stepped in to mentor two new engineers and stabilized the release under tight timelines.",
    points: 120,
    reward: 350,
    status: "APPROVED",
    date: "2026-03-08"
  },
  {
    id: "RC-498",
    employeeName: "Jean Bosco Iradukunda",
    department: "Sales",
    nominatedBy: "Clarisse Uwimana",
    category: "EXECUTION",
    message: "Exceeded quarterly outreach target and helped two peers close strategic accounts.",
    points: 95,
    reward: 280,
    status: "APPROVED",
    date: "2026-03-07"
  },
  {
    id: "RC-492",
    employeeName: "Alice Nishimwe",
    department: "People & Culture",
    nominatedBy: "Yvette Ingabire",
    category: "COLLABORATION",
    message: "Unified review templates across departments and reduced manager confusion this cycle.",
    points: 90,
    reward: 250,
    status: "PENDING",
    date: "2026-03-06"
  },
  {
    id: "RC-488",
    employeeName: "Diane Mukeshimana",
    department: "Product",
    nominatedBy: "Robert Ndayizeye",
    category: "INNOVATION",
    message: "Introduced a goals dashboard concept that cut planning time by over 30%.",
    points: 130,
    reward: 400,
    status: "APPROVED",
    date: "2026-03-04"
  },
  {
    id: "RC-481",
    employeeName: "Sam Kabera",
    department: "Operations",
    nominatedBy: "Michel Nsengiyumva",
    category: "CUSTOMER",
    message: "Handled a critical employee escalation with high professionalism and fast turnaround.",
    points: 70,
    reward: 180,
    status: "APPROVED",
    date: "2026-03-02"
  },
  {
    id: "RC-477",
    employeeName: "Grace Uwamahoro",
    department: "Engineering",
    nominatedBy: "Patrick Ndayambaje",
    category: "COLLABORATION",
    message: "Led cross-team API workshop that reduced implementation blockers for payroll team.",
    points: 85,
    reward: 220,
    status: "REJECTED",
    date: "2026-03-01"
  }
];

const statusLabel: Record<RecognitionStatus, string> = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Rejected"
};

const statusColor: Record<RecognitionStatus, "success" | "warning" | "error"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "error"
};

const categoryLabel: Record<RecognitionCategory, string> = {
  LEADERSHIP: "Leadership",
  INNOVATION: "Innovation",
  COLLABORATION: "Collaboration",
  CUSTOMER: "Customer Impact",
  EXECUTION: "Execution"
};

const categoryBadgeColor: Record<RecognitionCategory, "primary" | "info" | "success" | "warning" | "dark"> = {
  LEADERSHIP: "primary",
  INNOVATION: "info",
  COLLABORATION: "success",
  CUSTOMER: "warning",
  EXECUTION: "dark"
};

const categoryTint: Record<RecognitionCategory, string> = {
  LEADERSHIP: "bg-brand-50/30 dark:bg-brand-500/5",
  INNOVATION: "bg-blue-light-50/40 dark:bg-blue-light-500/5",
  COLLABORATION: "bg-success-50/30 dark:bg-success-500/5",
  CUSTOMER: "bg-warning-50/40 dark:bg-warning-500/5",
  EXECUTION: "bg-gray-50/70 dark:bg-white/5"
};

export default function PerformanceRecognitionPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RecognitionStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<RecognitionCategory | "ALL">("ALL");

  const stats = useMemo(() => {
    const approved = recognitionItems.filter((item) => item.status === "APPROVED");
    const pending = recognitionItems.filter((item) => item.status === "PENDING").length;
    const totalPoints = approved.reduce((sum, item) => sum + item.points, 0);
    const rewardBudget = approved.reduce((sum, item) => sum + item.reward, 0);
    const nominators = new Set(recognitionItems.map((item) => item.nominatedBy)).size;
    return { approved: approved.length, pending, totalPoints, rewardBudget, nominators };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return recognitionItems
      .filter((item) => {
        if (statusFilter !== "ALL" && item.status !== statusFilter) {
          return false;
        }

        if (categoryFilter !== "ALL" && item.category !== categoryFilter) {
          return false;
        }

        if (!q) {
          return true;
        }

        return (
          item.employeeName.toLowerCase().includes(q) ||
          item.nominatedBy.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [categoryFilter, query, statusFilter]);

  const leaderboard = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of recognitionItems) {
      if (item.status !== "APPROVED") {
        continue;
      }
      const current = map.get(item.employeeName) ?? 0;
      map.set(item.employeeName, current + item.points);
    }

    return Array.from(map.entries())
      .map(([employee, points]) => ({ employee, points }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
  }, []);

  const maxLeaderPoints = leaderboard[0]?.points ?? 1;

  const categoryPulse = useMemo(() => {
    const values: Record<RecognitionCategory, number> = {
      LEADERSHIP: 0,
      INNOVATION: 0,
      COLLABORATION: 0,
      CUSTOMER: 0,
      EXECUTION: 0
    };

    for (const item of recognitionItems) {
      values[item.category] += 1;
    }

    return Object.entries(values)
      .map(([category, count]) => ({ category: category as RecognitionCategory, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const pendingApprovals = useMemo(() => {
    return recognitionItems
      .filter((item) => item.status === "PENDING")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-gradient-to-r from-amber-50 via-white to-rose-50 p-6 dark:border-gray-800 dark:from-amber-500/10 dark:via-white/[0.03] dark:to-rose-500/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Recognition & Rewards</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Celebrate meaningful contributions and keep appreciation visible across teams.
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

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatChip label="Approved" value={String(stats.approved)} />
          <StatChip label="Pending" value={String(stats.pending)} />
          <StatChip label="Awarded Points" value={String(stats.totalPoints)} />
          <StatChip label="Reward Budget" value={`$${stats.rewardBudget.toLocaleString()}`} />
          <StatChip label="Active Nominators" value={String(stats.nominators)} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <ComponentCard title="Recognition Wall" desc="Latest nominations and awarded recognitions">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by employee, nominator, or ID"
                className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
              />
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as RecognitionCategory | "ALL")}
                className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="ALL">All Categories</option>
                <option value="LEADERSHIP">Leadership</option>
                <option value="INNOVATION">Innovation</option>
                <option value="COLLABORATION">Collaboration</option>
                <option value="CUSTOMER">Customer Impact</option>
                <option value="EXECUTION">Execution</option>
              </select>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as RecognitionStatus | "ALL")}
                className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-gray-500">No recognition records match your filters.</p>
            ) : (
              <div className="space-y-3">
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className={`rounded-xl border border-gray-100 p-4 dark:border-gray-800 ${categoryTint[item.category]}`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start gap-3">
                        <AvatarText name={item.employeeName} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.employeeName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.department} • {item.id} • {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge size="sm" color={categoryBadgeColor[item.category]}>
                          {categoryLabel[item.category]}
                        </Badge>
                        <Badge size="sm" color={statusColor[item.status]}>
                          {statusLabel[item.status]}
                        </Badge>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{item.message}</p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-3 text-xs dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Nominated by {item.nominatedBy}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{item.points} pts</span>
                        <span className="font-semibold text-success-600 dark:text-success-500">${item.reward}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </ComponentCard>

          <ComponentCard title="Pending Approval Queue" desc="Nominations awaiting HR/manager decision">
            {pendingApprovals.length === 0 ? (
              <p className="text-sm text-gray-500">No pending nominations.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] table-auto">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs text-gray-500 dark:border-gray-700">
                      <th className="px-3 py-2 font-medium">Employee</th>
                      <th className="px-3 py-2 font-medium">Category</th>
                      <th className="px-3 py-2 font-medium">Nominator</th>
                      <th className="px-3 py-2 font-medium">Points</th>
                      <th className="px-3 py-2 font-medium">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovals.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 text-sm dark:border-gray-800">
                        <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-100">{item.employeeName}</td>
                        <td className="px-3 py-3">
                          <Badge size="sm" color={categoryBadgeColor[item.category]}>
                            {categoryLabel[item.category]}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{item.nominatedBy}</td>
                        <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{item.points}</td>
                        <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ComponentCard>
        </div>

        <div className="space-y-6">
          <ComponentCard title="Recognition Leaderboard" desc="Top point earners this cycle">
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div key={entry.employee}>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {index + 1}. {entry.employee}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{entry.points} pts</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-success-500"
                      style={{ width: `${Math.round((entry.points / maxLeaderPoints) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard title="Category Pulse" desc="Recognition volume by category">
            <div className="space-y-3">
              {categoryPulse.map((item) => (
                <div key={item.category} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900/30">
                  <div className="flex items-center gap-2">
                    <Badge size="sm" color={categoryBadgeColor[item.category]}>
                      {categoryLabel[item.category]}
                    </Badge>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard title="Quick Actions" desc="Use common recognition workflows">
            <div className="space-y-3">
              <Button size="sm" className="w-full" onClick={() => router.push("/hrms/performance/reviews")}>
                Send Review Reminder
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={() => setStatusFilter("PENDING")}>
                Show Pending Nominations
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={() => setCategoryFilter("INNOVATION")}>
                Highlight Innovation Awards
              </Button>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/80 p-3 backdrop-blur dark:border-gray-700 dark:bg-white/5">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
