export type Screen = 'home' | 'auth' | 'chat' | 'station'
export type WorkspaceModeKey = 'owner' | 'sales' | 'technical' | 'bid' | 'knowledge'
export type ExportState = 'Draft' | 'Needs approval' | 'Approved' | 'Ready to share'
export type FlowStageKey = 'review' | 'approve' | 'export' | 'share'

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
  owner: string
  unread?: string
  sla: string
  priority: 'Critical' | 'High' | 'Normal'
  handoff: string
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
export type MiniMetric = { label: string; value: string; note: string }
export type FileItem = { name: string; kind: string; status: string }
export type AuthTrustItem = { label: string; detail: string; tone?: 'default' | 'good' | 'warning' }
export type TeamMember = { name: string; role: string; status: string; focus: string }
export type StationQueueItem = { task: string; owner: string; eta: string; status: string }
export type ActivityItem = { time: string; title: string; detail: string; tone?: 'default' | 'good' | 'warning' }
export type HandoffStep = { label: string; detail: string; done: boolean }
export type AuthSession = { device: string; location: string; status: string; lastSeen: string }
export type AccessRow = { role: string; scope: string; approval: string; seat: string }
export type PolicyItem = { label: string; detail: string; status: string }
export type ApprovalStep = { label: string; owner: string; status: 'Done' | 'Active' | 'Pending'; note: string }
export type ExportArtifact = { name: string; channel: string; state: ExportState; eta: string; note: string }
export type WorkspaceMode = {
  key: WorkspaceModeKey
  label: string
  landing: string
  workspaceState: string
  primaryGoal: string
  canApprove: string
  focus: string[]
}
export type FlowStage = {
  key: FlowStageKey
  label: string
  owner: string
  status: 'Live' | 'Next' | 'Queued'
  detail: string
}
export type TransitionMoment = {
  from: string
  to: string
  eta: string
  status: 'Active' | 'Queued' | 'Ready'
  note: string
}

export type ThreadContextPack = {
  threadTitle: string
  workspaceName: string
  projectLabel: string
  deskLabel: string
  authStageKey: string
  authWorkspaceHint: string
  authTrustNote: string
  roleLandingLabel: string
  roleWorkspaceState: string
  metrics: MiniMetric[]
  files: FileItem[]
  outputs: string[]
  pulse: InboxItem[]
  activities: ActivityItem[]
  handoffSteps: HandoffStep[]
  approvalSteps: ApprovalStep[]
  exportArtifacts: ExportArtifact[]
  messages: Message[]
  stageFlow: FlowStage[]
  transitionMoments: TransitionMoment[]
  stationBoard: WorkspaceBoard
  stationFocus: {
    queueLead: StationQueueItem
    policyLead: PolicyItem
    rosterNote: string
    adminHeadline: string
    reviewLabel: string
  }
}

export const workspaceModes: WorkspaceMode[] = [
  {
    key: 'owner',
    label: 'Owner',
    landing: 'Owner hub',
    workspaceState: 'Theo dõi deadline, quyền và approval trên toàn workspace',
    primaryGoal: 'Gỡ bottleneck và duyệt các output có ảnh hưởng ra ngoài.',
    canApprove: 'Export, role, publish',
    focus: ['Approval queue', 'Cross-desk health', 'External-safe output'],
  },
  {
    key: 'sales',
    label: 'Sales',
    landing: 'Sales board',
    workspaceState: 'Tập trung SLA phản hồi, thiếu dữ liệu khách và draft gửi ra ngoài',
    primaryGoal: 'Giữ lead nóng nhưng không tạo lead/báo giá sai dữ liệu.',
    canApprove: 'Sales-safe customer drafts trong phạm vi desk',
    focus: ['SLA', 'Customer-safe draft', 'Lead data gate'],
  },
  {
    key: 'technical',
    label: 'Technical',
    landing: 'Technical queue',
    workspaceState: 'Ưu tiên scope, model, tiêu chuẩn và sign-off trước khi gửi',
    primaryGoal: 'Xác nhận phần kỹ thuật trước khi thread đi tiếp sang export.',
    canApprove: 'Technical sign-off cho note và checklist',
    focus: ['Model verification', 'Standards check', 'Cờ đỏ'],
  },
  {
    key: 'bid',
    label: 'Bid',
    landing: 'Bid board',
    workspaceState: 'Giữ nhịp checklist, hồ sơ thiếu và phối hợp liên phòng',
    primaryGoal: 'Chốt bộ nộp thầu đúng deadline, không rơi bước bàn giao.',
    canApprove: 'Internal handoff package trước export',
    focus: ['Deadline risk', 'Artifact completeness', 'Owner escalation'],
  },
  {
    key: 'knowledge',
    label: 'Knowledge',
    landing: 'Knowledge queue',
    workspaceState: 'Giữ nguồn, peer review và library hygiene trước khi publish',
    primaryGoal: 'Biến note thành tài sản dùng chung mà không sai viện dẫn.',
    canApprove: 'Library-ready summary sau peer review',
    focus: ['Source hygiene', 'Peer review', 'Reusable output'],
  },
]

export const navItems: NavItem[] = [
  { key: 'home', label: 'Trang chủ' },
  { key: 'auth', label: 'Đăng nhập' },
  { key: 'chat', label: 'Chat app' },
  { key: 'station', label: 'AI Station' },
]

export const heroStats: Stat[] = [
  { label: 'Use case', value: '08', note: 'Tra cứu · hồ sơ · sale · kỹ thuật · HSMT · SOP · routing · audit' },
  { label: 'Cốt lõi', value: 'Chat-first', note: 'Quen như ChatGPT nhưng có cảm giác làm việc thật.' },
  { label: 'Sẵn để làm thật', value: 'Auth + station', note: 'Có trust, phân quyền và lớp admin rõ hơn.' },
]

export const productFeatures: Feature[] = [
  {
    title: 'Chat giống một công cụ làm việc thật',
    description: 'Thread có owner, SLA, file context và output queue rõ ràng.',
  },
  {
    title: 'Auth là vào đúng workspace, đúng quyền',
    description: 'Có trust checks, phiên đăng nhập, nhận diện thiết bị và duyệt quyền.',
  },
  {
    title: 'AI Station là tầng điều hành, không chỉ là trang admin',
    description: 'Có roster, queue, desk, quyền và usage rõ ràng.',
  },
  {
    title: 'PCCC vẫn là lõi sản phẩm',
    description: 'Toàn bộ flow bám sát sale, kỹ thuật, hồ sơ và thư viện nội bộ PCCC.',
  },
]

export const personas: Persona[] = [
  {
    title: 'Sale PCCC',
    summary: 'Cần phản hồi nhanh và biết còn thiếu dữ liệu gì trước khi tạo lead hay báo giá.',
    outputs: ['Draft Zalo / email', 'Checklist hỏi thêm', 'Brief bàn giao cho kỹ thuật'],
  },
  {
    title: 'Kỹ thuật / tư vấn',
    summary: 'Cần bóc yêu cầu từ PDF và trả note xác nhận đúng context.',
    outputs: ['Checklist kỹ thuật', 'Tóm tắt hệ thống', 'Note xác nhận thiết bị'],
  },
  {
    title: 'Hồ sơ thầu',
    summary: 'Cần rà mục dễ thiếu, bám deadline và biết ai đang giữ việc gì.',
    outputs: ['Checklist nộp thầu', 'Danh sách rủi ro', 'Email phân việc'],
  },
  {
    title: 'Owner / Admin',
    summary: 'Cần kiểm soát thành viên, quyền và usage của workspace.',
    outputs: ['Role matrix', 'Audit snapshot', 'Usage & access review'],
  },
]

export const authStages: AuthStage[] = [
  {
    key: 'login',
    title: 'Đăng nhập',
    description: 'Dành cho thành viên quay lại bằng email công việc hoặc Google.',
    badge: 'Quay lại',
    helper: 'Giữ nhịp làm việc với lịch sử chat và thiết bị tin cậy.',
  },
  {
    key: 'signup',
    title: 'Tạo tài khoản',
    description: 'Tạo tài khoản mới cho cá nhân hoặc trưởng nhóm.',
    badge: 'Workspace mới',
    helper: 'Onboarding ngắn nhưng vẫn rõ use case, team và desk ưu tiên.',
  },
  {
    key: 'google',
    title: 'Google SSO',
    description: 'Đăng nhập nhanh cho owner, leader hoặc người được mời.',
    badge: 'Nhanh',
    helper: 'Flow giống SaaS B2B thật: đúng domain, đúng workspace, đúng quyền.',
  },
  {
    key: 'reset',
    title: 'Quên mật khẩu',
    description: 'Flow reset rõ thời gian hiệu lực và đường quay lại.',
    badge: 'Khôi phục',
    helper: 'Có thêm tín hiệu bảo mật và cách khôi phục khi cần.',
  },
  {
    key: 'invite',
    title: 'Vào team',
    description: 'Màn nhận lời mời, chọn vai trò và phạm vi dữ liệu.',
    badge: 'Vào team',
    helper: 'Rõ cho sale, kỹ thuật, hồ sơ và admin ngay lúc gia nhập.',
  },
]

export const authBenefits: Feature[] = [
  {
    title: 'Trust ngay trong giao diện',
    description: 'Workspace match, thiết bị tin cậy và invite scope giúp auth đáng tin hơn.',
  },
  {
    title: 'Onboarding nói đúng ngôn ngữ doanh nghiệp PCCC',
    description: 'Use case, desk, library access và duyệt quyền được đặt ngay trong flow tạo tài khoản.',
  },
  {
    title: 'Đủ nền cho enterprise path',
    description: 'SSO, duyệt quyền và recovery flow cho thấy đường phát triển rõ ràng.',
  },
]

export const authFlowSteps: FlowStep[] = [
  { title: '1. Identify', caption: 'Google · email · invite · recovery · trusted device' },
  { title: '2. Verify', caption: 'OTP / password / domain policy / MFA / access scope' },
  { title: '3. Enter workspace', caption: 'Landing theo vai trò cho sale, kỹ thuật, hồ sơ hoặc owner' },
]

export const chatThreads: ChatThread[] = [
  {
    title: 'Rà HSMT nhà xưởng 5 tầng',
    preview: 'Checklist kỹ thuật + email phân việc + 3 chỗ cần xác minh',
    segment: 'Đang ghim',
    state: 'Đang làm · Bid Desk',
    updatedAt: '2 phút trước',
    owner: 'Bid Desk',
    unread: '03 updates',
    sla: 'Deadline 17:00',
    priority: 'Critical',
    handoff: 'Chờ kỹ thuật chốt',
    active: true,
  },
  {
    title: 'Phản hồi khách hỏi tủ bơm chữa cháy',
    preview: 'Draft sale + thông tin cần hỏi thêm + note giá bán lẻ',
    segment: 'Hôm nay',
    state: 'Chờ thông tin khách',
    updatedAt: '12 phút trước',
    owner: 'Sales Desk',
    unread: 'Chờ khách',
    sla: 'Phản hồi <30m',
    priority: 'High',
    handoff: 'Waiting final customer contact fields',
  },
  {
    title: 'Tra cứu căn cứ thoát nạn công trình hỗn hợp',
    preview: 'Tóm tắt căn cứ + điểm dễ nhầm + note cần kiểm tra chéo',
    segment: 'Hôm qua',
    state: 'Sẵn để xuất',
    updatedAt: 'Hôm qua',
    owner: 'Knowledge Desk',
    unread: 'Không có mới',
    sla: 'Cần peer review',
    priority: 'Normal',
    handoff: 'Peer review before publish',
  },
  {
    title: 'Onboarding kỹ sư mới vào thư viện nội bộ',
    preview: 'FAQ nội bộ + checklist tuần đầu + SOP cần đọc',
    segment: 'Templates',
    state: 'Đổi tên suggested',
    updatedAt: '2 ngày trước',
    owner: 'Admin Desk',
    unread: '01 suggestion',
    sla: 'Giữ template',
    priority: 'Normal',
    handoff: 'Sẵn dọn template',
  },
]

export const conversationStates: InboxItem[] = [
  { label: 'Đổi tên hội thoại', note: 'Gợi ý tên theo công trình, khách hàng hoặc loại hồ sơ.' },
  { label: 'Giao cho desk khác', note: 'Chuyển ownership nhưng vẫn giữ chat và file context.', tone: 'good' },
  { label: 'Lưu trữ', note: 'Ẩn thread đã xong nhưng vẫn giữ lịch sử và file.' },
  { label: 'Xóa', note: 'Đưa thao tác nguy hiểm vào vùng riêng để tránh bấm nhầm.', tone: 'warning' },
]

export const suggestedPrompts = [
  'Tóm tắt HSMT này thành checklist nộp hồ sơ có mức ưu tiên',
  'Soạn phản hồi khách hỏi hệ thống báo cháy cho nhà xưởng 3.000m²',
  'Rút gọn căn cứ áp dụng cho công trình hỗn hợp 12 tầng thành 1 trang',
  'Tạo bảng câu hỏi kỹ thuật để sale khai thác đủ đầu vào trước báo giá',
]

export const authTrustItems: AuthTrustItem[] = [
  { label: 'Workspace match', detail: 'Email admin@pccc.vn khớp workspace', tone: 'good' },
  { label: 'Tin cậy device', detail: 'MacBook này đã đăng nhập nhiều lần trong 30 ngày qua', tone: 'good' },
  { label: 'Session notice', detail: 'Có 1 phiên đang hoạt động tại Hà Nội' },
  { label: 'Fallback recovery', detail: 'Luôn có recovery email và mã 2FA dự phòng', tone: 'warning' },
]

export const authSessions: AuthSession[] = [
  { device: 'MacBook Pro · Chrome', location: 'Hà Nội office', status: 'Hiện tại', lastSeen: 'Đang hoạt động' },
  { device: 'iPhone · Safari', location: 'Hà Nội', status: 'Tin cậy', lastSeen: '17 phút trước' },
  { device: 'Windows laptop · Edge', location: 'TP.HCM', status: 'Cần xem', lastSeen: '2 ngày trước' },
]

export const stationSignals: Stat[] = [
  { label: 'Workspace', value: '06', note: 'Theo dự án, desk hoặc use case' },
  { label: 'Output reuse', value: '18+', note: 'Checklist, FAQ, email, note pháp lý' },
  { label: 'Scale path', value: 'Credible', note: 'Có chỗ cho auth, audit và usage' },
]

export const accountCards: AccountCard[] = [
  {
    title: 'Tài khoản & hồ sơ',
    badge: 'Owner',
    lines: ['Tùng · admin@pccc.vn', 'Workspace: AI Station PCCC Vietnam', 'Thông báo: email + in-app + bảo mật'],
  },
  {
    title: 'Workspace & vai trò',
    badge: '08 người',
    lines: ['Roles: Owner · Admin · Sales Lead · Technical · Bid', 'Guest access theo project', 'Team invite theo desk và thư viện'],
  },
  {
    title: 'Billing & admin',
    badge: 'Pro',
    lines: ['Billing: admin@pccc.vn', 'Usage theo workspace', 'SSO / audit / private library là roadmap'],
  },
]

export const stationBoards: WorkspaceBoard[] = [
  {
    title: 'Dự án mở',
    status: 'Nhà xưởng 5 tầng · Bình Dương',
    summary: 'Đang bóc yêu cầu, chờ kỹ thuật xác nhận 3 hạng mục.',
  },
  {
    title: 'Việc hôm nay',
    status: '07 việc ưu tiên',
    summary: '2 lead cần phản hồi, 1 HSMT cần rà, 1 SOP cần chuẩn hóa.',
  },
  {
    title: 'Tín hiệu tri thức',
    status: 'Library cập nhật',
    summary: 'Đã đồng bộ quy chuẩn, checklist, SOP bid desk và FAQ onboarding.',
  },
]

export const stationCards: StationCard[] = [
  {
    title: 'Sales Desk',
    description: 'Khu làm việc cho lead, phản hồi khách và nháp báo giá ban đầu.',
    items: ['Tóm tắt nhu cầu', 'Draft Zalo / email', 'Checklist còn thiếu'],
  },
  {
    title: 'Technical Desk',
    description: 'Xử lý hồ sơ kỹ thuật, bóc scope và chuẩn bị thuyết minh.',
    items: ['Đọc PDF / DOCX', 'Checklist nghiệm thu', 'Khung thuyết minh giải pháp'],
  },
  {
    title: 'Bid Desk',
    description: 'Tập trung vào HSMT, hồ sơ năng lực và deadline.',
    items: ['Rà điều kiện', 'Rủi ro bị loại', 'Email phân việc nội bộ'],
  },
  {
    title: 'Knowledge Desk',
    description: 'Biến SOP, FAQ và tài liệu nội bộ thành tài sản AI.',
    items: ['Chuẩn hóa library', 'Tạo FAQ onboarding', 'Gắn nguồn cho workspace'],
  },
]

export const stationTimeline = [
  '08:10 · Sales Desk tạo draft phản hồi khách hỏi tủ bơm chữa cháy',
  '09:00 · Bid Desk sinh checklist nộp hồ sơ cho gói thầu cải tạo PCCC',
  '10:20 · Technical Desk bóc 3 hạng mục cần kỹ sư xác nhận',
  '11:05 · Knowledge Desk thêm SOP nghiệm thu vào library nội bộ',
  '11:30 · Owner mở 2 handoff đang chờ duyệt trước khi gửi khách',
]

export const stationRoster: TeamMember[] = [
  { name: 'Tùng', role: 'Owner', status: 'Online', focus: 'Cần xem workspace, access và usage' },
  { name: 'Sales Desk', role: 'Lead', status: 'Ổn', focus: '2 khách cần phản hồi trước 30 phút' },
  { name: 'Technical Desk', role: 'Scope', status: 'Bận', focus: 'Chờ xác nhận 3 thiết bị cho gói Bình Dương' },
  { name: 'Bid Desk', role: 'Hồ sơ thầu', status: 'Sát hạn', focus: 'Checklist + handoff email trước 17:00' },
]

export const stationQueue: StationQueueItem[] = [
  { task: 'Duyệt note kỹ thuật HSMT Bình Dương', owner: 'Technical Desk', eta: '15m', status: 'Cần duyệt' },
  { task: 'Gửi draft phản hồi lead tủ bơm', owner: 'Sales Desk', eta: '08m', status: 'Ready' },
  { task: 'Chuẩn hóa SOP nghiệm thu thành FAQ', owner: 'Knowledge Desk', eta: '45m', status: 'Running' },
  { task: 'Rà role guest cho đối tác hồ sơ', owner: 'Admin Desk', eta: 'Hôm nay', status: 'Pending' },
]

export const accessMatrix: AccessRow[] = [
  { role: 'Owner', scope: 'Toàn bộ workspace · billing · policy', approval: 'Không cần', seat: '1 / 1' },
  { role: 'Sales Lead', scope: 'Sales Desk + shared projects + customer threads', approval: 'Owner/Admin', seat: '2 / 3' },
  { role: 'Technical', scope: 'Technical Desk + project files được chia sẻ', approval: 'Admin', seat: '2 / 4' },
  { role: 'Guest partner', scope: '1 project cụ thể + file được chỉ định', approval: 'Owner', seat: '1 / 5' },
]

export const policyItems: PolicyItem[] = [
  { label: 'Domain allowlist', detail: 'Chỉ email @pccc.vn và lời mời hợp lệ mới được vào.', status: 'Active' },
  { label: 'Guest project isolation', detail: 'Khách chỉ thấy đúng project được chia sẻ.', status: 'Active' },
  { label: 'Cần xem output đỏ', detail: 'Output có cờ đỏ phải được duyệt trước khi gửi ra ngoài.', status: 'Cần duyệt' },
]

export const threadContextPacks: ThreadContextPack[] = [
  {
    threadTitle: 'Rà HSMT nhà xưởng 5 tầng',
    workspaceName: 'AI Station PCCC Vietnam',
    projectLabel: 'Nhà xưởng Bình Dương · deadline 17:00',
    deskLabel: 'Bid Desk',
    authStageKey: 'login',
    authWorkspaceHint: 'Owner quay lại đúng workspace để tiếp tục việc đang mở.',
    authTrustNote: 'Thiết bị tin cậy có thể vào thẳng, nhưng output rủi ro vẫn cần owner duyệt.',
    roleLandingLabel: 'Bid board',
    roleWorkspaceState: 'Checklist, risk flags và duyệt của owner đang bám theo deadline 17:00.',
    metrics: [
      { label: 'Threads', value: '12', note: '4 thread có deadline trong hôm nay' },
      { label: 'Outputs', value: '04', note: 'Checklist · email · note kỹ thuật' },
      { label: 'Cờ đỏ', value: '03', note: 'Thiết bị · tiến độ · nhân sự còn chờ xác nhận' },
    ],
    files: [
      { name: 'HSMT_Nha_Xuong_Binh_Duong.pdf', kind: 'PDF · 132 trang', status: 'File chính' },
      { name: 'Bang_tien_do_du_thau.xlsx', kind: 'XLSX · 6 sheet', status: 'Missing form review' },
      { name: 'Checklist_noi_bo_biddesk.docx', kind: 'DOCX · SOP', status: 'File tham chiếu' },
      { name: 'Mail_mau_phan_viec.msg', kind: 'Template', status: 'Sẵn để xuất' },
    ],
    outputs: [
      'Checklist rà HSMT — 18 mục · draft v2',
      'Email nội bộ phân việc — ready to send',
      'Danh sách 3 rủi ro dễ thiếu — flagged',
      'Note căn cứ áp dụng — 1 trang · needs review',
    ],
    pulse: [
      { label: 'Project', note: 'Nhà xưởng Bình Dương · deadline 17:00 · sale + hồ sơ + kỹ thuật' },
      { label: 'Knowledge', note: 'QC06, TCVN, checklist nội bộ, email template', tone: 'good' },
      { label: 'Cần duyệt', note: 'Chờ kỹ thuật xác nhận 3 hạng mục trước khi chốt gói cuối' },
    ],
    activities: [
      { time: '10:12', title: 'Bid Desk khóa context dự án', detail: 'Thread đang dùng chung 4 file và checklist nội bộ.', tone: 'good' },
      { time: '10:18', title: 'AI tạo risk flags đầu tiên', detail: 'Đánh dấu thiếu biểu mẫu tiến độ, nhân sự và xuất xứ thiết bị.' },
      { time: '10:24', title: 'Technical review được yêu cầu', detail: 'Handoff sang Technical Desk để xác nhận 3 hạng mục thiết bị.', tone: 'warning' },
      { time: '10:31', title: 'Owner visibility bật', detail: 'Thread được đẩy vào vùng ưu tiên vì deadline còn dưới 7 giờ.' },
    ],
    handoffSteps: [
      { label: 'Checklist nội bộ đã tạo', detail: '18 mục với 3 flag đỏ và deadline 17:00.', done: true },
      { label: 'Email phân việc đã sẵn sàng', detail: 'Có bản nháp cho sale, kỹ thuật và hồ sơ.', done: true },
      { label: 'Technical sign-off', detail: 'Còn xác nhận model thiết bị và biểu mẫu tiến độ.', done: false },
      { label: 'Owner trước khi export', detail: 'Duyệt nhanh các mục risk trước khi gửi.', done: false },
    ],
    approvalSteps: [
      { label: 'AI draft package', owner: 'Bid Desk', status: 'Done', note: 'Checklist và email phân việc đã ghép xong.' },
      { label: 'Technical sign-off', owner: 'Technical Desk', status: 'Active', note: 'Còn xác nhận model và form tiến độ.' },
      { label: 'Owner release', owner: 'Tùng', status: 'Pending', note: 'Chỉ export sau khi risk flags được duyệt.' },
    ],
    exportArtifacts: [
      { name: 'Checklist nộp thầu PDF', channel: 'Internal package', state: 'Draft', eta: '03m', note: 'Đã có format, đang chờ kỹ thuật duyệt.' },
      { name: 'Email phân việc', channel: 'Internal email', state: 'Approved', eta: 'Sẵn', note: 'Có thể gửi ngay trong nội bộ.' },
      { name: 'Risk summary', channel: 'Owner', state: 'Needs approval', eta: '15m', note: 'Giữ ở review trước khi chia sẻ rộng hơn.' },
    ],
    messages: [
      { role: 'assistant', meta: 'AI PCCC · Bid Desk · Nhà xưởng Bình Dương', content: 'Em đã nhận 4 file. Em đang bóc nhanh theo phạm vi, tiêu chuẩn, thiết bị, hồ sơ năng lực và các điểm cần kỹ thuật xác nhận.' },
      { role: 'user', meta: 'Project: Nhà xưởng Bình Dương · Deadline 17:00', content: 'Ưu tiên checklist rà nhanh HSMT, đánh dấu mục dễ thiếu trước 17h và soạn draft email phân việc.' },
      { role: 'assistant', meta: 'Draft · 18 mục · 3 risk flags', content: 'Em đã tạo checklist 18 mục với 3 điểm đỏ: nhân sự, xuất xứ thiết bị và biểu mẫu tiến độ. Em cũng đã soạn email phân việc.' },
      { role: 'assistant', meta: 'Next · export + handoff', content: 'Bước tiếp theo em có thể xuất checklist, email phân việc và note hỏi kỹ thuật. Em sẽ giữ chung context cho các bản nháp.' },
    ],
    stageFlow: [
      { key: 'review', label: 'Cần xem', owner: 'Bid Desk', status: 'Live', detail: 'Checklist, risk flags và package nội bộ đang được gom lại.' },
      { key: 'approve', label: 'Duyệt', owner: 'Technical Desk · Tùng', status: 'Next', detail: 'Kỹ thuật chốt model, rồi owner mở release.' },
      { key: 'export', label: 'Export nội bộ', owner: 'Bid Desk', status: 'Queued', detail: 'Xuất checklist PDF và email phân việc cùng lúc.' },
      { key: 'share', label: 'Handoff xong', owner: 'Bid + Technical', status: 'Queued', detail: 'Khi package xong, thread chuyển sang theo dõi hoàn tất.' },
    ],
    transitionMoments: [
      { from: 'Bid Desk', to: 'Technical Desk', eta: 'Ngay', status: 'Active', note: 'Đẩy note hỏi model và form tiến độ cho kỹ thuật duyệt.' },
      { from: 'Technical Desk', to: 'Owner', eta: '15m', status: 'Queued', note: 'Chỉ đưa owner các điểm đỏ đã được kỹ thuật gom gọn.' },
      { from: 'Owner', to: 'Bid Desk', eta: '20m', status: 'Ready', note: 'Sau duyệt, Bid Desk nhận lại package để gửi nội bộ ngay.' },
    ],
    stationBoard: {
      title: 'Thread được chọn',
      status: 'Bid Desk · risk review đang mở',
      summary: 'HSMT Bình Dương đang kéo theo queue kỹ thuật, owner review và kiểm tra export có gắn cờ đỏ.',
    },
    stationFocus: {
      queueLead: { task: 'Duyệt note kỹ thuật HSMT Bình Dương', owner: 'Technical Desk', eta: '15m', status: 'Cần duyệt' },
      policyLead: { label: 'Cần xem output đỏ', detail: 'Output có cờ đỏ phải được duyệt trước khi gửi ra ngoài.', status: 'Cần duyệt' },
      rosterNote: 'Bid Desk đang giữ nhịp chính; Technical Desk và Owner đang là hai điểm khóa tiếp theo.',
      adminHeadline: 'Thread này kéo cả workspace vào nhịp review gấp.',
      reviewLabel: 'Owner focus',
    },
  },
  {
    threadTitle: 'Phản hồi khách hỏi tủ bơm chữa cháy',
    workspaceName: 'AI Station PCCC Vietnam',
    projectLabel: 'Lead nóng · cần phản hồi trong 30 phút',
    deskLabel: 'Sales Desk',
    authStageKey: 'invite',
    authWorkspaceHint: 'Flow này hợp với Sales Lead mới vào để xử lý lead nhanh.',
    authTrustNote: 'Invite chỉ mở Sales Desk, thread khách hàng và thư viện chung.',
    roleLandingLabel: 'Sales board',
    roleWorkspaceState: 'Sales được mở đúng lead queue, chỉ thấy desk cần thiết và export rail an toàn cho khách.',
    metrics: [
      { label: 'SLA', value: '30m', note: 'Lead cần phản hồi nhanh' },
      { label: 'Thiếu đầu vào', value: '02', note: 'Thiếu tên người nhận · thiếu số điện thoại' },
      { label: 'Draft sẵn', value: '03', note: 'Zalo · email · checklist đã chuẩn bị' },
    ],
    files: [
      { name: 'Bang_gia_tu_bom_ban_le.xlsx', kind: 'XLSX · retail tier', status: 'Tham chiếu' },
      { name: 'Catalog_tu_bom_pccc_2026.pdf', kind: 'PDF · 48 trang', status: 'Customer-safe excerpt ready' },
      { name: 'Lead_capture_checklist.docx', kind: 'DOCX · SOP', status: 'Cần tên/SĐT' },
    ],
    outputs: [
      'Draft Zalo phản hồi khách — ready to send',
      'Checklist hỏi thêm — thiếu tên + SĐT',
      'Brief bàn giao kỹ thuật — waiting after customer reply',
    ],
    pulse: [
      { label: 'Sales context', note: 'Lead hỏi tủ bơm · cần phản hồi trong 30 phút' },
      { label: 'Giá dùng', note: 'Đang dùng giá bán lẻ và template hỏi thêm chuẩn', tone: 'good' },
      { label: 'Thiếu liên hệ', note: 'Chưa chốt tên và số điện thoại', tone: 'warning' },
    ],
    activities: [
      { time: '11:02', title: 'Sales Desk tạo draft đầu tiên', detail: 'Tạo phản hồi ngắn và xin đủ tên, số điện thoại.', tone: 'good' },
      { time: '11:05', title: 'Catalog an toàn đã được rút gọn', detail: 'Chỉ giữ các trang khách cần xem.' },
      { time: '11:11', title: 'Chờ khách', detail: 'Thread giữ trạng thái chờ khi thiếu số điện thoại.', tone: 'warning' },
    ],
    handoffSteps: [
      { label: 'Draft phản hồi đã tạo', detail: 'Giữ ngắn, lịch sự và đúng giọng sale PCCC.', done: true },
      { label: 'Xin đủ tên + SĐT', detail: 'Bắt buộc trước khi tạo lead hoặc báo giá.', done: false },
      { label: 'Đối chiếu mã hàng trong FSales', detail: 'Kiểm tra model ngay khi khách xác nhận.', done: false },
    ],
    approvalSteps: [
      { label: 'Draft phản hồi', owner: 'Sales Desk', status: 'Done', note: 'Tin nhắn đầu tiên đã theo template an toàn.' },
      { label: 'Lead data gate', owner: 'Sales Desk', status: 'Active', note: 'Còn thiếu tên và số điện thoại.' },
      { label: 'Mở handoff kỹ thuật', owner: 'Technical Desk', status: 'Pending', note: 'Chỉ bật khi khách trả lời đủ scope.' },
    ],
    exportArtifacts: [
      { name: 'Zalo reply draft', channel: 'Customer chat', state: 'Ready to share', eta: 'Sẵn', note: 'Có thể gửi ngay.' },
      { name: 'Catalog rút gọn', channel: 'Attachment', state: 'Approved', eta: 'Sẵn', note: 'Đã rút các trang phù hợp để gửi.' },
      { name: 'Lead brief', channel: 'Internal handoff', state: 'Draft', eta: 'Sau khi khách trả lời', note: 'Chỉ tạo khi đủ dữ liệu liên hệ và nhu cầu.' },
    ],
    messages: [
      { role: 'assistant', meta: 'Sales Desk · lead reply', content: 'Em đã soạn sẵn một phản hồi ngắn để giữ nhịp với khách và xin tên, số điện thoại.' },
      { role: 'user', meta: 'Lead nóng · khách hỏi nhanh qua Zalo', content: 'Khách hỏi tủ bơm cho nhà xưởng nhỏ. Soạn câu trả lời gọn và hỏi thêm thông tin cần thiết.' },
      { role: 'assistant', meta: 'Draft ready · customer info pending', content: 'Em đề xuất: “Anh/chị cho em xin tên và số điện thoại để em gửi báo giá đúng thông tin ạ. Nếu cần, cho em xin thêm công suất hoặc diện tích để bên em tư vấn đúng model.”' },
    ],
    stageFlow: [
      { key: 'review', label: 'Cần xem', owner: 'Sales Desk', status: 'Live', detail: 'Kiểm tra câu trả lời ngắn và an toàn.' },
      { key: 'approve', label: 'Chốt dữ liệu', owner: 'Sales Desk', status: 'Next', detail: 'Chỉ khi đủ tên và SĐT thì mới mở bước tiếp theo.' },
      { key: 'export', label: 'Gửi phản hồi khách', owner: 'Sales Desk', status: 'Queued', detail: 'Gửi Zalo reply và catalog đã lọc cho khách.' },
      { key: 'share', label: 'Handoff kỹ thuật', owner: 'Sales + Technical', status: 'Queued', detail: 'Nếu khách phản hồi đủ scope, brief sẽ sang Technical Desk.' },
    ],
    transitionMoments: [
      { from: 'Sales Desk', to: 'Customer', eta: '08m', status: 'Active', note: 'Giữ lead nóng bằng một reply ngắn và lịch sự.' },
      { from: 'Customer', to: 'Sales Desk', eta: 'Phụ thuộc phản hồi', status: 'Queued', note: 'Khi khách trả tên và SĐT, thread tự mở bước tạo brief.' },
      { from: 'Sales Desk', to: 'Technical Desk', eta: 'Sau khi đủ dữ liệu', status: 'Ready', note: 'Bàn giao scope sang kỹ thuật và giữ nguyên lịch sử hỏi đáp.' },
    ],
    stationBoard: {
      title: 'Thread được chọn',
      status: 'Sales Desk · lead nóng đang chờ dữ liệu',
      summary: 'Toàn bộ station chuyển ưu tiên sang giữ SLA phản hồi và chống tạo lead sai khi chưa đủ đầu vào.',
    },
    stationFocus: {
      queueLead: { task: 'Gửi draft phản hồi lead tủ bơm', owner: 'Sales Desk', eta: '08m', status: 'Ready' },
      policyLead: { label: 'Lead data gate', detail: 'Không tạo lead khi chưa có số điện thoại và chưa đối chiếu lịch sử.', status: 'Enforced' },
      rosterNote: 'Sales Desk đang dẫn nhịp; Admin chỉ vào sau khi lead đủ thông tin và cần gán quyền/phụ trách.',
      adminHeadline: 'Luồng này cho thấy workspace biết tự siết rule dữ liệu trước khi tạo lead hay mở quyền sâu hơn.',
      reviewLabel: 'SLA focus',
    },
  },
  {
    threadTitle: 'Tra cứu căn cứ thoát nạn công trình hỗn hợp',
    workspaceName: 'AI Station PCCC Vietnam',
    projectLabel: 'Knowledge Desk · legal summary',
    deskLabel: 'Knowledge Desk',
    authStageKey: 'google',
    authWorkspaceHint: 'SSO hợp với người nội bộ cần vào nhanh để tra cứu và publish note.',
    authTrustNote: 'Domain @pccc.vn khớp nên vào nhanh, nhưng publish vẫn cần peer review.',
    roleLandingLabel: 'Knowledge queue',
    roleWorkspaceState: 'Knowledge mở thẳng source pack, review và publish rail.',
    metrics: [
      { label: 'Nguồn', value: '05', note: 'QC06 · TCVN · note nội bộ và 2 trích dẫn liên quan' },
      { label: 'Peer review', value: '01', note: 'Còn 1 lượt kiểm tra chéo trước khi publish' },
      { label: 'Độ dài', value: '1 trang', note: 'Tóm tắt để sale và kỹ thuật cùng dùng được' },
    ],
    files: [
      { name: 'QC06_2022_BXD.pdf', kind: 'PDF · quy chuẩn', status: 'Primary source' },
      { name: 'TCVN_thoat_nan_mixuse.pdf', kind: 'PDF · excerpt', status: 'Cross-check required' },
      { name: 'Legal_summary_mixuse.md', kind: 'Note · 1 page', status: 'Chờ peer review' },
    ],
    outputs: [
      'Legal summary — 1 trang · ready to export',
      'Danh sách điểm dễ nhầm — internal only',
      'Note kiểm tra chéo — peer review pending',
    ],
    pulse: [
      { label: 'Knowledge context', note: 'Tra cứu thoát nạn cho công trình hỗn hợp, chuẩn bị note 1 trang' },
      { label: 'Source hygiene', note: 'Đã gắn nguồn và tách rõ phần diễn giải nội bộ', tone: 'good' },
      { label: 'Publish gate', note: 'Cần một lượt peer review trước khi đưa vào library' },
    ],
    activities: [
      { time: '09:40', title: 'Knowledge Desk gom nguồn', detail: 'Khóa 5 nguồn liên quan và tách nội dung có thể trích dẫn.', tone: 'good' },
      { time: '09:56', title: 'AI rút note 1 trang', detail: 'Biến căn cứ dài thành bản sale/kỹ thuật dễ dùng.' },
      { time: '10:07', title: 'Peer review được bật', detail: 'Giữ publish ở trạng thái chờ để tránh sai nguồn.', tone: 'warning' },
    ],
    handoffSteps: [
      { label: 'Nguồn gốc viện dẫn đã gắn', detail: 'Mỗi trích dẫn đều nối về file gốc.', done: true },
      { label: 'Note 1 trang đã tạo', detail: 'Dùng được cho sale và kỹ thuật.', done: true },
      { label: 'Peer review', detail: 'Cần kiểm tra chéo trước khi publish vào workspace library.', done: false },
    ],
    approvalSteps: [
      { label: 'Map nguồn xong', owner: 'Knowledge Desk', status: 'Done', note: 'Nguồn và diễn giải đã được tách sạch.' },
      { label: 'Peer review', owner: 'Knowledge Desk', status: 'Active', note: 'Đang chờ một lượt review chéo.' },
      { label: 'Library release', owner: 'Owner / Admin', status: 'Pending', note: 'Đưa note vào thư viện sau khi review xong.' },
    ],
    exportArtifacts: [
      { name: 'Legal summary', channel: 'Workspace library', state: 'Needs approval', eta: '20m', note: 'Sẵn publish nhưng còn chờ review.' },
      { name: 'Sales-safe version', channel: 'Internal share', state: 'Draft', eta: '10m', note: 'Có thể xuất thêm bản đơn giản cho sale.' },
      { name: 'Note kiểm tra nguồn', channel: 'Cần xemer package', state: 'Approved', eta: 'Sẵn', note: 'Dùng để reviewer kiểm tra nhanh.' },
    ],
    messages: [
      { role: 'assistant', meta: 'Knowledge Desk · legal note', content: 'Em đã gom các căn cứ liên quan và rút thành note 1 trang cho team dùng chung.' },
      { role: 'user', meta: 'Need legal clarity', content: 'Tôi cần bản tóm tắt gọn, có nguồn và chỉ ra các chỗ team hay hiểu sai.' },
      { role: 'assistant', meta: 'Sẵn để xuất · peer review pending', content: 'Em đã chia phần bắt buộc, phần dễ nhầm và phần cần kiểm tra chéo. Nếu anh muốn, em có thể xuất thêm bản dễ dùng cho sale.' },
    ],
    stageFlow: [
      { key: 'review', label: 'Rà nguồn', owner: 'Knowledge Desk', status: 'Live', detail: 'Rà lại nguồn và tách diễn giải nội bộ.' },
      { key: 'approve', label: 'Peer review', owner: 'Cần xemer nội bộ', status: 'Next', detail: 'Một lượt review để khóa note trước khi vào thư viện.' },
      { key: 'export', label: 'Đưa vào library', owner: 'Knowledge Desk', status: 'Queued', detail: 'Đẩy legal summary và reviewer package vào library.' },
      { key: 'share', label: 'Dùng lại', owner: 'Sales · Technical', status: 'Queued', detail: 'Sau publish, sale và kỹ thuật dùng cùng một note.' },
    ],
    transitionMoments: [
      { from: 'Knowledge Desk', to: 'Cần xemer', eta: '20m', status: 'Active', note: 'Cần xemer nhận package rút gọn để kiểm tra nhanh.' },
      { from: 'Cần xemer', to: 'Owner / Admin', eta: 'Sau peer review', status: 'Queued', note: 'Chỉ khi note sạch nguồn mới đi tiếp.' },
      { from: 'Workspace library', to: 'Sales + Technical', eta: 'Ngay sau publish', status: 'Ready', note: 'Cùng một artifact được tái sử dụng cho các desk.' },
    ],
    stationBoard: {
      title: 'Thread được chọn',
      status: 'Knowledge Desk · publish gate đang mở',
      summary: 'Station chuyển trọng tâm sang source, review và tái sử dụng tri thức.',
    },
    stationFocus: {
      queueLead: { task: 'Peer review note thoát nạn công trình hỗn hợp', owner: 'Knowledge Desk', eta: '20m', status: 'Cần xem' },
      policyLead: { label: 'Cần xem trước publish', detail: 'Note pháp lý phải có ít nhất 1 lượt kiểm tra chéo nguồn.', status: 'Active' },
      rosterNote: 'Knowledge Desk là điểm chính; Sales và Technical là người dùng downstream của output này.',
      adminHeadline: 'Luồng này làm AI Station trông như một knowledge engine có kiểm soát nguồn chứ không chỉ là chat đẹp.',
      reviewLabel: 'Publish focus',
    },
  },
  {
    threadTitle: 'Onboarding kỹ sư mới vào thư viện nội bộ',
    workspaceName: 'AI Station PCCC Vietnam',
    projectLabel: 'Admin Desk · onboarding nội bộ',
    deskLabel: 'Admin Desk',
    authStageKey: 'signup',
    authWorkspaceHint: 'Hợp cho người mới vào team: tạo tài khoản, gán desk và cấp thư viện.',
    authTrustNote: 'Workspace setup làm rõ owner, desk được vào, thư viện được thấy và bước duyệt quyền.',
    roleLandingLabel: 'Owner hub',
    roleWorkspaceState: 'Flow này mở vào setup board, seat logic và queue duyệt.',
    metrics: [
      { label: 'Onboarding', value: '06', note: 'FAQ · SOP · checklist tuần đầu' },
      { label: 'Phạm vi', value: '03', note: 'Technical Desk · shared library · assigned projects' },
      { label: 'Pendings', value: '01', note: 'Chờ admin chốt quyền nếu cần mở rộng' },
    ],
    files: [
      { name: 'FAQ_onboarding_ky_su.md', kind: 'Markdown · internal', status: 'Cần đổi tên' },
      { name: 'SOP_thu_vien_noi_bo.pdf', kind: 'PDF · internal', status: 'Cần đọc' },
      { name: 'Checklist_tuan_dau.docx', kind: 'DOCX · onboarding', status: 'Sẵn giao' },
    ],
    outputs: [
      'FAQ onboarding — draft v1',
      'Checklist tuần đầu — ready',
      'Scope access note — admin review pending',
    ],
    pulse: [
      { label: 'Onboarding context', note: 'Chuẩn hóa cách kỹ sư mới vào workspace và đọc đúng SOP' },
      { label: 'Library access', note: 'Chỉ mở shared technical library và project được gán', tone: 'good' },
      { label: 'Permission change', note: 'Nếu đổi từ Technical sang Admin, luồng sẽ chờ duyệt', tone: 'warning' },
    ],
    activities: [
      { time: '08:55', title: 'Admin Desk gom tài liệu onboarding', detail: 'Tách FAQ, SOP và checklist tuần đầu thành một bộ rõ ràng.', tone: 'good' },
      { time: '09:12', title: 'AI đề xuất rename sạch hơn', detail: 'Gợi ý chuẩn hóa tên FAQ và gắn source.' },
      { time: '09:28', title: 'Access scope đang chờ duyệt', detail: 'Chưa mở quyền admin cho user mới.', tone: 'warning' },
    ],
    handoffSteps: [
      { label: 'FAQ onboarding đã tạo', detail: 'Bao phủ tuần đầu, SOP cần đọc và nơi hỏi support.', done: true },
      { label: 'Checklist tuần đầu sẵn sàng', detail: 'Dùng để mentor theo dõi tiến độ.', done: true },
      { label: 'Admin approval nếu mở rộng quyền', detail: 'Giữ workspace an toàn khi tăng quyền.', done: false },
    ],
    approvalSteps: [
      { label: 'Pack onboarding xong', owner: 'Admin Desk', status: 'Done', note: 'FAQ, checklist và reading path đã gom đủ.' },
      { label: 'Rà scope', owner: 'Owner / Admin', status: 'Active', note: 'Đang kiểm tra user mới có cần scope rộng hơn không.' },
      { label: 'Gửi lời mời', owner: 'Admin Desk', status: 'Pending', note: 'Chỉ gửi lời mời khi quyền đã chốt.' },
    ],
    exportArtifacts: [
      { name: 'Onboarding checklist', channel: 'Mentor handoff', state: 'Approved', eta: 'Sẵn', note: 'Có thể giao mentor ngay' },
      { name: 'Lời mời có scope', channel: 'Workspace invite', state: 'Needs approval', eta: '12m', note: 'Còn chờ chốt quyền.' },
      { name: 'FAQ pack', channel: 'Technical library', state: 'Draft', eta: '06m', note: 'Cần đổi tên trước khi đưa vào library.' },
    ],
    messages: [
      { role: 'assistant', meta: 'Admin Desk · onboarding', content: 'Em đang dựng bộ onboarding cho kỹ sư mới để họ vào đúng Technical Desk và đọc đúng SOP tuần đầu.' },
      { role: 'user', meta: 'Need onboarding pack', content: 'Giúp tôi gom tài liệu rời rạc thành gói onboarding có FAQ và checklist tuần đầu.' },
      { role: 'assistant', meta: 'Setup + access', content: 'Em đã gom FAQ, checklist tuần đầu và note scope truy cập. Nếu cần mở rộng quyền, em sẽ thêm bước admin duyệt.' },
    ],
    stageFlow: [
      { key: 'review', label: 'Cần xem onboarding', owner: 'Admin Desk', status: 'Live', detail: 'Kiểm tra FAQ, checklist tuần đầu và tài liệu cần đọc.' },
      { key: 'approve', label: 'Chốt scope', owner: 'Owner / Admin', status: 'Next', detail: 'Chốt user mới chỉ vào Technical Desk hay cần quyền rộng hơn.' },
      { key: 'export', label: 'Gửi lời mời', owner: 'Admin Desk', status: 'Queued', detail: 'Invite chỉ mở đúng desk, thư viện và project cần.' },
      { key: 'share', label: 'Handoff mentor', owner: 'Admin + Technical Mentor', status: 'Queued', detail: 'Checklist tuần đầu đi cùng user mới cho mentor theo dõi.' },
    ],
    transitionMoments: [
      { from: 'Admin Desk', to: 'Owner / Admin', eta: '12m', status: 'Active', note: 'Đưa lên đúng câu hỏi về scope cho owner.' },
      { from: 'Owner / Admin', to: 'User mới', eta: 'Sau khi chốt quyền', status: 'Queued', note: 'Invite gửi kèm access note rõ ràng.' },
      { from: 'User mới', to: 'Technical Mentor', eta: 'Ngày đầu', status: 'Ready', note: 'Mentor tiếp quản checklist tuần đầu và theo dõi tiếp.' },
    ],
    stationBoard: {
      title: 'Thread được chọn',
      status: 'Admin Desk · onboarding controls',
      summary: 'Toàn station nghiêng sang setup workspace và invite cho user mới.',
    },
    stationFocus: {
      queueLead: { task: 'Rà role guest cho đối tác hồ sơ', owner: 'Admin Desk', eta: 'Hôm nay', status: 'Pending' },
      policyLead: { label: 'Duyệt nâng quyền', detail: 'Mọi thay đổi từ scope desk chuẩn sang admin đều phải qua duyệt.', status: 'Active' },
      rosterNote: 'Admin Desk đang dẫn kịch bản; Technical Desk là người nhận onboarding sau khi scope được chốt.',
      adminHeadline: 'Thread này nối auth, workspace và station trong một câu chuyện cấp quyền rõ ràng.',
      reviewLabel: 'Onboarding focus',
    },
  },
]
