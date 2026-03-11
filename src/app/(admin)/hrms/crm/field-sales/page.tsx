import type { Metadata } from "next";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import AvatarText from "@/components/ui/avatar/AvatarText";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Hrms / Crm / Field sales"
};

const fieldStats = [
  { label: "Planned Visits", value: "42", note: "This week", tone: "primary" },
  { label: "Completed Visits", value: "29", note: "69% completion", tone: "success" },
  { label: "Avg Travel Time", value: "34m", note: "Per check-in", tone: "info" },
  { label: "Missed Appointments", value: "3", note: "Needs follow-up", tone: "warning" }
] as const;

const routeLedger = [
  {
    id: 1,
    rep: "S. Diaz",
    territory: "North Cluster",
    checkIns: 5,
    distance: "42 km",
    revenue: "$8,400",
    status: "On Route"
  },
  {
    id: 2,
    rep: "K. Wong",
    territory: "East Industrial",
    checkIns: 4,
    distance: "36 km",
    revenue: "$6,950",
    status: "Completed"
  },
  {
    id: 3,
    rep: "P. Njeri",
    territory: "Central Retail",
    checkIns: 3,
    distance: "27 km",
    revenue: "$4,230",
    status: "Delayed"
  },
  {
    id: 4,
    rep: "A. Khan",
    territory: "South Corporate",
    checkIns: 6,
    distance: "48 km",
    revenue: "$11,760",
    status: "Completed"
  }
] as const;

const territoryCoverage = [
  { area: "North Cluster", progress: 82, accounts: 26 },
  { area: "East Industrial", progress: 74, accounts: 21 },
  { area: "Central Retail", progress: 58, accounts: 18 },
  { area: "South Corporate", progress: 66, accounts: 24 }
] as const;

const visitChecklist = [
  { task: "Daily route sync", owner: "Ops", done: true },
  { task: "High-priority customer visits", owner: "Team Lead", done: true },
  { task: "Missed check-in review", owner: "Supervisor", done: false },
  { task: "End-of-day sales report", owner: "All reps", done: false }
] as const;

const statusColor = {
  "On Route": "info",
  Completed: "success",
  Delayed: "warning"
} as const;

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CRM Field Sales" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {fieldStats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {item.value}
              </h3>
              <div className="mt-4">
                <Badge size="sm" color={item.tone}>{item.note}</Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <ComponentCard
            title="Route Planner"
            desc="Create and assign the next field route"
            className="xl:col-span-5"
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="routeName">Route Name</Label>
                <Input id="routeName" placeholder="e.g. North Priority Loop" />
              </div>
              <div>
                <Label htmlFor="visitDate">Visit Date</Label>
                <Input id="visitDate" type="date" />
              </div>
              <div>
                <Label htmlFor="assignedRep">Assigned Rep</Label>
                <Input id="assignedRep" placeholder="Select field rep" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Save Route</Button>
              <Button variant="outline">Assign Visits</Button>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Territory Coverage"
            desc="Active account coverage by region"
            className="xl:col-span-4"
          >
            <div className="space-y-4">
              {territoryCoverage.map((item) => (
                <div key={item.area}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.area}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.accounts} accounts
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard
            title="Operations Checklist"
            desc="Daily field-sales controls"
            className="xl:col-span-3"
          >
            <div className="space-y-3">
              {visitChecklist.map((item) => (
                <div
                  key={item.task}
                  className="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.task}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.owner}</span>
                    <Badge size="sm" color={item.done ? "success" : "warning"}>
                      {item.done ? "Done" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}

              <Link href="/hrms/crm/activities" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View Activity Stream
                </Button>
              </Link>
            </div>
          </ComponentCard>
        </div>

        <ComponentCard
          title="Field Visit Ledger"
          desc="Rep performance by route, check-ins, and revenue"
        >
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Rep
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Territory
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Check-ins
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Distance
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Revenue
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {routeLedger.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <AvatarText name={row.rep} className="h-8 w-8" />
                        <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                          {row.rep}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.territory}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.checkIns}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.distance}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                      {row.revenue}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      <Badge size="sm" color={statusColor[row.status]}>
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/hrms/crm/pipeline">
              <Button variant="outline">Open Pipeline</Button>
            </Link>
            <Link href="/hrms/crm/dashboard">
              <Button variant="primary">Back to Dashboard</Button>
            </Link>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
