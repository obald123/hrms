'use client';

import { useState, useMemo, useEffect } from 'react';
import { employeesService } from '@/lib/services/employees';
import { ApiClientError } from '@/lib/api-client';
import type { Employee as ApiEmployee } from '@/lib/services/employees';
import ComponentCard from '@/components/common/ComponentCard';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: string;
  joinDate: string;
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
    joinDate: employee.hire_date,
  };
};

const statusColors: Record<string, { bg: string; text: string }> = {
  'PROBATION': { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400' },
  'CONFIRMED': { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400' },
  'SUSPENDED': { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400' },
  'RESIGNED': { bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-700 dark:text-gray-400' },
  'TERMINATED': { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400' }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function EmployeeGridPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
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
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || emp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, employees]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      PROBATION: 0,
      CONFIRMED: 0,
      SUSPENDED: 0,
      RESIGNED: 0,
      TERMINATED: 0,
    };
    
    employees.forEach(emp => {
      if (counts[emp.status] !== undefined) {
        counts[emp.status]++;
      }
    });
    
    return counts;
  }, [employees]);



  return (
    <div className="space-y-6">
      {/* Search and Filter Card */}
      <ComponentCard title="Employee Directory" desc="Browse and manage all employees">
        <div className="space-y-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by name, email, position or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />

          {/* Status Filter Tabs */}
          <div>
            <div className="flex items-center gap-4 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setStatusFilter(null)}
                className={`flex-shrink-0 px-1 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                  statusFilter === null
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                All <span className="ml-1.5 opacity-75">({employees.length})</span>
              </button>
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-shrink-0 px-1 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                    statusFilter === status
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                      : `border-transparent hover:text-gray-800 dark:hover:text-gray-200 ${statusColors[status]?.text || 'text-gray-600 dark:text-gray-400'}`
                  }`}
                >
                  {status} <span className="ml-1.5 opacity-75">({count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Loading State */}
      {isLoading && (
        <ComponentCard title="Loading">
          <div className="flex items-center justify-center gap-3 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading employees...</span>
          </div>
        </ComponentCard>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <ComponentCard title="Error">
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
          </div>
        </ComponentCard>
      )}

      {/* Employee Grid */}
      {!isLoading && !error && filteredEmployees.length === 0 && (
        <ComponentCard title="No Results">
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">No employees found matching your criteria.</p>
        </ComponentCard>
      )}

      {!isLoading && !error && filteredEmployees.length > 0 && (
        <>
          {/* Results summary */}
          {(searchTerm || statusFilter) && (
            <div className="rounded-lg bg-blue-50 px-4 py-2 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Found <span className="font-semibold">{filteredEmployees.length}</span> employee{filteredEmployees.length !== 1 ? 's' : ''} 
                {searchTerm && <> matching "<span className="font-semibold">{searchTerm}</span>"</>}
                {statusFilter && <> with status <span className="font-semibold">{statusFilter}</span></>}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03]"
            >
              {/* Card Content */}
              <div className="p-6">
                {/* Avatar and Name */}
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-base font-bold text-white">
                    {getInitials(emp.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{emp.position}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusColors[emp.status]?.bg || ''} ${statusColors[emp.status]?.text || ''}`}>
                    {emp.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2.5 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Department</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100 truncate ml-2">{emp.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Join Date</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {new Date(emp.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-800 my-3"></div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <a
                    href={`mailto:${emp.email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400 truncate"
                  >
                    <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="truncate">{emp.email}</span>
                  </a>
                  {emp.phone && (
                    <a
                      href={`tel:${emp.phone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                    >
                      <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {emp.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
