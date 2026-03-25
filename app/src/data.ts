export type Screen = 'home' | 'auth' | 'chat' | 'station'

export type NavItem = { key: Screen; label: string }
export type Feature = { title: string; description: string }
export type Stat = { label: string; value: string; note: string }
export type Persona = { title: string; summary: string; outputs: string[] }
export type Message = { role: 'assistant' | 'user'; content: string; meta?: string }
export type ChatThread = {
  title: string
  preview: string
  segment: string
  state: string
  active?: boolean
  updatedAt: string
}
export type StationCard = { title: string; description: string; items: string[] }
export type WorkspaceBoard = { title: string; status: string; summary: string }
export type AuthStage = {
  key: string
  title: string
  description: string
  badge: string
  helper: string
}
export type FlowStep = { title: string; caption: string }
export type InboxItem = { label: string; note: string; tone?: 'default' | 'good' | 'warning' }
export type AccountCard = { title: string; lines: string[]; badge?: string }

export const navItems: NavItem[] = [
  { key: 'home', label: 'Trang chủ' },
  { key: 'auth', label: 'Đăng nhập' },
  { key: 'chat', label: 'Chat app' },
  { key: 'station', label: 'AI Station' },
]

export const heroStats: Stat[] = [
  { label: 'Use case mũi nhọn', value: '06', note: 'Tra cứu · bóc hồ sơ · sale · kỹ thuật · HSMT · knowledge' },
  { label: 'Trải nghiệm cốt lõi', value: 'Chat-first', note: 'Quen như ChatGPT nhưng đã gắn ngữ cảnh doanh nghiệp PCCC' },
  { label: 'Sẵn để productize', value: 'Auth + workspace', note: 'Có khung cho member, role, admin, billing và controls' },
]

export const productFeatures: Feature[] = [
  {
    title: 'Chat app giống sản phẩm thật hơn',
    description: 'Không chỉ là message list. Có sidebar quản lý conversation, context rail, output rail, gợi ý hành động và composer nhiều trạng thái.',
  },
  {
    title: 'Auth có nhiều điểm chạm rõ ràng',
    description: 'Login, signup, Google, email, reset password, team invite và workspace entry được gom thành một narrative SaaS mạch lạc.',
  },
  {
    title: 'Quản trị người dùng và workspace đã được gợi hình',
    description: 'Có user menu, account center, workspace plan, role matrix, admin note và concept billing để người duyệt nhìn thấy đường product rõ hơn.',
  },
  {
    title: 'PCCC Vietnam là lõi chứ không phải lớp trang trí',
    description: 'Prompt, thread, output, phòng ban và sample scenario đều bám sát sale, hồ sơ, căn cứ và kỹ thuật PCCC Việt Nam.',
  },
]

export const personas: Persona[] = [
  {
    title: 'Sale PCCC',
    summary: 'Cần draft phản hồi nhanh, tóm nhu cầu và biết rõ còn thiếu dữ liệu gì trước khi tạo lead hay báo giá.',
    outputs: ['Draft Zalo / email', 'Checklist hỏi thêm', 'Khung đề xuất cấu hình'],
  },
  {
    title: 'Kỹ thuật / tư vấn',
    summary: 'Cần bóc yêu cầu từ PDF, nhận diện scope và tạo thuyết minh ngắn gọn để phối hợp với sale.',
    outputs: ['Checklist kỹ thuật', 'Tóm tắt hệ thống', 'Nháp thuyết minh'],
  },
  {
    title: 'Hồ sơ thầu',
    summary: 'Cần rà các mục dễ thiếu, bám deadline và chia việc cho nội bộ bằng output có thể dùng ngay.',
    outputs: ['Checklist nộp thầu', 'Danh sách rủi ro', 'Email phân việc'],
  },
  {
    title: 'Admin / quản lý',
    summary: 'Cần kiểm soát thành viên, vai trò, workspace plan và cách tri thức nội bộ đang được dùng.',
    outputs: ['Bảng role', 'Audit summary', 'Workspace controls'],
  },
]

export const authStages: AuthStage[] = [
  {
    key: 'login',
    title: 'Đăng nhập',
    description: 'Dành cho thành viên quay lại workspace hiện có bằng email công việc hoặc Google.',
    badge: 'Returning user',
    helper: 'Giữ nhịp làm việc với lịch sử chat, project context và output gần nhất.',
  },
  {
    key: 'signup',
    title: 'Tạo tài khoản',
    description: 'Khởi tạo tài khoản mới cho cá nhân hoặc trưởng nhóm đang đánh giá AI Station.',
    badge: 'New workspace',
    helper: 'Làm rõ giá trị ngay từ ngày đầu bằng use case theo ngành PCCC.',
  },
  {
    key: 'google',
    title: 'Google SSO',
    description: 'Đăng nhập nhanh cho owner, leader hoặc user được mời qua domain công ty.',
    badge: 'Fast path',
    helper: 'Tối giản friction khi demo hoặc onboarding team nhỏ.',
  },
  {
    key: 'reset',
    title: 'Quên mật khẩu',
    description: 'Flow email reset với message an tâm, rõ thời gian hiệu lực và bước quay lại workspace.',
    badge: 'Recovery',
    helper: 'Không để user rơi khỏi luồng khi đang cần vào dự án gấp.',
  },
  {
    key: 'invite',
    title: 'Vào team',
    description: 'Màn chấp nhận lời mời vào workspace, chọn vai trò và xác nhận phạm vi dữ liệu được thấy.',
    badge: 'Team entry',
    helper: 'Rõ ràng cho sale, kỹ thuật, hồ sơ và admin ngay lúc gia nhập.',
  },
]

export const authBenefits: Feature[] = [
  {
    title: 'Cá nhân dùng thử vẫn có chỗ đứng riêng',
    description: 'Prompt starter, sample library và chat use case giúp người mới thấy giá trị trước khi cần setup phức tạp.',
  },
  {
    title: 'Team onboarding ngắn nhưng có chiều sâu',
    description: 'Có workspace name, team size, industry focus, ưu tiên use case và vai trò thành viên ngay trong concept.',
  },
  {
    title: 'Enterprise narrative rõ ngay từ auth',
    description: 'SSO, workspace isolation, admin controls và billing owner được đặt đúng chỗ trong câu chuyện sản phẩm.',
  },
]

export const authFlowSteps: FlowStep[] = [
  { title: '1. Identify', caption: 'Google · email · invite token · recovery link' },
  { title: '2. Verify', caption: 'OTP / password / domain policy / access scope' },
  { title: '3. Enter workspace', caption: 'Role-aware landing cho sale, kỹ thuật, hồ sơ hoặc admin' },
]

export const chatThreads: ChatThread[] = [
  {
    title: 'Rà HSMT nhà xưởng 5 tầng',
    preview: 'Checklist kỹ thuật + email phân việc + 3 chỗ cần xác minh',
    segment: 'Đang ghim',
    state: 'Active · shared with Bid Desk',
    updatedAt: '2 phút trước',
    active: true,
  },
  {
    title: 'Phản hồi khách hỏi tủ bơm chữa cháy',
    preview: 'Draft sale + thông tin cần hỏi thêm + note giá bán lẻ',
    segment: 'Hôm nay',
    state: 'Waiting customer info',
    updatedAt: '12 phút trước',
  },
  {
    title: 'Tra cứu căn cứ thoát nạn công trình hỗn hợp',
    preview: 'Tóm tắt căn cứ + điểm dễ nhầm + note cần kiểm tra chéo',
    segment: 'Hôm qua',
    state: 'Archived concept',
    updatedAt: 'Hôm qua',
  },
  {
    title: 'Onboarding kỹ sư mới vào thư viện nội bộ',
    preview: 'FAQ nội bộ + checklist tuần đầu + SOP cần đọc',
    segment: 'Templates',
    state: 'Rename suggested',
    updatedAt: '2 ngày trước',
  },
]

export const conversationStates: InboxItem[] = [
  { label: 'Đổi tên hội thoại', note: 'Gợi ý tên theo công trình, khách hàng hoặc loại hồ sơ để sidebar gọn hơn.' },
  { label: 'Lưu trữ', note: 'Ẩn thread đã xong khỏi active list nhưng vẫn giữ context và output đã sinh.' },
  { label: 'Xóa', note: 'Cho thao tác nguy hiểm vào vùng riêng với warning rõ, tránh nhầm khi dọn sidebar.', tone: 'warning' },
]

export const suggestedPrompts = [
  'Tóm tắt HSMT này thành checklist nộp hồ sơ có mức ưu tiên',
  'Soạn phản hồi khách hỏi hệ thống báo cháy cho nhà xưởng 3.000m²',
  'Rút gọn căn cứ áp dụng cho công trình hỗn hợp 12 tầng thành 1 trang',
  'Tạo bảng câu hỏi kỹ thuật để sale khai thác đủ đầu vào trước báo giá',
]

export const chatMessages: Message[] = [
  {
    role: 'assistant',
    meta: 'AI PCCC Copilot · Bid Desk mode',
    content: 'Chào anh. Em đã nhận 4 file của gói thầu nhà xưởng Bình Dương. Em đang bóc nhanh theo 6 nhóm: phạm vi hệ thống, tiêu chuẩn áp dụng, thiết bị bắt buộc, hồ sơ năng lực, điều kiện thương mại và các điểm cần kỹ thuật xác nhận.',
  },
  {
    role: 'user',
    meta: 'Project: Nhà xưởng Bình Dương',
    content: 'Ưu tiên cho tôi checklist rà nhanh HSMT và đánh dấu các mục dễ thiếu trước deadline 17h hôm nay. Nếu được thì soạn luôn draft email phân việc cho đội hồ sơ.',
  },
  {
    role: 'assistant',
    meta: 'Working draft · 18 mục · 3 risk flags',
    content: 'Em đã tạo checklist 18 mục, trong đó có 3 điểm đỏ: năng lực nhân sự, xác nhận xuất xứ thiết bị và biểu mẫu tiến độ. Em cũng đề xuất email phân việc chia cho kỹ thuật, hồ sơ và sale để chốt các phần còn thiếu trong vòng 90 phút.',
  },
  {
    role: 'assistant',
    meta: 'Next actions',
    content: 'Nếu anh muốn, bước tiếp theo em có thể xuất ngay 3 output song song: checklist nộp thầu, email phân việc và note hỏi kỹ thuật. Em sẽ giữ chung context để không bị lệch giữa các bản nháp.',
  },
]

export const chatSideOutputs = [
  'Checklist rà HSMT — 18 mục',
  'Email nội bộ phân việc — draft ready',
  'Danh sách 3 rủi ro dễ thiếu',
  'Note căn cứ áp dụng — 1 trang',
]

export const workspacePulse: InboxItem[] = [
  { label: 'Project context', note: 'Nhà xưởng Bình Dương · deadline 17:00 · phối hợp sale + hồ sơ + kỹ thuật' },
  { label: 'Knowledge attached', note: 'QC06, TCVN liên quan, checklist nội bộ, email template', tone: 'good' },
  { label: 'Need review', note: 'Chờ kỹ thuật xác nhận 3 hạng mục trước khi chốt final package' },
]

export const accountCards: AccountCard[] = [
  {
    title: 'Tài khoản & hồ sơ',
    badge: 'Owner',
    lines: ['Tùng · admin@pccc.vn', 'Workspace mặc định: AI Station PCCC Vietnam', 'Thông báo: email + in-app'],
  },
  {
    title: 'Workspace & vai trò',
    badge: '08 members',
    lines: ['Roles: Owner · Admin · Sales Lead · Technical · Bid', 'Guest access tách riêng theo project', 'Team invite có scope theo desk'],
  },
  {
    title: 'Billing & admin',
    badge: 'Pro Team',
    lines: ['Billing owner: admin@pccc.vn', 'SSO / audit / private library là roadmap nâng cấp', 'Usage summary hiển thị theo workspace thay vì user đơn lẻ'],
  },
]

export const stationBoards: WorkspaceBoard[] = [
  {
    title: 'Dự án đang mở',
    status: 'Nhà xưởng 5 tầng · Bình Dương',
    summary: 'Bóc yêu cầu báo cháy + chữa cháy, chờ kỹ thuật xác nhận 3 hạng mục thiết bị.',
  },
  {
    title: 'Pipeline hôm nay',
    status: '05 việc ưu tiên',
    summary: '2 lead cần phản hồi, 1 HSMT cần rà, 1 bộ SOP cần chuẩn hóa, 1 yêu cầu tra cứu căn cứ.',
  },
  {
    title: 'Knowledge signal',
    status: 'Library cập nhật',
    summary: 'Đã đồng bộ bộ quy chuẩn, mẫu checklist và 12 SOP nội bộ cho trải nghiệm RAG sau này.',
  },
]

export const stationCards: StationCard[] = [
  {
    title: 'Sales Desk',
    description: 'Khu làm việc cho lead, phản hồi khách và nháp báo giá ban đầu.',
    items: ['Tóm tắt nhu cầu khách', 'Draft Zalo / email phản hồi', 'Checklist thông tin còn thiếu'],
  },
  {
    title: 'Technical Desk',
    description: 'Khung xử lý hồ sơ kỹ thuật, bóc scope và chuẩn bị thuyết minh.',
    items: ['Đọc PDF / DOCX', 'Checklist nghiệm thu', 'Khung thuyết minh giải pháp'],
  },
  {
    title: 'Bid Desk',
    description: 'Tập trung vào HSMT, hồ sơ năng lực và deadline nộp thầu.',
    items: ['Rà điều kiện thương mại', 'Danh sách rủi ro bị loại', 'Email phân việc nội bộ'],
  },
  {
    title: 'Knowledge Desk',
    description: 'Biến SOP, FAQ và tài liệu nội bộ thành tài sản AI của doanh nghiệp.',
    items: ['Chuẩn hóa thư viện', 'Tạo FAQ onboarding', 'Gắn nguồn cho workspace'],
  },
]

export const stationTimeline = [
  '08:10 · Sales Desk tạo draft phản hồi khách hỏi tủ bơm chữa cháy',
  '09:00 · Bid Desk sinh checklist nộp hồ sơ cho gói thầu cải tạo PCCC',
  '10:20 · Technical Desk bóc 3 hạng mục cần kỹ sư xác nhận',
  '11:05 · Knowledge Desk thêm SOP nghiệm thu vào library nội bộ',
]

export const stationSignals: Stat[] = [
  { label: 'Workspace active', value: '06', note: 'Theo dự án, phòng ban hoặc nhóm use case' },
  { label: 'Output reusable', value: '12+', note: 'Checklist, FAQ, email, note pháp lý, brief kỹ thuật' },
  { label: 'Enterprise path', value: 'Ready', note: 'Có chỗ để cắm auth, audit, library và team controls' },
]
