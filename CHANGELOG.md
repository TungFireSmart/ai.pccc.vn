# CHANGELOG — ai.pccc.vn

## 2026-03-23
- Initialized product workspace for `ai.pccc.vn`.
- Wrote blueprint, roadmap, tasks, content strategy, sitemap, user flows, review guide, technical plan, and demo script.
- Bootstrapped frontend prototype with React + Vite.
- Replaced starter template with a premium multi-screen product prototype.
- Added main surfaces: Home, Workspace, Agents, Tools, Library, Enterprise.
- Expanded workspace with project context, prompts, files, outputs, and activity panels.
- Repeatedly validated production build successfully.
- Refactored frontend prototype to separate UI data (`src/data.ts`) and presentation sections (`src/components.tsx`) from the main app shell.
- Polished the internal review build with command-center stats, use-case sections, richer output preview cards, stronger workspace framing, and upgraded tools/library/enterprise screens.
- Added review-support docs: `REVIEW_SUMMARY.md` and `FINAL_POLISH_CHECKLIST.md`.
- Froze the Milestone 2 review candidate and aligned preview/status docs for owner review.
- Started Milestone 3 push: upgraded workspace with per-agent scenarios, strengthened pre-approval framing, and added `APPROVAL_PREP.md` + `GO_LIVE_AFTER_APPROVAL.md`.
- Added Milestone 3 review-support docs: `OWNER_WALKTHROUGH.md` and `PRE_APPROVAL_NOTES.md`, and upgraded the demo/review scripts for decision-oriented walkthroughs.
- Added a scenario-brief layer inside the workspace so agent switching communicates role/mode/next-step more clearly at first glance.
- Added `CURRENT_SNAPSHOT.md` as a quick status card for the current pre-approval state.
- Added an `approval-strip` in the workspace to make the pre-approval evaluation lens more explicit.
- Added a pre-approval question deck on Home and an after-approval roadmap block on Enterprise to make the build more decision-ready.
- Added `DECISION_SHEET.md` so owner review can converge into concrete next-step choices faster.
- Added a sticky `review-quickbar` across the app to make the review path obvious at first glance.
- Shipped the next Milestone 3 checkpoint: chat management now includes ownership, SLA/unread cues, artifact/file context, and stronger thread controls.
- Strengthened auth UX with trust-state messaging, device/session/security cues, richer signup/SSO/reset/invite states, and clearer workspace-entry framing.
- Upgraded AI Station with team roster, handoff queue, usage/admin cues, and a more credible operating-layer narrative for productization review.
- Deepened the next checkpoint with richer operational state: chat thread priority + handoff checklist + activity rail + composer modes.
- Strengthened auth/admin trust with session center, approval messaging, recovery clarity, and more realistic workspace-entry states.
- Added AI Station access matrix and policy center so role scope, seat logic, and workspace governance feel more productized.
