"use client";

import { useEffect, useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { ApiClientError } from "@/lib/api-client";
import { attendanceService, type AttendanceRecord } from "@/lib/services/attendance";

export default function AttendanceCheckInPage() {
  const [now, setNow] = useState(new Date());
  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadToday = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await attendanceService.myToday();
      setEmployeeId(response.employee_id);
      setRecord(response.attendance);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to load today's attendance.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadToday();
  }, []);

  const totalHours = useMemo(() => {
    if (!record?.check_in) {
      return "0h 0m";
    }

    const start = new Date(record.check_in).getTime();
    const end = record.check_out ? new Date(record.check_out).getTime() : Date.now();
    const diff = Math.max(0, end - start);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }, [record]);

  const checkIn = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      const next = await attendanceService.checkInSelf({ check_in_type: "MANUAL" });
      setRecord(next);
      setSuccess("Check-in recorded.");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to check in.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const checkOut = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      const next = await attendanceService.checkOutSelf({ check_out_type: "MANUAL" });
      setRecord(next);
      setSuccess("Check-out recorded.");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to check out.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isCheckedIn = Boolean(record?.check_in) && !record?.check_out;
  const completed = Boolean(record?.check_in) && Boolean(record?.check_out);

  return (
    <div className="space-y-6">
      <ComponentCard title="Today" desc={now.toLocaleString()}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Stat label="Check In" value={record?.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"} />
          <Stat label="Check Out" value={record?.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"} />
          <Stat label="Worked" value={totalHours} />
        </div>
      </ComponentCard>

      <ComponentCard title="Actions" desc={`Employee ID: ${employeeId || "-"}`}>
        {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {success ? <p className="text-sm text-green-600">{success}</p> : null}

        {!loading ? (
          <div className="flex flex-wrap items-center gap-3">
            {!record?.check_in ? (
              <button disabled={submitting} onClick={() => void checkIn()} className="inline-flex rounded-lg bg-brand-500 px-4 py-2 text-sm text-white hover:bg-brand-600 disabled:opacity-60">Check In</button>
            ) : null}
            {isCheckedIn ? (
              <button disabled={submitting} onClick={() => void checkOut()} className="inline-flex rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-60">Check Out</button>
            ) : null}
            {completed ? <span className="inline-flex rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700">Day Completed</span> : null}
          </div>
        ) : null}
      </ComponentCard>

      <ComponentCard title="Attendance Record">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Stat label="Status" value={record?.status ?? "N/A"} />
          <Stat label="Late Minutes" value={String(record?.late_minutes ?? 0)} />
          <Stat label="Check-in Type" value={record?.check_in_type ?? "N/A"} />
          <Stat label="Check-out Type" value={record?.check_out_type ?? "N/A"} />
        </div>
      </ComponentCard>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">{value}</p>
    </div>
  );
}
