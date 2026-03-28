import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/require-auth.js'

export const documentRouter = Router()

documentRouter.use(requireAuth)

async function resolveThread(threadId: string | null | undefined, workspaceId: string) {
  if (!threadId) return null

  return prisma.thread.findFirst({
    where: {
      id: threadId,
      workspaceId,
    },
  })
}

documentRouter.get('/', async (req, res) => {
  const threadId = typeof req.query.threadId === 'string' ? req.query.threadId : undefined

  const docs = await prisma.document.findMany({
    where: {
      workspaceId: req.auth!.workspaceId,
      ...(threadId ? { threadId } : {}),
    },
    include: {
      file: true,
      chunks: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return res.json(docs)
})

const createDocumentSchema = z.object({
  fileId: z.string().min(1),
  threadId: z.string().min(1).optional(),
  title: z.string().min(1),
  sourceType: z.string().optional(),
})

documentRouter.post('/', async (req, res) => {
  const parsed = createDocumentSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const file = await prisma.file.findFirst({
    where: {
      id: parsed.data.fileId,
      workspaceId: req.auth!.workspaceId,
    },
  })

  if (!file) {
    return res.status(404).json({ error: 'File not found' })
  }

  const resolvedThreadId = parsed.data.threadId ?? file.threadId ?? null

  if (resolvedThreadId) {
    const thread = await resolveThread(resolvedThreadId, req.auth!.workspaceId)
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' })
    }
  }

  const doc = await prisma.document.create({
    data: {
      workspaceId: req.auth!.workspaceId,
      threadId: resolvedThreadId,
      fileId: file.id,
      title: parsed.data.title,
      sourceType: parsed.data.sourceType ?? 'UPLOAD',
    },
    include: {
      file: true,
      chunks: true,
    },
  })

  return res.status(201).json(doc)
})

const ingestSchema = z.object({
  content: z.string().min(1),
  chunkSize: z.number().int().positive().optional(),
})

documentRouter.post('/:documentId/ingest', async (req, res) => {
  const parsed = ingestSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const doc = await prisma.document.findFirst({
    where: {
      id: req.params.documentId,
      workspaceId: req.auth!.workspaceId,
    },
  })

  if (!doc) {
    return res.status(404).json({ error: 'Document not found' })
  }

  const chunkSize = parsed.data.chunkSize ?? 500
  const normalized = parsed.data.content.replace(/\s+/g, ' ').trim()
  const chunks: string[] = []

  for (let i = 0; i < normalized.length; i += chunkSize) {
    chunks.push(normalized.slice(i, i + chunkSize))
  }

  await prisma.documentChunk.deleteMany({ where: { documentId: doc.id } })

  if (chunks.length > 0) {
    await prisma.documentChunk.createMany({
      data: chunks.map((content, index) => ({
        documentId: doc.id,
        chunkIndex: index,
        content,
        tokenCount: content.length,
      })),
    })
  }

  await prisma.document.update({
    where: { id: doc.id },
    data: { status: 'INGESTED' },
  })

  return res.json({
    documentId: doc.id,
    chunks: chunks.length,
    chunkSize,
  })
})

documentRouter.get('/:documentId/retrieve', async (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase()

  const doc = await prisma.document.findFirst({
    where: {
      id: req.params.documentId,
      workspaceId: req.auth!.workspaceId,
    },
    include: {
      file: true,
      chunks: { orderBy: { chunkIndex: 'asc' } },
    },
  })

  if (!doc) {
    return res.status(404).json({ error: 'Document not found' })
  }

  const results = (!q
    ? doc.chunks.slice(0, 5)
    : doc.chunks.filter((chunk) => chunk.content.toLowerCase().includes(q)).slice(0, 5)
  ).map((chunk) => ({
    id: chunk.id,
    content: chunk.content,
    chunkIndex: chunk.chunkIndex,
    tokenCount: chunk.tokenCount,
    citation: {
      documentId: doc.id,
      documentTitle: doc.title,
      fileId: doc.file.id,
      fileName: doc.file.originalName,
      chunkIndex: chunk.chunkIndex,
      sourceType: doc.sourceType,
      threadId: doc.threadId,
    },
  }))

  return res.json({
    documentId: doc.id,
    query: q,
    results,
  })
})
