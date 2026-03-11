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
  title: "Hrms / Crm / Activities"
};

const dailyHighlights = [
  { label: "Total Events", value: "86", tone: "primary" },
  { label: "Completed", value: "52", tone: "success" },
  { label: "Pending", value: "24", tone: "warning" },
  { label: "Overdue", value: "10", tone: "error" }
] as const;

const activityRows = [
  {
    id: 1,
    time: "09:15 AM",
    event: "Lead assigned to sales rep",
    owner: "A. Khan",
    module: "Leads",
    status: "Done"
  },
  {
    id: 2,
    time: "10:40 AM",
    event: "Opportunity moved to Proposal stage",
    owner: "M. Joseph",
    module: "Pipeline",
    status: "Done"
  },
  {
    id: 3,
    time: "12:05 PM",
    event: "Quotation awaiting approval",
    owner: "R. Ahmed",
    module: "Quotations",
    status: "Pending"
  },
  {
    id: 4,
    time: "02:20 PM",
    event: "Client follow-up task missed",
    owner: "S. Diaz",
    module: "Customers",
    status: "Overdue"
  },
  {
    id: 5,
    time: "03:55 PM",
    event: "Field visit report submitted",
    owner: "P. Njeri",
    module: "Field Sales",
    status: "Done"
  },
  {
    id: 6,
    time: "05:10 PM",
    event: "Campaign lead list synced",
    owner: "K. Wong",
    module: "Marketing",
    status: "Pending"
  }
] as const;

const statusColor = {
  Done: "success",
  Pending: "warning",
  Overdue: "error"
} as const;

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CRM Activities" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dailyHighlights.map((item) => (
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
                  Today
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <ComponentCard
            title="Activity Timeline"
            desc="Latest CRM events across modules"
            className="xl:col-span-2"
          >
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Time
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Event
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
                      Module
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
                  {activityRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {row.time}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                        {row.event}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {row.owner}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {row.module}
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
            title="Quick Navigation"
            desc="Open related CRM workspaces"
          >
            <div className="space-y-3">
              <Link href="/hrms/crm/leads" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Open Leads
                </Button>
              </Link>
              <Link href="/hrms/crm/pipeline" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Open Pipeline
                </Button>
              </Link>
              <Link href="/hrms/crm/customers" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Open Customers
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
