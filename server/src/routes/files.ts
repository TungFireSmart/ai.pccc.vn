import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/require-auth.js'

export const fileRouter = Router()

fileRouter.use(requireAuth)

async function resolveThread(threadId: string | null | undefined, workspaceId: string) {
  if (!threadId) return null

  return prisma.thread.findFirst({
    where: {
      id: threadId,
      workspaceId,
    },
  })
}

fileRouter.get('/', async (req, res) => {
  const threadId = typeof req.query.threadId === 'string' ? req.query.threadId : undefined

  const files = await prisma.file.findMany({
    where: {
      workspaceId: req.auth!.workspaceId,
      ...(threadId ? { threadId } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return res.json(files)
})

const createFileSchema = z.object({
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  storagePath: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  threadId: z.string().min(1).optional(),
})

fileRouter.post('/', async (req, res) => {
  const parsed = createFileSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  if (parsed.data.threadId) {
    const thread = await resolveThread(parsed.data.threadId, req.auth!.workspaceId)
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' })
    }
  }

  const file = await prisma.file.create({
    data: {
      workspaceId: req.auth!.workspaceId,
      uploadedBy: req.auth!.userId,
      ...parsed.data,
    },
  })

  return res.status(201).json(file)
})

const uploadFileSchema = z.object({
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  contentBase64: z.string().min(1),
  threadId: z.string().min(1).optional(),
})

fileRouter.post('/upload', async (req, res) => {
  const parsed = uploadFileSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  if (parsed.data.threadId) {
    const thread = await resolveThread(parsed.data.threadId, req.auth!.workspaceId)
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' })
    }
  }

  const buffer = Buffer.from(parsed.data.contentBase64, 'base64')
  const safeName = parsed.data.originalName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storageDir = path.resolve(process.cwd(), 'storage', req.auth!.workspaceId)
  const storageName = `${Date.now()}-${safeName}`
  const absolutePath = path.join(storageDir, storageName)

  await fs.mkdir(storageDir, { recursive: true })
  await fs.writeFile(absolutePath, buffer)

  const file = await prisma.file.create({
    data: {
      workspaceId: req.auth!.workspaceId,
      threadId: parsed.data.threadId,
      uploadedBy: req.auth!.userId,
      originalName: parsed.data.originalName,
      mimeType: parsed.data.mimeType,
      storagePath: absolutePath,
      sizeBytes: buffer.byteLength,
      status: 'UPLOADED',
    },
  })

  return res.status(201).json(file)
})
