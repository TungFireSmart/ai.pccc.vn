# TASKS — ai.pccc.vn

## Current sprint
### Phase 1 — review build
1. [x] Chốt cấu trúc sản phẩm
2. [x] Chọn stack frontend
3. [x] Dựng skeleton app
4. [x] Dựng landing page chất lượng cao
5. [x] Dựng workspace kiểu ChatGPT
6. [x] Tạo dữ liệu mẫu chuyên ngành PCCC để demo
7. [x] Polish giao diện
8. [x] Tăng chiều sâu nội dung PCCC trong các màn hình
9. [x] Làm interaction fidelity cao hơn
10. [x] Chuẩn bị bản demo nội bộ có cảm giác gần-final
11. [x] Chốt technical plan mức kiến trúc
12. [x] Tạo demo script nội bộ
13. [x] Chốt architecture notes mức khung hệ thống
14. [x] Tổ chức lại frontend theo component/config khi prototype đủ ổn
15. [x] Polish UI/interaction sau refactor
16. [x] Chốt Milestone 2 / Phase 1 review build

### Phase 2 — MVP planning + technical foundation
1. [x] Tạo Phase 2 kickoff
2. [x] Chốt MVP scope v1 bản đầu
3. [x] Chốt system modules v1 bản đầu
4. [x] Chốt data model v1 bản đầu
5. [x] Chốt build order v1 bản đầu
6. [x] Chốt auth/workspace/role model chi tiết hơn
7. [x] Chọn backend stack thật
8. [x] Chọn DB/migration/storage baseline
9. [x] Viết implementation roadmap v1
10. [x] Scaffold backend foundation chạy local
11. [x] Test các flow nền: health / auth / workspace / thread / message
12. [x] Thêm files/documents APIs
13. [x] Thêm ingest/chunk pipeline bản đầu
14. [x] Thêm retrieval + citations bản đầu
15. [x] Nối frontend với API thật ở lớp auth/chat cơ bản
16. [x] Thay thêm mock workflow/output blocks bằng state backend ở màn chat
17. [x] Nối document flow UI với files / documents / ingest / retrieve APIs
18. [x] Giảm tách rời giữa review shell và live API panels trong chat
19. [x] Giữ server + app build xanh sau vòng nối state thật
20. [x] Gắn thread với file/document/output entity thật
21. [x] Thay approval / export / output persistence bằng backend state tối thiểu
22. [x] Đổi create-file giả lập sang upload/storage thật
23. [x] Thêm orchestration cơ bản để message/composer kéo theo output/document actions
24. [x] Review UX vòng sau sau khi state thật đi sâu thêm
25. [x] Thêm assistant response / output action layer sâu hơn (beyond minimal persistence)
26. [x] Mở rộng assistant brief sang action history / timeline layer và nối AI Station queue/timeline với backend state hiện có
27. [x] Thêm queue summary endpoint riêng cho AI Station để nhìn nhiều thread thay vì chỉ suy diễn từ thread live gần nhất
28. [x] Mở output history / job log backend-first và đưa drill-down queue item → thread/output/document vào AI Station
29. [~] Cân nhắc rename-delete-share rails hoặc automation rules nếu owner muốn orchestration sâu hơn
   - Đã mở bước đầu cho output action rail: save/update rõ ràng hơn trong Release rail + delete output backend/UI.
   - Đã mở thêm hướng số 2: automation executor bản đầu (`POST /outputs/:id/execute`) bám trên output state + history để tự chạy next step hợp lý nhất trong release flow.
   - Đã harden thêm release workflow backend: soft-delete output để giữ audit trail, và thêm metadata lifecycle tối thiểu (`assigned/reviewed/released/deleted`).
   - Đã mở thêm executor đa mode (`NEXT_STEP`, `FORCE_REVIEW`, `FORCE_EXPORT`, `RESET_FLOW`) và transition guards backend để chặn export sớm khi chưa duyệt.
   - Đã mở assignee rail tối thiểu: chọn member thật của workspace trong Release rail, persist `assignedToId` ở backend và log `ASSIGNED` event vào history.
   - Đã siết thêm policy theo channel: kênh ngoài như `Zalo/Email` bắt buộc có assignee trước khi output được chuyển sang `READY/EXPORTED`, và executor sẽ chặn release nếu thiếu người phụ trách.
   - Đã mở reviewer assignment rõ hơn: có thể chọn reviewer thật từ workspace trong Release rail, persist `reviewedById` ở backend và log `REVIEWER_ASSIGNED` event vào history.
   - Đã siết thêm reviewer-required policy: các output `HANDOFF_NOTE`, `DOCUMENT_EXTRACT` hoặc output đi kênh ngoài bắt buộc có reviewer trước khi được approve/export; executor cũng chặn force export nếu thiếu reviewer.
   - Phần còn lại nếu đi tiếp: policy rules tinh hơn theo desk/role, share/reassign rails sâu hơn, hoặc smoke test chốt cuối trước khi tự claim xong Phase 2.

## Current closeout checklist (owner-requested)
1. [x] Cắt nốt copy còn dài trên web
2. [x] Đồng nhất label / trạng thái còn lẫn Anh–Việt
3. [x] Siết state/status để đọc lướt nhanh
4. [x] Rút gọn hero / review strip / action text
5. [x] Đồng bộ snapshot/tasks/docs với trạng thái thật hiện tại
6. [x] Build và khóa lại bản Phase 1

## Quality bar
- Trông như sản phẩm thật, không như template demo
- Copywriting rõ, ngắn, sang
- Có sự khác biệt ngành PCCC ngay từ first screen
- Không lạm dụng hiệu ứng rối mắt
- Ưu tiên tốc độ và cảm giác premium
- Mỗi màn hình đều phải trả lời được câu hỏi: người dùng PCCC sẽ thấy nó hữu ích ở điểm nào
