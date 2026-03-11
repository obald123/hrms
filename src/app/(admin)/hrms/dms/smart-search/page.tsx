"use client";

import { useState, useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";

interface SearchResult {
  id: string;
  title: string;
  type: "document" | "email" | "contract" | "policy";
  sender: string;
  department: string;
  date: string;
  preview: string;
  relevance: number;
}

const mockSearchResults: SearchResult[] = [
  {
    id: "sr-001",
    title: "Employee Handbook 2026 Update",
    type: "document",
    sender: "HR Manager",
    department: "Human Resources",
    date: "2026-03-04",
    preview: "Annual handbook update with new policies and procedures",
    relevance: 95,
  },
  {
    id: "sr-002",
    title: "Compensation Policy Review",
    type: "policy",
    sender: "Finance Lead",
    department: "Finance",
    date: "2026-03-03",
    preview: "Updated compensation structure and salary adjustments",
    relevance: 85,
  },
  {
    id: "sr-003",
    title: "Remote Work Guidelines",
    type: "document",
    sender: "Operations Manager",
    department: "Operations",
    date: "2026-03-02",
    preview: "New remote work policy with security protocols",
    relevance: 75,
  },
  {
    id: "sr-004",
    title: "Travel Expense Policy",
    type: "policy",
    sender: "Finance Manager",
    department: "Finance",
    date: "2026-03-01",
    preview: "Updated travel reimbursement rates and procedures",
    relevance: 70,
  },
  {
    id: "sr-005",
    title: "Q1 Training Schedule",
    type: "document",
    sender: "HR Director",
    department: "Human Resources",
    date: "2026-02-28",
    preview: "Q1 employee training programs and workshops",
    relevance: 65,
  },
  {
    id: "sr-006",
    title: "Health & Safety Protocol",
    type: "policy",
    sender: "Compliance Officer",
    department: "Compliance",
    date: "2026-02-25",
    preview: "Updated health and safety requirements for all staff",
    relevance: 60,
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "document":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    case "email":
      return "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    case "contract":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    case "policy":
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export default function SmartSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"relevance" | "date">("relevance");

  const filteredResults = useMemo(() => {
    let results = mockSearchResults.filter((result) => {
      const matchesSearch =
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !selectedType || result.type === selectedType;

      return matchesSearch && matchesType;
    });

    if (sortBy === "relevance") {
      results.sort((a, b) => b.relevance - a.relevance);
    } else {
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return results;
  }, [searchTerm, selectedType, sortBy]);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <ComponentCard title="Search Documents" desc="Find documents by keyword, type, or department">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by title, content, sender, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 outline-none dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-500 dark:text-white"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-3 py-1 text-sm rounded-full font-medium transition ${
                  selectedType === null
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                All Types
              </button>
              {["document", "contract", "policy", "email"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 text-sm rounded-full font-medium transition capitalize ${
                    selectedType === type
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "relevance" | "date")}
              className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>
      </ComponentCard>

      {/* Search Results */}
      <ComponentCard title="Search Results" desc={`Found ${filteredResults.length} result${filteredResults.length !== 1 ? "s" : ""}`}>
        {filteredResults.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No results found. Try adjusting your search terms.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="rounded-lg border border-gray-200 p-4 hover:border-brand-500 hover:bg-brand-50 transition dark:border-gray-700 dark:hover:bg-brand-900/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {result.preview}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>By {result.sender}</span>
                      <span>{result.department}</span>
                      <span>{new Date(result.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
                        {result.relevance}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Relevance
                      </p>
                    </div>
                    <button className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ComponentCard>
    </div>
  );
}
