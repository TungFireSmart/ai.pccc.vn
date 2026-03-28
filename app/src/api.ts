export const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:4000'

export type AuthResponse = {
  token: string
  user: {
    id: string
    email: string
    fullName: string
  }
  workspace: {
    id: string
    name: string
    slug: string
  }
  role?: string
}

export type ThreadRecord = {
  id: string
  title: string
  status: string
  createdAt: string
  updatedAt: string
  _count?: { messages: number; files: number; documents: number; outputs: number }
}

export type MessageRecord = {
  id: string
  role: string
  content: string
  createdAt: string
}

export type FileRecord = {
  id: string
  workspaceId: string
  threadId?: string | null
  uploadedBy: string
  originalName: string
  mimeType: string
  storagePath: string
  sizeBytes: number
  status: string
  createdAt: string
}

export type DocumentChunkRecord = {
  id: string
  documentId: string
  chunkIndex: number
  content: string
  tokenCount: number
}

export type DocumentRecord = {
  id: string
  workspaceId: string
  threadId?: string | null
  fileId: string
  title: string
  sourceType: string
  status: string
  createdAt: string
  file: FileRecord
  chunks: DocumentChunkRecord[]
}

export type OutputRecord = {
  id: string
  workspaceId: string
  threadId: string
  documentId?: string | null
  createdById?: string | null
  assignedToId?: string | null
  assignedAt?: string | null
  reviewedById?: string | null
  reviewedAt?: string | null
  releasedById?: string | null
  releasedAt?: string | null
  deletedById?: string | null
  deletedAt?: string | null
  kind: string
  title: string
  content: string
  status: string
  approvalStatus: string
  approvalNote?: string | null
  approvedById?: string | null
  approvedAt?: string | null
  exportStatus: string
  exportChannel?: string | null
  exportNote?: string | null
  exportedAt?: string | null
  createdAt: string
  updatedAt: string
}

export type OutputEventRecord = {
  id: string
  outputId: string
  actorId?: string | null
  eventType: string
  label: string
  note?: string | null
  payload?: unknown
  createdAt: string
  actor?: {
    id: string
    email: string
    fullName: string
  } | null
}

export type ThreadDetail = ThreadRecord & {
  messages: MessageRecord[]
  files: FileRecord[]
  documents: DocumentRecord[]
  outputs: OutputRecord[]
}

export type WorkspaceSummary = {
  id: string
  name: string
  slug: string
  status: string
  members: Array<{
    id: string
    role: string
    status: string
    user: {
      id: string
      email: string
      fullName: string
    }
  }>
}

export type WorkspaceMemberOption = WorkspaceSummary['members'][number]

export type DocumentRetrieveResult = {
  id: string
  content: string
  chunkIndex: number
  tokenCount: number
  citation: {
    documentId: string
    documentTitle: string
    fileId: string
    fileName: string
    chunkIndex: number
    sourceType: string
    threadId?: string | null
  }
}

export type DocumentRetrieveResponse = {
  documentId: string
  query: string
  results: DocumentRetrieveResult[]
}

export type AssistantActionBrief = {
  mode: 'ASK' | 'DRAFT' | 'EXTRACT' | 'ASSIGN'
  nextAction: string
  approvalLabel: string
  exportLabel: string
  suggestedTitle: string
}

export type CreateMessageResponse = {
  message: MessageRecord
  assistantMessage: MessageRecord | null
  output: OutputRecord | null
  actionBrief: AssistantActionBrief | null
}

export type UpdateOutputPayload = {
  title?: string
  content?: string
  status?: string
  assignedToId?: string | null
  reviewedById?: string | null
  approvalStatus?: 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED'
  approvalNote?: string
  exportStatus?: 'NOT_READY' | 'READY' | 'EXPORTED'
  exportChannel?: string
  exportNote?: string
}

export type ExecuteOutputAutomationMode = 'NEXT_STEP' | 'FORCE_REVIEW' | 'FORCE_EXPORT' | 'RESET_FLOW'

export type ExecuteOutputAutomationResponse = {
  output: OutputRecord
  nextAction: string
  summary: string
}

export type StationSummary = {
  workspace: {
    id: string
  }
  counts: {
    threads: number
    activeThreads: number
    outputs: number
    pendingApproval: number
    changesRequested: number
    readyToExport: number
    exported: number
    documents: number
    ingestedDocuments: number
  }
  queue: Array<{
    id: string
    entityId: string
    entityType: 'OUTPUT' | 'DOCUMENT'
    type: 'OUTPUT' | 'DOCUMENT'
    threadId: string
    threadTitle: string
    documentId?: string | null
    label: string
    owner: string
    status: string
    priority: number
    eta: string
    note: string
    updatedAt: string
  }>
  timeline: Array<{
    threadId: string
    threadTitle: string
    updatedAt: string
    detail: string
    counts: {
      messages: number
      documents: number
      outputs: number
    }
  }>
}

async function request<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const api = {
  health: () => request<{ ok: boolean; service: string }>('/health'),
  login: (email: string, password: string) => request<AuthResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }),
  register: (payload: {
    email: string
    password: string
    fullName: string
    workspaceName: string
    workspaceSlug: string
  }) => request<AuthResponse>('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }),
  getWorkspace: (token: string) => request<WorkspaceSummary>('/workspaces/me', undefined, token),
  getThreads: (token: string) => request<ThreadRecord[]>('/threads', undefined, token),
  createThread: (token: string, title: string) => request<ThreadRecord>('/threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  }, token),
  getThread: (token: string, threadId: string) => request<ThreadDetail>(`/threads/${threadId}`, undefined, token),
  createMessage: (token: string, threadId: string, payload: {
    role: 'user' | 'assistant' | 'system'
    content: string
    orchestration?: {
      mode: 'ASK' | 'DRAFT' | 'EXTRACT' | 'ASSIGN'
      documentId?: string
      documentTitle?: string
      retrieveHits?: number
    }
    createOutput?: {
      kind?: string
      title: string
      status?: string
      approvalStatus?: string
      approvalNote?: string
      exportStatus?: string
      exportChannel?: string
      exportNote?: string
      documentId?: string
    }
  }) => request<CreateMessageResponse>(`/threads/${threadId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, token),
  getFiles: (token: string, threadId?: string | null) => request<FileRecord[]>(`/files${threadId ? `?threadId=${encodeURIComponent(threadId)}` : ''}`, undefined, token),
  createFile: (token: string, payload: {
    originalName: string
    mimeType: string
    storagePath: string
    sizeBytes: number
    threadId?: string
  }) => request<FileRecord>('/files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, token),
  uploadFile: (token: string, payload: {
    originalName: string
    mimeType: string
    contentBase64: string
    threadId?: string
  }) => request<FileRecord>('/files/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, token),
  getDocuments: (token: string, threadId?: string | null) => request<DocumentRecord[]>(`/documents${threadId ? `?threadId=${encodeURIComponent(threadId)}` : ''}`, undefined, token),
  createDocument: (token: string, payload: {
    fileId: string
    title: string
    threadId?: string
    sourceType?: string
  }) => request<DocumentRecord>('/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, token),
  ingestDocument: (token: string, documentId: string, payload: {
    content: string
    chunkSize?: number
  }) => request<{ documentId: string; chunks: number; chunkSize: number }>(`/documents/${documentId}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, token),
  retrieveDocument: (token: string, documentId: string, query: string) => request<DocumentRetrieveResponse>(`/documents/${documentId}/retrieve?q=${encodeURIComponent(query)}`, undefined, token),
  getOutputs: (token: string, threadId?: string | null) => request<OutputRecord[]>(`/outputs${threadId ? `?threadId=${encodeURIComponent(threadId)}` : ''}`, undefined, token),
  createOutput: (token: string, payload: {
    threadId: string
    documentId?: string
    kind: string
    title: string
    content: string
    status?: string
    approvalStatus?: string
    approvalNote?: string
    exportStatus?: string
    exportChannel?: string
    exportNote?: string
  }) => request<OutputRecord>('/outputs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, token),
  updateOutput: (token: string, outputId: string, payload: UpdateOutputPayload) => request<OutputRecord>(`/outputs/${outputId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, token),
  executeOutputAutomation: (token: string, outputId: string, mode: ExecuteOutputAutomationMode = 'NEXT_STEP') => request<ExecuteOutputAutomationResponse>(`/outputs/${outputId}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode }),
  }, token),
  deleteOutput: (token: string, outputId: string) => request<void>(`/outputs/${outputId}`, {
    method: 'DELETE',
  }, token),
  getOutputHistory: (token: string, outputId: string) => request<OutputEventRecord[]>(`/outputs/${outputId}/history`, undefined, token),
  getStationSummary: (token: string, limit = 6) => request<StationSummary>(`/station/summary?limit=${encodeURIComponent(String(limit))}`, undefined, token),
}
