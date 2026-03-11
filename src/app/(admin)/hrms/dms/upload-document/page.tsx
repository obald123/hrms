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

type Document = {
  id: string;
  name: string;
  folder: string;
  type: string;
  size: number;
  uploadedBy: string;
  dateUploaded: string;
  status: "ACTIVE" | "PENDING" | "ARCHIVED";
};

const mockDocuments: Document[] = [
  {
    id: "D001",
    name: "Employee_Contract_Template.pdf",
    folder: "HR Documents / Contracts",
    type: "PDF",
    size: 2.5,
    uploadedBy: "HR Admin",
    dateUploaded: "2026-03-04",
    status: "ACTIVE",
  },
  {
    id: "D002",
    name: "Company_Policy_2026.docx",
    folder: "HR Documents / Policies",
    type: "DOCX",
    size: 1.8,
    uploadedBy: "HR Director",
    dateUploaded: "2026-03-03",
    status: "ACTIVE",
  },
  {
    id: "D003",
    name: "Payroll_March_2026.xlsx",
    folder: "Finance / Payroll",
    type: "XLSX",
    size: 3.2,
    uploadedBy: "Finance Manager",
    dateUploaded: "2026-03-02",
    status: "ACTIVE",
  },
  {
    id: "D004",
    name: "Budget_Q1_2026.pdf",
    folder: "Finance / Budgets",
    type: "PDF",
    size: 4.1,
    uploadedBy: "CFO",
    dateUploaded: "2026-03-01",
    status: "PENDING",
  },
  {
    id: "D005",
    name: "Compliance_Report_2025.pdf",
    folder: "Legal / Compliance",
    type: "PDF",
    size: 2.9,
    uploadedBy: "Legal Team",
    dateUploaded: "2026-02-28",
    status: "ARCHIVED",
  },
];

export default function Page() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    folder: "Root",
    type: "PDF",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const filteredDocuments = useMemo(() => {
    let result = documents;

    if (search.trim()) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.folder.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "ALL") {
      result = result.filter((d) => d.type === typeFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((d) => d.status === statusFilter);
    }

    return result;
  }, [documents, search, typeFilter, statusFilter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Auto-fill name from filename
      if (!formData.name) {
        setFormData({ ...formData, name: file.name });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    const newDocument: Document = {
      id: `D${String(documents.length + 1).padStart(3, "0")}`,
      name: formData.name,
      folder: formData.folder,
      type: formData.type,
      size: parseFloat((selectedFile.size / (1024 * 1024)).toFixed(2)),
      uploadedBy: "Current User",
      dateUploaded: new Date().toISOString().split("T")[0],
      status: "ACTIVE",
    };

    setDocuments([newDocument, ...documents]);
    setFormData({ name: "", folder: "Root", type: "PDF", description: "" });
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with Upload Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Document Upload
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload and manage documents
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            startIcon={<span>+</span>}
          >
            Upload Document
          </Button>
        </div>

        {/* Filters */}
        <ComponentCard title="Filter" desc="Search and filter documents">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <InputField
              type="text"
              placeholder="Search by document name, folder..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              options={[
                { value: "ALL", label: "All Types" },
                { value: "PDF", label: "PDF" },
                { value: "DOCX", label: "DOCX" },
                { value: "XLSX", label: "XLSX" },
              ]}
              placeholder="Select document type"
              defaultValue={typeFilter}
              onChange={(value) => setTypeFilter(value)}
            />
            <Select
              options={[
                { value: "ALL", label: "All Status" },
                { value: "ACTIVE", label: "Active" },
                { value: "PENDING", label: "Pending" },
                { value: "ARCHIVED", label: "Archived" },
              ]}
              placeholder="Select status"
              defaultValue={statusFilter}
              onChange={(value) => setStatusFilter(value)}
            />
          </div>
        </ComponentCard>

        {/* Documents Table */}
        <ComponentCard title="Uploaded Documents">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Document Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Folder
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Type
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Size
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Uploaded By
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow
                  key={doc.id}
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
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {doc.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {doc.folder}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {doc.type}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {doc.size} MB
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {doc.uploadedBy}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {doc.dateUploaded}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs">
                    <button 
                      onClick={() => handleViewDocument(doc)}
                      className="rounded-md bg-blue-50 px-3 py-1.5 font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      View Details
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ComponentCard>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showCloseButton={true}
        className="max-w-2xl p-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Upload Document
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Area */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select File *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    required
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center hover:border-blue-500 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-400 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      PDF, DOCX, XLSX (max 50MB)
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Document Name *
                </label>
                <InputField
                  type="text"
                  defaultValue={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter document name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Destination Folder *
                </label>
                <Select
                  options={[
                    { value: "Root", label: "Root" },
                    { value: "HR Documents / Contracts", label: "HR Documents / Contracts" },
                    { value: "HR Documents / Policies", label: "HR Documents / Policies" },
                    { value: "Finance / Payroll", label: "Finance / Payroll" },
                    { value: "Finance / Budgets", label: "Finance / Budgets" },
                    { value: "Legal / Compliance", label: "Legal / Compliance" },
                  ]}
                  defaultValue={formData.folder}
                  onChange={(value) =>
                    setFormData({ ...formData, folder: value })
                  }
                  placeholder="Select destination folder"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Document Type *
                </label>
                <Select
                  options={[
                    { value: "PDF", label: "PDF" },
                    { value: "DOCX", label: "DOCX" },
                    { value: "XLSX", label: "XLSX" },
                  ]}
                  defaultValue={formData.type}
                  onChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  placeholder="Select document type"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter document description"
                  rows={3}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                  Upload Document
                </button>
              </div>
            </form>
      </Modal>

      {/* View Document Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        showCloseButton={true}
        className="max-w-2xl p-6"
      >
        {selectedDocument && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Document Details
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Document ID
                  </label>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedDocument.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Status
                  </label>
                  <div>
                    {selectedDocument.status === "ACTIVE" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    )}
                    {selectedDocument.status === "PENDING" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Pending
                      </span>
                    )}
                    {selectedDocument.status === "ARCHIVED" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                        Archived
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Document Name
                </label>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedDocument.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Folder Location
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedDocument.folder}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Document Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDocument.type}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    File Size
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDocument.size} MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Uploaded By
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDocument.uploadedBy}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Upload Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDocument.dateUploaded}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <Button
                variant="primary"
                className="flex-1"
              >
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
