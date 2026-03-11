'use client';

import { useState } from 'react';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  avatar?: string;
  reports?: Employee[];
}

const orgData: Employee = {
  id: 'CEO-001',
  name: 'Sarah Johnson',
  position: 'Chief Executive Officer',
  department: 'Executive',
  email: 'sarah.johnson@company.com',
  reports: [
    {
      id: 'CTO-001',
      name: 'Michael Chen',
      position: 'Chief Technology Officer',
      department: 'Technology',
      email: 'michael.chen@company.com'
    },
    {
      id: 'CFO-001',
      name: 'Robert Taylor',
      position: 'Chief Financial Officer',
      department: 'Finance',
      email: 'robert.taylor@company.com'
    },
    {
      id: 'CMO-001',
      name: 'Amanda White',
      position: 'Chief Marketing Officer',
      department: 'Marketing',
      email: 'amanda.white@company.com'
    }
  ]
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getAvatarColor = (id: string) => {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
  ];
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const departmentColors: Record<string, string> = {
  'Executive': 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20',
  'Technology': 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
  'Engineering': 'border-cyan-200 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-900/20',
  'Quality Assurance': 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20',
  'Finance': 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20',
  'Marketing': 'border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/20',
};

interface EmployeeCardProps {
  employee: Employee;
  level: number;
}

function EmployeeCard({ employee, level }: EmployeeCardProps) {
  const [expanded, setExpanded] = useState(true);
  const hasReports = employee.reports && employee.reports.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Employee Card */}
      <div 
        className={`group relative rounded-xl border-2 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-64 ${departmentColors[employee.department] || 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'}`}
      >
        <div className="p-4">
          {/* Avatar and Info */}
          <div className="flex items-start gap-3">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white font-bold text-sm shadow-md ${getAvatarColor(employee.id)}`}>
              {getInitials(employee.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {employee.name}
              </h3>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
                {employee.position}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {employee.department}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${employee.email}`} className="text-xs text-blue-600 hover:underline truncate dark:text-blue-400">
                {employee.email}
              </a>
            </div>
          </div>

          {/* Reports Count Badge */}
          {hasReports && (
            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {employee.reports!.length} {employee.reports!.length === 1 ? 'Report' : 'Reports'}
              </span>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                <svg 
                  className={`w-3 h-3 text-gray-600 dark:text-gray-300 transition-transform ${expanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vertical Line to Reports */}
      {hasReports && expanded && (
        <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
      )}

      {/* Reports */}
      {hasReports && expanded && (
        <div className="relative">
          {/* Horizontal Line */}
          {employee.reports!.length > 1 && (
            <div className="absolute left-1/2 top-0 w-full h-0.5 bg-gray-300 dark:bg-gray-600 -translate-x-1/2"></div>
          )}
          
          {/* Reports Grid */}
          <div className={`flex gap-8 mt-0 ${employee.reports!.length === 1 ? '' : 'pt-8'}`}>
            {employee.reports!.map((report, index) => (
              <div key={report.id} className="relative">
                {/* Vertical line connecting to horizontal line */}
                {employee.reports!.length > 1 && (
                  <div className="absolute left-1/2 -top-8 w-0.5 h-8 bg-gray-300 dark:bg-gray-600 -translate-x-1/2"></div>
                )}
                <EmployeeCard employee={report} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrgChartPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6 flex items-center justify-center">
      {/* Organization Chart */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-default dark:border-gray-700 dark:bg-gray-800 p-8">
        <div className="flex items-center justify-center">
          <EmployeeCard employee={orgData} level={0} />
        </div>
      </div>
    </div>
  );
}
