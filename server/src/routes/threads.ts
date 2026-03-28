import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { logOutputEvent } from '../lib/output-events.js'
import { requireAuth } from '../middleware/require-auth.js'

export const threadRouter = Router()

threadRouter.use(requireAuth)

threadRouter.get('/', async (req, res) => {
  const threads = await prisma.thread.findMany({
    where: { workspaceId: req.auth!.workspaceId },
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: { select: { id: true } },
      files: { select: { id: true } },
      documents: { select: { id: true } },
      outputs: { select: { id: true } },
    },
  })

  return res.json(
    threads.map(({ messages, files, documents, outputs, ...thread }) => ({
      ...thread,
      _count: {
        messages: messages.length,
        files: files.length,
        documents: documents.length,
        outputs: outputs.length,
      },
    })),
  )
})

const createThreadSchema = z.object({
  title: z.string().min(1),
})

threadRouter.post('/', async (req, res) => {
  const parsed = createThreadSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const thread = await prisma.thread.create({
    data: {
      title: parsed.data.title,
      workspaceId: req.auth!.workspaceId,
      createdById: req.auth!.userId,
    },
  })

  return res.status(201).json(thread)
})

threadRouter.get('/:threadId', async (req, res) => {
  const thread = await prisma.thread.findFirst({
    where: {
      id: req.params.threadId,
      workspaceId: req.auth!.workspaceId,
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      files: {
        orderBy: { createdAt: 'desc' },
      },
      documents: {
        include: {
          file: true,
          chunks: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      outputs: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' })
  }

  return res.json(thread)
})

const createMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  orchestration: z.object({
    mode: z.enum(['ASK', 'DRAFT', 'EXTRACT', 'ASSIGN']).default('ASK'),
    documentId: z.string().min(1).optional(),
    documentTitle: z.string().min(1).optional(),
    retrieveHits: z.number().int().min(0).optional(),
  }).optional(),
  createOutput: z.object({
    kind: z.string().min(1).optional(),
    title: z.string().min(1),
    status: z.string().min(1).optional(),
    approvalStatus: z.string().min(1).optional(),
    approvalNote: z.string().min(1).optional(),
    exportStatus: z.string().min(1).optional(),
    exportChannel: z.string().min(1).optional(),
    exportNote: z.string().min(1).optional(),
    documentId: z.string().min(1).optional(),
  }).optional(),
})

function buildAssistantResponse(input: {
  content: string
  mode: 'ASK' | 'DRAFT' | 'EXTRACT' | 'ASSIGN'
  documentTitle?: string
  retrieveHits?: number
  outputTitle?: string
}) {
  const trimmed = input.content.trim()
  const shortRequest = trimmed.length > 140 ? `${trimmed.slice(0, 140)}…` : trimmed
  const evidenceLine = input.documentTitle
    ? `Nguồn chính đang bám: ${input.documentTitle}${typeof input.retrieveHits === 'number' ? ` · ${input.retrieveHits} retrieve hits` : ''}.`
    : 'Chưa có document thật được gắn vào bước này, nên nên kiểm tra nguồn trước khi release.'

  if (input.mode === 'DRAFT') {
    return {
      message: `Em đã dựng một draft để team sửa và duyệt tiếp. ${evidenceLine} Bước tiếp theo phù hợp nhất là rà wording, chốt người duyệt và chọn kênh gửi trước khi export.\n\nYêu cầu đang xử lý: ${shortRequest}`,
      suggestedTitle: input.outputTitle ?? 'Draft phản hồi đang chờ duyệt',
      nextAction: 'Rà nội dung và chuyển sang duyệt',
      approvalLabel: 'Lead/owner review',
      exportLabel: 'Email / Zalo khi đã duyệt',
    }
  }

  if (input.mode === 'EXTRACT') {
    return {
      message: `Em đã giữ bước bóc tách này như một output riêng để không trộn với phần trao đổi. ${evidenceLine} Bước tiếp theo là xác nhận đoạn nào sẽ được đưa vào checklist, note kỹ thuật hoặc phản hồi khách.\n\nYêu cầu đang xử lý: ${shortRequest}`,
      suggestedTitle: input.outputTitle ?? 'Trích ý chính từ tài liệu',
      nextAction: 'Chọn phần sẽ dùng trong checklist / note',
      approvalLabel: 'Kỹ thuật xác nhận',
      exportLabel: 'Internal note / checklist',
    }
  }

  if (input.mode === 'ASSIGN') {
    return {
      message: `Em đã đóng gói yêu cầu này theo dạng handoff để desk tiếp nhận không bị thiếu ngữ cảnh. ${evidenceLine} Bước tiếp theo là chỉ định người nhận, chốt deadline và để lead xác nhận trước khi gửi đi.\n\nYêu cầu đang xử lý: ${shortRequest}`,
      suggestedTitle: input.outputTitle ?? 'Handoff note đang chờ nhận việc',
      nextAction: 'Giao người nhận và chốt ETA',
      approvalLabel: 'Lead confirm handoff',
      exportLabel: 'Desk relay',
    }
  }

  return {
    message: `Em đã ghi nhận yêu cầu và giữ thread ở trạng thái sẵn để đi tiếp. ${evidenceLine} Nếu cần ra ngoài thread này, nên tạo draft hoặc extract để có rail duyệt rõ ràng.\n\nYêu cầu đang xử lý: ${shortRequest}`,
    suggestedTitle: input.outputTitle ?? 'Câu trả lời đang theo dõi trong thread',
    nextAction: 'Chọn Draft / Extract / Assign nếu cần artifact',
    approvalLabel: 'Theo dõi trong thread',
    exportLabel: 'Chưa cần export',
  }
}

threadRouter.post('/:threadId/messages', async (req, res) => {
  const parsed = createMessageSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const thread = await prisma.thread.findFirst({
    where: {
      id: req.params.threadId,
      workspaceId: req.auth!.workspaceId,
    },
  })

  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' })
  }

  const orchestrationMode = parsed.data.orchestration?.mode ?? 'ASK'
  const assistantBrief = buildAssistantResponse({
    content: parsed.data.content,
    mode: orchestrationMode,
    documentTitle: parsed.data.orchestration?.documentTitle,
    retrieveHits: parsed.data.orchestration?.retrieveHits,
    outputTitle: parsed.data.createOutput?.title,
  })

  const result = await prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: {
        threadId: thread.id,
        userId: parsed.data.role === 'assistant' ? null : req.auth!.userId,
        role: parsed.data.role,
        content: parsed.data.content,
      },
    })

    let assistantMessage = null
    if (parsed.data.role === 'user') {
      assistantMessage = await tx.message.create({
        data: {
          threadId: thread.id,
          userId: null,
          role: 'assistant',
          content: assistantBrief.message,
        },
      })
    }

    let output = null
    if (parsed.data.createOutput) {
      output = await tx.output.create({
        data: {
          workspaceId: req.auth!.workspaceId,
          threadId: thread.id,
          documentId: parsed.data.createOutput.documentId,
          createdById: parsed.data.role === 'assistant' ? null : req.auth!.userId,
          kind: parsed.data.createOutput.kind ?? 'NOTE',
          title: parsed.data.createOutput.title,
          content: `${parsed.data.content}\n\nNext action: ${assistantBrief.nextAction}`,
          status: parsed.data.createOutput.status ?? 'DRAFT',
          approvalStatus: parsed.data.createOutput.approvalStatus ?? 'PENDING',
          approvalNote: parsed.data.createOutput.approvalNote ?? assistantBrief.approvalLabel,
          exportStatus: parsed.data.createOutput.exportStatus ?? 'NOT_READY',
          exportChannel: parsed.data.createOutput.exportChannel ?? assistantBrief.exportLabel,
          exportNote: parsed.data.createOutput.exportNote,
        },
      })

      await logOutputEvent(tx, {
        outputId: output.id,
        actorId: parsed.data.role === 'assistant' ? null : req.auth!.userId,
        eventType: 'CREATED_FROM_MESSAGE',
        label: `Created from ${orchestrationMode}`,
        note: assistantBrief.nextAction,
        payload: {
          mode: orchestrationMode,
          documentId: output.documentId,
          title: output.title,
        },
      })
    }

    await tx.thread.update({
      where: { id: thread.id },
      data: { updatedAt: new Date() },
    })

    return {
      message,
      assistantMessage,
      output,
      actionBrief: {
        mode: orchestrationMode,
        nextAction: assistantBrief.nextAction,
        approvalLabel: assistantBrief.approvalLabel,
        exportLabel: assistantBrief.exportLabel,
        suggestedTitle: assistantBrief.suggestedTitle,
      },
    }
  })

  return res.status(201).json(result)
})
