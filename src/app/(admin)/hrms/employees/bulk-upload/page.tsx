'use client';

import { useState, useEffect } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { employeesService, type CreateEmployeePayload } from '@/lib/services/employees';
import { departmentsService, type Department } from '@/lib/services/departments';
import { positionsService, type Position } from '@/lib/services/positions';

interface BulkUploadData {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id: string;
  department_name: string;
  position_id: string;
  position_name: string;
  hire_date: string;
  base_salary?: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
}

export default function BulkUploadPage() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<BulkUploadData[]>([]);
  const [uploadMessage, setUploadMessage] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch departments and positions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptsRes, posRes] = await Promise.all([
          departmentsService.list({ limit: 100 }),
          positionsService.list({ limit: 100 })
        ]);
        setDepartments(deptsRes.data);
        setPositions(posRes.data);
      } catch (err) {
        console.error('Error fetching departments/positions:', err);
        showToast('error', 'Failed to load departments and positions');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadFile(e.target.files[0]);
      setUploadMessage('');
      setUploadedData([]);
    }
  };

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      setUploadMessage('Please select a file');
      showToast('warning', 'Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      const text = await uploadFile.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        throw new Error('CSV file is empty or invalid');
      }

      const headers = rows[0].map(h => h.toLowerCase().trim());
      const data: BulkUploadData[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < headers.length || !row[0]) continue;

        const empData: any = {};
        headers.forEach((header, idx) => {
          empData[header] = row[idx]?.trim() || '';
        });

        // Find department
        const dept = departments.find(d => 
          d.name.toLowerCase() === empData.department?.toLowerCase() ||
          d.code.toLowerCase() === empData.department?.toLowerCase()
        );

        // Find position
        const pos = positions.find(p => 
          p.title.toLowerCase() === empData.position?.toLowerCase() ||
          p.code.toLowerCase() === empData.position?.toLowerCase()
        );

        if (!dept) {
          console.warn(`Department not found for: ${empData.department}`);
        }
        if (!pos) {
          console.warn(`Position not found for: ${empData.position}`);
        }

        data.push({
          employee_code: empData.employee_code || empData.code || `EMP${Date.now()}${i}`,
          first_name: empData.first_name || empData.firstname || '',
          last_name: empData.last_name || empData.lastname || '',
          email: empData.email || '',
          phone: empData.phone || '',
          department_id: dept?.id || '',
          department_name: empData.department || '',
          position_id: pos?.id || '',
          position_name: empData.position || '',
          hire_date: empData.hire_date || empData.join_date || new Date().toISOString().split('T')[0],
          base_salary: empData.salary || empData.base_salary || ''
        });
      }

      if (data.length === 0) {
        throw new Error('No valid employee records found in CSV');
      }

      setUploadedData(data);
      setUploadMessage(`✓ Successfully parsed ${data.length} records from ${uploadFile.name}`);
      showToast('success', `Parsed ${data.length} employee records`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to parse file';
      setUploadMessage(message);
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBulk = async () => {
    if (uploadedData.length === 0) return;

    try {
      setSubmitting(true);
      let successCount = 0;
      let errorCount = 0;

      for (const emp of uploadedData) {
        try {
          const payload: CreateEmployeePayload = {
            employee_code: emp.employee_code,
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            phone: emp.phone || undefined,
            hire_date: emp.hire_date,
            employment_status: 'PROBATION',
            department_id: emp.department_id || undefined,
            position_id: emp.position_id || undefined,
            base_salary: emp.base_salary ? parseFloat(emp.base_salary) : undefined
          };

          await employeesService.create(payload);
          successCount++;
        } catch (err) {
          console.error(`Failed to create employee ${emp.email}:`, err);
          errorCount++;
        }
      }

      if (successCount > 0) {
        showToast('success', `Successfully imported ${successCount} employees`);
      }
      if (errorCount > 0) {
        showToast('error', `Failed to import ${errorCount} employees`);
      }

      // Clear form after successful submission
      if (successCount === uploadedData.length) {
        setUploadedData([]);
        setUploadFile(null);
        setUploadMessage('');
      }
    } catch (err) {
      showToast('error', 'Bulk import failed');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `employee_code,first_name,last_name,email,phone,department,position,hire_date,salary
EMP001,John,Doe,john.doe@company.com,+1234567890,Engineering,Developer,2026-04-01,80000
EMP002,Jane,Smith,jane.smith@company.com,+1234567891,Marketing,Manager,2026-04-01,75000`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employee-bulk-upload-template.csv';
    link.click();
    showToast('success', 'Template downloaded successfully');
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Bulk Upload Employees" />

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ComponentCard
          title="Bulk Import"
          desc="Import multiple employees at once using CSV or Excel files"
          className="xl:col-span-2"
        >
          <div className="space-y-6">{/* Upload Section */}
            <div>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                <div className="text-center space-y-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  
                  <div>
                    <label className="cursor-pointer inline-block">
                      <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Choose File
                      </span>
                      <input
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {uploadFile && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Selected: {uploadFile.name}
                      </p>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Supports CSV and Excel formats
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFileUpload}
                  disabled={!uploadFile || loading}
                >
                  {loading ? 'Parsing...' : 'Parse File'}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={downloadTemplate}
                >
                  Download Template
                </Button>
              </div>

              {uploadMessage && (
                <div className={`mt-4 p-4 rounded-lg border ${
                  uploadMessage.startsWith('✓')
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <p className={`text-sm font-medium ${
                    uploadMessage.startsWith('✓')
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {uploadMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Preview Table */}
            {uploadedData.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preview ({uploadedData.length} records)
                </h3>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Position</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Hire Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedData.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.employee_code}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{row.first_name} {row.last_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {row.department_name}
                            {!row.department_id && <span className="ml-1 text-xs text-red-500">⚠</span>}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {row.position_name}
                            {!row.position_id && <span className="ml-1 text-xs text-red-500">⚠</span>}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.hire_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {uploadedData.some(r => !r.department_id || !r.position_id) && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      ⚠ Some records have missing department or position IDs. These will use default values or may fail during import.
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSubmitBulk}
                    disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {submitting ? 'Importing...' : 'Confirm & Import'}
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setUploadedData([]);
                      setUploadFile(null);
                      setUploadMessage('');
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ComponentCard>

        <ComponentCard title="CSV Format Guidelines" desc="Important information">
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>- <strong>Required columns:</strong> employee_code, first_name, last_name, email, department, position, hire_date</li>
            <li>- <strong>Optional columns:</strong> phone, salary</li>
            <li>- Department and position names must match existing records</li>
            <li>- Date format should be YYYY-MM-DD (e.g., 2026-04-01)</li>
            <li>- Download the template to see the correct format</li>
            <li>- All employees will be created with PROBATION status</li>
          </ul>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            Tip: Ensure all department and position names match your existing records to avoid import errors.
          </div>
        </ComponentCard>
      </div>

      {/* Legacy info box kept for reference if needed */}
      <div className="hidden rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10 p-5">
        {/* Moved to ComponentCard sidebar */}
      </div>
    </div>
  );
}
