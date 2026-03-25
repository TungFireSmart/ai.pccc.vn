# ARCHITECTURE NOTES — ai.pccc.vn

## Product layers
1. Presentation layer
   - landing, app shell, agent views, tools, library, enterprise
2. Workflow layer
   - sessions, projects, outputs, prompts, activity, context
3. Intelligence layer
   - agents, prompt routing, retrieval, structured outputs
4. Knowledge layer
   - legal docs, technical docs, bid docs, SOP, enterprise memory
5. Platform layer
   - auth, permissions, audit, storage, deployment

## Current prototype emphasis
- presentation layer
- workflow layer (mocked)
- partial intelligence abstractions (conceptual only)

## Next implementation directions
- move from hardcoded state to config-driven sections
- introduce reusable component primitives
- later split routes/components by domain area
