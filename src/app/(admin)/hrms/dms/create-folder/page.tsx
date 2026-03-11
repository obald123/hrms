"use client";

import { useEffect, useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal/index";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table/index";
import InputField from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";

type Folder = {
  id: string;
  name: string;
  parentFolder: string;
  description: string;
  createdBy: string;
  dateCreated: string;
  status: "ACTIVE" | "ARCHIVED";
};

const mockFolders: Folder[] = [
  {
    id: "F001",
    name: "HR Documents",
    parentFolder: "Root",
    description: "All HR related documents",
    createdBy: "Admin",
    dateCreated: "2026-01-15",
    status: "ACTIVE",
  },
  {
    id: "F002",
    name: "Finance",
    parentFolder: "Root",
    description: "Financial documents and reports",
    createdBy: "CFO",
    dateCreated: "2026-01-20",
    status: "ACTIVE",
  },
  {
    id: "F003",
    name: "Contracts",
    parentFolder: "HR Documents",
    description: "Employee contracts and agreements",
    createdBy: "HR Manager",
    dateCreated: "2026-02-01",
    status: "ACTIVE",
  },
  {
    id: "F004",
    name: "Payroll",
    parentFolder: "Finance",
    description: "Monthly payroll documents",
    createdBy: "Finance Manager",
    dateCreated: "2026-02-10",
    status: "ACTIVE",
  },
  {
    id: "F005",
    name: "Old Records",
    parentFolder: "Root",
    description: "Archived documents from 2024",
    createdBy: "Admin",
    dateCreated: "2025-12-01",
    status: "ARCHIVED",
  },
];

export default function Page() {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    parentFolder: "Root",
    description: "",
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const filteredFolders = useMemo(() => {
    let result = folders;

    if (search.trim()) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((f) => f.status === statusFilter);
    }

    return result;
  }, [folders, search, statusFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFolder: Folder = {
      id: `F${String(folders.length + 1).padStart(3, "0")}`,
      name: formData.name,
      parentFolder: formData.parentFolder,
      description: formData.description,
      createdBy: "Current User",
      dateCreated: new Date().toISOString().split("T")[0],
      status: "ACTIVE",
    };

    setFolders([newFolder, ...folders]);
    setFormData({ name: "", parentFolder: "Root", description: "" });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setFolders(folders.filter((f) => f.id !== id));
  };

  const handleArchive = (id: string) => {
    setFolders(
      folders.map((f) =>
        f.id === id ? { ...f, status: "ARCHIVED" as const } : f
      )
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Folder Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create and manage document folders
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            startIcon={<span>+</span>}
          >
            Create Folder
          </Button>
        </div>

        {/* Filters */}
        <ComponentCard title="Filter" desc="Search and filter folders">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <InputField
              type="text"
              placeholder="Search by folder name, description..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              options={[
                { value: "ALL", label: "All Status" },
                { value: "ACTIVE", label: "Active" },
                { value: "ARCHIVED", label: "Archived" },
              ]}
              defaultValue={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              placeholder="Select status"
            />
          </div>
        </ComponentCard>

        {/* Folders Table */}
        <ComponentCard title="All Folders">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Folder Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Parent Folder
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Created By
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Date
                </TableCell>
                
                
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFolders.map((folder) => (
                <TableRow
                  key={folder.id}
                  className="border-b border-gray-100 dark:border-gray-700/50"
                >
                  <TableCell className="px-3 py-3 text-xs">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {folder.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {folder.parentFolder}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {folder.description}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {folder.createdBy}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {folder.dateCreated}
                  </TableCell>
                  
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ComponentCard>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showCloseButton={true}
        className="max-w-lg p-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Folder
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Folder Name *
            </label>
            <InputField
              type="text"
              defaultValue={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter folder name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Parent Folder *
            </label>
            <Select
              options={[
                { value: "Root", label: "Root" },
                ...folders
                  .filter((f) => f.status === "ACTIVE")
                  .map((f) => ({ value: f.name, label: f.name })),
              ]}
              defaultValue={formData.parentFolder}
              onChange={(value) =>
                setFormData({ ...formData, parentFolder: value })
              }
              placeholder="Select parent folder"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <TextArea
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
              placeholder="Enter folder description"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            >
              Create Folder
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
