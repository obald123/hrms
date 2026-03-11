"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "@/components/ui/modal";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  assignedEmployees: number;
  color: string;
}

interface Employee {
  id: number;
  name: string;
  position: string;
  assigned: boolean;
  avatar?: string;
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
  ];
  return colors[id % colors.length];
};

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([
    { id: 1, name: "Morning Shift", startTime: "08:00", endTime: "16:00", description: "Standard morning shift", assignedEmployees: 12, color: "blue" },
    { id: 2, name: "Afternoon Shift", startTime: "16:00", endTime: "00:00", description: "Afternoon to midnight", assignedEmployees: 8, color: "orange" },
    { id: 3, name: "Night Shift", startTime: "00:00", endTime: "08:00", description: "Overnight shift", assignedEmployees: 6, color: "purple" },
    { id: 4, name: "Day Shift", startTime: "09:00", endTime: "17:00", description: "Regular business hours", assignedEmployees: 15, color: "green" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    description: "",
    color: "blue"
  });

  const [mockEmployees, setMockEmployees] = useState<Employee[]>([
    { id: 1, name: "John Doe", position: "Developer", assigned: true },
    { id: 2, name: "Jane Smith", position: "Designer", assigned: true },
    { id: 3, name: "Mike Johnson", position: "Manager", assigned: false },
    { id: 4, name: "Sarah Wilson", position: "HR Specialist", assigned: false },
    { id: 5, name: "Tom Brown", position: "Developer", assigned: true },
    { id: 6, name: "Emily Davis", position: "Analyst", assigned: false },
  ]);

  const handleAddShift = () => {
    const newShift: Shift = {
      id: shifts.length + 1,
      name: formData.name,
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description,
      assignedEmployees: 0,
      color: formData.color
    };
    setShifts([...shifts, newShift]);
    setShowAddModal(false);
    setFormData({ name: "", startTime: "", endTime: "", description: "", color: "blue" });
  };

  const handleEditShift = () => {
    if (selectedShift) {
      setShifts(shifts.map(shift => 
        shift.id === selectedShift.id 
          ? { ...shift, name: formData.name, startTime: formData.startTime, endTime: formData.endTime, description: formData.description, color: formData.color }
          : shift
      ));
      setShowEditModal(false);
      setSelectedShift(null);
      setFormData({ name: "", startTime: "", endTime: "", description: "", color: "blue" });
    }
  };

  const handleDeleteShift = (id: number) => {
    if (confirm("Are you sure you want to delete this shift?")) {
      setShifts(shifts.filter(shift => shift.id !== id));
    }
  };

  const openEditModal = (shift: Shift) => {
    setSelectedShift(shift);
    setFormData({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      description: shift.description,
      color: shift.color
    });
    setShowEditModal(true);
  };

  const openAssignModal = (shift: Shift) => {
    setSelectedShift(shift);
    setShowAssignModal(true);
  };

  const toggleEmployeeAssignment = (employeeId: number) => {
    setMockEmployees(mockEmployees.map(emp => 
      emp.id === employeeId ? { ...emp, assigned: !emp.assigned } : emp
    ));
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; avatar: string }> = {
      blue: { bg: "bg-blue-100", text: "text-blue-700", avatar: "bg-blue-500" },
      green: { bg: "bg-green-100", text: "text-green-700", avatar: "bg-green-500" },
      orange: { bg: "bg-orange-100", text: "text-orange-700", avatar: "bg-orange-500" },
      purple: { bg: "bg-purple-100", text: "text-purple-700", avatar: "bg-purple-500" },
      red: { bg: "bg-red-100", text: "text-red-700", avatar: "bg-red-500" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <ComponentCard 
        title="Shift Management" 
        desc="Create and manage work shifts for your organization"
      >
        <div className="flex justify-end">
          <Button
            onClick={() => setShowAddModal(true)}
            variant="primary"
            size="sm"
            startIcon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Shift
          </Button>
        </div>

        {/* Shifts Table */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                <TableRow>
                  <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Shift Details
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Description
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Assigned
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-4 py-8 text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">No shifts found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  shifts.map((shift) => {
                    const colorClass = getColorClasses(shift.color);
                    return (
                      <TableRow key={shift.id} className="border-b border-gray-200 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/30">
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-semibold flex-shrink-0 ${colorClass.avatar}`}>
                              {getInitials(shift.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">{shift.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{shift.startTime} - {shift.endTime}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="text-sm text-gray-600 dark:text-gray-400">{shift.description || '-'}</div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {mockEmployees
                                .filter((emp) => emp.assigned)
                                .slice(0, 3)
                                .map((emp) => (
                                  <div
                                    key={emp.id}
                                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white dark:border-gray-800 ${getAvatarColor(emp.id)}`}
                                    title={emp.name}
                                  >
                                    {getInitials(emp.name)}
                                  </div>
                                ))}
                              {mockEmployees.filter((emp) => emp.assigned).length > 3 && (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-400 text-xs font-semibold text-white dark:border-gray-800">
                                  +{mockEmployees.filter((emp) => emp.assigned).length - 3}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{mockEmployees.filter((emp) => emp.assigned).length} assigned</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openAssignModal(shift)}
                              className="inline-flex h-8 items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-3 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              Assign
                            </button>
                            <button
                              onClick={() => openEditModal(shift)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900/30"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteShift(shift.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
            Showing {shifts.length} shifts
          </div>
        </div>
      </ComponentCard>

      {/* Add Shift Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} className="max-w-lg p-6">
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Shift</h3>
        </div>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="shift-name">Shift Name</Label>
            <Input
              type="text"
              id="shift-name"
              placeholder="e.g., Morning Shift"
              defaultValue={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea
              placeholder="Shift description..."
              rows={3}
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
            />
          </div>
          <div>
            <Label htmlFor="color">Color</Label>
            <Select
              options={[
                { value: "blue", label: "Blue" },
                { value: "green", label: "Green" },
                { value: "orange", label: "Orange" },
                { value: "purple", label: "Purple" },
                { value: "red", label: "Red" },
              ]}
              defaultValue={formData.color}
              onChange={(value) => setFormData({ ...formData, color: value })}
              placeholder="Select a color"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddModal(false);
              setFormData({ name: "", startTime: "", endTime: "", description: "", color: "blue" });
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddShift}>
            Add Shift
          </Button>
        </div>
      </Modal>

      {/* Edit Shift Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} className="max-w-lg p-6">
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Shift</h3>
        </div>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="edit-shift-name">Shift Name</Label>
            <Input
              type="text"
              id="edit-shift-name"
              defaultValue={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-start-time">Start Time</Label>
              <Input
                type="time"
                id="edit-start-time"
                defaultValue={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-end-time">End Time</Label>
              <Input
                type="time"
                id="edit-end-time"
                defaultValue={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <TextArea
              placeholder="Shift description..."
              rows={3}
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-color">Color</Label>
            <Select
              options={[
                { value: "blue", label: "Blue" },
                { value: "green", label: "Green" },
                { value: "orange", label: "Orange" },
                { value: "purple", label: "Purple" },
                { value: "red", label: "Red" },
              ]}
              defaultValue={formData.color}
              onChange={(value) => setFormData({ ...formData, color: value })}
              placeholder="Select a color"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowEditModal(false);
              setSelectedShift(null);
              setFormData({ name: "", startTime: "", endTime: "", description: "", color: "blue" });
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleEditShift}>
            Save Changes
          </Button>
        </div>
      </Modal>

      {/* Assign Employees Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} className="max-w-2xl p-6">
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assign Employees to {selectedShift?.name}
          </h3>
        </div>
        <div className="max-h-96 overflow-y-auto py-4">
          <div className="space-y-2">
            {mockEmployees.map((employee) => (
              <label
                key={employee.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/30 transition"
              >
                <input
                  type="checkbox"
                  checked={employee.assigned}
                  onChange={() => toggleEmployeeAssignment(employee.id)}
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white flex-shrink-0 ${getAvatarColor(employee.id)}`}>
                  {getInitials(employee.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{employee.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{employee.position}</p>
                </div>
                {employee.assigned && (
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400 flex-shrink-0">
                    Assigned
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mockEmployees.filter(e => e.assigned).length} of {mockEmployees.length} employees assigned
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setShowAssignModal(false);
              setSelectedShift(null);
            }}
          >
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
}
