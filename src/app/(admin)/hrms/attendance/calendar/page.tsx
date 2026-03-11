"use client";

import { useState, useMemo } from "react";

type AttendanceStatus = "present" | "absent" | "late" | "leave" | "weekend" | "holiday";

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  status?: AttendanceStatus;
}

interface DayEvent {
  title: string;
  color: string;
}

const statusEvents: Record<AttendanceStatus, DayEvent> = {
  present: { title: "Present", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  absent: { title: "Absent", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  late: { title: "Late", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  leave: { title: "Leave", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  weekend: { title: "Weekend", color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
  holiday: { title: "Holiday", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" }
};

const mockEmployees = [
  { id: 1, name: "John Doe", status: "present" },
  { id: 2, name: "Jane Smith", status: "present" },
  { id: 3, name: "Mike Johnson", status: "leave" },
  { id: 4, name: "Sarah Wilson", status: "absent" },
  { id: 5, name: "Tom Brown", status: "late" },
  { id: 6, name: "Emily Davis", status: "present" },
  { id: 7, name: "David Lee", status: "absent" },
  { id: 8, name: "Lisa Anderson", status: "leave" },
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (id: number) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];
  return colors[id % colors.length];
};

// Mock data generator
const generateMockAttendance = (date: Date): AttendanceStatus | undefined => {
  const day = date.getDay();
  const dateNum = date.getDate();
  
  if (day === 0 || day === 6) return "weekend";
  
  const rand = (dateNum + day) % 10;
  if (rand < 6) return "present";
  if (rand < 7) return "late";
  if (rand < 8) return "leave";
  if (rand < 9) return "absent";
  return undefined;
};

export default function AttendanceCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  const { year, month } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth()
  }), [currentDate]);

  // Employee-specific attendance generator
  const getEmployeeAttendance = (empId: number | null, date: Date): AttendanceStatus | undefined => {
    const day = date.getDay();
    const dateNum = date.getDate();

    if (day === 0 || day === 6) return "weekend";

    if (empId === null) {
      // All employees - random mix
      const rand = (dateNum + day) % 10;
      if (rand < 6) return "present";
      if (rand < 7) return "late";
      if (rand < 8) return "leave";
      if (rand < 9) return "absent";
      return undefined;
    }

    // Employee-specific patterns based on ID
    const seed = empId + dateNum + day;
    const pattern = seed % 20;

    // Employee patterns
    if (empId === 1) {
      // John Doe - mostly present
      if (pattern > 17) return "late";
      if (pattern > 16) return "leave";
      return "present";
    } else if (empId === 2) {
      // Jane Smith - consistent
      if (pattern > 18) return "absent";
      return "present";
    } else if (empId === 3) {
      // Mike Johnson - takes leave
      if (pattern > 14) return "leave";
      if (pattern > 12) return "absent";
      return "present";
    } else if (empId === 4) {
      // Sarah Wilson - often absent
      if (pattern > 15) return "leave";
      if (pattern > 10) return "absent";
      return "present";
    } else if (empId === 5) {
      // Tom Brown - sometimes late
      if (pattern > 16) return "late";
      if (pattern > 14) return "leave";
      return "present";
    } else if (empId === 6) {
      // Emily Davis - very reliable
      if (pattern > 19) return "leave";
      return "present";
    } else if (empId === 7) {
      // David Lee - frequently absent
      if (pattern > 12) return "absent";
      if (pattern > 10) return "leave";
      return "present";
    } else if (empId === 8) {
      // Lisa Anderson - takes leave regularly
      if (pattern > 13) return "leave";
      if (pattern > 11) return "absent";
      return "present";
    }

    return undefined;
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();

    const days: CalendarDay[] = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        status: getEmployeeAttendance(selectedEmployee, date)
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        status: getEmployeeAttendance(selectedEmployee, date)
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        status: getEmployeeAttendance(selectedEmployee, date)
      });
    }

    return days;
  }, [year, month, selectedEmployee, getEmployeeAttendance]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-default dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700 sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{monthName}</h3>
          {selectedEmployee && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {mockEmployees.find((emp) => emp.id === selectedEmployee)?.name}
            </p>
          )}
        </div>
        <div className="mt-4 flex flex-col items-start gap-4 sm:mt-0 sm:flex-row sm:items-center">
          {/* Employee Selector */}
          <select
            value={selectedEmployee || ""}
            onChange={(e) => setSelectedEmployee(e.target.value === "" ? null : parseInt(e.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500"
          >
            <option value="">All Employees</option>
            {mockEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextMonth}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-6">
        <div className="mb-4 overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Weekday Headers */}
            <div className="mb-4 grid grid-cols-7 gap-2">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className="p-3 text-center">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">{day}</p>
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((calDay, index) => {
                const isToday = 
                  calDay.isCurrentMonth &&
                  calDay.date.toDateString() === new Date().toDateString();
                const eventInfo = calDay.status ? statusEvents[calDay.status] : null;

                return (
                  <div
                    key={index}
                    className={`min-h-24 rounded-lg border p-3 ${
                      isToday
                        ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-500/10"
                        : calDay.isCurrentMonth
                        ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                        : "border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        calDay.isCurrentMonth && isToday
                          ? "text-brand-600 dark:text-brand-400"
                          : calDay.isCurrentMonth
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {calDay.day}
                    </p>

                    {eventInfo && calDay.isCurrentMonth && (
                      <div className="mt-2">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-medium ${eventInfo.color}`}
                        >
                          {eventInfo.title}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          {Object.entries(statusEvents).map(([status, event]) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`inline-block rounded px-2.5 py-1 text-xs font-medium ${event.color}`}>
                {event.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Attendance Status - Table */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h4 className="mb-6 text-base font-semibold text-gray-900 dark:text-white">Today's Attendance</h4>
          
          {/* Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">Employee Name</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockEmployees.sort((a, b) => a.name.localeCompare(b.name)).map((emp, idx) => {
                  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
                    present: { bg: "bg-green-100", text: "text-green-700", label: "Present" },
                    leave: { bg: "bg-blue-100", text: "text-blue-700", label: "Leave" },
                    absent: { bg: "bg-red-100", text: "text-red-700", label: "Absent" },
                    late: { bg: "bg-orange-100", text: "text-orange-700", label: "Late" },
                  };
                  
                  const config = statusConfig[emp.status] || statusConfig.present;
                  
                  return (
                    <tr key={emp.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(emp.id)}`}>
                            {getInitials(emp.name)}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
