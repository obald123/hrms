"use client";

import { useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type FolderNode = {
  id: string;
  name: string;
  parentId: string | null;
  children?: FolderNode[];
};

type DocumentFile = {
  id: string;
  name: string;
  folderId: string;
  type: string;
  size: number;
  uploadedBy: string;
  dateUploaded: string;
  status: "ACTIVE" | "ARCHIVED";
};

const mockFolders: FolderNode[] = [
  { id: "root", name: "Root", parentId: null },
  { id: "hr", name: "HR Documents", parentId: "root" },
  { id: "finance", name: "Finance", parentId: "root" },
  { id: "legal", name: "Legal", parentId: "root" },
  { id: "contracts", name: "Contracts", parentId: "hr" },
  { id: "policies", name: "Policies", parentId: "hr" },
  { id: "payroll", name: "Payroll", parentId: "finance" },
  { id: "budgets", name: "Budgets", parentId: "finance" },
  { id: "compliance", name: "Compliance", parentId: "legal" },
];

const mockDocuments: DocumentFile[] = [
  {
    id: "D001",
    name: "Employee_Contract_Template.pdf",
    folderId: "contracts",
    type: "PDF",
    size: 2.5,
    uploadedBy: "HR Admin",
    dateUploaded: "2026-03-04",
    status: "ACTIVE",
  },
  {
    id: "D002",
    name: "Company_Policy_2026.docx",
    folderId: "policies",
    type: "DOCX",
    size: 1.8,
    uploadedBy: "HR Director",
    dateUploaded: "2026-03-03",
    status: "ACTIVE",
  },
  {
    id: "D003",
    name: "Payroll_March_2026.xlsx",
    folderId: "payroll",
    type: "XLSX",
    size: 3.2,
    uploadedBy: "Finance Manager",
    dateUploaded: "2026-03-02",
    status: "ACTIVE",
  },
  {
    id: "D004",
    name: "Q1_Budget_Report.pdf",
    folderId: "budgets",
    type: "PDF",
    size: 4.1,
    uploadedBy: "CFO",
    dateUploaded: "2026-03-01",
    status: "ACTIVE",
  },
  {
    id: "D005",
    name: "Data_Protection_Policy.pdf",
    folderId: "compliance",
    type: "PDF",
    size: 2.9,
    uploadedBy: "Legal Team",
    dateUploaded: "2026-02-28",
    status: "ACTIVE",
  },
  {
    id: "D006",
    name: "Employment_Agreement_Jean.pdf",
    folderId: "contracts",
    type: "PDF",
    size: 1.5,
    uploadedBy: "HR Admin",
    dateUploaded: "2026-02-25",
    status: "ACTIVE",
  },
  {
    id: "D007",
    name: "Tax_Compliance_2025.pdf",
    folderId: "compliance",
    type: "PDF",
    size: 5.2,
    uploadedBy: "Legal Team",
    dateUploaded: "2026-02-20",
    status: "ARCHIVED",
  },
];

export default function Page() {
  const [selectedFolder, setSelectedFolder] = useState<string>("root");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["root", "hr", "finance", "legal"])
  );
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Build folder tree
  const folderTree = useMemo(() => {
    const folderMap = new Map<string, FolderNode>();
    mockFolders.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    const tree: FolderNode[] = [];
    folderMap.forEach((folder) => {
      if (folder.parentId === null) {
        tree.push(folder);
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children!.push(folder);
        }
      }
    });

    return tree;
  }, []);

  // Get current folder name
  const currentFolderName = useMemo(() => {
    const folder = mockFolders.find((f) => f.id === selectedFolder);
    return folder?.name || "Root";
  }, [selectedFolder]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    let result = mockDocuments.filter((doc) => doc.folderId === selectedFolder);

    if (search.trim()) {
      result = result.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "ALL") {
      result = result.filter((doc) => doc.type === typeFilter);
    }

    return result;
  }, [selectedFolder, search, typeFilter]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFolderTree = (folders: FolderNode[], level: number = 0) => {
    return folders.map((folder) => {
      const hasChildren = folder.children && folder.children.length > 0;
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = selectedFolder === folder.id;

      return (
        <div key={folder.id}>
          <div
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm cursor-pointer transition-colors ${
              isSelected
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
            onClick={() => setSelectedFolder(folder.id)}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
                className="flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
            {!hasChildren && <span className="w-4" />}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 flex-shrink-0"
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
            <span className="truncate font-medium">{folder.name}</span>
          </div>
          {hasChildren && isExpanded && (
            <div>{renderFolderTree(folder.children!, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const getFileIcon = (type: string) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
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
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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
          <span className="font-semibold text-gray-900 dark:text-white">
            Current Folder: {currentFolderName}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Folder Tree - Left Sidebar */}
        <div className="lg:col-span-1">
          <ComponentCard title="Folders" desc="Browse folder structure">
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {renderFolderTree(folderTree)}
            </div>
          </ComponentCard>
        </div>

        {/* Document List - Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <ComponentCard title="Filter Documents" desc="Search and filter files">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                type="text"
                placeholder="Search by document name..."
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
                defaultValue={typeFilter}
                onChange={(value) => setTypeFilter(value)}
                placeholder="Select document type"
              />
            </div>
          </ComponentCard>

          {/* Document List */}
          <ComponentCard title="Documents">
            {filteredDocuments.length === 0 ? (
              <div className="py-12 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  No documents in this folder
                </p>
              </div>
            ) : (
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
                          {getFileIcon(doc.type)}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {doc.name}
                          </span>
                        </div>
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
                      <TableCell className="px-3 py-3 text-xs flex gap-2">
                        <button className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                          View
                        </button>
                        <button className="rounded-md bg-green-50 px-2 py-1 font-medium text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30">
                          Download
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
