"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface PayrollStats {
  id: string;
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
}

interface PayrollActivity {
  id: string;
  employee_name: string;
  employee_email: string;
  amount: number;
  date: string;
  status: "PAID" | "PENDING" | "OVERDUE" | "PROCESSING";
}

export default function Page() {
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [search, setSearch] = useState("");

  // Mock stats
  const stats: PayrollStats[] = [
    {
      id: "1",
      label: "Total Payroll",
      value: "RWF 2,450,000",
      change: 20,
      isPositive: true,
    },
    {
      id: "2",
      label: "Paid This Month",
      value: "RWF 1,850,000",
      change: 9,
      isPositive: true,
    },
    {
      id: "3",
      label: "Pending Amount",
      value: "RWF 450,000",
      change: -4.5,
      isPositive: false,
    },
  ];

  // Mock payroll activity
  const activities: PayrollActivity[] = [
    {
      id: "PR001",
      employee_name: "Jean Kabera",
      employee_email: "jean.kabera@company.com",
      amount: 8500,
      date: "2026-03-01",
      status: "PAID",
    },
    {
      id: "PR002",
      employee_name: "Marie Mukiza",
      employee_email: "marie.mukiza@company.com",
      amount: 7200,
      date: "2026-03-01",
      status: "PAID",
    },
    {
      id: "PR003",
      employee_name: "Pierre Niyigaba",
      employee_email: "pierre.niyigaba@company.com",
      amount: 9100,
      date: "2026-03-05",
      status: "PENDING",
    },
    {
      id: "PR004",
      employee_name: "Yvonne Iradukunda",
      employee_email: "yvonne.iradukunda@company.com",
      amount: 6800,
      date: "2026-02-20",
      status: "OVERDUE",
    },
    {
      id: "PR005",
      employee_name: "David Ndagijimana",
      employee_email: "david.ndagijimana@company.com",
      amount: 7900,
      date: "2026-03-02",
      status: "PAID",
    },
    {
      id: "PR006",
      employee_name: "Grace Uwacu",
      employee_email: "grace.uwacu@company.com",
      amount: 8200,
      date: "2026-03-01",
      status: "PAID",
    },
    {
      id: "PR007",
      employee_name: "Victor Habimana",
      employee_email: "victor.habimana@company.com",
      amount: 7500,
      date: "2026-03-03",
      status: "PROCESSING",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600";
      case "PENDING":
        return "text-yellow-600";
      case "OVERDUE":
        return "text-red-600";
      case "PROCESSING":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const filtered = useMemo(() => {
    return activities.filter((activity) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        activity.employee_name.toLowerCase().includes(q) ||
        activity.employee_email.toLowerCase().includes(q)
      );
    });
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div
                className={`text-sm font-semibold ${
                  stat.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.isPositive ? "+" : ""}{stat.change}%
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              last month
            </p>
          </div>
        ))}
      </div>

      {/* Time Period Tabs & Revenue Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ComponentCard title="Monthly Payroll Breakdown" desc="Target payroll for each month">
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                {["Monthly", "Quarterly", "Annually"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period.toLowerCase())}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                      timePeriod === period.toLowerCase()
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="flex h-64 items-end justify-around rounded-lg bg-gray-50 p-6 dark:bg-gray-900/20">
                {[120, 150, 130, 170, 160, 140, 180, 170, 160, 190, 210, 200].map(
                  (height, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-6 rounded-t-lg bg-blue-600 dark:bg-blue-500"
                        style={{
                          height: `${(height / 210) * 180}px`,
                        }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][idx]}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Status Summary */}
        <div>
          <ComponentCard title="Payment Status" desc="Current payment distribution">
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Paid
                  </span>
                  <span className="font-semibold text-green-600">65%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Pending
                  </span>
                  <span className="font-semibold text-yellow-600">23%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: "23%" }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Overdue
                  </span>
                  <span className="font-semibold text-red-600">9%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: "9%" }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Processing
                  </span>
                  <span className="font-semibold text-blue-600">3%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: "3%" }}
                  />
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Recent Payroll Activity */}
      <ComponentCard title="Recent Payroll" desc="Latest payment transactions">
        {/* Search */}
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee or email"
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No payroll records found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Reference</th>
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-gray-100 text-sm"
                  >
                    <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-100">
                      {activity.id}
                    </td>
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {activity.employee_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.employee_email}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-medium text-gray-600 dark:text-gray-300">
                      RWF {activity.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* See All Link */}
        <div className="flex justify-end">
          <Link
            href="/hrms/payroll"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
          >
            See all →
          </Link>
        </div>
      </ComponentCard>
    </div>
  );
}
