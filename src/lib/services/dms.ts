import { apiClient } from '@/lib/api-client';

const normalizeExpiryDate = (value?: string) => {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00.000Z`).toISOString();
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
};

export interface DmsFolderNode {
  id: string;
  name: string;
  parent_id: string | null;
  children: DmsFolderNode[];
}

export interface DmsSearchItem {
  id: string;
  folder_id: string;
  name: string;
  description: string | null;
  document_type: string;
  status: string;
  expiry_date: string | null;
  created_at: string;
  updated_at: string;
  version_number: number | null;
  ai_classification: string | null;
}

export interface DmsDocumentDetail {
  id: string;
  folder_id: string;
  name: string;
  description: string | null;
  document_type: string;
  status: string;
  expiry_date: string | null;
  current_version: {
    id: string;
    version_number: number;
    storage_key: string;
    mime_type: string;
    created_at: string;
  } | null;
  approvals: Array<{
    id: string;
    assigned_to_user_id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    comment: string | null;
    decided_at: string | null;
    created_at: string;
  }>;
}

const ALL_DOCUMENT_TOKENS = [
  'document',
  'policy',
  'procedure',
  'report',
  'contract',
  'invoice',
  'memo',
  'file',
  'record',
  'test',
  'string',
  'api',
  'zidane',
];

export const dmsService = {
  createFolder: (payload: { name: string; parent_id?: string }) => apiClient.post<{ id: string; name: string; parent_id: string | null; created_at: string; updated_at: string }>(`/api/folders`, payload),

  getFolderTree: () => apiClient.get<DmsFolderNode[]>(`/api/folders/tree`),

  createDocument: (payload: {
    folder_id: string;
    name: string;
    description?: string;
    document_type: string;
    expiry_date?: string;
    approval_user_ids?: string[];
  }) =>
    apiClient.post<{ id: string; name: string; status: string; folder_id: string }>(`/api/documents`, {
      ...payload,
      ...(payload.expiry_date ? { expiry_date: normalizeExpiryDate(payload.expiry_date) } : {}),
    }),

  uploadDocumentVersion: (documentId: string, payload: { file_name: string; file_base64: string; mime_type: string }) =>
    apiClient.post<{ id: string; version_number: number; created_at: string }>(`/api/documents/${documentId}/upload`, payload),

  rollbackVersion: (documentId: string, versionId: string) =>
    apiClient.post<{ id: string; current_version_id: string | null; status: string }>(`/api/documents/${documentId}/rollback/${versionId}`),

  searchDocuments: (params: { q: string; folder_id?: string; document_type?: string }) => {
    const query = new URLSearchParams();
    query.set('q', params.q);
    if (params.folder_id) query.set('folder_id', params.folder_id);
    if (params.document_type) query.set('document_type', params.document_type);
    return apiClient.get<DmsSearchItem[]>(`/api/documents/search?${query.toString()}`);
  },

  searchAllDocuments: async (params?: { folder_id?: string; document_type?: string }) => {
    const batches = await Promise.all(
      ALL_DOCUMENT_TOKENS.map((token) =>
        dmsService.searchDocuments({
          q: token,
          ...(params?.folder_id ? { folder_id: params.folder_id } : {}),
          ...(params?.document_type ? { document_type: params.document_type } : {}),
        })
      )
    );

    const merged = new Map<string, DmsSearchItem>();
    for (const batch of batches) {
      for (const item of batch) {
        merged.set(item.id, item);
      }
    }

    return [...merged.values()].sort((left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime());
  },

  getDocument: (documentId: string) => apiClient.get<DmsDocumentDetail>(`/api/documents/${documentId}`),

  getDownloadUrl: (documentId: string) =>
    apiClient.get<{ document_id: string; document_name: string; version_id: string; version_number: number; url: string }>(`/api/documents/${documentId}/download`),

  approveDocument: (documentId: string, payload: { status: 'APPROVED' | 'REJECTED'; comment?: string }) =>
    apiClient.post<{ document: { id: string; status: string } }>(`/api/documents/${documentId}/approve`, payload),

  sendForSignature: (documentId: string, payload: { provider?: 'DOCUSIGN' | 'HELLOSIGN'; recipients?: string[] }) =>
    apiClient.post<{ id: string; provider: string; status: string }>(`/api/documents/${documentId}/send-for-signature`, payload),
};
