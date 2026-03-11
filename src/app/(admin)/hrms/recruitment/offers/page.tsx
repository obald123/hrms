"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";

interface Offer {
  id: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  department: string;
  offered_salary: string;
  offer_date: string;
  expiry_date: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "REVOKED";
  notes?: string;
}

const statusClasses: Record<Offer["status"], string> = {
  PENDING: "text-yellow-600 dark:text-yellow-400",
  ACCEPTED: "text-green-600 dark:text-green-400",
  REJECTED: "text-red-600 dark:text-red-400",
  EXPIRED: "text-gray-600 dark:text-gray-400",
  REVOKED: "text-orange-600 dark:text-orange-400"
};

const mockOffers: Offer[] = [
  {
    id: "1",
    candidate_name: "Ahmed Al-Rashid",
    candidate_email: "ahmed.rashid@email.com",
    job_title: "Senior Backend Engineer",
    department: "Engineering",
    offered_salary: "SAR 250,000 - 300,000 annually",
    offer_date: "2026-03-01",
    expiry_date: "2026-03-15",
    status: "PENDING",
    notes: "Awaiting candidate response"
  },
  {
    id: "2",
    candidate_name: "Sarah Mohammed",
    candidate_email: "sarah.m@email.com",
    job_title: "UX Designer",
    department: "Design",
    offered_salary: "SAR 180,000 - 220,000 annually",
    offer_date: "2026-02-28",
    expiry_date: "2026-03-14",
    status: "ACCEPTED",
    notes: "Accepted on 2026-03-05"
  },
  {
    id: "3",
    candidate_name: "Omar Abdullah",
    candidate_email: "omar.abdullah@email.com",
    job_title: "Frontend Developer",
    department: "Engineering",
    offered_salary: "SAR 200,000 - 240,000 annually",
    offer_date: "2026-02-25",
    expiry_date: "2026-03-11",
    status: "REJECTED",
    notes: "Candidate declined on 2026-03-02"
  },
  {
    id: "4",
    candidate_name: "Nora Abdullah",
    candidate_email: "nora.abdullah@email.com",
    job_title: "UX Designer",
    department: "Design",
    offered_salary: "SAR 185,000 - 225,000 annually",
    offer_date: "2026-02-20",
    expiry_date: "2026-03-06",
    status: "EXPIRED",
    notes: "No response received, offer expired"
  },
  {
    id: "5",
    candidate_name: "Layla Ibrahim",
    candidate_email: "layla.ibrahim@email.com",
    job_title: "Product Manager",
    department: "Product",
    offered_salary: "SAR 280,000 - 320,000 annually",
    offer_date: "2026-02-27",
    expiry_date: "2026-03-13",
    status: "PENDING",
    notes: "Under review by candidate"
  },
  {
    id: "6",
    candidate_name: "Khalid Saeed",
    candidate_email: "khalid.s@email.com",
    job_title: "DevOps Engineer",
    department: "Engineering",
    offered_salary: "SAR 240,000 - 280,000 annually",
    offer_date: "2026-02-22",
    expiry_date: "2026-03-08",
    status: "REVOKED",
    notes: "Position filled by another candidate"
  },
  {
    id: "7",
    candidate_name: "Maha Salem",
    candidate_email: "maha.salem@email.com",
    job_title: "Data Analyst",
    department: "Analytics",
    offered_salary: "SAR 160,000 - 200,000 annually",
    offer_date: "2026-03-03",
    expiry_date: "2026-03-17",
    status: "PENDING",
    notes: "Just sent to candidate"
  }
];

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "REVOKED">("ALL");

  const filtered = useMemo(() => {
    let result = offers;

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((offer) => offer.status === statusFilter);
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((offer) => {
        return (
          offer.candidate_name.toLowerCase().includes(q) ||
          offer.candidate_email.toLowerCase().includes(q) ||
          offer.job_title.toLowerCase().includes(q) ||
          offer.department.toLowerCase().includes(q)
        );
      });
    }

    return result.sort((a, b) => new Date(b.offer_date).getTime() - new Date(a.offer_date).getTime());
  }, [offers, search, statusFilter]);

  const handleResend = (id: string) => {
    alert(`Offer ${id} resent to candidate`);
  };

  const handleRevoke = (id: string) => {
    setOffers(offers.map((offer) => (offer.id === id ? { ...offer, status: "REVOKED" as const } : offer)));
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Job Offers" desc="Manage and track all job offers">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by candidate, job, or department"
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as any)}
            className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:text-white dark:bg-gray-900"
          >
            <option value="ALL">All Offers</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPIRED">Expired</option>
            <option value="REVOKED">Revoked</option>
          </select>
        </div>
      </ComponentCard>

      <ComponentCard title="Offer Records">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No offers found.</p>
        ) : (
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-medium">Candidate</th>
                  <th className="px-3 py-2 font-medium">Job</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Offered Salary</th>
                  <th className="px-3 py-2 font-medium">Offer Date</th>
                  <th className="px-3 py-2 font-medium">Expiry Date</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((offer) => (
                  <tr key={offer.id} className="border-b border-gray-100 text-sm">
                    <td className="px-3 py-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{offer.candidate_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{offer.candidate_email}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{offer.job_title}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{offer.department}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300 font-medium">{offer.offered_salary}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(offer.offer_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(offer.expiry_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold ${statusClasses[offer.status]}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/hrms/recruitment/offers/${offer.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        >
                          View
                        </Link>
                        {(offer.status === "PENDING" || offer.status === "REJECTED") && (
                          <div className="relative group">
                            <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                              Actions
                            </button>
                            <div className="absolute right-0 mt-1 w-32 rounded-lg border border-gray-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 dark:border-gray-600 dark:bg-gray-800">
                              <button
                                onClick={() => handleResend(offer.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                              >
                                Resend Offer
                              </button>
                              <button
                                onClick={() => handleRevoke(offer.id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                              >
                                Revoke
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>
    </div>
  );
}
