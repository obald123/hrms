'use client';

import { useState, useMemo, useEffect } from 'react';
import { employeesService } from '@/lib/services/employees';
import { ApiClientError } from '@/lib/api-client';
import type { Employee as ApiEmployee } from '@/lib/services/employees';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';
import AvatarText from '@/components/ui/avatar/AvatarText';
import Badge from '@/components/ui/badge/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: string;
  joinDate: string;
  avatar?: string;
}

const mapApiEmployeeToEmployee = (employee: ApiEmployee): Employee => {
  const fullName = `${employee.first_name} ${employee.last_name}`.trim();

  return {
    id: employee.id,
    name: fullName || employee.employee_code,
    email: employee.email,
    phone: employee.phone ?? '',
    position: employee.current_assignment?.position_title ?? 'Unassigned',
    department: employee.current_assignment?.department_name ?? 'Unassigned',
    status: employee.employment_status,
    joinDate: employee.hire_date
  };
};

const statusBadgeColor: Record<string, 'success' | 'warning' | 'error' | 'info' | 'light'> = {
  ACTIVE: 'success',
  CONFIRMED: 'success',
  PROBATION: 'warning',
  ON_LEAVE: 'info',
  SUSPENDED: 'warning',
  TERMINATED: 'error',
  RESIGNED: 'light'
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

export default function EmployeeDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await employeesService.list();
        setEmployees((response.data || []).map(mapApiEmployeeToEmployee));
      } catch (err) {
        const errorMessage = err instanceof ApiClientError
          ? err.message
          : 'Failed to fetch employees';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, employees]);

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Employee Directory" />

      <ComponentCard title="Search" desc="Browse and manage all employees">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            id="search-employees"
            name="search-employees"
            defaultValue={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, email, position, or department"
          />
          <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400">
            Showing {filteredEmployees.length} of {employees.length}
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Employee Records">
        {isLoading ? <p className="text-sm text-gray-500">Loading employees...</p> : null}

        {!isLoading && error ? <p className="text-sm text-red-500">Error: {error}</p> : null}

        {!isLoading && !error && filteredEmployees.length === 0 ? (
          <p className="text-sm text-gray-500">No employees found.</p>
        ) : null}

        {!isLoading && !error && filteredEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-[980px]">
              <TableHeader className="border-b border-gray-200 dark:border-gray-800">
                <TableRow>
                  <TableCell isHeader className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Employee</TableCell>
                  <TableCell isHeader className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Email</TableCell>
                  <TableCell isHeader className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Position</TableCell>
                  <TableCell isHeader className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Department</TableCell>
                  <TableCell isHeader className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
                  <TableCell isHeader className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Join Date</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <AvatarText name={emp.name} className="h-8 w-8" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{emp.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{emp.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{emp.email}</TableCell>
                    <TableCell className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{emp.position}</TableCell>
                    <TableCell className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{emp.department}</TableCell>
                    <TableCell className="px-3 py-3">
                      <Badge size="sm" color={statusBadgeColor[emp.status] ?? 'light'}>
                        {emp.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm text-gray-600 dark:text-gray-300">{formatDate(emp.joinDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
          </div>
        ) : null}
      </ComponentCard>
    </div>
  );
}
