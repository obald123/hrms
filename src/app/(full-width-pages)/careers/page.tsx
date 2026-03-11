"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";
import { ApiClientError } from "@/lib/api-client";
import { atsService, type CareerJob } from "@/lib/services/ats";

export default function CareersPage() {
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const id = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const response = await atsService.listCareers({
          page: 1,
          limit: 100,
          ...(search ? { search } : {}),
          ...(location ? { location } : {})
        });
        setJobs(response.data);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError("Failed to load careers.");
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(id);
  }, [search, location]);

  return (
    <div className="space-y-6">
      <ComponentCard title="Careers" desc="Public job board from ATS module">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or keywords"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm"
          />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Filter by location"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm"
          />
        </div>
      </ComponentCard>

      <ComponentCard title="Open Roles">
        {loading ? <p className="text-sm text-gray-500">Loading careers...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {!loading && !error && jobs.length === 0 ? (
          <p className="text-sm text-gray-500">No jobs found.</p>
        ) : null}
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{job.title}</p>
              <p className="mt-1 text-xs text-gray-500">
                {job.department.name} / {job.position.title} / {job.location}
              </p>
              <Link href={`/careers/${job.id}`} className="mt-3 inline-flex text-xs text-brand-500 hover:text-brand-600">
                View details
              </Link>
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  );
}
