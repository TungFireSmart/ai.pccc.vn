import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/require-auth.js'

export const stationRouter = Router()

stationRouter.use(requireAuth)

stationRouter.get('/summary', async (req, res) => {
  const workspaceId = req.auth!.workspaceId
  const threadLimit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 12)

  const threads = await prisma.thread.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: 'desc' },
    take: threadLimit,
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      documents: {
        include: { chunks: { select: { id: true } }, file: true },
        orderBy: { createdAt: 'desc' },
      },
      outputs: {
        orderBy: { updatedAt: 'desc' },
      },
    },
  })

  const counts = {
    threads: threads.length,
    activeThreads: threads.filter((thread) => thread.status === 'ACTIVE').length,
    outputs: threads.reduce((sum, thread) => sum + thread.outputs.length, 0),
    pendingApproval: threads.reduce((sum, thread) => sum + thread.outputs.filter((output) => output.approvalStatus === 'PENDING').length, 0),
    changesRequested: threads.reduce((sum, thread) => sum + thread.outputs.filter((output) => output.approvalStatus === 'CHANGES_REQUESTED').length, 0),
    readyToExport: threads.reduce((sum, thread) => sum + thread.outputs.filter((output) => output.approvalStatus === 'APPROVED' && output.exportStatus !== 'EXPORTED').length, 0),
    exported: threads.reduce((sum, thread) => sum + thread.outputs.filter((output) => output.exportStatus === 'EXPORTED').length, 0),
    documents: threads.reduce((sum, thread) => sum + thread.documents.length, 0),
    ingestedDocuments: threads.reduce((sum, thread) => sum + thread.documents.filter((document) => document.status === 'INGESTED').length, 0),
  }

  const queue = threads.flatMap((thread) => {
    const outputCards = thread.outputs.slice(0, 3).map((output) => ({
      id: output.id,
      entityId: output.id,
      entityType: 'OUTPUT',
      type: 'OUTPUT',
      threadId: thread.id,
      threadTitle: thread.title,
      documentId: output.documentId,
      label: output.title,
      owner: output.approvalStatus === 'APPROVED' ? 'Release rail' : output.kind,
      status: output.approvalStatus === 'CHANGES_REQUESTED'
        ? 'Needs changes'
        : output.exportStatus === 'EXPORTED'
          ? 'Exported'
          : output.approvalStatus === 'APPROVED'
            ? 'Ready to export'
            : 'Pending approval',
      priority: output.approvalStatus === 'CHANGES_REQUESTED'
        ? 95
        : output.approvalStatus === 'PENDING'
          ? 90
          : output.exportStatus === 'READY'
            ? 82
            : output.exportStatus === 'NOT_READY'
              ? 72
              : 58,
      eta: output.exportStatus === 'EXPORTED' ? 'Done' : output.approvalStatus === 'APPROVED' ? 'Now' : 'Next',
      note: output.exportChannel
        ? `${output.approvalStatus} · ${output.exportStatus} · ${output.exportChannel}`
        : `${output.approvalStatus} · ${output.exportStatus}`,
      updatedAt: output.updatedAt,
    }))

    const documentCards = thread.documents
      .filter((document) => document.status !== 'INGESTED')
      .slice(0, 2)
      .map((document) => ({
        id: document.id,
        entityId: document.id,
        entityType: 'DOCUMENT',
        type: 'DOCUMENT',
        threadId: thread.id,
        threadTitle: thread.title,
        documentId: document.id,
        label: `Ingest ${document.title}`,
        owner: 'Evidence rail',
        status: document.status === 'READY' ? 'Ready to ingest' : document.status,
        priority: 76,
        eta: 'Soon',
        note: `${document.file.originalName} · ${document.chunks.length} chunks`,
        updatedAt: document.createdAt.toISOString(),
      }))

    return [...outputCards, ...documentCards]
  })
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
    .slice(0, 8)

  const timeline = threads.slice(0, 5).map((thread) => {
    const latestOutput = thread.outputs[0]
    const latestDocument = thread.documents[0]
    const latestMessage = thread.messages[0]

    const detail = latestOutput
      ? `${latestOutput.title} · ${latestOutput.approvalStatus} / ${latestOutput.exportStatus}`
      : latestDocument
        ? `${latestDocument.title} · ${latestDocument.status} · ${latestDocument.chunks.length} chunks`
        : latestMessage
          ? `${latestMessage.role} message captured`
          : 'Thread mới tạo, chưa có activity sâu.'

    return {
      threadId: thread.id,
      threadTitle: thread.title,
      updatedAt: thread.updatedAt,
      detail,
      counts: {
        messages: thread.messages.length,
        documents: thread.documents.length,
        outputs: thread.outputs.length,
      },
    }
  })

  return res.json({
    workspace: {
      id: workspaceId,
    },
    counts,
    queue,
    timeline,
  })
})
