'use client';

import { useState, useEffect } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { employeesService, type Employee } from '@/lib/services/employees';
import { departmentsService, type Department } from '@/lib/services/departments';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
}

const employmentStatuses = ['All Statuses', 'PROBATION', 'CONFIRMED', 'SUSPENDED', 'RESIGNED', 'TERMINATED'];
const exportReasons = ['Payroll', 'Reports', 'Analysis', 'Backup', 'Integration', 'Other'];

const selectStyles = `
  select {
    color-scheme: light;
  }
  
  .dark select {
    color-scheme: dark;
  }
  
  .dark select option {
    background-color: #1f2937;
    color: #f3f4f6;
  }
  
  select option {
    background-color: #ffffff;
    color: #000000;
  }
`;

export default function ExportPage() {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedEmploymentStatus, setSelectedEmploymentStatus] = useState('All Statuses');
  const [selectedReason, setSelectedReason] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exportMessage, setExportMessage] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Fetch departments and employees on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptsRes, empsRes] = await Promise.all([
          departmentsService.list({ limit: 100 }).catch(err => {
            console.warn('Department fetch failed:', err);
            return { data: [] };
          }),
          employeesService.list({ limit: 100 }).catch(err => {
            console.warn('Employee fetch failed:', err);
            return { data: [] };
          })
        ]);
        
        const deptData = deptsRes?.data || [];
        const empData = empsRes?.data || [];
        
        setDepartments(deptData);
        setEmployees(empData);
        
        // Log what we received
        console.log(`Loaded ${deptData.length} departments and ${empData.length} employees`);
        
        if (deptData.length === 0 && empData.length > 0) {
          showToast('warning', 'No departments found, but employees loaded');
        } else if (empData.length === 0) {
          showToast('warning', 'No employee data available');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load data';
        console.error('Data fetch error:', errorMsg, err);
        showToast('error', errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const getFilteredEmployees = () => {
    let filtered = [...employees];

    // Filter by department
    if (selectedDepartment !== 'All Departments') {
      const dept = departments.find(d => d.name === selectedDepartment);
      if (dept) {
        filtered = filtered.filter(emp => emp.current_assignment?.department_id === dept.id);
      }
    }

    // Filter by employment status
    if (selectedEmploymentStatus !== 'All Statuses') {
      filtered = filtered.filter(emp => emp.employment_status === selectedEmploymentStatus);
    }

    // Filter by hire date
    if (dateFrom) {
      filtered = filtered.filter(emp => emp.hire_date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(emp => emp.hire_date <= dateTo);
    }

    return filtered;
  };

  const exportCSV = (data: Employee[], extension = 'csv') => {
    const headers = 'Employee Code,First Name,Last Name,Email,Phone,Department,Position,Employment Status,Hire Date,Is Active';
    const rows = data.map(emp => [
      emp.employee_code,
      emp.first_name,
      emp.last_name,
      emp.email,
      emp.phone || '',
      emp.current_assignment?.department_name || 'Unassigned',
      emp.current_assignment?.position_title || 'Unassigned',
      emp.employment_status,
      emp.hire_date,
      emp.is_active ? 'Yes' : 'No'
    ].map(field => `"${field}"`).join(','));
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employees-export-${new Date().toISOString().split('T')[0]}.${extension}`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    try {
      setExporting(true);
      const filteredEmployees = getFilteredEmployees();

      if (filteredEmployees.length === 0) {
        showToast('warning', 'No employees match the selected filters');
        return;
      }

      if (exportFormat === 'csv') {
        exportCSV(filteredEmployees);
      } else if (exportFormat === 'excel') {
        exportCSV(filteredEmployees, 'xlsx');
      } else {
        exportCSV(filteredEmployees, 'txt');
      }

      setExportMessage(`✓ Successfully exported ${filteredEmployees.length} employee records`);
      showToast('success', `Exported ${filteredEmployees.length} employees`);
      setTimeout(() => setExportMessage(''), 5000);
    } catch (err) {
      showToast('error', 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const activeFiltersCount = 
    (selectedDepartment !== 'All Departments' ? 1 : 0) +
    (selectedEmploymentStatus !== 'All Statuses' ? 1 : 0) +
    (selectedReason ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  const filteredCount = getFilteredEmployees().length;

  return (
    <div>
      <style>{selectStyles}</style>

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border animate-in slide-in-from-right-5 duration-300 min-w-[320px] max-w-md ${
              toast.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                : toast.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
            }`}
          >
            {toast.type === 'success' && (
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.type === 'warning' && (
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <p className={`text-sm font-medium flex-1 ${
              toast.type === 'success' 
                ? 'text-emerald-700 dark:text-emerald-400'
                : toast.type === 'error'
                ? 'text-red-700 dark:text-red-400'
                : 'text-amber-700 dark:text-amber-400'
            }`}>
              {toast.message}
            </p>
          </div>
        ))}
      </div>

      <PageBreadcrumb pageTitle="Export Employees" />

      {/* Data Status Indicator */}
      {!loading && (
        <div className={`mb-4 rounded-lg border p-3 ${
          departments.length > 0 && employees.length > 0
            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
            : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
        }`}>
          <p className={`text-sm font-medium ${
            departments.length > 0 && employees.length > 0
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-amber-700 dark:text-amber-400'
          }`}>
            ✓ Loaded: {departments.length} departments, {employees.length} employees
          </p>
        </div>
      )}

      <div className="space-y-5 sm:space-y-6\">
        {/* Export Format Selection */}
        <ComponentCard 
          title="Choose Export Format"
          desc={loading ? 'Loading data...' : `${employees.length} employees | ${departments.length} departments${activeFiltersCount > 0 ? ` | ${filteredCount} match filters` : ''}`}
        >
          <div className="flex gap-3">
            {/* CSV Option */}
            <label className="relative flex flex-1 cursor-pointer">
              <input
                type="radio"
                name="format"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={() => setExportFormat('csv')}
                className="sr-only"
              />
              <div className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                exportFormat === 'csv'
                  ? 'border-brand-500 bg-brand-500 text-white dark:border-brand-500 dark:bg-brand-500'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </div>
            </label>

            {/* Excel Option */}
            <label className="relative flex flex-1 cursor-pointer">
              <input
                type="radio"
                name="format"
                value="excel"
                checked={exportFormat === 'excel'}
                onChange={() => setExportFormat('excel')}
                className="sr-only"
              />
              <div className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                exportFormat === 'excel'
                  ? 'border-brand-500 bg-brand-500 text-white dark:border-brand-500 dark:bg-brand-500'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Excel
              </div>
            </label>

            {/* PDF Option */}
            <label className="relative flex flex-1 cursor-pointer">
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={exportFormat === 'pdf'}
                onChange={() => setExportFormat('pdf')}
                className="sr-only"
              />
              <div className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                exportFormat === 'pdf'
                  ? 'border-brand-500 bg-brand-500 text-white dark:border-brand-500 dark:bg-brand-500'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </div>
            </label>
          </div>
        </ComponentCard>

        {/* Filter Criteria */}
        <ComponentCard 
          title="Filter Criteria"
          desc="Select criteria to filter the exported data"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Department */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                disabled={loading || departments.length === 0}
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-brand-400 disabled:opacity-50"
              >
                <option value="All Departments">
                  {loading ? 'Loading departments...' : departments.length === 0 ? 'No departments available' : 'All Departments'}
                </option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              {departments.length === 0 && !loading && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">⚠ Department list is empty. Check backend connection.</p>
              )}
            </div>

            {/* Employment Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Employment Status
              </label>
              <select
                value={selectedEmploymentStatus}
                onChange={(e) => setSelectedEmploymentStatus(e.target.value)}
                disabled={loading}
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-brand-400 disabled:opacity-50"
              >
                {employmentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Export Reason */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Export Reason
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-brand-400"
              >
                <option value="">Select a reason...</option>
                {exportReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-brand-400"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-brand-400"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
              <p className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                Active Filters: {activeFiltersCount}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedDepartment !== 'All Departments' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    Department: {selectedDepartment}
                  </span>
                )}
                {selectedEmploymentStatus !== 'All Statuses' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    Status: {selectedEmploymentStatus}
                  </span>
                )}
                {selectedReason && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    Reason: {selectedReason}
                  </span>
                )}
                {dateFrom && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    From: {dateFrom}
                  </span>
                )}
                {dateTo && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    To: {dateTo}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedDepartment('All Departments');
                  setSelectedEmploymentStatus('All Statuses');
                  setSelectedReason('');
                  setDateFrom('');
                  setDateTo('');
                }}
                className="mt-4 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </ComponentCard>

        {/* Included Data */}
        <ComponentCard 
          title="Included Data Fields"
          desc="The export will include the following information"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              'Employee Code',
              'Full Name',
              'Email Address',
              'Phone Number',
              'Department',
              'Position',
              'Employment Status',
              'Hire Date',
              'Active Status'
            ].map((field) => (
              <div key={field} className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 text-brand-600 dark:text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">{field}</span>
              </div>
            ))}
          </div>
        </ComponentCard>

        {/* Action Card */}
        <ComponentCard title="Ready to Export?">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click the export button below to download your employee data in the selected format with applied filters.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="primary" 
                size="md"
                onClick={handleExport}
                disabled={loading || exporting || filteredCount === 0}
              >
                {exporting ? 'Exporting...' : loading ? 'Loading...' : `Export ${filteredCount} Employees`}
              </Button>
              <Button 
                variant="outline" 
                size="md"
                onClick={() => {
                  setExportFormat('csv');
                  setSelectedDepartment('All Departments');
                  setSelectedEmploymentStatus('All Statuses');
                  setSelectedReason('');
                  setDateFrom('');
                  setDateTo('');
                }}
                disabled={loading || exporting}
              >
                Reset
              </Button>
            </div>
          </div>
        </ComponentCard>

        {/* Success Message */}
        {exportMessage && (
          <div className="rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-300">Success</h4>
                <p className="mt-1 text-sm text-green-700 dark:text-green-200">{exportMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
