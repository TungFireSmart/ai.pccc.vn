# BACKEND BASELINE OPTIONS — ai.pccc.vn

## Recommended baseline
### App/API
- Next.js app router hoặc frontend tách riêng + NestJS/Express backend
- Nếu ưu tiên tốc độ triển khai: **Next.js fullstack + route handlers**

### Database
- **Postgres**

### ORM / migrations
- **Prisma** hoặc **Drizzle**
- Ưu tiên: Prisma nếu muốn đi nhanh và dễ đọc schema

### File storage
- S3-compatible storage
- local-compatible ở môi trường dev

### Retrieval layer
- v1 có thể dùng Postgres + pgvector hoặc tách vector DB sau
- ưu tiên ít thành phần trước, miễn đủ chạy thật

## Practical recommendation for MVP v1
- Frontend/App: **Next.js**
- DB: **Postgres**
- ORM: **Prisma**
- File: **S3-compatible storage**
- Vector: **pgvector** trước

## Why
- ít mảnh ghép
- đi nhanh cho MVP
- đủ đường mở rộng về sau
- dễ tuyển/dev handoff hơn
