import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { logOutputEvent } from '../lib/output-events.js'
import { requireAuth } from '../middleware/require-auth.js'

export const outputRouter = Router()

outputRouter.use(requireAuth)

async function resolveThread(threadId: string, workspaceId: string) {
  return prisma.thread.findFirst({
    where: {
      id: threadId,
      workspaceId,
    },
  })
}

function isExternalReleaseChannel(channel?: string | null) {
  if (!channel) return false
  return ['zalo', 'email', 'sms', 'whatsapp'].includes(channel.trim().toLowerCase())
}

function requiresReviewer(output: { kind: string; exportChannel?: string | null }) {
  return output.kind === 'HANDOFF_NOTE' || output.kind === 'DOCUMENT_EXTRACT' || isExternalReleaseChannel(output.exportChannel)
}

outputRouter.get('/', async (req, res) => {
  const threadId = typeof req.query.threadId === 'string' ? req.query.threadId : undefined

  const outputs = await prisma.output.findMany({
    where: {
      workspaceId: req.auth!.workspaceId,
      deletedAt: null,
      ...(threadId ? { threadId } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return res.json(outputs)
})

const createOutputSchema = z.object({
  threadId: z.string().min(1),
  documentId: z.string().min(1).optional(),
  kind: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  status: z.string().min(1).optional(),
  approvalStatus: z.string().min(1).optional(),
  approvalNote: z.string().min(1).optional(),
  exportStatus: z.string().min(1).optional(),
  exportChannel: z.string().min(1).optional(),
  exportNote: z.string().min(1).optional(),
})

outputRouter.post('/', async (req, res) => {
  const parsed = createOutputSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const thread = await resolveThread(parsed.data.threadId, req.auth!.workspaceId)
  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' })
  }

  if (parsed.data.documentId) {
    const document = await prisma.document.findFirst({
      where: {
        id: parsed.data.documentId,
        workspaceId: req.auth!.workspaceId,
      },
    })

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }
  }

  const output = await prisma.$transaction(async (tx) => {
    const created = await tx.output.create({
      data: {
        workspaceId: req.auth!.workspaceId,
        threadId: parsed.data.threadId,
        documentId: parsed.data.documentId,
        createdById: req.auth!.userId,
        kind: parsed.data.kind,
        title: parsed.data.title,
        content: parsed.data.content,
        status: parsed.data.status ?? 'DRAFT',
        approvalStatus: parsed.data.approvalStatus ?? 'PENDING',
        approvalNote: parsed.data.approvalNote,
        exportStatus: parsed.data.exportStatus ?? 'NOT_READY',
        exportChannel: parsed.data.exportChannel,
        exportNote: parsed.data.exportNote,
      },
    })

    await logOutputEvent(tx, {
      outputId: created.id,
      actorId: req.auth!.userId,
      eventType: 'CREATED',
      label: 'Output created',
      note: `${created.approvalStatus} · ${created.exportStatus}${created.exportChannel ? ` · ${created.exportChannel}` : ''}`,
      payload: {
        kind: created.kind,
        title: created.title,
        documentId: created.documentId,
      },
    })

    await tx.thread.update({
      where: { id: thread.id },
      data: { updatedAt: new Date() },
    })

    return created
  })

  return res.status(201).json(output)
})

const updateOutputSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  assignedToId: z.string().min(1).nullable().optional(),
  reviewedById: z.string().min(1).nullable().optional(),
  approvalStatus: z.enum(['PENDING', 'APPROVED', 'CHANGES_REQUESTED']).optional(),
  approvalNote: z.string().optional(),
  exportStatus: z.enum(['NOT_READY', 'READY', 'EXPORTED']).optional(),
  exportChannel: z.string().optional(),
  exportNote: z.string().optional(),
})

const executeAutomationSchema = z.object({
  mode: z.enum(['NEXT_STEP', 'FORCE_REVIEW', 'FORCE_EXPORT', 'RESET_FLOW']).default('NEXT_STEP'),
})

outputRouter.get('/:outputId/history', async (req, res) => {
  const output = await prisma.output.findFirst({
    where: {
      id: req.params.outputId,
      workspaceId: req.auth!.workspaceId,
      deletedAt: null,
    },
  })

  if (!output) {
    return res.status(404).json({ error: 'Output not found' })
  }

  const events = await prisma.outputEvent.findMany({
    where: { outputId: output.id },
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
  })

  return res.json(events)
})

outputRouter.patch('/:outputId', async (req, res) => {
  const parsed = updateOutputSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const existing = await prisma.output.findFirst({
    where: {
      id: req.params.outputId,
      workspaceId: req.auth!.workspaceId,
      deletedAt: null,
    },
  })

  if (!existing) {
    return res.status(404).json({ error: 'Output not found' })
  }

  const approvalStatus = parsed.data.approvalStatus ?? existing.approvalStatus
  const exportStatus = parsed.data.exportStatus ?? existing.exportStatus
  const exportChannel = parsed.data.exportChannel !== undefined ? parsed.data.exportChannel : existing.exportChannel
  const assignedToId = parsed.data.assignedToId !== undefined ? parsed.data.assignedToId : existing.assignedToId
  const reviewedById = parsed.data.reviewedById !== undefined ? parsed.data.reviewedById : existing.reviewedById

  if (parsed.data.assignedToId) {
    const assignee = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: req.auth!.workspaceId,
        userId: parsed.data.assignedToId,
        status: 'ACTIVE',
      },
    })

    if (!assignee) {
      return res.status(404).json({ error: 'Assignee not found in workspace' })
    }
  }

  if (parsed.data.reviewedById) {
    const reviewer = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: req.auth!.workspaceId,
        userId: parsed.data.reviewedById,
        status: 'ACTIVE',
      },
    })

    if (!reviewer) {
      return res.status(404).json({ error: 'Reviewer not found in workspace' })
    }
  }

  if (parsed.data.exportStatus === 'READY' && approvalStatus !== 'APPROVED') {
    return res.status(409).json({ error: 'Output must be approved before marking export as READY' })
  }

  if (parsed.data.exportStatus === 'EXPORTED' && approvalStatus !== 'APPROVED') {
    return res.status(409).json({ error: 'Output must be approved before marking export as EXPORTED' })
  }

  if (parsed.data.approvalStatus === 'CHANGES_REQUESTED' && exportStatus !== 'NOT_READY') {
    return res.status(409).json({ error: 'Output with requested changes must stay in NOT_READY export state' })
  }

  if (isExternalReleaseChannel(exportChannel) && (exportStatus === 'READY' || exportStatus === 'EXPORTED') && !assignedToId) {
    return res.status(409).json({ error: 'External release channels require an assignee before marking output READY or EXPORTED' })
  }

  if (requiresReviewer({ kind: existing.kind, exportChannel }) && approvalStatus === 'APPROVED' && !reviewedById) {
    return res.status(409).json({ error: 'This output requires an assigned reviewer before approval can be completed' })
  }

  if (requiresReviewer({ kind: existing.kind, exportChannel }) && exportStatus === 'READY' && !reviewedById) {
    return res.status(409).json({ error: 'This output requires a reviewer before marking export as READY' })
  }

  if (requiresReviewer({ kind: existing.kind, exportChannel }) && exportStatus === 'EXPORTED' && !reviewedById) {
    return res.status(409).json({ error: 'This output requires a reviewer before marking export as EXPORTED' })
  }

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.output.update({
      where: { id: existing.id },
      data: {
        ...(parsed.data.title ? { title: parsed.data.title } : {}),
        ...(parsed.data.content ? { content: parsed.data.content } : {}),
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.assignedToId !== undefined ? { assignedToId: parsed.data.assignedToId, assignedAt: parsed.data.assignedToId ? new Date() : null } : {}),
        ...(parsed.data.approvalStatus ? { approvalStatus: parsed.data.approvalStatus } : {}),
        ...(parsed.data.approvalNote !== undefined ? { approvalNote: parsed.data.approvalNote } : {}),
        approvedById: approvalStatus === 'APPROVED' ? req.auth!.userId : null,
        approvedAt: approvalStatus === 'APPROVED' ? new Date() : null,
        reviewedById: parsed.data.reviewedById !== undefined
          ? parsed.data.reviewedById
          : approvalStatus === 'APPROVED' || approvalStatus === 'CHANGES_REQUESTED'
            ? reviewedById ?? req.auth!.userId
            : existing.reviewedById,
        reviewedAt: parsed.data.reviewedById !== undefined
          ? parsed.data.reviewedById ? new Date() : null
          : approvalStatus === 'APPROVED' || approvalStatus === 'CHANGES_REQUESTED'
            ? existing.reviewedAt ?? new Date()
            : existing.reviewedAt,
        ...(parsed.data.exportStatus ? { exportStatus: parsed.data.exportStatus } : {}),
        ...(parsed.data.exportChannel !== undefined ? { exportChannel: parsed.data.exportChannel } : {}),
        ...(parsed.data.exportNote !== undefined ? { exportNote: parsed.data.exportNote } : {}),
        exportedAt: exportStatus === 'EXPORTED' ? new Date() : null,
        releasedById: exportStatus === 'EXPORTED' ? req.auth!.userId : existing.releasedById,
        releasedAt: exportStatus === 'EXPORTED' ? new Date() : existing.releasedAt,
      },
    })

    if (parsed.data.title || parsed.data.content || parsed.data.status) {
      await logOutputEvent(tx, {
        outputId: next.id,
        actorId: req.auth!.userId,
        eventType: 'CONTENT_UPDATED',
        label: 'Output updated',
        note: parsed.data.title ? `Title: ${parsed.data.title}` : parsed.data.status ? `Status: ${parsed.data.status}` : 'Content edited',
        payload: {
          title: next.title,
          status: next.status,
        },
      })
    }

    if (parsed.data.assignedToId !== undefined) {
      const assignedUser = parsed.data.assignedToId
        ? await tx.user.findUnique({
            where: { id: parsed.data.assignedToId },
            select: { id: true, fullName: true, email: true },
          })
        : null

      await logOutputEvent(tx, {
        outputId: next.id,
        actorId: req.auth!.userId,
        eventType: 'ASSIGNED',
        label: parsed.data.assignedToId ? `Assigned → ${assignedUser?.fullName ?? parsed.data.assignedToId}` : 'Assignment cleared',
        note: parsed.data.assignedToId ? assignedUser?.email ?? null : 'Output no longer has an assignee.',
        payload: {
          assignedToId: next.assignedToId,
          assignedAt: next.assignedAt?.toISOString() ?? null,
        },
      })
    }

    if (parsed.data.reviewedById !== undefined) {
      const reviewerUser = parsed.data.reviewedById
        ? await tx.user.findUnique({
            where: { id: parsed.data.reviewedById },
            select: { id: true, fullName: true, email: true },
          })
        : null

      await logOutputEvent(tx, {
        outputId: next.id,
        actorId: req.auth!.userId,
        eventType: 'REVIEWER_ASSIGNED',
        label: parsed.data.reviewedById ? `Reviewer → ${reviewerUser?.fullName ?? parsed.data.reviewedById}` : 'Reviewer cleared',
        note: parsed.data.reviewedById ? reviewerUser?.email ?? null : 'Output no longer has a reviewer.',
        payload: {
          reviewedById: next.reviewedById,
          reviewedAt: next.reviewedAt?.toISOString() ?? null,
        },
      })
    }

    if (parsed.data.approvalStatus || parsed.data.approvalNote !== undefined) {
      await logOutputEvent(tx, {
        outputId: next.id,
        actorId: req.auth!.userId,
        eventType: 'APPROVAL_UPDATED',
        label: `Approval → ${next.approvalStatus}`,
        note: next.approvalNote ?? null,
        payload: {
          approvalStatus: next.approvalStatus,
          approvedAt: next.approvedAt?.toISOString() ?? null,
        },
      })
    }

    if (parsed.data.exportStatus || parsed.data.exportChannel !== undefined || parsed.data.exportNote !== undefined) {
      await logOutputEvent(tx, {
        outputId: next.id,
        actorId: req.auth!.userId,
        eventType: 'EXPORT_UPDATED',
        label: `Export → ${next.exportStatus}`,
        note: next.exportNote ?? next.exportChannel ?? null,
        payload: {
          exportStatus: next.exportStatus,
          exportChannel: next.exportChannel,
          exportedAt: next.exportedAt?.toISOString() ?? null,
        },
      })
    }

    await tx.thread.update({
      where: { id: existing.threadId },
      data: { updatedAt: new Date() },
    })

    return next
  })

  return res.json(updated)
})

outputRouter.post('/:outputId/execute', async (req, res) => {
  const parsed = executeAutomationSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const existing = await prisma.output.findFirst({
    where: {
      id: req.params.outputId,
      workspaceId: req.auth!.workspaceId,
      deletedAt: null,
    },
    include: {
      events: {
        orderBy: { createdAt: 'desc' },
        take: 8,
      },
    },
  })

  if (!existing) {
    return res.status(404).json({ error: 'Output not found' })
  }

  const result = await prisma.$transaction(async (tx) => {
    let nextAction = 'NO_ACTION'
    let summary = 'Automation executor did not find a stronger next step.'
    let patch: Parameters<typeof tx.output.update>[0]['data'] = {}

    if (parsed.data.mode === 'RESET_FLOW') {
      nextAction = 'RESET_TO_DRAFT'
      summary = 'Executor đã kéo output về nhịp draft để chạy lại từ đầu mà vẫn giữ audit trail.'
      patch = {
        status: 'DRAFT',
        approvalStatus: 'PENDING',
        approvalNote: 'Reset by automation executor.',
        exportStatus: 'NOT_READY',
        exportNote: 'Release flow reset by automation executor.',
        approvedById: null,
        approvedAt: null,
        reviewedById: null,
        reviewedAt: null,
        releasedById: null,
        releasedAt: null,
        exportedAt: null,
      }
    } else if (parsed.data.mode === 'FORCE_REVIEW') {
      nextAction = 'FORCE_REVIEW'
      summary = 'Executor ép output vào nhịp review, gắn người theo dõi và chặn release sớm.'
      patch = {
        status: 'IN_REVIEW',
        approvalStatus: 'PENDING',
        approvalNote: existing.approvalNote ?? 'Forced into review by automation executor.',
        exportStatus: 'NOT_READY',
        assignedToId: existing.assignedToId ?? req.auth!.userId,
        assignedAt: existing.assignedAt ?? new Date(),
      }
    } else if (parsed.data.mode === 'FORCE_EXPORT') {
      if (existing.approvalStatus !== 'APPROVED') {
        return {
          output: existing,
          nextAction: 'EXPORT_BLOCKED',
          summary: 'Executor chặn force export vì output chưa được duyệt.',
        }
      }

      if (requiresReviewer(existing) && !existing.reviewedById) {
        return {
          output: existing,
          nextAction: 'REVIEWER_REQUIRED',
          summary: 'Executor chặn force export vì output này bắt buộc phải có reviewer rõ ràng trước khi release.',
        }
      }

      if (isExternalReleaseChannel(existing.exportChannel) && !existing.assignedToId) {
        return {
          output: existing,
          nextAction: 'ASSIGNEE_REQUIRED',
          summary: 'Executor chặn force export vì kênh xuất ngoài cần có người phụ trách rõ ràng trước khi release.',
        }
      }

      nextAction = existing.exportStatus === 'EXPORTED' ? 'ALREADY_RELEASED' : 'FORCE_EXPORT'
      summary = existing.exportStatus === 'EXPORTED'
        ? 'Output này đã ở trạng thái xuất xong; executor chỉ ghi nhận checkpoint.'
        : 'Executor đẩy output qua release ngay vì artifact đã đủ điều kiện xuất.'
      patch = existing.exportStatus === 'EXPORTED'
        ? {}
        : {
            status: 'RELEASED',
            exportStatus: 'EXPORTED',
            reviewedById: existing.reviewedById ?? req.auth!.userId,
            reviewedAt: existing.reviewedAt ?? new Date(),
            exportedAt: new Date(),
            releasedById: req.auth!.userId,
            releasedAt: new Date(),
            exportNote: existing.exportNote ?? `Export completed by automation executor${existing.exportChannel ? ` · ${existing.exportChannel}` : ''}`,
          }
    } else if (existing.approvalStatus === 'CHANGES_REQUESTED') {
      nextAction = 'PREPARE_REVISION'
      summary = 'Executor giữ output ở luồng sửa và gắn cờ cần chỉnh nội dung trước khi duyệt lại.'
      patch = {
        status: 'REVISION_PENDING',
        exportStatus: 'NOT_READY',
        exportNote: 'Executor held export because changes were requested.',
      }
    } else if (existing.approvalStatus === 'PENDING') {
      nextAction = 'QUEUE_APPROVAL'
      summary = 'Executor đưa output vào nhịp chờ duyệt rõ hơn để release rail không bị treo mơ hồ.'
      patch = {
        status: 'IN_REVIEW',
        approvalNote: existing.approvalNote ?? 'Queued by automation executor for approval review.',
        assignedToId: existing.assignedToId ?? req.auth!.userId,
        assignedAt: existing.assignedAt ?? new Date(),
      }
    } else if (existing.approvalStatus === 'APPROVED' && existing.exportStatus === 'NOT_READY') {
      if (requiresReviewer(existing) && !existing.reviewedById) {
        nextAction = 'REVIEW_BEFORE_EXPORT'
        summary = 'Executor giữ output ở nhịp chờ vì loại output hoặc kênh xuất này cần reviewer rõ ràng trước khi sẵn xuất.'
        patch = {
          status: 'IN_REVIEW',
          exportStatus: 'NOT_READY',
          exportNote: 'Reviewer required before release.',
        }
      } else if (isExternalReleaseChannel(existing.exportChannel) && !existing.assignedToId) {
        nextAction = 'ASSIGN_BEFORE_EXPORT'
        summary = 'Executor giữ output ở nhịp chờ vì kênh xuất ngoài cần người phụ trách rõ ràng trước khi sẵn xuất.'
        patch = {
          status: 'IN_REVIEW',
          exportStatus: 'NOT_READY',
          exportNote: 'Assignment required before external release.',
        }
      } else {
        nextAction = 'PREPARE_EXPORT'
        summary = 'Executor đã chuẩn bị bước xuất kế tiếp vì output đã được duyệt.'
        patch = {
          status: 'READY_FOR_EXPORT',
          exportStatus: 'READY',
          reviewedById: existing.reviewedById ?? req.auth!.userId,
          reviewedAt: existing.reviewedAt ?? new Date(),
          exportNote: existing.exportNote ?? `Prepared by automation executor${existing.exportChannel ? ` · ${existing.exportChannel}` : ''}`,
        }
      }
    } else if (existing.approvalStatus === 'APPROVED' && existing.exportStatus === 'READY') {
      nextAction = 'EXECUTE_EXPORT'
      summary = 'Executor đã đẩy output qua bước xuất hoàn tất.'
      patch = {
        status: 'RELEASED',
        exportStatus: 'EXPORTED',
        exportedAt: new Date(),
        releasedById: req.auth!.userId,
        releasedAt: new Date(),
        exportNote: existing.exportNote ?? `Export completed by automation executor${existing.exportChannel ? ` · ${existing.exportChannel}` : ''}`,
      }
    } else if (existing.exportStatus === 'EXPORTED') {
      nextAction = 'ALREADY_RELEASED'
      summary = 'Output này đã ở trạng thái xuất xong; executor chỉ ghi nhận thêm checkpoint.'
    }

    const updated = await tx.output.update({
      where: { id: existing.id },
      data: patch,
    })

    await logOutputEvent(tx, {
      outputId: updated.id,
      actorId: req.auth!.userId,
      eventType: 'AUTOMATION_EXECUTED',
      label: `Executor → ${nextAction}`,
      note: summary,
      payload: {
        mode: parsed.data.mode,
        from: {
          status: existing.status,
          approvalStatus: existing.approvalStatus,
          exportStatus: existing.exportStatus,
        },
        to: {
          status: updated.status,
          approvalStatus: updated.approvalStatus,
          exportStatus: updated.exportStatus,
        },
        recentEvents: existing.events.map((event) => ({
          eventType: event.eventType,
          label: event.label,
          createdAt: event.createdAt.toISOString(),
        })),
      },
    })

    await tx.thread.update({
      where: { id: existing.threadId },
      data: { updatedAt: new Date() },
    })

    return {
      output: updated,
      nextAction,
      summary,
    }
  })

  return res.json(result)
})

outputRouter.delete('/:outputId', async (req, res) => {
  const existing = await prisma.output.findFirst({
    where: {
      id: req.params.outputId,
      workspaceId: req.auth!.workspaceId,
      deletedAt: null,
    },
  })

  if (!existing) {
    return res.status(404).json({ error: 'Output not found' })
  }

  await prisma.$transaction(async (tx) => {
    await logOutputEvent(tx, {
      outputId: existing.id,
      actorId: req.auth!.userId,
      eventType: 'DELETED',
      label: 'Output archived',
      note: existing.title,
      payload: {
        title: existing.title,
        approvalStatus: existing.approvalStatus,
        exportStatus: existing.exportStatus,
      },
    })

    await tx.output.update({
      where: { id: existing.id },
      data: {
        deletedAt: new Date(),
        deletedById: req.auth!.userId,
        status: 'ARCHIVED',
      },
    })

    await tx.thread.update({
      where: { id: existing.threadId },
      data: { updatedAt: new Date() },
    })
  })

  return res.status(204).send()
})
