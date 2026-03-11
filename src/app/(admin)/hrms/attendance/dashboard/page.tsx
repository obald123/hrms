"use client";

import { useEffect, useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { ApiClientError } from "@/lib/api-client";
import { attendanceService, type AttendanceRecord, type AttendanceSummary } from "@/lib/services/attendance";

export default function AttendanceDashboardPage() {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const now = new Date();
        const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

        const [summaryResponse, listResponse] = await Promise.all([
          attendanceService.summary({ date: from.toISOString() }),
          attendanceService.list({ page: 1, limit: 20, date_from: from.toISOString(), date_to: to.toISOString() })
        ]);

        setSummary(summaryResponse);
        setRecords(listResponse.data);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError("Failed to load attendance dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const metrics = useMemo(() => {
    const total = summary?.totals.active ?? 0;
    const present = summary?.attendance.present ?? 0;
    const absent = summary?.attendance.absent ?? 0;
    const late = summary?.attendance.late ?? 0;
    return { total, present, absent, late, rate: summary?.attendance.attendanceRate ?? 0 };
  }, [summary]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Active Employees" value={String(metrics.total)} />
        <MetricCard label="Present" value={String(metrics.present)} />
        <MetricCard label="Absent" value={String(metrics.absent)} />
        <MetricCard label="Late" value={String(metrics.late)} />
      </div>

      <ComponentCard title="Attendance Rate" desc="Live values from HRMS attendance API">
        {loading ? <p className="text-sm text-gray-500">Loading summary...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {!loading && !error ? (
          <div className="space-y-3">
            <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="h-3 rounded-full bg-brand-500" style={{ width: `${Math.max(0, Math.min(100, metrics.rate))}%` }} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{metrics.rate}% attendance rate today</p>
          </div>
        ) : null}
      </ComponentCard>

      <ComponentCard title="Recent Attendance Logs">
        {loading ? <p className="text-sm text-gray-500">Loading logs...</p> : null}
        {!loading && !error && records.length === 0 ? <p className="text-sm text-gray-500">No records found for today.</p> : null}
        {!loading && !error && records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Code</th>
                  <th className="px-3 py-2 font-medium">Check In</th>
                  <th className="px-3 py-2 font-medium">Check Out</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3">{record.employee.first_name} {record.employee.last_name}</td>
                    <td className="px-3 py-3 text-gray-600">{record.employee.employee_code}</td>
                    <td className="px-3 py-3 text-gray-600">{record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                    <td className="px-3 py-3 text-gray-600">{record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">{record.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </ComponentCard>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <ComponentCard title={label} className="h-full">
      <p className="text-3xl font-semibold text-gray-800 dark:text-white/90">{value}</p>
    </ComponentCard>
  );
}
