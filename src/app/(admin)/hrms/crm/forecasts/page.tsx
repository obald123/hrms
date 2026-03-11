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
  title: "Hrms / Crm / Forecasts"
};

const forecastSummary = [
  { label: "Gross Pipeline Value", value: "$1.24M", note: "All stages" },
  { label: "Weighted Revenue", value: "$687K", note: "Probability adjusted" },
  { label: "Expected Wins", value: "32 deals", note: "This quarter" },
  { label: "Confidence Level", value: "78%", note: "Based on historical data" }
];

const pipelineBreakdown = [
  {
    stage: "Lead In",
    deals: 37,
    grossValue: "$330K",
    probability: 25,
    weightedValue: "$82K"
  },
  {
    stage: "Discovery",
    deals: 24,
    grossValue: "$456K",
    probability: 40,
    weightedValue: "$182K"
  },
  {
    stage: "Proposal",
    deals: 16,
    grossValue: "$288K",
    probability: 60,
    weightedValue: "$173K"
  },
  {
    stage: "Negotiation",
    deals: 9,
    grossValue: "$166K",
    probability: 80,
    weightedValue: "$133K"
  }
];

const monthlyForecast = [
  { month: "March 2026", projected: "$210K", confidence: "High" },
  { month: "April 2026", projected: "$265K", confidence: "High" },
  { month: "May 2026", projected: "$212K", confidence: "Medium" },
  { month: "June 2026", projected: "$185K", confidence: "Medium" }
] as const;

const confidenceColor = {
  High: "success",
  Medium: "warning",
  Low: "error"
} as const;

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CRM Revenue Forecasts" />

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {forecastSummary.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {item.value}
              </h3>
              <div className="mt-4">
                <Badge size="sm" color="primary">
                  {item.note}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Stage Breakdown */}
        <ComponentCard
          title="Pipeline Stage Breakdown"
          desc="Gross vs weighted revenue by sales stage"
        >
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                <TableRow>
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
                    Deals
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Gross Value
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Win Probability
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Weighted Value
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {pipelineBreakdown.map((row) => (
                  <TableRow key={row.stage}>
                    <TableCell className="py-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                      {row.stage}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.deals}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      {row.grossValue}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.probability}%
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                      {row.weightedValue}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ComponentCard>

        {/* Monthly Forecast & Actions */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <ComponentCard
            title="Monthly Forecast Projection"
            desc="Expected revenue by month with confidence score"
            className="xl:col-span-2"
          >
            <div className="space-y-4">
              {monthlyForecast.map((item) => (
                <div
                  key={item.month}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.month}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">
                      {item.projected}
                    </p>
                  </div>
                  <Badge size="sm" color={confidenceColor[item.confidence]}>
                    {item.confidence} confidence
                  </Badge>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard title="Actions" desc="Navigate and configure forecasts">
            <div className="space-y-3">
              <Link href="/hrms/crm/pipeline" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View Pipeline
                </Button>
              </Link>
              <Link href="/hrms/crm/leads" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Manage Leads
                </Button>
              </Link>
              <Link href="/hrms/crm/dashboard" className="block">
                <Button variant="primary" className="w-full justify-center">
                  Back to CRM Dashboard
                </Button>
              </Link>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
