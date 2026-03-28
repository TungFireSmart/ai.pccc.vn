import type { NextFunction, Request, Response } from 'express'
import { verifyAuthToken } from '../lib/auth.js'

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string
        workspaceId: string
        role: string
      }
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const token = header.slice('Bearer '.length)
    req.auth = verifyAuthToken(token)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
