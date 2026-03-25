# PRODUCT BLUEPRINT — ai.pccc.vn

## 1) Product vision
ai.pccc.vn là nền tảng AI chuyên ngành dành cho người làm PCCC tại Việt Nam: sale, kỹ sư, tư vấn, hồ sơ thầu, đào tạo nội bộ, và quản lý doanh nghiệp.

Mục tiêu không phải là một chatbot chung chung, mà là một workspace AI giúp người dùng:
- hỏi đúng,
- tra đúng,
- soạn đúng,
- làm hồ sơ nhanh hơn,
- và ra quyết định tốt hơn trong ngữ cảnh PCCC Việt Nam.

## 2) Positioning
**Nền tảng AI chuyên ngành PCCC cho người làm nghề tại Việt Nam.**

Tinh thần sản phẩm:
- Quen dùng như ChatGPT
- Hữu ích như một trợ lý nghiệp vụ thật
- Tin cậy hơn nhờ dữ liệu chuyên ngành và quy trình rõ ràng

## 3) Success criteria for internal approval
Bản duyệt đầu tiên cần đạt:
- Giao diện hiện đại, sạch, tạo cảm giác cao cấp
- Trải nghiệm chat mượt, dễ dùng
- Có cấu trúc agent/chế độ làm việc rõ ràng
- Có landing page thuyết phục
- Có ít nhất 3 nhóm use case chuyên ngành PCCC thể hiện rõ giá trị
- Có kiến trúc đủ để sau này gắn AI thật, knowledge base, auth, billing

## 4) Core users
### A. Kinh doanh PCCC
- cần trả lời khách nhanh
- cần soạn báo giá, giải thích cấu hình, gợi ý phương án

### B. Kỹ sư / tư vấn
- cần tra quy chuẩn, tiêu chuẩn, bóc tách yêu cầu, soạn thuyết minh

### C. Hồ sơ thầu / vận hành văn phòng
- cần tóm tắt hồ sơ, trích yêu cầu, soạn tài liệu

### D. Chủ doanh nghiệp / quản lý
- cần AI nội bộ để chuẩn hóa tri thức và tăng tốc đội ngũ

## 5) Phase-1 use cases
1. Hỏi đáp chuyên ngành PCCC
2. Tóm tắt và khai thác tài liệu/hồ sơ
3. Soạn nội dung nghiệp vụ: công văn, mô tả kỹ thuật, checklist, tư vấn khách hàng

## 6) Product pillars
1. **Chat-first experience** — người dùng mở vào là dùng được ngay.
2. **PCCC-native intelligence** — mọi trải nghiệm đều nói ngôn ngữ nghề.
3. **Tool-assisted workflow** — không chỉ trả lời, mà hỗ trợ làm việc.
4. **Trust & traceability** — về sau phải có nguồn viện dẫn/căn cứ.
5. **Enterprise-ready foundation** — sẵn đường cho auth, workspace, phân quyền, dữ liệu riêng.

## 7) IA / main surfaces
- `/` Landing page
- `/app` Main AI workspace
- `/agents` Chuyên gia AI
- `/tools` Bộ công cụ
- `/library` Thư viện tri thức
- `/about` Sứ mệnh

## 8) Initial agents
- Trợ lý Pháp lý PCCC
- Trợ lý Kỹ thuật PCCC
- Trợ lý Hồ sơ thầu
- Trợ lý Kinh doanh PCCC
- Trợ lý Đào tạo nội bộ

## 9) MVP boundaries
### In scope
- Landing page hoàn chỉnh
- App shell kiểu ChatGPT
- Agent switching
- Demo chats/sample prompts
- Upload zone UI
- Saved conversations UI
- Tool cards / library shell

### Out of scope for first internal approval
- Billing thật
- Tích hợp model thật production-grade
- SSO doanh nghiệp
- Knowledge base ingest production
- Domain/go-live infra

## 10) Definition of done for approval build
- Chạy local ổn định
- Responsive desktop/tablet/mobile tốt
- UI có bản sắc riêng, không copy thô OpenAI
- Có câu chuyện sản phẩm rõ ràng từ landing đến app
- Có thể demo end-to-end như một sản phẩm thật
