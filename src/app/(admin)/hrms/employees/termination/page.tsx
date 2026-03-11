'use client';

import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { employeesService, type Employee } from '@/lib/services/employees';

interface FormData {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  terminationDate: string;
  lastWorkingDay: string;
  reason: string;
  notes: string;
}

interface EmployeeOption {
  id: string;
  name: string;
  department: string;
  position: string;
}

const terminationReasons = [
  'Voluntary Resignation',
  'Relocation',
  'Performance Issues',
  'Redundancy',
  'Retirement',
  'Medical Reasons',
  'Mutual Agreement',
  'Other'
];

export default function TerminationPage() {
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    employeeId: '',
    employeeName: '',
    department: '',
    position: '',
    terminationDate: '',
    lastWorkingDay: '',
    reason: '',
    notes: ''
  });
  const [formVersion, setFormVersion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOption | null>(null);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await employeesService.list({
          limit: 100,
          employment_status: 'CONFIRMED'
        });
        
        const mappedEmployees: EmployeeOption[] = response.data.map((emp: Employee) => ({
          id: emp.id,
          name: `${emp.first_name} ${emp.last_name}`,
          department: emp.current_assignment?.department_name || 'N/A',
          position: emp.current_assignment?.position_title || 'N/A'
        }));
        
        setEmployees(mappedEmployees);
      } catch (err) {
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const resetForm = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      department: '',
      position: '',
      terminationDate: '',
      lastWorkingDay: '',
      reason: '',
      notes: ''
    });
    setSelectedEmployee(null);
    setFormVersion((current) => current + 1);
  };

  const handleEmployeeChange = (value: string) => {
    const employee = employees.find(emp => emp.id === value);
    if (employee) {
      setSelectedEmployee(employee);
      setFormData(prev => ({
        ...prev,
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
        position: employee.position
      }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotesChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      notes: value
    }));
  };

  const handleReasonChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      reason: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Termination Data:', formData);
    setTimeout(() => {
      setSubmitted(false);
      resetForm();
    }, 2000);
  };

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: emp.name
  }));

  const reasonOptions = terminationReasons.map(reason => ({
    value: reason,
    label: reason
  }));

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Employee Termination" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ComponentCard
          title="Termination Form"
          desc="Initiate and process employee termination"
          className="xl:col-span-2"
        >
          <form key={formVersion} onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="employeeId">Select Employee *</Label>
              <Select
                options={employeeOptions}
                placeholder="-- Choose Employee --"
                defaultValue={formData.employeeId}
                onChange={handleEmployeeChange}
              />
            </div>

            {selectedEmployee && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.employeeName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Department</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.department}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Position</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.position}</p>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="reason">Termination Reason *</Label>
              <Select
                options={reasonOptions}
                placeholder="-- Select Reason --"
                defaultValue={formData.reason}
                onChange={handleReasonChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="terminationDate">Termination Date *</Label>
                <Input
                  id="terminationDate"
                  type="date"
                  name="terminationDate"
                  defaultValue={formData.terminationDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="lastWorkingDay">Last Working Day *</Label>
                <Input
                  id="lastWorkingDay"
                  type="date"
                  name="lastWorkingDay"
                  defaultValue={formData.lastWorkingDay}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <TextArea
                value={formData.notes}
                onChange={handleNotesChange}
                placeholder="Add any additional information about the termination..."
                rows={5}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                disabled={!selectedEmployee || loading}
              >
                Submit Termination
              </Button>
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
              >
                Clear Form
              </button>
            </div>

            {submitted && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  ✓ Termination request submitted successfully for {formData.employeeName}
                </p>
              </div>
            )}
          </form>
        </ComponentCard>

        <ComponentCard title="Notice" desc="Important information">
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>- Ensure all compliance requirements are met before submission</li>
            <li>- The employee will be notified as per company policy</li>
            <li>- Final settlement will be initiated automatically</li>
            <li>- Last working day must be on or after termination date</li>
          </ul>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            Tip: Document all termination details thoroughly for legal compliance.
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
