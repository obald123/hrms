import type { Metadata } from "next";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Hrms / Crm / Dashboard"
};

const crmModules = [
  { label: "Lead Management", href: "/hrms/crm/leads", status: "Live" },
  { label: "Pipeline Management", href: "/hrms/crm/pipeline", status: "Live" },
  { label: "Customer Management", href: "/hrms/crm/customers", status: "Live" },
  { label: "Quotation & Deals", href: "/hrms/crm/quotations", status: "Live" },
  { label: "Commission Engine", href: "/hrms/crm/commissions", status: "Live" },
  { label: "Field Sales", href: "/hrms/crm/field-sales", status: "Live" },
  { label: "Marketing Automation", href: "/hrms/crm/marketing", status: "Live" },
  { label: "Activity Stream", href: "/hrms/crm/activities", status: "Live" },
  { label: "Revenue Forecasts", href: "/hrms/crm/forecasts", status: "Live" }
];

const pipelineStages = [
  { stage: "Lead In", deals: 37, value: "$82K", progress: 78 },
  { stage: "Discovery", deals: 24, value: "$114K", progress: 64 },
  { stage: "Proposal", deals: 16, value: "$96K", progress: 44 },
  { stage: "Negotiation", deals: 9, value: "$71K", progress: 30 }
];

const recentActivities = [
  {
    id: 1,
    event: "Follow-up scheduled for Zenith Ltd.",
    owner: "A. Khan",
    module: "Leads",
    status: "Done"
  },
  {
    id: 2,
    event: "Proposal sent to Omega Textiles",
    owner: "M. Joseph",
    module: "Quotations",
    status: "Pending"
  },
  {
    id: 3,
    event: "Contract renewal flagged as high risk",
    owner: "R. Ahmed",
    module: "Customers",
    status: "Overdue"
  },
  {
    id: 4,
    event: "Territory visit report submitted",
    owner: "S. Diaz",
    module: "Field Sales",
    status: "Done"
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
      <PageBreadcrumb pageTitle="CRM Dashboard" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">New Leads</p>
            <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">128</h3>
            <div className="mt-4">
              <Badge color="success" size="sm">
                +14.8% vs last month
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Qualified Deals</p>
            <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">42</h3>
            <div className="mt-4">
              <Badge color="success" size="sm">
                +6.2% MQL to SQL
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Won Revenue</p>
            <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">$184.2K</h3>
            <div className="mt-4">
              <Badge color="success" size="sm">
                +11.1% current quarter
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Churn Risk Accounts</p>
            <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">9</h3>
            <div className="mt-4">
              <Badge color="warning" size="sm">
                Needs review
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <ComponentCard
            title="CRM Workspaces"
            desc="Jump directly into each CRM workflow"
            className="xl:col-span-2"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {crmModules.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-gray-200 p-4 transition hover:border-brand-300 hover:bg-brand-50/50 dark:border-gray-700 dark:hover:border-brand-500/50 dark:hover:bg-brand-500/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                      {item.label}
                    </p>
                    <Badge size="sm" color="success">
                      {item.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard
            title="Pipeline Snapshot"
            desc="Deal count and weighted value by stage"
          >
            <div className="space-y-4">
              {pipelineStages.map((item) => (
                <div key={item.stage}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.stage} ({item.deals} deals)
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.value}</p>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-2 rounded-full bg-brand-500" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent CRM Activities
          </h3>
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                <TableRow>
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
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      {activity.event}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {activity.owner}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {activity.module}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      <Badge size="sm" color={statusColor[activity.status]}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
