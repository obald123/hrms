'use client';

import { useMemo, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import AvatarText from '@/components/ui/avatar/AvatarText';
import {
  PlusIcon,
  TaskIcon
} from '@/icons';

type TimelineStatus = 'planned' | 'ongoing' | 'completed';
type TimelineFilter = 'all' | TimelineStatus;

interface TimelineEvent {
  id: number;
  title: string;
  summary: string;
  date: string;
  time: string;
  department: string;
  owner: string;
  attendees: number;
  status: TimelineStatus;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    title: 'Policy refresh kickoff',
    summary: 'Start FY26 leave and attendance policy review with cross-functional leads.',
    date: '2026-03-05',
    time: '09:30 AM',
    department: 'Compliance',
    owner: 'Ava Wilson',
    attendees: 14,
    status: 'planned'
  },
  {
    id: 2,
    title: 'Q2 hiring alignment meeting',
    summary: 'Finalize hiring slots and interview windows with department managers.',
    date: '2026-03-07',
    time: '11:00 AM',
    department: 'Recruitment',
    owner: 'Sarah Johnson',
    attendees: 10,
    status: 'planned'
  },
  {
    id: 3,
    title: 'HRMS security training rollout',
    summary: 'Deploy mandatory cybersecurity training and monitor completion rates.',
    date: '2026-03-09',
    time: '02:00 PM',
    department: 'Technology',
    owner: 'Noah Brown',
    attendees: 220,
    status: 'ongoing'
  },
  {
    id: 4,
    title: 'Performance cycle calibration',
    summary: 'Review manager ratings and calibrate score distribution for fairness.',
    date: '2026-03-10',
    time: '03:30 PM',
    department: 'Performance',
    owner: 'Emma Davis',
    attendees: 18,
    status: 'ongoing'
  },
  {
    id: 5,
    title: 'Attendance audit closure',
    summary: 'Close February attendance anomalies and publish final reconciliation notes.',
    date: '2026-03-02',
    time: '04:00 PM',
    department: 'Attendance',
    owner: 'Ethan Clark',
    attendees: 8,
    status: 'completed'
  },
  {
    id: 6,
    title: 'Payroll communication release',
    summary: 'Share revised payroll timeline and reimbursement cut-off reminders.',
    date: '2026-03-03',
    time: '10:15 AM',
    department: 'Payroll',
    owner: 'Olivia Jones',
    attendees: 120,
    status: 'completed'
  }
];

const filterOrder: TimelineFilter[] = ['all', 'planned', 'ongoing', 'completed'];

const filterLabel: Record<TimelineFilter, string> = {
  all: 'All',
  planned: 'Planned',
  ongoing: 'Ongoing',
  completed: 'Completed'
};

const statusConfig: Record<
  TimelineStatus,
  { label: string; badgeColor: 'info' | 'warning' | 'success'; dotClass: string }
> = {
  planned: {
    label: 'Planned',
    badgeColor: 'info',
    dotClass: 'border-blue-light-500 bg-blue-light-400'
  },
  ongoing: {
    label: 'Ongoing',
    badgeColor: 'warning',
    dotClass: 'border-warning-500 bg-warning-400'
  },
  completed: {
    label: 'Completed',
    badgeColor: 'success',
    dotClass: 'border-success-500 bg-success-400'
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

export default function CompanyTimelinePage() {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>('all');

  const counts = useMemo(
    () => ({
      all: timelineEvents.length,
      planned: timelineEvents.filter((event) => event.status === 'planned').length,
      ongoing: timelineEvents.filter((event) => event.status === 'ongoing').length,
      completed: timelineEvents.filter((event) => event.status === 'completed').length
    }),
    []
  );

  const visibleEvents = useMemo(
    () =>
      (activeFilter === 'all'
        ? timelineEvents
        : timelineEvents.filter((event) => event.status === activeFilter)
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [activeFilter]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Company Timeline" />
        <Button
          size="sm"
          variant="primary"
          className="!rounded-lg !px-3 !py-2 !text-xs"
          startIcon={<PlusIcon className="size-4" />}
        >
          Add Event
        </Button>
      </div>

      <ComponentCard
        title="Timeline Filters"
        desc="Switch between planned, ongoing, and completed company events"
      >
        <div className="flex flex-wrap gap-2">
          {filterOrder.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                activeFilter === filter
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]'
              }`}
            >
              {filterLabel[filter]}
              <span
                className={`inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                  activeFilter === filter
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {counts[filter]}
              </span>
            </button>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Event Timeline"
        desc="Manage and track all company events"
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          {visibleEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-10">
              <div className="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <TaskIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">No events found</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Try adjusting your filter to see more events</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {visibleEvents.map((event, idx) => (
                <article
                  key={event.id}
                  className="bg-white p-4 transition-colors duration-200 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/70"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start">
                    {/* Timeline Dot */}
                    <div className="flex w-5 flex-shrink-0 flex-col items-center pt-1">
                      <div className={`h-3 w-3 rounded-full border-2 ${statusConfig[event.status].dotClass}`} />
                      {idx < visibleEvents.length - 1 && (
                        <div className="mt-2 h-14 w-px bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge size="sm" color={statusConfig[event.status].badgeColor}>
                              {statusConfig[event.status].label}
                            </Badge>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{formatDate(event.date)}</span>
                          </div>
                          <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                        </div>

                        <span className="w-fit rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-700/60 dark:text-gray-400">
                          #{event.id}
                        </span>
                      </div>

                      <p className="mb-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{event.summary}</p>

                      {/* Meta Row */}
                      <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400 sm:grid-cols-4">
                        <p><span className="font-medium">Time:</span> {event.time}</p>
                        <p><span className="font-medium">Dept:</span> {event.department}</p>
                        <p><span className="font-medium">Attendees:</span> {event.attendees}</p>
                        <p><span className="font-medium">Status:</span> {statusConfig[event.status].label}</p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <AvatarText name={event.owner} className="h-7 w-7" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{event.owner}</span>
                        </div>
                        <Badge size="sm" color={event.status === 'completed' ? 'success' : 'warning'}>
                          {event.status === 'completed' ? 'Closed' : 'In Progress'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </ComponentCard>
    </div>
  );
}
