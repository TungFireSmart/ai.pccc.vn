# TECHNICAL PLAN — ai.pccc.vn

## Current phase
Internal-review product build. No live infra yet.

## Proposed stack
### Frontend
- React
- TypeScript
- Vite
- CSS system custom-built first, can migrate to design system later

### Future backend
- Node.js or Python service layer
- Auth service
- Chat orchestration layer
- Retrieval / vector search layer
- File processing pipeline
- Audit / workspace persistence

## Frontend architecture direction
- Single app shell
- State-driven navigation for internal prototype
- Later upgrade paths:
  - router-based navigation
  - auth gates
  - persisted workspaces/projects
  - live chat session layer

## Product modules
1. Marketing / landing
2. Workspace app
3. Agent registry
4. Tools catalog
5. Library / knowledge surface
6. Enterprise layer

## AI integration plan (future)
- Abstract chat provider interface
- Agent-specific system instructions
- Retrieval middleware by workspace / knowledge collection
- File upload + extraction pipeline
- Structured output modes (checklist, email draft, summary, legal basis)

## Go-live stages after approval
1. Finalize UI/UX
2. Hook real data layer
3. Add auth/workspace persistence
4. Add AI provider + retrieval
5. Add admin / content ingestion
6. Deploy staging
7. Review
8. Production launch
