import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/require-auth.js'

export const workspaceRouter = Router()

workspaceRouter.use(requireAuth)

workspaceRouter.get('/me', async (req, res) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: req.auth!.workspaceId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })

  if (!workspace) {
    return res.status(404).json({ error: 'Workspace not found' })
  }

  return res.json(workspace)
})
