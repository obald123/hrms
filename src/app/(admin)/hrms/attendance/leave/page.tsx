'use client';

import { useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeId: '101',
      employeeName: 'John Doe',
      leaveType: 'Annual Leave',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      days: 6,
      reason: 'Personal vacation',
      status: 'pending',
      appliedDate: '2024-03-01',
    },
    {
      id: '2',
      employeeId: '102',
      employeeName: 'Jane Smith',
      leaveType: 'Sick Leave',
      startDate: '2024-03-10',
      endDate: '2024-03-12',
      days: 3,
      reason: 'Medical appointment',
      status: 'approved',
      appliedDate: '2024-03-08',
    },
    {
      id: '3',
      employeeId: '103',
      employeeName: 'Mike Johnson',
      leaveType: 'Personal Leave',
      startDate: '2024-03-18',
      endDate: '2024-03-19',
      days: 2,
      reason: 'Family matter',
      status: 'rejected',
      appliedDate: '2024-03-05',
    },
    {
      id: '4',
      employeeId: '104',
      employeeName: 'Sarah Williams',
      leaveType: 'Maternity Leave',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      days: 90,
      reason: 'Maternity leave',
      status: 'approved',
      appliedDate: '2024-02-15',
    },
    {
      id: '5',
      employeeId: '105',
      employeeName: 'Robert Brown',
      leaveType: 'Annual Leave',
      startDate: '2024-03-25',
      endDate: '2024-03-29',
      days: 5,
      reason: 'Vacation',
      status: 'pending',
      appliedDate: '2024-03-10',
    },
  ]);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    employeeName: '',
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const filteredRequests = leaveRequests.filter(
    (request) => filterStatus === 'All' || request.status === filterStatus.toLowerCase()
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (employeeId: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-cyan-500',
      'bg-teal-500',
      'bg-green-500',
      'bg-orange-500',
    ];
    const colorIndex = parseInt(employeeId) % colors.length;
    return colors[colorIndex];
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      pending: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-200',
        label: 'Pending',
      },
      approved: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-200',
        label: 'Approved',
      },
      rejected: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-200',
        label: 'Rejected',
      },
    };
    return configs[status] || configs.pending;
  };

  const handleApplyLeave = () => {
    if (!formData.employeeName || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      employeeId: Math.floor(Math.random() * 1000).toString(),
      employeeName: formData.employeeName,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    setLeaveRequests([...leaveRequests, newRequest]);
    setShowApplyModal(false);
    setFormData({ employeeName: '', leaveType: 'Annual Leave', startDate: '', endDate: '', reason: '' });
  };

  const handleApprove = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id ? { ...request, status: 'approved' } : request
      )
    );
  };

  const handleReject = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id ? { ...request, status: 'rejected' } : request
      )
    );
  };

  const openDetailsModal = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Leave Management"
        desc="Manage employee leave requests and approvals"
      >
        <div className="space-y-6">
          {/* Header with Controls */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search by employee name"
              className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowApplyModal(true)}
              >
                + Apply for Leave
              </Button>
            </div>
          </div>

          {/* Leave Requests Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Leave Type</th>
                  <th className="px-3 py-2 font-medium">Period</th>
                  <th className="px-3 py-2 font-medium text-center">Days</th>
                  <th className="px-3 py-2 font-medium text-center">Status</th>
                  <th className="px-3 py-2 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => {
                  const statusConfig = getStatusConfig(request.status);
                  return (
                    <tr key={request.id} className="border-b border-gray-100 text-sm">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(
                              request.employeeId
                            )}`}
                          >
                            {getInitials(request.employeeName)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-100">{request.employeeName}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Applied: {new Date(request.appliedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{request.leaveType}</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                        {new Date(request.startDate).toLocaleDateString()} -{' '}
                        {new Date(request.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 text-center text-gray-600 dark:text-gray-300">{request.days}</td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDetailsModal(request)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900/30"
                            title="View Details"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                                title="Approve"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                                title="Reject"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </ComponentCard>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => {
          setShowApplyModal(false);
          setFormData({
            employeeName: '',
            leaveType: 'Annual Leave',
            startDate: '',
            endDate: '',
            reason: '',
          });
        }}
        className="max-w-lg p-6"
      >
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Apply for Leave</h3>
        </div>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="employee-name">Employee Name</Label>
            <InputField
              id="employee-name"
              type="text"
              placeholder="Enter your name"
              defaultValue={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="leave-type">Leave Type</Label>
            <select
              id="leave-type"
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Paternity Leave">Paternity Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <InputField
                id="start-date"
                type="date"
                defaultValue={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <InputField
                id="end-date"
                type="date"
                defaultValue={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="reason">Reason</Label>
            <TextArea
              placeholder="Reason for leave..."
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
              setFormData({
                employeeName: '',
                leaveType: 'Annual Leave',
                startDate: '',
                endDate: '',
                reason: '',
              });
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleApplyLeave}>
            Submit Application
          </Button>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRequest(null);
        }}
        className="max-w-lg p-6"
      >
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Request Details</h3>
        </div>
        {selectedRequest && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(
                  selectedRequest.employeeId
                )}`}
              >
                {getInitials(selectedRequest.employeeName)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedRequest.employeeName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Applied on {new Date(selectedRequest.appliedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Leave Type</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {selectedRequest.leaveType}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {selectedRequest.days} days
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Start Date</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {new Date(selectedRequest.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">End Date</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {new Date(selectedRequest.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Reason</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {selectedRequest.reason}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
              <span
                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  getStatusConfig(selectedRequest.status).bg
                } ${getStatusConfig(selectedRequest.status).text}`}
              >
                {getStatusConfig(selectedRequest.status).label}
              </span>
            </div>
          </div>
        )}
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
