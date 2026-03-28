# DATA MODEL V1 — ai.pccc.vn

## Core entities

### users
- id
- email
- password_hash
- full_name
- status
- created_at
- updated_at

### workspaces
- id
- name
- slug
- owner_user_id
- status
- created_at
- updated_at

### workspace_members
- id
- workspace_id
- user_id
- role
- status
- joined_at

### threads
- id
- workspace_id
- title
- created_by
- status
- created_at
- updated_at

### messages
- id
- thread_id
- role
- content
- model
- created_at

### files
- id
- workspace_id
- uploaded_by
- original_name
- mime_type
- storage_path
- size_bytes
- status
- created_at

### thread_files
- id
- thread_id
- file_id
- attached_by
- created_at

### documents
- id
- workspace_id
- file_id
- title
- source_type
- status
- created_at

### document_chunks
- id
- document_id
- chunk_index
- content
- embedding_ref
- token_count

### outputs
- id
- workspace_id
- thread_id
- created_by
- output_type
- title
- content
- status
- created_at
- updated_at

### output_sources
- id
- output_id
- document_id
- chunk_id
- note

### sessions
- id
- user_id
- workspace_id
- token_hash
- expires_at
- created_at

## MVP notes
- Bắt đầu với Postgres làm nguồn dữ liệu chính
- File storage tách riêng (object storage hoặc local-compatible storage)
- Embedding/index có thể tách service sau; v1 chỉ cần schema đủ để gắn vào

## Later
- audits
- approvals
- notifications
- usage events
- billing entities
- granular permissions
