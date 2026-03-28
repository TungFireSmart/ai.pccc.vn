# BUILD ORDER V1 — ai.pccc.vn

## Order of execution

### Step 1 — Foundation
- chọn backend stack
- chọn DB + migration tool
- chọn file storage approach
- tạo env structure

### Step 2 — Auth + Workspace
- users
- login/session
- workspace
- member roles

### Step 3 — Chat base
- threads
- messages
- thread list/detail APIs

### Step 4 — File + Document ingest
- upload file
- attach file vào thread
- document records
- chunking pipeline

### Step 5 — Retrieval + citations
- retrieve chunks
- attach sources vào answer/output
- hiển thị nguồn cơ bản

### Step 6 — Output generation
- draft output theo thread context
- save output
- reopen/edit/export basic

### Step 7 — Admin basic
- member list
- role change
- file/document visibility

## Rule
- Không làm retrieval thật trước khi xong auth/workspace/thread/file base
- Không làm approval phức tạp trước khi xong output v1
- Không làm multi-workspace sâu trước khi 1 workspace dùng ổn
