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

type DocumentVersion = {
  id: string;
  documentName: string;
  versionNumber: number;
  fileSize: number;
  uploadedBy: string;
  dateUploaded: string;
  description: string;
  isCurrent: boolean;
};

type DocumentFile = {
  id: string;
  name: string;
  currentVersion: number;
  totalVersions: number;
  lastUpdated: string;
  lastUpdatedBy: string;
};

const mockDocuments: DocumentFile[] = [
  {
    id: "D001",
    name: "Employee_Contract_Template.pdf",
    currentVersion: 3,
    totalVersions: 3,
    lastUpdated: "2026-03-04",
    lastUpdatedBy: "HR Admin",
  },
  {
    id: "D002",
    name: "Company_Policy_2026.docx",
    currentVersion: 2,
    totalVersions: 2,
    lastUpdated: "2026-03-03",
    lastUpdatedBy: "HR Director",
  },
  {
    id: "D003",
    name: "Payroll_March_2026.xlsx",
    currentVersion: 1,
    totalVersions: 1,
    lastUpdated: "2026-03-02",
    lastUpdatedBy: "Finance Manager",
  },
];

const mockVersions: DocumentVersion[] = [
  {
    id: "V001",
    documentName: "Employee_Contract_Template.pdf",
    versionNumber: 3,
    fileSize: 2.7,
    uploadedBy: "HR Admin",
    dateUploaded: "2026-03-04",
    description: "Updated terms and conditions",
    isCurrent: true,
  },
  {
    id: "V002",
    documentName: "Employee_Contract_Template.pdf",
    versionNumber: 2,
    fileSize: 2.5,
    uploadedBy: "HR Director",
    dateUploaded: "2026-03-01",
    description: "Added signature block",
    isCurrent: false,
  },
  {
    id: "V003",
    documentName: "Employee_Contract_Template.pdf",
    versionNumber: 1,
    fileSize: 2.2,
    uploadedBy: "HR Admin",
    dateUploaded: "2026-02-25",
    description: "Initial template",
    isCurrent: false,
  },
  {
    id: "V004",
    documentName: "Company_Policy_2026.docx",
    versionNumber: 2,
    fileSize: 1.9,
    uploadedBy: "HR Director",
    dateUploaded: "2026-03-03",
    description: "Updated remote work policy",
    isCurrent: true,
  },
  {
    id: "V005",
    documentName: "Company_Policy_2026.docx",
    versionNumber: 1,
    fileSize: 1.8,
    uploadedBy: "HR Admin",
    dateUploaded: "2026-02-28",
    description: "Initial version",
    isCurrent: false,
  },
];

export default function Page() {
  const [documents, setDocuments] = useState<DocumentFile[]>(mockDocuments);
  const [versions, setVersions] = useState<DocumentVersion[]>(mockVersions);
  const [selectedDocument, setSelectedDocument] = useState<string>(mockDocuments[0].id);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isUploadModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isUploadModalOpen]);

  const currentDocument = useMemo(
    () => documents.find((d) => d.id === selectedDocument),
    [documents, selectedDocument]
  );

  const filteredVersions = useMemo(() => {
    let result = versions.filter((v) =>
      selectedDocument ? v.documentName === currentDocument?.name : true
    );

    if (search.trim()) {
      result = result.filter((v) =>
        v.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result.sort((a, b) => b.versionNumber - a.versionNumber);
  }, [versions, selectedDocument, currentDocument, search]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadNewVersion = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !currentDocument) {
      alert("Please select a file and document");
      return;
    }

    const nextVersion = currentDocument.currentVersion + 1;

    const newVersion: DocumentVersion = {
      id: `V${String(versions.length + 1).padStart(3, "0")}`,
      documentName: currentDocument.name,
      versionNumber: nextVersion,
      fileSize: parseFloat((selectedFile.size / (1024 * 1024)).toFixed(2)),
      uploadedBy: "Current User",
      dateUploaded: new Date().toISOString().split("T")[0],
      description: uploadDescription,
      isCurrent: true,
    };

    // Update previous versions to not current
    const updatedVersions = versions.map((v) =>
      v.documentName === currentDocument.name
        ? { ...v, isCurrent: false }
        : v
    );
    updatedVersions.push(newVersion);

    // Update document
    const updatedDocuments = documents.map((d) =>
      d.id === selectedDocument
        ? {
            ...d,
            currentVersion: nextVersion,
            totalVersions: nextVersion,
            lastUpdated: new Date().toISOString().split("T")[0],
            lastUpdatedBy: "Current User",
          }
        : d
    );

    setVersions(updatedVersions);
    setDocuments(updatedDocuments);
    setSelectedFile(null);
    setUploadDescription("");
    setIsUploadModalOpen(false);
  };

  const handleRollback = (versionId: string) => {
    const versionToRollback = versions.find((v) => v.id === versionId);
    if (!versionToRollback) return;

    // Mark all versions of this document as not current
    const updatedVersions = versions.map((v) =>
      v.documentName === versionToRollback.documentName
        ? { ...v, isCurrent: v.id === versionId }
        : v
    );

    // Update document to use this version
    const updatedDocuments = documents.map((d) =>
      d.name === versionToRollback.documentName
        ? {
            ...d,
            currentVersion: versionToRollback.versionNumber,
            lastUpdated: new Date().toISOString().split("T")[0],
            lastUpdatedBy: "Current User",
          }
        : d
    );

    setVersions(updatedVersions);
    setDocuments(updatedDocuments);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Version Control
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage document versions and rollback
            </p>
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            variant="primary"
            startIcon={<span>+</span>}
          >
            Upload New Version
          </Button>
        </div>

        {/* Document Selection */}
        <ComponentCard title="Select Document" desc="Choose a document to view its versions">
          <Select
            options={documents.map((doc) => ({
              value: doc.id,
              label: `${doc.name} (v${doc.currentVersion})`,
            }))}
            defaultValue={selectedDocument}
            onChange={(value) => setSelectedDocument(value)}
            placeholder="Select a document"
          />
        </ComponentCard>

        {/* Current Version Info */}
        {currentDocument && (
          <ComponentCard title="Current Version" desc="Active version information">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Version Number</p>
                <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                  v{currentDocument.currentVersion}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Versions</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {currentDocument.totalVersions}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {currentDocument.lastUpdated}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Updated By</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {currentDocument.lastUpdatedBy}
                </p>
              </div>
            </div>
          </ComponentCard>
        )}

        {/* Version History Filter */}
        <ComponentCard title="Filter" desc="Search version history">
          <InputField
            type="text"
            placeholder="Search by description..."
            defaultValue={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </ComponentCard>

        {/* Version History Table */}
        <ComponentCard title="Version History">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Version
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  File Size
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
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Status
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
              {filteredVersions.map((version) => (
                <TableRow
                  key={version.id}
                  className={`border-b border-gray-100 dark:border-gray-700/50 ${
                    version.isCurrent ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <TableCell className="px-3 py-3 text-xs">
                    <span className="rounded-full bg-gray-100 px-3 py-1 font-bold text-gray-900 dark:bg-gray-800 dark:text-white">
                      v{version.versionNumber}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {version.fileSize} MB
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {version.uploadedBy}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {version.dateUploaded}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {version.description}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs">
                    {version.isCurrent ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-green-700 font-semibold dark:bg-green-900/30 dark:text-green-400">
                        Current
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 font-semibold dark:bg-gray-800 dark:text-gray-400">
                        Archived
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs flex gap-2">
                    <button className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                      Download
                    </button>
                    <button className="rounded-md bg-gray-50 px-2 py-1 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                      Preview
                    </button>
                    {!version.isCurrent && (
                      <button
                        onClick={() => handleRollback(version.id)}
                        className="rounded-md bg-orange-50 px-2 py-1 font-medium text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
                      >
                        Rollback
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ComponentCard>
      </div>

      {/* Upload New Version Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        showCloseButton={true}
        className="max-w-2xl p-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Upload New Version
          </h2>
        </div>

        <form onSubmit={handleUploadNewVersion} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Document *
            </label>
            <Select
              options={documents.map((doc) => ({
                value: doc.id,
                label: `${doc.name} (Current: v${doc.currentVersion})`,
              }))}
              defaultValue={selectedDocument}
              onChange={(value) => setSelectedDocument(value)}
              placeholder="Select a document"
              className="opacity-60 pointer-events-none"
            />
          </div>

          {/* File Upload Area */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select New Version File *
            </label>
            <div className="relative">
              <input
                type="file"
                required
                onChange={handleFileChange}
                className="hidden"
                id="version-file-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
              <label
                htmlFor="version-file-upload"
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
              Change Description *
            </label>
            <TextArea
              value={uploadDescription}
              onChange={(value) => setUploadDescription(value)}
              placeholder="Describe the changes in this version"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            >
              Upload New Version
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
