# AUTH + WORKSPACE MODEL V1 — ai.pccc.vn

## MVP roles
### 1. Owner/Admin
- quản lý workspace
- quản lý member
- quản lý tài liệu
- xem toàn bộ thread

### 2. Sales
- tạo và dùng thread sale
- xem tài liệu được chia sẻ
- tạo output trong phạm vi được phép

### 3. Technical/Bid
- dùng thread kỹ thuật / hồ sơ
- xem tài liệu được chia sẻ
- tạo output kỹ thuật / checklist / note

## MVP auth model
- email + password
- session-based auth
- password reset
- basic protected routes
- optional Google login ở vòng sau gần MVP

## Workspace model
- v1 ưu tiên 1 workspace nội bộ dùng thật
- mỗi user có thể là member của workspace
- role gắn ở `workspace_members`
- thread, file, output đều thuộc workspace

## Access rules v1
- user phải là member mới vào được workspace
- owner/admin thấy toàn bộ
- sales / technical chỉ thấy các tài nguyên được phép trong workspace
- document/file visibility bắt đầu ở mức đơn giản, không đi quá granular ở v1

## Later
- multi-workspace thực sự
- granular permissions theo desk / folder / document
- audit đầy đủ
- approval workflow thật
- SSO doanh nghiệp
