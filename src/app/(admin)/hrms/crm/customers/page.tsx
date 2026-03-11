import type { Metadata } from "next";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import AvatarText from "@/components/ui/avatar/AvatarText";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Hrms / Crm / Customers"
};

const customerStats = [
  { label: "Active Accounts", value: "214", note: "+8 this month", tone: "success" },
  { label: "Monthly Recurring Revenue", value: "$482K", note: "+6.4% MoM", tone: "primary" },
  { label: "Renewals Due (30d)", value: "19", note: "Needs attention", tone: "warning" }
] as const;

const customerRows = [
  {
    id: 1,
    account: "Zenith Enterprises Ltd.",
    csm: "A. Khan",
    plan: "Enterprise",
    mrr: "$28,400",
    health: "Healthy"
  },
  {
    id: 2,
    account: "Omega Textiles",
    csm: "M. Joseph",
    plan: "Growth",
    mrr: "$14,900",
    health: "Watchlist"
  },
  {
    id: 3,
    account: "Apex Manufacturing",
    csm: "R. Ahmed",
    plan: "Enterprise",
    mrr: "$31,700",
    health: "Healthy"
  },
  {
    id: 4,
    account: "Prime Logistics",
    csm: "S. Diaz",
    plan: "Pro",
    mrr: "$8,200",
    health: "Critical"
  },
  {
    id: 5,
    account: "Nova Technologies",
    csm: "K. Wong",
    plan: "Growth",
    mrr: "$12,600",
    health: "Watchlist"
  }
] as const;

const segmentBreakdown = [
  { segment: "Enterprise", accounts: 48, progress: 78 },
  { segment: "Growth", accounts: 91, progress: 62 },
  { segment: "Pro", accounts: 75, progress: 44 }
] as const;

const upcomingRenewals = [
  { account: "Prime Logistics", dueIn: "5 days", value: "$8,200" },
  { account: "Delta Solutions", dueIn: "9 days", value: "$11,450" },
  { account: "Blue Orbit Labs", dueIn: "14 days", value: "$6,900" }
] as const;

const healthColor = {
  Healthy: "success",
  Watchlist: "warning",
  Critical: "error"
} as const;

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CRM Customer Management" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <ComponentCard
            title="Customer Command Center"
            desc="Monitor account health, retention, and revenue signals"
            className="xl:col-span-2"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {customerStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <h3 className="mt-2 text-xl font-semibold text-gray-800 dark:text-white/90">
                    {item.value}
                  </h3>
                  <div className="mt-3">
                    <Badge size="sm" color={item.tone}>
                      {item.note}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge size="sm" color="info">Customer Success</Badge>
              <Badge size="sm" color="primary">Account Expansion</Badge>
              <Badge size="sm" color="warning">Renewal Watch</Badge>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Quick Actions"
            desc="Open core customer workflows"
          >
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-center">
                Add Customer
              </Button>
              <Link href="/hrms/crm/activities" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View Activity Stream
                </Button>
              </Link>
              <Link href="/hrms/crm/quotations" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Open Quotations
                </Button>
              </Link>
              <Link href="/hrms/crm/dashboard" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </ComponentCard>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <ComponentCard
            title="Customer Accounts"
            desc="Top accounts by monthly recurring revenue"
            className="xl:col-span-8"
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
                      CSM
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Plan
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      MRR
                    </TableCell>
                    <TableCell
                      isHeader
                      className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Health
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {customerRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <AvatarText name={row.account} />
                          <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                            {row.account}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {row.csm}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        {row.plan}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                        {row.mrr}
                      </TableCell>
                      <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                        <Badge size="sm" color={healthColor[row.health]}>
                          {row.health}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ComponentCard>

          <div className="space-y-6 xl:col-span-4">
            <ComponentCard
              title="Segment Distribution"
              desc="Account mix across plans"
            >
              <div className="space-y-4">
                {segmentBreakdown.map((item) => (
                  <div key={item.segment}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.segment}
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
              title="Upcoming Renewals"
              desc="Accounts due within 30 days"
            >
              <div className="space-y-3">
                {upcomingRenewals.map((item) => (
                  <div
                    key={item.account}
                    className="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.account}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge size="sm" color="warning">{item.dueIn}</Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ComponentCard>
          </div>
        </div>
      </div>
    </div>
  );
}
