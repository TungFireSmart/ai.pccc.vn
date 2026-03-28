# ai-pccc/server

Backend foundation for Phase 2.

## What is working now
- health check
- register workspace owner
- login
- get current workspace
- create thread
- add message to thread
- message → output draft persistence on the same thread
- list/get threads with thread-bound files, documents, outputs
- create/list files
- upload file content into local storage
- create/list documents
- ingest document content into chunks
- basic retrieve from ingested chunks with thread-aware citation data

## Stack
- Express
- TypeScript
- Prisma
- SQLite for local dev

## Local run
```bash
cd /home/agent/.openclaw/workspace/ai-pccc/server
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Server default:
- `http://localhost:4000`

## Quick test
### Health
```bash
curl http://localhost:4000/health
```

### Register
```bash
curl -X POST http://localhost:4000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email":"owner@pccc.vn",
    "password":"12345678",
    "fullName":"Tung Owner",
    "workspaceName":"AI Station PCCC Vietnam",
    "workspaceSlug":"ai-station-pccc-vietnam"
  }'
```

Use returned `token` as Bearer token for protected routes.

## Next Phase 2 steps
- persist approval/export rails as first-class backend entities
- deepen orchestration from chat actions into output/document workflows
- move beyond local disk storage toward a more durable upload/storage layer
- refine the frontend UX now that thread-bound state is real
