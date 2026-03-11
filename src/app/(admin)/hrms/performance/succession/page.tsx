"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import AvatarText from "@/components/ui/avatar/AvatarText";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

type ReadinessBand = "READY_NOW" | "READY_1_2_YEARS" | "READY_3_YEARS";
type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

interface SuccessorProfile {
  name: string;
  department: string;
  readiness: ReadinessBand;
  confidence: number;
  strengths: string[];
}

interface SuccessionRole {
  id: string;
  roleTitle: string;
  currentHolder: string;
  department: string;
  risk: RiskLevel;
  retentionRisk: number;
  successors: SuccessorProfile[];
}

const successionRoles: SuccessionRole[] = [
  {
    id: "SP-701",
    roleTitle: "Head of Engineering",
    currentHolder: "Patrick Ndayambaje",
    department: "Engineering",
    risk: "HIGH",
    retentionRisk: 74,
    successors: [
      {
        name: "Aline Mukamana",
        department: "Engineering",
        readiness: "READY_NOW",
        confidence: 86,
        strengths: ["Team Leadership", "Architecture", "Delivery"]
      },
      {
        name: "Grace Uwamahoro",
        department: "Engineering",
        readiness: "READY_1_2_YEARS",
        confidence: 69,
        strengths: ["Mentoring", "Platform Reliability"]
      },
      {
        name: "Kevin Mutesi",
        department: "Engineering",
        readiness: "READY_3_YEARS",
        confidence: 51,
        strengths: ["System Thinking", "Incident Management"]
      }
    ]
  },
  {
    id: "SP-702",
    roleTitle: "HR Business Partner Lead",
    currentHolder: "Yvette Ingabire",
    department: "People & Culture",
    risk: "MEDIUM",
    retentionRisk: 46,
    successors: [
      {
        name: "Alice Nishimwe",
        department: "People & Culture",
        readiness: "READY_NOW",
        confidence: 82,
        strengths: ["Calibration", "Coaching", "Policy"]
      },
      {
        name: "Nadine Uwera",
        department: "People & Culture",
        readiness: "READY_1_2_YEARS",
        confidence: 66,
        strengths: ["Engagement", "Onboarding"]
      }
    ]
  },
  {
    id: "SP-703",
    roleTitle: "Regional Sales Director",
    currentHolder: "Clarisse Uwimana",
    department: "Sales",
    risk: "HIGH",
    retentionRisk: 79,
    successors: [
      {
        name: "Jean Bosco Iradukunda",
        department: "Sales",
        readiness: "READY_1_2_YEARS",
        confidence: 72,
        strengths: ["Pipeline Growth", "Negotiation"]
      },
      {
        name: "Eddy Habimana",
        department: "Sales",
        readiness: "READY_3_YEARS",
        confidence: 58,
        strengths: ["Account Expansion", "Forecasting"]
      }
    ]
  },
  {
    id: "SP-704",
    roleTitle: "Operations Excellence Manager",
    currentHolder: "Michel Nsengiyumva",
    department: "Operations",
    risk: "LOW",
    retentionRisk: 28,
    successors: [
      {
        name: "Sam Kabera",
        department: "Operations",
        readiness: "READY_NOW",
        confidence: 89,
        strengths: ["Process Optimization", "SLA Management"]
      },
      {
        name: "Diane Umulisa",
        department: "Operations",
        readiness: "READY_1_2_YEARS",
        confidence: 62,
        strengths: ["Planning", "Cross-team Delivery"]
      }
    ]
  },
  {
    id: "SP-705",
    roleTitle: "Product Strategy Lead",
    currentHolder: "Robert Ndayizeye",
    department: "Product",
    risk: "MEDIUM",
    retentionRisk: 51,
    successors: [
      {
        name: "Diane Mukeshimana",
        department: "Product",
        readiness: "READY_1_2_YEARS",
        confidence: 71,
        strengths: ["Roadmapping", "Stakeholder Alignment"]
      },
      {
        name: "Ben Muhirwa",
        department: "Product",
        readiness: "READY_3_YEARS",
        confidence: 49,
        strengths: ["Discovery", "UX Research"]
      }
    ]
  }
];

const riskColor: Record<RiskLevel, "error" | "warning" | "success"> = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "success"
};

const readinessLabel: Record<ReadinessBand, string> = {
  READY_NOW: "Ready Now",
  READY_1_2_YEARS: "1-2 Years",
  READY_3_YEARS: "3+ Years"
};

const readinessColor: Record<ReadinessBand, "success" | "info" | "light"> = {
  READY_NOW: "success",
  READY_1_2_YEARS: "info",
  READY_3_YEARS: "light"
};

export default function PerformanceSuccessionPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  const departments = useMemo(() => {
    return Array.from(new Set(successionRoles.map((role) => role.department))).sort();
  }, []);

  const roleCards = useMemo(() => {
    const q = search.trim().toLowerCase();

    return successionRoles.filter((role) => {
      if (riskFilter !== "ALL" && role.risk !== riskFilter) {
        return false;
      }

      if (departmentFilter !== "ALL" && role.department !== departmentFilter) {
        return false;
      }

      if (!q) {
        return true;
      }

      const successorsText = role.successors.map((item) => item.name.toLowerCase()).join(" ");
      return (
        role.roleTitle.toLowerCase().includes(q) ||
        role.currentHolder.toLowerCase().includes(q) ||
        successorsText.includes(q) ||
        role.id.toLowerCase().includes(q)
      );
    });
  }, [departmentFilter, riskFilter, search]);

  const stats = useMemo(() => {
    const totalRoles = successionRoles.length;
    const highRisk = successionRoles.filter((role) => role.risk === "HIGH").length;
    const readyNow = successionRoles.filter((role) =>
      role.successors.some((candidate) => candidate.readiness === "READY_NOW")
    ).length;
    const avgBenchConfidence = Math.round(
      successionRoles.reduce((sum, role) => sum + calculateBenchStrength(role), 0) / totalRoles
    );

    return { totalRoles, highRisk, readyNow, avgBenchConfidence };
  }, []);

  const readinessBoard = useMemo(() => {
    const board: Record<ReadinessBand, Array<{ roleId: string; roleTitle: string; candidate: SuccessorProfile }>> = {
      READY_NOW: [],
      READY_1_2_YEARS: [],
      READY_3_YEARS: []
    };

    for (const role of successionRoles) {
      for (const successor of role.successors) {
        board[successor.readiness].push({
          roleId: role.id,
          roleTitle: role.roleTitle,
          candidate: successor
        });
      }
    }

    return board;
  }, []);

  const departmentBench = useMemo(() => {
    const map = new Map<string, { total: number; confidenceSum: number }>();
    for (const role of successionRoles) {
      const current = map.get(role.department) ?? { total: 0, confidenceSum: 0 };
      current.total += role.successors.length;
      current.confidenceSum += role.successors.reduce((sum, s) => sum + s.confidence, 0);
      map.set(role.department, current);
    }

    return Array.from(map.entries())
      .map(([department, data]) => ({
        department,
        candidates: data.total,
        confidence: Math.round(data.confidenceSum / Math.max(data.total, 1))
      }))
      .sort((a, b) => b.confidence - a.confidence);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Succession Planning</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track critical roles, successor readiness, and bench confidence across departments.
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
        <MetricTile label="Critical Roles" value={String(stats.totalRoles)} helper="Tracked positions" />
        <MetricTile label="High Risk Roles" value={String(stats.highRisk)} helper="Need immediate planning" />
        <MetricTile label="Ready Now Coverage" value={String(stats.readyNow)} helper="Roles with immediate backup" />
        <MetricTile label="Avg Bench Confidence" value={`${stats.avgBenchConfidence}%`} helper="Successor preparedness" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ComponentCard title="Role Coverage Matrix" desc="Readiness and risk per critical role">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search role, holder, successor, or ID"
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
                value={riskFilter}
                onChange={(event) => setRiskFilter(event.target.value as RiskLevel | "ALL")}
                className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {roleCards.length === 0 ? (
              <p className="text-sm text-gray-500">No roles match your filters.</p>
            ) : (
              <div className="space-y-3">
                {roleCards.map((role) => {
                  const primary = role.successors[0];
                  const benchStrength = calculateBenchStrength(role);
                  return (
                    <article key={role.id} className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{role.roleTitle}</p>
                            <Badge size="sm" color={riskColor[role.risk]}>
                              {role.risk} Risk
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {role.currentHolder} • {role.department} • {role.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge size="sm" color={readinessColor[primary.readiness]}>
                            {readinessLabel[primary.readiness]}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Bench {benchStrength}%</span>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 md:grid-cols-3">
                        {role.successors.map((successor) => (
                          <div key={`${role.id}-${successor.name}`} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/30">
                            <div className="flex items-start gap-2">
                              <AvatarText name={successor.name} className="h-9 w-9 text-xs" />
                              <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">{successor.name}</p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">{successor.department}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-[11px] text-gray-500 dark:text-gray-400">Confidence</span>
                                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{successor.confidence}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${successor.confidence}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {primary.strengths.map((skill) => (
                          <Badge key={`${role.id}-${skill}`} size="sm" color="light">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-3 border-t border-gray-200 pt-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        Retention risk score: {role.retentionRisk}%
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </ComponentCard>
        </div>

        <div className="space-y-6">
          <ComponentCard title="Department Bench Strength" desc="Average successor confidence by department">
            <div className="space-y-3">
              {departmentBench.map((row) => (
                <div key={row.department}>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.department}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{row.confidence}%</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-blue-light-500" style={{ width: `${row.confidence}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{row.candidates} candidates in pipeline</p>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard title="Quick Actions" desc="Operational steps for succession governance">
            <div className="space-y-3">
              <Button size="sm" className="w-full" onClick={() => setRiskFilter("HIGH")}>
                Focus High Risk Roles
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={() => setDepartmentFilter("Engineering")}>
                Filter Engineering
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setDepartmentFilter("ALL");
                  setRiskFilter("ALL");
                  setSearch("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </ComponentCard>
        </div>
      </div>

      <ComponentCard title="Readiness Board" desc="Talent pool grouped by promotion readiness">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {(["READY_NOW", "READY_1_2_YEARS", "READY_3_YEARS"] as ReadinessBand[]).map((band) => (
            <div key={band} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
              <div className="mb-3 flex items-center justify-between">
                <Badge size="sm" color={readinessColor[band]}>
                  {readinessLabel[band]}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">{readinessBoard[band].length}</span>
              </div>

              <div className="space-y-2">
                {readinessBoard[band].slice(0, 5).map((item) => (
                  <div key={`${item.roleId}-${item.candidate.name}`} className="rounded-lg bg-gray-50 p-2.5 text-xs dark:bg-gray-900/30">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{item.candidate.name}</p>
                    <p className="mt-0.5 text-gray-500 dark:text-gray-400">{item.roleTitle}</p>
                  </div>
                ))}
                {readinessBoard[band].length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">No candidates in this band.</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  );
}

function calculateBenchStrength(role: SuccessionRole): number {
  const weighted = role.successors.reduce((sum, candidate) => {
    const multiplier =
      candidate.readiness === "READY_NOW"
        ? 1
        : candidate.readiness === "READY_1_2_YEARS"
          ? 0.8
          : 0.6;
    return sum + candidate.confidence * multiplier;
  }, 0);

  return Math.round(weighted / Math.max(role.successors.length, 1));
}

function MetricTile({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helper}</p>
    </div>
  );
}
