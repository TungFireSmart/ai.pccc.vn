# CURRENT SNAPSHOT — ai.pccc.vn

## Current stage
Phase 2 — **MVP foundation now running through live auth, chat, thread-bound document flow, backend-backed output / approval / export workflow, AI Station multi-thread queue summary, plus drill-down + output job-log rails**

## Current status
- Phase 1 review shell vẫn giữ được cảm giác sản phẩm và app build pass ổn định.
- Backend foundation trong `server/` đang build pass với các flow thật: health, register, login, workspace, thread, message, files, documents, ingest, retrieve.
- Frontend auth/chat không còn chỉ là mock: đã dùng session local thật, workspace thật, thread thật và message thật từ API.
- Chat screen vừa được kéo gần hơn về một màn làm việc thống nhất: live thread controls + live document flow nằm ngay trong khung chat thay vì tách hẳn thành “mock shell + API tester”.
- File list, workflow snapshot, workflow board, output tags và composer footnote giờ đều có thể phản ánh state backend documents/retrieve khi đã đăng nhập.
- Thread ↔ file ↔ document đã gắn được bằng entity thật thay vì chỉ workspace scope.
- Đã có upload/storage tối thiểu: frontend có thể chọn file, đổi sang base64 và backend ghi file thật xuống `server/storage/<workspaceId>/...` rồi lưu path vào DB.
- Message create có thể kéo theo `Output` draft backend thật, và `Output` giờ mang luôn approval/export state tối thiểu (`approvalStatus`, `exportStatus`, `exportChannel`, timestamps`) thay vì chỉ là draft text.
- Đã có route backend thật cho `/outputs` và `PATCH /outputs/:id`, nên approval rail và export rail không còn chỉ đọc dữ liệu mock khi đang ở live thread.
- Composer trong chat giờ có thể tạo output backend có chủ đích theo mode (Draft / Extract / Assign), gắn document đang mở nếu có, rồi đẩy thẳng vào luồng duyệt/xuất.
- Composer không còn chỉ lưu user message + output tối thiểu: backend giờ có orchestration payload, tự sinh assistant response ngắn cho bước kế tiếp, trả về action brief (`nextAction`, approval label, export label, suggested title) và đẩy nó ngay vào thread thật.
- Chat UI đã có `Assistant brief` strip để biến orchestration response thành lớp điều phối nhìn thấy được ngay trong màn làm việc, thay vì để người duyệt phải suy ra từ status rời rạc.
- Chat giờ có thêm `Assistant timeline` đọc từ thread/messages/documents/outputs thật để biến brief đơn lẻ thành một history/log ngắn ngay trong main shell.
- AI Station không còn chỉ dựa vào timeline/queue mock: đã có `Live station sync` panel dùng backend state thật.
- Mới thêm backend route `GET /station/summary` để gom queue/timeline/counts từ nhiều thread cùng lúc, thay vì frontend chỉ suy diễn từ thread live mới nhất.
- AI Station giờ đọc summary nhiều thread trước, rồi mới bám sâu vào lead thread để giữ context detail; nhờ vậy queue nhìn ra được backlog approval/export/evidence trên toàn vùng làm việc nhỏ, không chỉ một thread.
- Queue item trong AI Station giờ không dừng ở aggregate label: có thể chọn từng item để drill xuống đúng thread/output/document tương ứng, thấy metadata thật và mở thẳng sang chat thread liên quan.
- Backend đã có model `OutputEvent` + route `GET /outputs/:id/history`, nên output workflow không còn chỉ có current state; đã có job log/history thật cho các bước create / approval / export.
- Chat `Release rail` giờ có thêm output selector + `Job log` rail đọc từ history backend, còn AI Station cũng có job log khi drill vào queue item loại output.
- Release rail vừa được đẩy thêm một bước từ "xem + patch trạng thái" sang action rail rõ hơn: có thể nạp output vào form, lưu lại title/content/channel ngay trong panel, và xóa output bằng backend route thật.
- Theo hướng số 2, backend đã có automation executor bản đầu qua `POST /outputs/:id/execute`: đọc output state + recent `OutputEvent`, rồi tự chạy bước kế tiếp hợp lý nhất như queue approval, prepare export hoặc execute export.
- Frontend Release rail giờ có nút `Auto-run next step`, nhận về `nextAction` + summary rồi refresh history/state ngay trong cùng panel.
- Release workflow backend vừa được harden thêm một bước quan trọng: `DELETE /outputs/:id` không còn hard-delete làm mất job log nữa, mà chuyển sang soft-delete/archived để giữ audit trail; đồng thời `Output` đã có metadata lifecycle tối thiểu cho `assigned / reviewed / released / deleted`.
- Executor không còn chỉ có một đường `NEXT_STEP`: đã mở thêm các mode `FORCE_REVIEW`, `FORCE_EXPORT`, `RESET_FLOW` để release rail có policy actions rõ hơn thay vì chỉ manual patch hoặc auto-step duy nhất.
- Patch rules backend cho output đã được siết chặt hơn: không thể đẩy `exportStatus` sang `READY/EXPORTED` nếu output chưa `APPROVED`, và output ở trạng thái `CHANGES_REQUESTED` bị chặn không cho giữ export state sẵn xuất.
- Release rail frontend giờ cho chọn automation mode ngay trong panel, nên policy hardening đã nhìn thấy được ở UI chứ không chỉ nằm ẩn trong backend.
- Policy layer được siết thêm theo kênh xuất: với các kênh ngoài như `Zalo` / `Email`, output không thể lên `READY/EXPORTED` nếu chưa có người phụ trách; executor cũng sẽ chặn `FORCE_EXPORT` hoặc giữ lại ở bước `ASSIGN_BEFORE_EXPORT` thay vì cho release mù.
- Release rail UI đã phản ánh guard này bằng cảnh báo tại chỗ khi chọn kênh ngoài mà chưa gán assignee, giúp người review thấy rule ngay trước khi bấm hành động.
- Vừa mở thêm assignee rail backend/UI ở mức tối thiểu: `PATCH /outputs/:id` nhận `assignedToId`, validate người được giao phải là member active của workspace, ghi `ASSIGNED` event vào job log, và panel Release rail có thể chọn/lưu người phụ trách thật từ danh sách thành viên workspace.
- Reviewer policy vừa được siết thêm một tầng: các output kiểu `HANDOFF_NOTE`, `DOCUMENT_EXTRACT` hoặc mọi output đi qua kênh ngoài giờ bắt buộc phải có reviewer rõ ràng trước khi có thể `APPROVED`, `READY` hay `EXPORTED`.
- Executor cũng đã hiểu guard reviewer này: nếu thiếu reviewer thì sẽ chặn `FORCE_EXPORT` hoặc giữ output ở nhịp `REVIEW_BEFORE_EXPORT` thay vì lách qua release flow.
- Release rail frontend giờ hiển thị cảnh báo reviewer-required ngay trong panel output detail và tự persist `reviewedById` cùng các action duyệt/xuất, nên desk-level hardening không còn là logic ẩn ở backend.
- Reviewer layer cũng đã được kéo ra thành entity nhìn thấy được thay vì chỉ là timestamp ngầm: `PATCH /outputs/:id` giờ nhận `reviewedById`, validate reviewer là member active, log `REVIEWER_ASSIGNED` vào history, và Release rail có selector riêng để gán/xóa reviewer thật.
- Khi approve / request changes từ Release rail, reviewer được persist cùng action nếu đã chọn, nên job log và metadata lifecycle giờ đọc được rõ hơn ai là người review chứ không chỉ biết output “đã reviewed”.
- Copy/headings của ba khối live trong chat đã được đổi từ kiểu “ops/API panel” sang ngôn ngữ sản phẩm hơn: `Workspace pulse`, `Evidence`, `Release rail`.
- Trọng tâm kế tiếp không còn là output history cơ bản nữa, mà là nếu cần sẽ mở rộng tiếp sang share/reassign rails hoặc automation rules sâu hơn.

## Những gì mạnh nhất lúc này
- Định vị AI chuyên ngành PCCC vẫn rõ và nhất quán trên cả 4 màn.
- Auth đã có live session/workspace state đủ để làm nền cho app thật.
- Chat đã có live backend state ở cả ba lớp quan trọng: hội thoại, tài liệu và output history.
- Document flow đã đi hết chuỗi file → document → ingest → retrieve với citation data và được bơm vào UI chính thay vì chỉ tồn tại ở backend.
- AI Station đã bắt đầu có cảm giác điều phối thật hơn vì queue không chỉ tổng hợp mà còn drill được xuống artifact cụ thể.
- Cảm giác sản phẩm giờ bớt “demo panel gắn tạm” và gần hơn với một workspace nội bộ đang chạy thật.

## Những gì còn có thể tiếp tục tăng lực
- Mở rộng output workflow từ history cơ bản sang action rõ hơn: rename/delete/reassign/share rails hoặc retry/export jobs sâu hơn.
- Nếu owner muốn đi tiếp theo hướng pilot, bước hợp lý là nối summary/brief/job-log này sang automation rules hoặc action executor thay vì chỉ dừng ở visibility + manual transitions.

## Nếu dừng tại đây để xin duyệt
Bản hiện tại đã đủ để hỏi câu tiếp theo:
**Có chốt Phase 2 sang hướng workspace thật với thread + document operations trước, rồi mới thêm orchestration/output persistence không?**

## Freeze note
- Đây không còn chỉ là prototype review shell; nó đã chạm tới nền MVP thật ở auth/chat/document.
- Mốc hiện tại phù hợp để owner review kiến trúc hướng build tiếp, không nên quay lại polish thuần giao diện quá sớm.
