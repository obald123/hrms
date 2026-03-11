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
  title: "Hrms / Crm / Leads"
};

const leadMetrics = [
  { label: "Total Leads", value: "342", tone: "primary" },
  { label: "New This Week", value: "28", tone: "success" },
  { label: "Qualified", value: "156", tone: "info" },
  { label: "Needs Follow-up", value: "47", tone: "warning" }
] as const;

const leadRecords = [
  {
    id: 1,
    name: "Zenith Enterprises Ltd.",
    contact: "Sarah Mitchell",
    source: "Website",
    score: 85,
    status: "Hot"
  },
  {
    id: 2,
    name: "Omega Textiles",
    contact: "James Chen",
    source: "Referral",
    score: 72,
    status: "Warm"
  },
  {
    id: 3,
    name: "Apex Manufacturing",
    contact: "Linda Brown",
    source: "Trade Show",
    score: 91,
    status: "Hot"
  },
  {
    id: 4,
    name: "Delta Solutions Inc.",
    contact: "Michael Rodriguez",
    source: "Cold Call",
    score: 45,
    status: "Cold"
  },
  {
    id: 5,
    name: "Nova Technologies",
    contact: "Emily Jones",
    source: "LinkedIn",
    score: 68,
    status: "Warm"
  },
  {
    id: 6,
    name: "Prime Logistics",
    contact: "David Kim",
    source: "Email Campaign",
    score: 92,
    status: "Hot"
  }
] as const;

const statusColor = {
  Hot: "error",
  Warm: "warning",
  Cold: "info"
} as const;

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CRM Lead Management" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {leadMetrics.map((item) => (
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
                  Active
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <ComponentCard
            title="Lead Pipeline"
            desc="Current leads sorted by score and engagement"
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
                      Company
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Contact
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Source
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Score
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
                  {leadRecords.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="py-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                        {lead.name}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {lead.contact}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {lead.source}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">{lead.score}</span>/100
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        <Badge size="sm" color={statusColor[lead.status]}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Quick Actions"
            desc="Common lead operations"
          >
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-center">
                Add New Lead
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Import Leads
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export List
              </Button>
              <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                <Link href="/hrms/crm/pipeline" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Move to Pipeline
                  </Button>
                </Link>
                <Link href="/hrms/crm/dashboard" className="block mt-2">
                  <Button variant="outline" className="w-full justify-start">
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
