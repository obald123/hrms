'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import { PlusIcon } from '@/icons';
import { departmentsService } from '@/lib/services/departments';
import { ApiClientError } from '@/lib/api-client';
import Toast from '@/components/common/Toast';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Checkbox from '@/components/form/input/Checkbox';
import Button from '@/components/ui/button/Button';

interface DepartmentFormData {
  name: string;
  code: string;
  is_active: boolean;
}

export default function AddDepartmentPage() {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    code: '',
    is_active: true
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
      name: '',
      code: '',
      is_active: true
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        is_active: formData.is_active
      };

      await departmentsService.create(payload);

      showToast('Department added successfully!', 'success');
      resetForm();
    } catch (err) {
      if (err instanceof ApiClientError) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to add department. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Add Department" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ComponentCard
          title="Department Information"
          desc="Create a new department in your organization"
          className="xl:col-span-2"
        >
          <form key={formVersion} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Human Resources"
                />
              </div>

              <div>
                <Label htmlFor="code">Department Code</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., HR"
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Unique short identifier. Will be saved in uppercase.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: checked
                  }))
                }
                label="Active Department"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                startIcon={<PlusIcon className="size-4" />}
                disabled={isLoading}
              >
                {isLoading ? 'Adding Department...' : 'Add Department'}
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

        <ComponentCard
          title="Guidelines"
          desc="Before you create a department"
        >
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>- Department name should be unique.</li>
            <li>- Code should be short and readable (e.g., HR, FIN, IT).</li>
            <li>- Use active status to make it immediately available.</li>
          </ul>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            Tip: Keep department codes consistent with your payroll and reporting naming.
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
