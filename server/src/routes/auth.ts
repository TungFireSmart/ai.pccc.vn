import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { signAuthToken } from '../lib/auth.js'

export const authRouter = Router()

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  workspaceName: z.string().min(1),
  workspaceSlug: z.string().min(1),
})

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const { email, password, fullName, workspaceName, workspaceSlug } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' })
  }

  const existingWorkspace = await prisma.workspace.findUnique({ where: { slug: workspaceSlug } })
  if (existingWorkspace) {
    return res.status(409).json({ error: 'Workspace slug already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, passwordHash, fullName },
    })

    const workspace = await tx.workspace.create({
      data: {
        name: workspaceName,
        slug: workspaceSlug,
        ownerUserId: user.id,
      },
    })

    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: 'OWNER',
      },
    })

    return { user, workspace }
  })

  const token = signAuthToken({ userId: result.user.id, workspaceId: result.workspace.id, role: 'OWNER' })

  return res.status(201).json({
    token,
    user: {
      id: result.user.id,
      email: result.user.email,
      fullName: result.user.fullName,
    },
    workspace: {
      id: result.workspace.id,
      name: result.workspace.name,
      slug: result.workspace.slug,
    },
  })
})

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        include: {
          workspace: true,
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const membership = user.memberships[0]
  if (!membership) {
    return res.status(403).json({ error: 'No workspace membership found' })
  }

  const token = signAuthToken({ userId: user.id, workspaceId: membership.workspaceId, role: membership.role })

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
    workspace: {
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
    },
    role: membership.role,
  })
})
