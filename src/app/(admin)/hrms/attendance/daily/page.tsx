"use client";

import { useEffect, useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { ApiClientError } from "@/lib/api-client";
import { attendanceService, type AttendanceRecord } from "@/lib/services/attendance";

export default function AttendanceDailyPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const date = new Date(selectedDate);
        const from = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        const to = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

        const response = await attendanceService.list({
          page: 1,
          limit: 100,
          date_from: from.toISOString(),
          date_to: to.toISOString()
        });
        setRecords(response.data);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError("Failed to load attendance records.");
        }
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [selectedDate]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return records;
    }

    return records.filter((record) => {
      const name = `${record.employee.first_name} ${record.employee.last_name}`.toLowerCase();
      return name.includes(q) || record.employee.employee_code.toLowerCase().includes(q);
    });
  }, [records, searchQuery]);

  return (
    <div className="space-y-6">
      <ComponentCard title="Daily Attendance Filters">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-900 dark:text-white dark:border-gray-600"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by employee name or code"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-900 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
          />
        </div>
      </ComponentCard>

      <ComponentCard title="Attendance Records">
        {loading ? <p className="text-sm text-gray-500">Loading records...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {!loading && !error && filtered.length === 0 ? <p className="text-sm text-gray-500">No records found.</p> : null}

        {!loading && !error && filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Code</th>
                  <th className="px-3 py-2 font-medium">Check In</th>
                  <th className="px-3 py-2 font-medium">Check Out</th>
                  <th className="px-3 py-2 font-medium">Late Minutes</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3">{record.employee.first_name} {record.employee.last_name}</td>
                    <td className="px-3 py-3 text-gray-600">{record.employee.employee_code}</td>
                    <td className="px-3 py-3 text-gray-600">{record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                    <td className="px-3 py-3 text-gray-600">{record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                    <td className="px-3 py-3 text-gray-600">{record.late_minutes}</td>
                    <td className="px-3 py-3"><span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">{record.status}</span></td>
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
