import type { Metadata } from "next";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Hrms / Crm / Pipeline"
};

const pipelineMetrics = [
  { label: "Open Opportunities", value: "58", tone: "primary" },
  { label: "Pipeline Value", value: "$563K", tone: "success" },
  { label: "Avg Win Rate", value: "37%", tone: "info" },
  { label: "Stuck Deals", value: "11", tone: "warning" }
] as const;

const opportunityRows = [
  {
    id: 1,
    account: "Zenith Enterprises Ltd.",
    stage: "Discovery",
    owner: "A. Khan",
    value: "$34,000",
    probability: 45,
    status: "On Track"
  },
  {
    id: 2,
    account: "Omega Textiles",
    stage: "Proposal",
    owner: "M. Joseph",
    value: "$51,500",
    probability: 62,
    status: "At Risk"
  },
  {
    id: 3,
    account: "Apex Manufacturing",
    stage: "Negotiation",
    owner: "R. Ahmed",
    value: "$78,300",
    probability: 80,
    status: "On Track"
  },
  {
    id: 4,
    account: "Prime Logistics",
    stage: "Proposal",
    owner: "S. Diaz",
    value: "$26,900",
    probability: 58,
    status: "Pending"
  },
  {
    id: 5,
    account: "Nova Technologies",
    stage: "Lead In",
    owner: "K. Wong",
    value: "$18,400",
    probability: 30,
    status: "Pending"
  }
] as const;

const stageBreakdown = [
  { stage: "Lead In", deals: 15, value: "$96K", progress: 76 },
  { stage: "Discovery", deals: 19, value: "$184K", progress: 64 },
  { stage: "Proposal", deals: 14, value: "$173K", progress: 48 },
  { stage: "Negotiation", deals: 10, value: "$110K", progress: 34 }
] as const;

const statusColor = {
  "On Track": "success",
  Pending: "warning",
  "At Risk": "error"
} as const;

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CRM Pipeline Management" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {pipelineMetrics.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {item.value}
              </h3>
              <div className="mt-4">
                <Badge size="sm" color={item.tone}>
                  Live
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <ComponentCard
            title="Opportunity Pipeline"
            desc="Track active deals by stage, value, and probability"
            className="xl:col-span-3"
          >
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Account
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Stage
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Owner
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Value
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Probability
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
                  {opportunityRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="py-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                        {row.account}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {row.stage}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {row.owner}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                        {row.value}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">{row.probability}%</span>
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
          </ComponentCard>

          <ComponentCard
            title="Stage Breakdown"
            desc="Deal count and value by stage"
          >
            <div className="space-y-4">
              {stageBreakdown.map((item) => (
                <div key={item.stage}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.stage} ({item.deals})
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.value}</p>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                <Link href="/hrms/crm/forecasts" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Open Forecasts
                  </Button>
                </Link>
                <Link href="/hrms/crm/dashboard" className="block mt-2">
                  <Button variant="primary" className="w-full justify-center">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
