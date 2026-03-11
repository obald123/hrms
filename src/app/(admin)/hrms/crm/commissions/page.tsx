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
  title: "Hrms / Crm / Commissions"
};

const commissionKpis = [
  { label: "Total Commission (MTD)", value: "$94,600", note: "+12.4% vs last month", tone: "success" },
  { label: "Pending Approvals", value: "14", note: "Awaiting manager review", tone: "warning" },
  { label: "Average Payout", value: "$3,785", note: "Per rep", tone: "primary" },
  { label: "Disputed Entries", value: "2", note: "Needs audit", tone: "error" }
] as const;

const payoutLedger = [
  {
    id: 1,
    rep: "A. Khan",
    period: "Mar 2026",
    closedDeals: 6,
    netSales: "$128,000",
    rate: "6.0%",
    payout: "$7,680",
    status: "Approved"
  },
  {
    id: 2,
    rep: "M. Joseph",
    period: "Mar 2026",
    closedDeals: 4,
    netSales: "$86,500",
    rate: "5.5%",
    payout: "$4,758",
    status: "Pending"
  },
  {
    id: 3,
    rep: "R. Ahmed",
    period: "Mar 2026",
    closedDeals: 5,
    netSales: "$112,000",
    rate: "6.0%",
    payout: "$6,720",
    status: "Approved"
  },
  {
    id: 4,
    rep: "S. Diaz",
    period: "Mar 2026",
    closedDeals: 3,
    netSales: "$58,400",
    rate: "5.0%",
    payout: "$2,920",
    status: "On Hold"
  }
] as const;

const ruleProgress = [
  { rule: "Base Deal Commission", coverage: 92, detail: "Applied to closed-won deals" },
  { rule: "Upsell Bonus", coverage: 68, detail: "Triggered on expansion revenue" },
  { rule: "Quarterly Accelerator", coverage: 41, detail: "Applies after quota threshold" }
] as const;

const payoutCalendar = [
  { batch: "Batch A", date: "Mar 12", amount: "$28,440", reps: 7 },
  { batch: "Batch B", date: "Mar 18", amount: "$35,620", reps: 9 },
  { batch: "Batch C", date: "Mar 25", amount: "$30,540", reps: 8 }
] as const;

const statusColor = {
  Approved: "success",
  Pending: "warning",
  "On Hold": "error"
} as const;

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CRM Commission Engine" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {commissionKpis.map((item) => (
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
                  {item.note}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <ComponentCard
            title="Commission Rule Preview"
            desc="Validate payout rules before processing batches"
            className="xl:col-span-7"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="region">Sales Region</Label>
                <Input id="region" placeholder="e.g. North Territory" />
              </div>
              <div>
                <Label htmlFor="period">Commission Period</Label>
                <Input id="period" type="month" />
              </div>
            </div>

            <div className="space-y-4">
              {ruleProgress.map((item) => (
                <div key={item.rule}>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.rule}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                    </div>
                    <Badge size="sm" color="info">{item.coverage}%</Badge>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${item.coverage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Run Calculation</Button>
              <Button variant="outline">Export Statement</Button>
            </div>
          </ComponentCard>

          <div className="space-y-6 xl:col-span-5">
            <ComponentCard
              title="Upcoming Payout Batches"
              desc="Scheduled disbursement timeline"
            >
              <div className="space-y-3">
                {payoutCalendar.map((item) => (
                  <div
                    key={item.batch}
                    className="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.batch} - {item.date}
                      </p>
                      <Badge size="sm" color="primary">{item.reps} reps</Badge>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.amount}</p>
                  </div>
                ))}
              </div>
            </ComponentCard>

            <ComponentCard
              title="Quick Navigation"
              desc="Open related CRM modules"
            >
              <div className="space-y-3">
                <Link href="/hrms/crm/quotations" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Open Quotations
                  </Button>
                </Link>
                <Link href="/hrms/crm/pipeline" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Open Pipeline
                  </Button>
                </Link>
                <Link href="/hrms/crm/dashboard" className="block">
                  <Button variant="primary" className="w-full justify-center">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </ComponentCard>
          </div>
        </div>

        <ComponentCard
          title="Commission Payout Ledger"
          desc="Per-representative payout records for the selected period"
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
                    Period
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Closed Deals
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Net Sales
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Rate
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Payout
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
                {payoutLedger.map((row) => (
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
                      {row.period}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.closedDeals}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      {row.netSales}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.rate}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                      {row.payout}
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
      </div>
    </div>
  );
}
