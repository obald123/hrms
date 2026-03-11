'use client';

import { useEffect, useMemo, useState } from 'react';
import { departmentsService, Department } from '@/lib/services/departments';
import { ApiClientError } from '@/lib/api-client';
import Link from 'next/link';
import { PlusIcon } from '@/icons';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import AvatarText from '@/components/ui/avatar/AvatarText';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const statusBadgeColor: Record<string, 'success' | 'light'> = {
  true: 'success',
  false: 'light'
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

export default function DepartmentListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const response = await departmentsService.list();
        setDepartments(response.data);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Failed to load departments');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const filteredDepartments = useMemo(
    () =>
      departments.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.code.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, departments]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Department List" />
        <Link href="/hrms/dashboard/add-department">
          <Button size="sm" variant="primary" startIcon={<PlusIcon className="size-4" />}>
            Add Department
          </Button>
        </Link>
      </div>

      {error && (
        <ComponentCard title="Error">
          <p className="text-sm text-red-500">{error}</p>
        </ComponentCard>
      )}

      <ComponentCard title="Departments" desc="Manage all departments in your organization">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            id="search-departments"
            name="search-departments"
            defaultValue={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by department name or code"
          />
          <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400">
            Total: {filteredDepartments.length}
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Department Records">
        {isLoading ? <p className="text-sm text-gray-500">Loading departments...</p> : null}

        {!isLoading && filteredDepartments.length === 0 ? (
          <p className="text-sm text-gray-500">No departments found.</p>
        ) : null}

        {!isLoading && filteredDepartments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-[760px]">
              <TableHeader className="border-b border-gray-200 dark:border-gray-800">
                <TableRow>
                  <TableCell isHeader className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Department
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Code
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Created
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <AvatarText name={dept.name} className="h-8 w-8" />
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{dept.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{dept.code}</TableCell>
                    <TableCell className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(dept.created_at)}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <Badge size="sm" color={statusBadgeColor[String(dept.is_active)]}>
                        {dept.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </ComponentCard>
    </div>
  );
}
