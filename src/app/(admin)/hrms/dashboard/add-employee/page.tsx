'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons';
import { employeesService } from '@/lib/services/employees';
import { ApiClientError } from '@/lib/api-client';
import Toast from '@/components/common/Toast';

interface EmployeeFormData {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employment_status: 'PROBATION' | 'CONFIRMED' | 'SUSPENDED' | 'RESIGNED' | 'TERMINATED';
}

const employmentStatuses = ['PROBATION', 'CONFIRMED', 'SUSPENDED', 'RESIGNED', 'TERMINATED'];

// Generate auto employee code
const generateEmployeeCode = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `EMP-${year}-${random}`;
};

export default function AddEmployeePage() {
  const [formData, setFormData] = useState<EmployeeFormData>({
    employee_code: generateEmployeeCode(),
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    employment_status: 'PROBATION'
  });
  const [formVersion, setFormVersion] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const resetForm = () => {
    setFormData({
      employee_code: generateEmployeeCode(),
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      employment_status: 'PROBATION'
    });
    setFormVersion((current) => current + 1);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value: string) => {
    if (employmentStatuses.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        employment_status: value as EmployeeFormData['employment_status']
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const firstName = formData.first_name.trim();
    const lastName = formData.last_name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!firstName || !lastName || !email || !phone) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        employee_code: formData.employee_code,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        employment_status: formData.employment_status,
      };

      await employeesService.create(payload);
      
      showToast('Employee added successfully!', 'success');
      resetForm();
    } catch (err) {
      if (err instanceof ApiClientError) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to add employee. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = employmentStatuses.map((status) => ({
    value: status,
    label: status.replace('_', ' ')
  }));

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Add Employee" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ComponentCard
          title="Employee Information"
          desc="Create a new employee profile in the system"
          className="xl:col-span-2"
        >
          <form key={formVersion} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="employee_code">Employee Code</Label>
                <Input
                  id="employee_code"
                  name="employee_code"
                  defaultValue={formData.employee_code}
                  disabled
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Auto-generated employee identifier.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  defaultValue={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="e.g., John"
                />
              </div>

              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  defaultValue={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  defaultValue={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@company.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  defaultValue={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="employment_status">Employment Status</Label>
              <Select
                options={statusOptions}
                defaultValue={formData.employment_status}
                onChange={handleStatusChange}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                startIcon={<PlusIcon className="size-4" />}
                disabled={isLoading}
              >
                {isLoading ? 'Adding Employee...' : 'Add Employee'}
              </Button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
              >
                Clear Form
              </button>
            </div>
          </form>
        </ComponentCard>

        <ComponentCard title="Guidelines" desc="Before you add an employee">
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>- Employee code is generated automatically.</li>
            <li>- Complete all required fields marked with *.</li>
            <li>- Use a valid work email and reachable phone number.</li>
          </ul>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            Tip: Keep employee names and contact details consistent with official records.
          </div>
        </ComponentCard>
      </div>

      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
