"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "@/components/ui/modal";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

interface OvertimeRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

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

export default function OvertimePage() {
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>([
    { id: 1, employeeId: 1, employeeName: "John Doe", date: "2026-03-05", startTime: "18:00", endTime: "20:30", hours: 2.5, reason: "Project deadline", status: "approved", appliedDate: "2026-03-04" },
    { id: 2, employeeId: 2, employeeName: "Jane Smith", date: "2026-03-06", startTime: "17:00", endTime: "19:00", hours: 2, reason: "Client meeting preparation", status: "pending", appliedDate: "2026-03-05" },
    { id: 3, employeeId: 3, employeeName: "Mike Johnson", date: "2026-03-04", startTime: "19:00", endTime: "21:00", hours: 2, reason: "System maintenance", status: "approved", appliedDate: "2026-03-03" },
    { id: 4, employeeId: 4, employeeName: "Sarah Wilson", date: "2026-03-07", startTime: "18:30", endTime: "20:30", hours: 2, reason: "Report compilation", status: "pending", appliedDate: "2026-03-06" },
    { id: 5, employeeId: 5, employeeName: "Tom Brown", date: "2026-03-02", startTime: "17:30", endTime: "18:30", hours: 1, reason: "Document review", status: "rejected", appliedDate: "2026-03-01" },
  ]);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [formData, setFormData] = useState({
    employeeName: "",
    date: "",
    startTime: "",
    endTime: "",
    reason: ""
  });

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    return (endMins - startMins) / 60;
  };

  const handleApplyOvertime = () => {
    const hours = calculateHours(formData.startTime, formData.endTime);
    const newRequest: OvertimeRequest = {
      id: overtimeRequests.length + 1,
      employeeId: overtimeRequests.length + 1,
      employeeName: formData.employeeName,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      hours: hours > 0 ? hours : 0,
      reason: formData.reason,
      status: "pending",
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setOvertimeRequests([...overtimeRequests, newRequest]);
    setShowApplyModal(false);
    setFormData({ employeeName: "", date: "", startTime: "", endTime: "", reason: "" });
  };

  const handleApprove = (id: number) => {
    setOvertimeRequests(overtimeRequests.map(req => req.id === id ? { ...req, status: "approved" as const } : req));
  };

  const handleReject = (id: number) => {
    setOvertimeRequests(overtimeRequests.map(req => req.id === id ? { ...req, status: "rejected" as const } : req));
  };

  const openDetailsModal = (request: OvertimeRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const filteredRequests = filterStatus === "all" 
    ? overtimeRequests 
    : overtimeRequests.filter(req => req.status === filterStatus);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-orange-100", text: "text-orange-700", label: "Pending" },
      approved: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="space-y-6">
      <ComponentCard 
        title="Overtime Management"
        desc="Track and manage employee overtime requests"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <Button
            onClick={() => setShowApplyModal(true)}
            variant="primary"
            size="sm"
            startIcon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Apply Overtime
          </Button>
        </div>

        {/* Overtime Requests Table */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                <TableRow>
                  <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Employee
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Time
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Hours
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Reason
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const statusConfig = getStatusConfig(request.status);
                  return (
                    <TableRow key={request.id} className="border-b border-gray-200 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/30">
                      <TableCell className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(request.employeeId)}`}>
                            {getInitials(request.employeeName)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{request.employeeName}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Applied: {new Date(request.appliedDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-5">
                        <span className="text-sm text-gray-900 dark:text-gray-100">{new Date(request.date).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell className="px-4 py-5">
                        <span className="text-sm text-gray-900 dark:text-gray-100">{request.startTime} - {request.endTime}</span>
                      </TableCell>
                      <TableCell className="px-4 py-5">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {request.hours}h
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-5 text-sm text-gray-600 dark:text-gray-400">{request.reason}</TableCell>
                      <TableCell className="px-4 py-5 text-center">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDetailsModal(request)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                            title="View Details"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {request.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                                title="Approve"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                                title="Reject"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </ComponentCard>

      {/* Apply Overtime Modal */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} className="max-w-lg p-6">
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Apply for Overtime</h3>
        </div>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="employee-name">Employee Name</Label>
            <Input
              type="text"
              id="employee-name"
              placeholder="Enter your name"
              defaultValue={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="overtime-date">Date</Label>
            <Input
              type="date"
              id="overtime-date"
              defaultValue={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                type="time"
                id="start-time"
                defaultValue={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Input
                type="time"
                id="end-time"
                defaultValue={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>
          {formData.startTime && formData.endTime && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Total Hours: <span className="font-semibold">{calculateHours(formData.startTime, formData.endTime)}h</span>
              </p>
            </div>
          )}
          <div>
            <Label htmlFor="reason">Reason</Label>
            <TextArea
              placeholder="Reason for overtime..."
              rows={3}
              value={formData.reason}
              onChange={(value) => setFormData({ ...formData, reason: value })}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowApplyModal(false);
              setFormData({ employeeName: "", date: "", startTime: "", endTime: "", reason: "" });
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleApplyOvertime}>
            Submit Application
          </Button>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} className="max-w-lg p-6">
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overtime Request Details</h3>
        </div>
        <div className="space-y-4 py-4">
          {selectedRequest && (
            <>
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(selectedRequest.employeeId)}`}>
                  {getInitials(selectedRequest.employeeName)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedRequest.employeeName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Applied on {new Date(selectedRequest.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Date</p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{new Date(selectedRequest.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Hours</p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.hours}h</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Start Time</p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.startTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">End Time</p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.endTime}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Reason</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedRequest.reason}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
                <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusConfig(selectedRequest.status).bg} ${getStatusConfig(selectedRequest.status).text}`}>
                  {getStatusConfig(selectedRequest.status).label}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedRequest(null);
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
