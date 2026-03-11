'use client';

import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Checkbox from '@/components/form/input/Checkbox';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { employeesService, type Employee } from '@/lib/services/employees';
import { departmentsService, type Department } from '@/lib/services/departments';
import { positionsService, type Position } from '@/lib/services/positions';

interface FormData {
  employeeId: string;
  employeeName: string;
  previousDepartment: string;
  previousPosition: string;
  newDepartment: string;
  newPosition: string;
  rehireDate: string;
  salary: string;
  reason: string;
  checks: {
    backgroundCheck: boolean;
    referenceCheck: boolean;
    healthCheck: boolean;
    documentVerification: boolean;
  };
  notes: string;
}

interface EmployeeOption {
  id: string;
  name: string;
  department: string;
  position: string;
}

const rehireReasons = [
  'Contract Extension',
  'Project Based',
  'Seasonal Work',
  'Special Assignment',
  'Skills Needed',
  'Other'
];

export default function RehireCheckPage() {
  const [terminatedEmployees, setTerminatedEmployees] = useState<EmployeeOption[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    employeeId: '',
    employeeName: '',
    previousDepartment: '',
    previousPosition: '',
    newDepartment: '',
    newPosition: '',
    rehireDate: '',
    salary: '',
    reason: '',
    checks: {
      backgroundCheck: false,
      referenceCheck: false,
      healthCheck: false,
      documentVerification: false,
    },
    notes: ''
  });
  const [formVersion, setFormVersion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOption | null>(null);

  // Fetch all employees from API
  useEffect(() => {
    const fetchTerminatedEmployees = async () => {
      try {
        setLoading(true);
        const response = await employeesService.list({
          limit: 100
        });
        
        const mappedEmployees: EmployeeOption[] = response.data.map((emp: Employee) => ({
          id: emp.id,
          name: `${emp.first_name} ${emp.last_name}`,
          department: emp.current_assignment?.department_name || 'Unsigned',
          position: emp.current_assignment?.position_title || 'Unsigned'
        }));
        
        setTerminatedEmployees(mappedEmployees);
      } catch (err) {
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerminatedEmployees();
  }, []);

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepts(true);
        const response = await departmentsService.list({ limit: 100 });
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch positions from API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoadingPositions(true);
        const response = await positionsService.list({ limit: 100 });
        setPositions(response.data);
      } catch (err) {
        console.error('Error fetching positions:', err);
      } finally {
        setLoadingPositions(false);
      }
    };

    fetchPositions();
  }, []);

  const resetForm = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      previousDepartment: '',
      previousPosition: '',
      newDepartment: '',
      newPosition: '',
      rehireDate: '',
      salary: '',
      reason: '',
      checks: {
        backgroundCheck: false,
        referenceCheck: false,
        healthCheck: false,
        documentVerification: false,
      },
      notes: ''
    });
    setSelectedEmployee(null);
    setFormVersion((current) => current + 1);
  };

  const handleEmployeeChange = (value: string) => {
    const employee = terminatedEmployees.find(emp => emp.id === value);
    if (employee) {
      setSelectedEmployee(employee);
      setFormData(prev => ({
        ...prev,
        employeeId: employee.id,
        employeeName: employee.name,
        previousDepartment: employee.department,
        previousPosition: employee.position,
        newDepartment: employee.department,
        newPosition: employee.position
      }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      newDepartment: value
    }));
  };

  const handlePositionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      newPosition: value
    }));
  };

  const handleReasonChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      reason: value
    }));
  };

  const handleNotesChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      notes: value
    }));
  };

  const handleCheckChange = (name: keyof FormData['checks'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      checks: {
        ...prev.checks,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Re-hire Data:', formData);
    setTimeout(() => {
      setSubmitted(false);
      resetForm();
    }, 2000);
  };

  const employeeOptions = terminatedEmployees.map(emp => ({
    value: emp.id,
    label: emp.name
  }));

  const departmentOptions = departments.map(dept => ({
    value: dept.id,
    label: dept.name
  }));

  const positionOptions = positions.map(pos => ({
    value: pos.id,
    label: pos.title
  }));

  const reasonOptions = rehireReasons.map(reason => ({
    value: reason,
    label: reason
  }));

  const allChecksCompleted = Object.values(formData.checks).every(check => check === true);

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Re-hire Employee" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ComponentCard
          title="Re-hire Form"
          desc="Process re-hiring of previously terminated employees with compliance checks"
          className="xl:col-span-2"
        >
          <form key={formVersion} onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="employeeId">Select Employee to Re-hire *</Label>
              <Select
                options={employeeOptions}
                placeholder={loading ? 'Loading...' : terminatedEmployees.length === 0 ? 'No employees found' : '-- Choose Employee --'}
                defaultValue={formData.employeeId}
                onChange={handleEmployeeChange}
              />
              {!loading && terminatedEmployees.length > 0 && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {terminatedEmployees.length} {terminatedEmployees.length === 1 ? 'employee' : 'employees'} available
                </p>
              )}
            </div>

            {selectedEmployee && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.employeeName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Previous Department</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.previousDepartment}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Previous Position</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.previousPosition}</p>
                </div>
              </div>
            )}

            <div className="space-y-5 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">New Position Details</h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="newDepartment">New Department *</Label>
                  <Select
                    options={departmentOptions}
                    placeholder={loadingDepts ? 'Loading departments...' : '-- Select Department --'}
                    defaultValue={formData.newDepartment}
                    onChange={handleDepartmentChange}
                  />
                </div>
                <div>
                  <Label htmlFor="newPosition">New Position *</Label>
                  <Select
                    options={positionOptions}
                    placeholder={loadingPositions ? 'Loading positions...' : '-- Select Position --'}
                    defaultValue={formData.newPosition}
                    onChange={handlePositionChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Re-hire Information</h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="rehireDate">Re-hire Date *</Label>
                  <Input
                    id="rehireDate"
                    type="date"
                    name="rehireDate"
                    defaultValue={formData.rehireDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary (Optional)</Label>
                  <Input
                    id="salary"
                    type="number"
                    name="salary"
                    defaultValue={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Enter annual salary"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Re-hire *</Label>
                <Select
                  options={reasonOptions}
                  placeholder="-- Select Reason --"
                  defaultValue={formData.reason}
                  onChange={handleReasonChange}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pre-hire Compliance Checks</h3>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                <Checkbox
                  id="backgroundCheck"
                  checked={formData.checks.backgroundCheck}
                  onChange={(checked) => handleCheckChange('backgroundCheck', checked)}
                  label="Background Check Completed"
                />
                <Checkbox
                  id="referenceCheck"
                  checked={formData.checks.referenceCheck}
                  onChange={(checked) => handleCheckChange('referenceCheck', checked)}
                  label="Reference Check Completed"
                />
                <Checkbox
                  id="healthCheck"
                  checked={formData.checks.healthCheck}
                  onChange={(checked) => handleCheckChange('healthCheck', checked)}
                  label="Health Check Completed"
                />
                <Checkbox
                  id="documentVerification"
                  checked={formData.checks.documentVerification}
                  onChange={(checked) => handleCheckChange('documentVerification', checked)}
                  label="Document Verification Completed"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <TextArea
                value={formData.notes}
                onChange={handleNotesChange}
                placeholder="Add any additional information about the re-hire..."
                rows={4}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                disabled={!selectedEmployee || !allChecksCompleted || loading}
              >
                {allChecksCompleted ? 'Submit Re-hire Request' : 'Complete All Checks'}
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
                  ✓ Re-hire request submitted successfully for {formData.employeeName}
                </p>
              </div>
            )}
          </form>
        </ComponentCard>

        <ComponentCard title="Re-hire Process Notice" desc="Important information">
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>- All compliance checks must be completed before submission</li>
            <li>- Employee will be notified of re-hire approval via registered email</li>
            <li>- New employment agreement will be generated automatically</li>
            <li>- System re-hire date cannot be changed after submission</li>
            <li>- HR will process the request within 2-3 business days</li>
          </ul>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            Tip: Verify all details carefully before submission as changes cannot be made after approval.
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
