import type { Metadata } from "next";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import AvatarText from "@/components/ui/avatar/AvatarText";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Hrms / Crm / Marketing"
};

const marketingMetrics = [
  { label: "Active Campaigns", value: "11", note: "Across all channels", tone: "primary" },
  { label: "MQL Generated", value: "264", note: "+18% this month", tone: "success" },
  { label: "Cost per Lead", value: "$31", note: "-6% vs previous", tone: "info" },
  { label: "Paused Campaigns", value: "2", note: "Budget control", tone: "warning" }
] as const;

const campaignRows = [
  {
    id: 1,
    campaign: "Spring Enterprise Push",
    owner: "K. Wong",
    channel: "LinkedIn",
    spend: "$8,200",
    leads: 74,
    status: "Running"
  },
  {
    id: 2,
    campaign: "Webinar Series - Ops",
    owner: "M. Joseph",
    channel: "Email",
    spend: "$3,900",
    leads: 56,
    status: "Running"
  },
  {
    id: 3,
    campaign: "Retail Reactivation",
    owner: "A. Khan",
    channel: "SMS",
    spend: "$1,450",
    leads: 23,
    status: "Paused"
  },
  {
    id: 4,
    campaign: "Field Demo Outreach",
    owner: "S. Diaz",
    channel: "Events",
    spend: "$5,780",
    leads: 38,
    status: "Completed"
  }
] as const;

const funnelProgress = [
  { stage: "Audience Reached", count: "42.5K", progress: 88 },
  { stage: "Engaged", count: "8.9K", progress: 62 },
  { stage: "Leads Captured", count: "1.4K", progress: 41 },
  { stage: "MQL", count: "264", progress: 24 }
] as const;

const upcomingActions = [
  { task: "Budget reallocation review", owner: "Marketing Lead", due: "Mar 11" },
  { task: "Creative approval for Q2 ads", owner: "Design Team", due: "Mar 12" },
  { task: "Lead scoring sync with CRM", owner: "RevOps", due: "Mar 13" }
] as const;

const statusColor = {
  Running: "success",
  Paused: "warning",
  Completed: "info"
} as const;

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CRM Marketing Automation" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {marketingMetrics.map((item) => (
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
            title="Campaign Launch Pad"
            desc="Set up and schedule a campaign brief"
            className="xl:col-span-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input id="campaignName" placeholder="Enter campaign name" />
              </div>
              <div>
                <Label htmlFor="channel">Channel</Label>
                <Input id="channel" placeholder="LinkedIn, Email, SMS" />
              </div>
              <div>
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input id="budget" placeholder="e.g. 5000" />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Create Campaign</Button>
              <Button variant="outline">Save Draft</Button>
            </div>
          </ComponentCard>

          <ComponentCard
            title="Funnel Health"
            desc="Progression from reach to qualified leads"
            className="xl:col-span-4"
          >
            <div className="space-y-4">
              {funnelProgress.map((item) => (
                <div key={item.stage}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.stage}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.count}</p>
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
            title="Upcoming Actions"
            desc="Marketing tasks for next 72 hours"
            className="xl:col-span-4"
          >
            <div className="space-y-3">
              {upcomingActions.map((item) => (
                <div
                  key={item.task}
                  className="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.task}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.owner}</span>
                    <Badge size="sm" color="warning">{item.due}</Badge>
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
          title="Campaign Performance Ledger"
          desc="Running and completed campaigns by spend and lead output"
        >
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Campaign
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
                    Channel
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Spend
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Leads
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
                {campaignRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="py-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                      {row.campaign}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <AvatarText name={row.owner} className="h-8 w-8" />
                        <span className="text-theme-sm text-gray-500 dark:text-gray-400">{row.owner}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.channel}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                      {row.spend}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {row.leads}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      <Badge size="sm" color={statusColor[row.status]}>{row.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/hrms/crm/leads">
              <Button variant="outline">Open Leads</Button>
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
