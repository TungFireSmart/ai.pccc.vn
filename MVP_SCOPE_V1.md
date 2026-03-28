# MVP SCOPE V1 — ai.pccc.vn

## Mục tiêu MVP
Ra một bản dùng thật được cho nhóm nội bộ nhỏ, tập trung vào **chat + tài liệu + output công việc** trong ngữ cảnh PCCC.

## ICP / người dùng đầu tiên
1. Sale PCCC
2. Kỹ thuật / tư vấn PCCC
3. Hồ sơ thầu / vận hành nội bộ

## 3 use case ưu tiên nhất
### 1) Hỏi đáp + tra cứu tài liệu PCCC
- hỏi theo ngữ cảnh công việc
- trả lời có nguồn
- gợi tài liệu liên quan

### 2) Tóm tắt / bóc tài liệu
- upload PDF / DOCX
- trích ý chính
- bóc checklist / yêu cầu / điểm cần lưu ý

### 3) Soạn output công việc
- draft phản hồi khách
- draft checklist
- draft note kỹ thuật / nội bộ

## In scope cho MVP v1
- đăng nhập cơ bản
- workspace đơn
- role cơ bản
- chat thread
- upload tài liệu
- retrieval cơ bản trên tài liệu đã nạp
- output generation có nguồn / context
- lưu lịch sử chat
- lưu file / output / metadata
- admin cơ bản để quản lý workspace và user

## Out of scope cho MVP v1
- billing thật
- multi-tenant enterprise sâu
- SSO doanh nghiệp hoàn chỉnh
- workflow approval phức tạp như prototype
- automation sâu / agent orchestration nhiều tầng
- external integrations diện rộng
- commercial launch infra hoàn chỉnh

## MVP now vs later
### MVP now
- 1 workspace nội bộ
- 3 vai trò chính: Owner/Admin, Sales, Technical/Bid
- 1 luồng chat chính
- 1 luồng upload + retrieve
- 1 luồng xuất output

### Later
- nhiều workspace
- granular permission chi tiết
- approval rail thật nhiều bước
- audit nâng cao
- library publishing workflow hoàn chỉnh
- team queue / desk orchestration realtime
