import cors from 'cors'
import express from 'express'
import { env } from './lib/env.js'
import { healthRouter } from './routes/health.js'
import { authRouter } from './routes/auth.js'
import { workspaceRouter } from './routes/workspaces.js'
import { threadRouter } from './routes/threads.js'
import { fileRouter } from './routes/files.js'
import { documentRouter } from './routes/documents.js'
import { outputRouter } from './routes/outputs.js'
import { stationRouter } from './routes/station.js'

const app = express()

app.use(cors({ origin: env.appOrigin, credentials: true }))
app.use(express.json({ limit: '5mb' }))

app.use('/health', healthRouter)
app.use('/auth', authRouter)
app.use('/workspaces', workspaceRouter)
app.use('/threads', threadRouter)
app.use('/files', fileRouter)
app.use('/documents', documentRouter)
app.use('/outputs', outputRouter)
app.use('/station', stationRouter)

app.listen(env.port, () => {
  console.log(`ai-pccc-server listening on http://localhost:${env.port}`)
})
