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
  title: "Hrms / Crm / Quotations"
};

const quoteSummary = [
  { label: "Open Quotes", value: "34", tone: "primary", note: "Across all teams" },
  { label: "Sent Today", value: "7", tone: "info", note: "Awaiting response" },
  { label: "Approved", value: "18", tone: "success", note: "This month" },
  { label: "Rejected", value: "4", tone: "error", note: "Review pricing" }
] as const;

const quotationRows = [
  {
    id: 1,
    quoteNo: "QT-2026-1041",
    account: "Zenith Enterprises Ltd.",
    owner: "A. Khan",
    amount: "$42,500",
    validTill: "Mar 21, 2026",
    status: "Pending"
  },
  {
    id: 2,
    quoteNo: "QT-2026-1037",
    account: "Omega Textiles",
    owner: "M. Joseph",
    amount: "$18,200",
    validTill: "Mar 18, 2026",
    status: "Approved"
  },
  {
    id: 3,
    quoteNo: "QT-2026-1032",
    account: "Prime Logistics",
    owner: "S. Diaz",
    amount: "$9,850",
    validTill: "Mar 15, 2026",
    status: "Expired"
  },
  {
    id: 4,
    quoteNo: "QT-2026-1029",
    account: "Apex Manufacturing",
    owner: "R. Ahmed",
    amount: "$63,300",
    validTill: "Mar 27, 2026",
    status: "Pending"
  }
] as const;

const approvalQueue = [
  { name: "Pricing Team", pending: 3, sla: "< 4h" },
  { name: "Finance", pending: 2, sla: "< 6h" },
  { name: "Legal", pending: 1, sla: "< 24h" }
] as const;

const dealSteps = [
  { step: "Draft", count: 12, progress: 72 },
  { step: "Sent", count: 10, progress: 56 },
  { step: "Negotiation", count: 8, progress: 38 },
  { step: "Won", count: 6, progress: 24 }
] as const;

const statusColor = {
  Pending: "warning",
  Approved: "success",
  Expired: "error"
} as const;

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CRM Quotations & Deals" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quoteSummary.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {item.value}
              </h3>
              <div className="mt-4 flex items-center justify-between gap-2">
                <Badge size="sm" color={item.tone}>{item.note}</Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <ComponentCard
            title="Quick Quote Builder"
            desc="Prepare a quote draft before sending for approval"
            className="xl:col-span-7"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" placeholder="Enter account name" />
              </div>
              <div>
                <Label htmlFor="quoteOwner">Quote Owner</Label>
                <Input id="quoteOwner" placeholder="Assign owner" />
              </div>
              <div>
                <Label htmlFor="quoteAmount">Quote Amount</Label>
                <Input id="quoteAmount" placeholder="e.g. 25000" />
              </div>
              <div>
                <Label htmlFor="validity">Valid Until</Label>
                <Input id="validity" type="date" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Save Draft</Button>
              <Button variant="outline">Send For Approval</Button>
              <Link href="/hrms/crm/pipeline">
                <Button variant="outline">Attach to Deal</Button>
              </Link>
            </div>
          </ComponentCard>

          <div className="space-y-6 xl:col-span-5">
            <ComponentCard
              title="Approval Queue"
              desc="Current pending sign-offs"
            >
              <div className="space-y-3">
                {approvalQueue.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.name}
                      </p>
                      <Badge size="sm" color="warning">{item.pending} pending</Badge>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">SLA {item.sla}</p>
                  </div>
                ))}
              </div>
            </ComponentCard>

            <ComponentCard
              title="Deal Conversion"
              desc="Quotes moving through deal cycle"
            >
              <div className="space-y-4">
                {dealSteps.map((item) => (
                  <div key={item.step}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.step}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.count} deals</p>
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
          </div>
        </div>

        <ComponentCard
          title="Open Quotations"
          desc="Recent quotes sorted by validity and status"
        >
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Quote #
                  </TableCell>
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
                    Owner
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Valid Till
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
                {quotationRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="py-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                      {row.quoteNo}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <AvatarText name={row.account} className="h-8 w-8" />
                        <span className="text-theme-sm text-gray-700 dark:text-gray-300">{row.account}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.owner}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                      {row.amount}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.validTill}
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
