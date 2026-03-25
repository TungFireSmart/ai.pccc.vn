export type Screen = 'home' | 'auth' | 'chat' | 'station'
export type WorkspaceModeKey = 'owner' | 'sales' | 'technical' | 'bid' | 'knowledge'
export type ExportState = 'Draft' | 'Needs approval' | 'Approved' | 'Ready to share'

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
    label: 'Owner mode',
    landing: 'Owner cockpit',
    workspaceState: 'Theo dõi deadline, quyền và approval trên toàn workspace',
    primaryGoal: 'Gỡ bottleneck và duyệt các output có ảnh hưởng ra ngoài.',
    canApprove: 'Export risk, role elevation, publish library',
    focus: ['Approval queue', 'Cross-desk health', 'External-safe outputs'],
  },
  {
    key: 'sales',
    label: 'Sales mode',
    landing: 'Sales follow-up board',
    workspaceState: 'Tập trung SLA phản hồi, thiếu dữ liệu khách và draft gửi ra ngoài',
    primaryGoal: 'Giữ lead nóng nhưng không tạo lead/báo giá sai dữ liệu.',
    canApprove: 'Sales-safe customer drafts trong phạm vi desk',
    focus: ['Reply SLA', 'Customer-safe draft', 'Lead data gate'],
  },
  {
    key: 'technical',
    label: 'Technical mode',
    landing: 'Technical verification queue',
    workspaceState: 'Ưu tiên scope, model, tiêu chuẩn và sign-off trước khi gửi',
    primaryGoal: 'Xác nhận phần kỹ thuật trước khi thread đi tiếp sang export.',
    canApprove: 'Technical sign-off cho note và checklist',
    focus: ['Model verification', 'Standards check', 'Risk flags'],
  },
  {
    key: 'bid',
    label: 'Bid mode',
    landing: 'Bid deadline board',
    workspaceState: 'Giữ nhịp checklist, hồ sơ thiếu và phối hợp liên phòng',
    primaryGoal: 'Chốt bộ nộp thầu đúng deadline, không rơi bước bàn giao.',
    canApprove: 'Internal handoff package trước export',
    focus: ['Deadline risk', 'Artifact completeness', 'Owner escalation'],
  },
  {
    key: 'knowledge',
    label: 'Knowledge mode',
    landing: 'Knowledge publish queue',
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
  { label: 'Use case mũi nhọn', value: '08', note: 'Tra cứu · bóc hồ sơ · sale · kỹ thuật · HSMT · SOP · team routing · audit' },
  { label: 'Trải nghiệm cốt lõi', value: 'Chat-first', note: 'Quen như ChatGPT nhưng đậm cảm giác workspace thật, có phối hợp team và output flow' },
  { label: 'Sẵn để productize', value: 'Auth + station', note: 'Có account trust, team entry, desk orchestration, usage và admin layer rõ hơn' },
]

export const productFeatures: Feature[] = [
  {
    title: 'Chat management giống SaaS vận hành thật',
    description: 'Thread có owner, SLA, priority, handoff checklist, activity rail, file context, output queue và workspace pulse để người duyệt thấy được nhịp điều phối thật.',
  },
  {
    title: 'Auth UX không chỉ “đăng nhập” mà là “vào đúng workspace, đúng quyền, đúng mức tin cậy”',
    description: 'Có trust checks, phiên đăng nhập hiện hữu, device recognition, invite scope, admin approval cues và message giải thích để flow nhìn đủ chín cho môi trường doanh nghiệp.',
  },
  {
    title: 'AI Station trở thành tầng điều hành, không chỉ là trang admin tượng trưng',
    description: 'Có team roster, handoff queue, workspace desks, access matrix, policy center, seat logic, usage logic, audit cues và tình trạng library để câu chuyện enterprise đáng tin hơn.',
  },
  {
    title: 'PCCC Vietnam vẫn là lõi sản phẩm',
    description: 'Mẫu thread, artifact, desk, task queue, policy và auth copy đều bám sát sale, kỹ thuật, hồ sơ, công văn và thư viện nội bộ ngành PCCC.',
  },
]

export const personas: Persona[] = [
  {
    title: 'Sale PCCC',
    summary: 'Cần draft phản hồi nhanh, tóm nhu cầu, biết ai đang follow thread và còn thiếu dữ liệu gì trước khi tạo lead hay báo giá.',
    outputs: ['Draft Zalo / email', 'Checklist hỏi thêm', 'Brief bàn giao cho kỹ thuật'],
  },
  {
    title: 'Kỹ thuật / tư vấn',
    summary: 'Cần bóc yêu cầu từ PDF, nhận diện scope, xem lại file đính kèm và trả note xác nhận mà không lạc khỏi context dự án.',
    outputs: ['Checklist kỹ thuật', 'Tóm tắt hệ thống', 'Note xác nhận thiết bị'],
  },
  {
    title: 'Hồ sơ thầu',
    summary: 'Cần rà mục dễ thiếu, bám deadline, đẩy output song song và thấy rõ ai đang giữ việc gì trong team.',
    outputs: ['Checklist nộp thầu', 'Danh sách rủi ro', 'Email phân việc'],
  },
  {
    title: 'Owner / Admin',
    summary: 'Cần kiểm soát thành viên, quyền, trust level, usage và tình trạng AI Station theo workspace thay vì từng người dùng rời rạc.',
    outputs: ['Role matrix', 'Audit snapshot', 'Usage & access review'],
  },
]

export const authStages: AuthStage[] = [
  {
    key: 'login',
    title: 'Đăng nhập',
    description: 'Dành cho thành viên quay lại workspace hiện có bằng email công việc hoặc Google.',
    badge: 'Returning user',
    helper: 'Giữ nhịp làm việc với lịch sử chat, project context, devices tin cậy và output gần nhất.',
  },
  {
    key: 'signup',
    title: 'Tạo tài khoản',
    description: 'Khởi tạo tài khoản mới cho cá nhân hoặc trưởng nhóm đang đánh giá AI Station.',
    badge: 'New workspace',
    helper: 'Onboarding ngắn nhưng làm rõ use case, quy mô team, desk ưu tiên và admin owner ngay từ đầu.',
  },
  {
    key: 'google',
    title: 'Google SSO',
    description: 'Đăng nhập nhanh cho owner, leader hoặc user được mời qua domain công ty.',
    badge: 'Fast path',
    helper: 'Nhìn giống flow thật của SaaS B2B: domain-aware, workspace-aware và an toàn khi vào nhầm lời mời.',
  },
  {
    key: 'reset',
    title: 'Quên mật khẩu',
    description: 'Flow email reset với message an tâm, rõ thời gian hiệu lực và bước quay lại workspace.',
    badge: 'Recovery',
    helper: 'Thêm tín hiệu bảo mật, recovery options và notice khi phát hiện đăng nhập khác thường.',
  },
  {
    key: 'invite',
    title: 'Vào team',
    description: 'Màn chấp nhận lời mời vào workspace, chọn vai trò và xác nhận phạm vi dữ liệu được thấy.',
    badge: 'Team entry',
    helper: 'Rõ ràng cho sale, kỹ thuật, hồ sơ và admin ngay lúc gia nhập; tránh cảm giác “bị quăng vào chat chung”.',
  },
]

export const authBenefits: Feature[] = [
  {
    title: 'Trust ngay trong giao diện',
    description: 'Workspace match, device recognition, active sessions, OTP/MFA và invite scope giúp auth nhìn đáng tin hơn hẳn bản form tĩnh.',
  },
  {
    title: 'Onboarding nói đúng ngôn ngữ doanh nghiệp PCCC',
    description: 'Use case ưu tiên, desk assignment, library access, admin approval và owner billing được đặt ngay trong flow tạo tài khoản.',
  },
  {
    title: 'Đủ nền cho enterprise path',
    description: 'SSO, admin approval, audit cues, role-aware landing và recovery copy cho thấy đường phát triển không bị hẫng.',
  },
]

export const authFlowSteps: FlowStep[] = [
  { title: '1. Identify', caption: 'Google · email · invite token · recovery link · trusted device' },
  { title: '2. Verify', caption: 'OTP / password / domain policy / MFA / access scope' },
  { title: '3. Enter workspace', caption: 'Role-aware landing cho sale, kỹ thuật, hồ sơ hoặc owner/admin' },
]

export const chatThreads: ChatThread[] = [
  {
    title: 'Rà HSMT nhà xưởng 5 tầng',
    preview: 'Checklist kỹ thuật + email phân việc + 3 chỗ cần xác minh',
    segment: 'Đang ghim',
    state: 'In progress · shared with Bid Desk',
    updatedAt: '2 phút trước',
    owner: 'Bid Desk',
    unread: '03 updates',
    sla: 'Deadline 17:00',
    priority: 'Critical',
    handoff: 'Need technical sign-off',
    active: true,
  },
  {
    title: 'Phản hồi khách hỏi tủ bơm chữa cháy',
    preview: 'Draft sale + thông tin cần hỏi thêm + note giá bán lẻ',
    segment: 'Hôm nay',
    state: 'Waiting customer info',
    updatedAt: '12 phút trước',
    owner: 'Sales Desk',
    unread: 'Customer pending',
    sla: 'Reply under 30m',
    priority: 'High',
    handoff: 'Waiting final customer contact fields',
  },
  {
    title: 'Tra cứu căn cứ thoát nạn công trình hỗn hợp',
    preview: 'Tóm tắt căn cứ + điểm dễ nhầm + note cần kiểm tra chéo',
    segment: 'Hôm qua',
    state: 'Ready to export',
    updatedAt: 'Hôm qua',
    owner: 'Knowledge Desk',
    unread: 'No unread',
    sla: 'Need peer review',
    priority: 'Normal',
    handoff: 'Peer review before publish',
  },
  {
    title: 'Onboarding kỹ sư mới vào thư viện nội bộ',
    preview: 'FAQ nội bộ + checklist tuần đầu + SOP cần đọc',
    segment: 'Templates',
    state: 'Rename suggested',
    updatedAt: '2 ngày trước',
    owner: 'Admin Desk',
    unread: '01 suggestion',
    sla: 'Template upkeep',
    priority: 'Normal',
    handoff: 'Ready for template cleanup',
  },
]

export const conversationStates: InboxItem[] = [
  { label: 'Đổi tên hội thoại', note: 'Gợi ý tên theo công trình, khách hàng hoặc loại hồ sơ để sidebar gọn hơn.' },
  { label: 'Giao cho desk khác', note: 'Chuyển ownership từ Sales sang Technical/Bid nhưng giữ nguyên lịch sử chat và file context.', tone: 'good' },
  { label: 'Lưu trữ', note: 'Ẩn thread đã xong khỏi active list nhưng vẫn giữ context, artifact và decision trail.' },
  { label: 'Xóa', note: 'Cho thao tác nguy hiểm vào vùng riêng với warning rõ, tránh nhầm khi dọn sidebar.', tone: 'warning' },
]

export const suggestedPrompts = [
  'Tóm tắt HSMT này thành checklist nộp hồ sơ có mức ưu tiên',
  'Soạn phản hồi khách hỏi hệ thống báo cháy cho nhà xưởng 3.000m²',
  'Rút gọn căn cứ áp dụng cho công trình hỗn hợp 12 tầng thành 1 trang',
  'Tạo bảng câu hỏi kỹ thuật để sale khai thác đủ đầu vào trước báo giá',
]

export const authTrustItems: AuthTrustItem[] = [
  { label: 'Workspace match', detail: 'Email admin@pccc.vn khớp workspace AI Station PCCC Vietnam', tone: 'good' },
  { label: 'Trusted device', detail: 'Chrome on MacBook của anh đã từng đăng nhập 18 lần trong 30 ngày qua', tone: 'good' },
  { label: 'Session notice', detail: 'Có 1 phiên đang hoạt động tại văn phòng Hà Nội · xem và thu hồi trong Account Center' },
  { label: 'Fallback recovery', detail: 'Recovery email + mã 2FA backup luôn được hiển thị như một lối thoát an toàn', tone: 'warning' },
]

export const authSessions: AuthSession[] = [
  { device: 'MacBook Pro · Chrome', location: 'Hà Nội office', status: 'Current session', lastSeen: 'Đang hoạt động' },
  { device: 'iPhone · Safari', location: 'Hà Nội', status: 'Trusted mobile', lastSeen: '17 phút trước' },
  { device: 'Windows laptop · Edge', location: 'TP.HCM', status: 'Needs review', lastSeen: '2 ngày trước' },
]

export const stationSignals: Stat[] = [
  { label: 'Workspace active', value: '06', note: 'Theo dự án, desk hoặc nhóm use case' },
  { label: 'Output reusable', value: '18+', note: 'Checklist, FAQ, email, note pháp lý, brief kỹ thuật, SOP handoff' },
  { label: 'Enterprise path', value: 'Credible', note: 'Có chỗ cho auth, audit, library, usage và team controls' },
]

export const accountCards: AccountCard[] = [
  {
    title: 'Tài khoản & hồ sơ',
    badge: 'Owner',
    lines: ['Tùng · admin@pccc.vn', 'Workspace mặc định: AI Station PCCC Vietnam', 'Thông báo: email + in-app + security alerts'],
  },
  {
    title: 'Workspace & vai trò',
    badge: '08 members',
    lines: ['Roles: Owner · Admin · Sales Lead · Technical · Bid', 'Guest access tách riêng theo project', 'Team invite có scope theo desk và thư viện'],
  },
  {
    title: 'Billing & admin',
    badge: 'Pro Team',
    lines: ['Billing owner: admin@pccc.vn', 'Usage summary theo workspace thay vì user đơn lẻ', 'SSO / audit / private library là roadmap mở rộng'],
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
    status: '07 việc ưu tiên',
    summary: '2 lead cần phản hồi, 1 HSMT cần rà, 1 bộ SOP cần chuẩn hóa, 1 tra cứu căn cứ, 2 handoff nội bộ.',
  },
  {
    title: 'Knowledge signal',
    status: 'Library cập nhật',
    summary: 'Đã đồng bộ bộ quy chuẩn, mẫu checklist, SOP bid desk và FAQ onboarding để làm nền cho RAG.',
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
  '11:30 · Owner review mở 2 handoff đang chờ duyệt trước khi gửi khách',
]

export const stationRoster: TeamMember[] = [
  { name: 'Tùng', role: 'Owner', status: 'Online', focus: 'Review workspace, access, usage and priority deals' },
  { name: 'Sales Desk', role: 'Lead routing', status: 'Healthy', focus: '2 khách cần phản hồi trước 30 phút' },
  { name: 'Technical Desk', role: 'Scope verification', status: 'Busy', focus: 'Chờ xác nhận 3 thiết bị cho gói Bình Dương' },
  { name: 'Bid Desk', role: 'Tender delivery', status: 'On deadline', focus: 'Checklist + handoff email trước 17:00' },
]

export const stationQueue: StationQueueItem[] = [
  { task: 'Duyệt note kỹ thuật cho HSMT Bình Dương', owner: 'Technical Desk', eta: '15m', status: 'Need owner visibility' },
  { task: 'Gửi draft phản hồi lead tủ bơm', owner: 'Sales Desk', eta: '08m', status: 'Ready to ship' },
  { task: 'Chuẩn hóa SOP nghiệm thu thành FAQ', owner: 'Knowledge Desk', eta: '45m', status: 'In progress' },
  { task: 'Rà role guest cho đối tác hồ sơ', owner: 'Admin Desk', eta: 'Today', status: 'Pending approval' },
]

export const accessMatrix: AccessRow[] = [
  { role: 'Owner', scope: 'Toàn bộ workspace · billing · policy · audit', approval: 'Không cần', seat: '1 / 1' },
  { role: 'Sales Lead', scope: 'Sales Desk + shared projects + customer threads', approval: 'Owner/Admin', seat: '2 / 3' },
  { role: 'Technical', scope: 'Technical Desk + project files được chia sẻ', approval: 'Admin', seat: '2 / 4' },
  { role: 'Guest partner', scope: '1 project cụ thể + file được chỉ định', approval: 'Owner review', seat: '1 / 5' },
]

export const policyItems: PolicyItem[] = [
  { label: 'Domain allowlist', detail: 'Chỉ email @pccc.vn và lời mời hợp lệ mới vào workspace chính.', status: 'Active' },
  { label: 'Guest project isolation', detail: 'Khách/đối tác chỉ thấy đúng project được chia sẻ, không thấy thread nội bộ khác.', status: 'Enabled' },
  { label: 'High-risk export review', detail: 'Artifact có gắn cờ đỏ phải qua owner hoặc desk lead trước khi gửi ra ngoài.', status: 'Needs owner review' },
]

export const threadContextPacks: ThreadContextPack[] = [
  {
    threadTitle: 'Rà HSMT nhà xưởng 5 tầng',
    workspaceName: 'AI Station PCCC Vietnam',
    projectLabel: 'Nhà xưởng Bình Dương · deadline 17:00',
    deskLabel: 'Bid Desk',
    authStageKey: 'login',
    authWorkspaceHint: 'Owner quay lại đúng workspace chính để tiếp tục chuỗi duyệt HSMT, queue và artifact đang mở.',
    authTrustNote: 'Thiết bị tin cậy có thể vào thẳng workspace nhưng vẫn thấy cảnh báo còn 1 export rủi ro cần owner duyệt.',
    roleLandingLabel: 'Bid deadline board',
    roleWorkspaceState: 'Checklist, risk flags và owner approval đang neo toàn bộ workspace quanh deadline 17:00.',
    metrics: [
      { label: 'Open threads', value: '12', note: '4 thread có deadline trong hôm nay' },
      { label: 'Artifacts this thread', value: '04', note: 'Checklist · email · note kỹ thuật · legal summary' },
      { label: 'Risk flags', value: '03', note: 'Thiết bị · tiến độ · năng lực nhân sự còn chờ confirm' },
    ],
    files: [
      { name: 'HSMT_Nha_Xuong_Binh_Duong.pdf', kind: 'PDF · 132 trang', status: 'Primary brief' },
      { name: 'Bang_tien_do_du_thau.xlsx', kind: 'XLSX · 6 sheet', status: 'Missing form review' },
      { name: 'Checklist_noi_bo_biddesk.docx', kind: 'DOCX · SOP', status: 'Reference attached' },
      { name: 'Mail_mau_phan_viec.msg', kind: 'Template', status: 'Ready for export' },
    ],
    outputs: [
      'Checklist rà HSMT — 18 mục · draft v2',
      'Email nội bộ phân việc — ready to send',
      'Danh sách 3 rủi ro dễ thiếu — flagged',
      'Note căn cứ áp dụng — 1 trang · needs review',
    ],
    pulse: [
      { label: 'Project context', note: 'Nhà xưởng Bình Dương · deadline 17:00 · phối hợp sale + hồ sơ + kỹ thuật' },
      { label: 'Knowledge attached', note: 'QC06, TCVN liên quan, checklist nội bộ, email template', tone: 'good' },
      { label: 'Need review', note: 'Chờ kỹ thuật xác nhận 3 hạng mục trước khi chốt final package' },
    ],
    activities: [
      { time: '10:12', title: 'Bid Desk khóa context dự án', detail: 'Thread đang dùng chung 4 file và checklist nội bộ của phòng hồ sơ.', tone: 'good' },
      { time: '10:18', title: 'AI tạo risk flags đầu tiên', detail: 'Đánh dấu thiếu biểu mẫu tiến độ, nhân sự chủ chốt và xuất xứ thiết bị.' },
      { time: '10:24', title: 'Technical review được yêu cầu', detail: 'Handoff sang Technical Desk để xác nhận 3 hạng mục thiết bị.', tone: 'warning' },
      { time: '10:31', title: 'Owner visibility bật', detail: 'Thread được đẩy vào vùng theo dõi ưu tiên vì deadline còn dưới 7 giờ.' },
    ],
    handoffSteps: [
      { label: 'Checklist nội bộ đã tạo', detail: '18 mục với 3 flag đỏ và deadline 17:00.', done: true },
      { label: 'Email phân việc đã sẵn sàng', detail: 'Có bản nháp cho sale, kỹ thuật và hồ sơ.', done: true },
      { label: 'Technical sign-off', detail: 'Còn xác nhận model thiết bị và biểu mẫu tiến độ.', done: false },
      { label: 'Owner review trước khi export', detail: 'Đề nghị duyệt nhanh các mục risk trước khi gửi final.', done: false },
    ],
    approvalSteps: [
      { label: 'AI draft package', owner: 'Bid Desk', status: 'Done', note: 'Checklist + email phân việc đã được ghép cùng project context.' },
      { label: 'Technical sign-off', owner: 'Technical Desk', status: 'Active', note: 'Còn xác nhận model thiết bị và form tiến độ.' },
      { label: 'Owner release', owner: 'Tùng', status: 'Pending', note: 'Chỉ mở export ra ngoài sau khi risk flags được duyệt.' },
    ],
    exportArtifacts: [
      { name: 'Checklist nộp thầu PDF', channel: 'Internal package', state: 'Draft', eta: '03m', note: 'Sẵn format nhưng đang chờ sign-off kỹ thuật.' },
      { name: 'Email phân việc', channel: 'Internal email', state: 'Approved', eta: 'Ready now', note: 'Có thể gửi ngay trong nội bộ để kéo team vào nhịp.' },
      { name: 'Risk summary', channel: 'Owner review', state: 'Needs approval', eta: '15m', note: 'Giữ ở review rail trước khi chia sẻ rộng hơn.' },
    ],
    messages: [
      { role: 'assistant', meta: 'AI PCCC Copilot · Bid Desk mode · Context locked to project Nhà xưởng Bình Dương', content: 'Em đã nhận 4 file của gói thầu nhà xưởng Bình Dương. Em đang bóc nhanh theo 6 nhóm: phạm vi hệ thống, tiêu chuẩn áp dụng, thiết bị bắt buộc, hồ sơ năng lực, điều kiện thương mại và các điểm cần kỹ thuật xác nhận.' },
      { role: 'user', meta: 'Project: Nhà xưởng Bình Dương · Deadline 17:00', content: 'Ưu tiên cho tôi checklist rà nhanh HSMT và đánh dấu các mục dễ thiếu trước deadline 17h hôm nay. Nếu được thì soạn luôn draft email phân việc cho đội hồ sơ.' },
      { role: 'assistant', meta: 'Working draft · 18 mục · 3 risk flags · output queue synced', content: 'Em đã tạo checklist 18 mục, trong đó có 3 điểm đỏ: năng lực nhân sự, xác nhận xuất xứ thiết bị và biểu mẫu tiến độ. Em cũng đề xuất email phân việc chia cho kỹ thuật, hồ sơ và sale để chốt các phần còn thiếu trong vòng 90 phút.' },
      { role: 'assistant', meta: 'Next actions · export + handoff available', content: 'Bước tiếp theo em có thể xuất ngay 3 output song song: checklist nộp thầu, email phân việc và note hỏi kỹ thuật. Em sẽ giữ chung context để không bị lệch giữa các bản nháp, đồng thời gắn owner cho từng output để team theo dõi dễ hơn.' },
    ],
    stationBoard: {
      title: 'Thread được chọn',
      status: 'Bid Desk · risk review đang mở',
      summary: 'HSMT Bình Dương đang kéo theo queue kỹ thuật, owner review và kiểm tra export có gắn cờ đỏ.',
    },
    stationFocus: {
      queueLead: { task: 'Duyệt note kỹ thuật cho HSMT Bình Dương', owner: 'Technical Desk', eta: '15m', status: 'Need owner visibility' },
      policyLead: { label: 'High-risk export review', detail: 'Artifact có gắn cờ đỏ phải qua owner hoặc desk lead trước khi gửi ra ngoài.', status: 'Needs owner review' },
      rosterNote: 'Bid Desk đang giữ nhịp chính; Technical Desk và Owner đang là hai điểm khóa tiếp theo.',
      adminHeadline: 'Thread này kéo toàn bộ workspace sang chế độ review tốc độ cao trước deadline.',
      reviewLabel: 'Owner review in focus',
    },
  },
  {
    threadTitle: 'Phản hồi khách hỏi tủ bơm chữa cháy',
    workspaceName: 'AI Station PCCC Vietnam',
    projectLabel: 'Lead nóng · cần phản hồi trong 30 phút',
    deskLabel: 'Sales Desk',
    authStageKey: 'invite',
    authWorkspaceHint: 'Flow phù hợp cho Sales Lead vừa được mời vào workspace để xử lý lead mà chưa thấy toàn bộ dữ liệu admin.',
    authTrustNote: 'Invite scope chỉ mở Sales Desk, thread khách hàng và thư viện chung; chưa thấy billing, audit hay hồ sơ nội bộ.',
    roleLandingLabel: 'Sales follow-up board',
    roleWorkspaceState: 'Sales được mở đúng lead queue, chỉ thấy desk cần thiết và export rail an toàn cho khách.',
    metrics: [
      { label: 'Reply SLA', value: '30m', note: 'Lead cần phản hồi nhanh trước khi nguội' },
      { label: 'Missing inputs', value: '02', note: 'Tên người nhận báo giá · số điện thoại còn thiếu' },
      { label: 'Drafts ready', value: '03', note: 'Zalo · email · checklist hỏi thêm đã chuẩn bị' },
    ],
    files: [
      { name: 'Bang_gia_tu_bom_ban_le.xlsx', kind: 'XLSX · retail tier', status: 'Reference only' },
      { name: 'Catalog_tu_bom_pccc_2026.pdf', kind: 'PDF · 48 trang', status: 'Customer-safe excerpt ready' },
      { name: 'Lead_capture_checklist.docx', kind: 'DOCX · SOP', status: 'Phone/name validation needed' },
    ],
    outputs: [
      'Draft Zalo phản hồi khách — ready to send',
      'Checklist hỏi thêm — thiếu tên + SĐT',
      'Brief bàn giao kỹ thuật — waiting after customer reply',
    ],
    pulse: [
      { label: 'Sales context', note: 'Lead hỏi tủ bơm chữa cháy · cần giữ nhịp phản hồi trong 30 phút' },
      { label: 'Pricing mode', note: 'Đang dùng giá bán lẻ và template hỏi thêm chuẩn', tone: 'good' },
      { label: 'Missing contact fields', note: 'Chưa chốt tên người nhận báo giá và số điện thoại đầy đủ', tone: 'warning' },
    ],
    activities: [
      { time: '11:02', title: 'Sales Desk tạo draft đầu tiên', detail: 'Tạo phản hồi ngắn để giữ lead nóng và xin đủ tên + số điện thoại.', tone: 'good' },
      { time: '11:05', title: 'Catalog an toàn đã được rút gọn', detail: 'Chỉ giữ các trang khách cần xem, tránh lộ bảng giá nội bộ.' },
      { time: '11:11', title: 'Need customer reply', detail: 'Thread giữ trạng thái chờ để không tạo lead khi thiếu số điện thoại.', tone: 'warning' },
    ],
    handoffSteps: [
      { label: 'Draft phản hồi đã tạo', detail: 'Giữ ngắn, lịch sự và đúng giọng sale PCCC.', done: true },
      { label: 'Xin đủ tên + SĐT', detail: 'Bắt buộc trước khi tạo lead hoặc báo giá.', done: false },
      { label: 'Đối chiếu mã hàng trong FSales', detail: 'Kiểm tra model / nhãn hiệu ngay khi khách xác nhận.', done: false },
    ],
    approvalSteps: [
      { label: 'Draft customer reply', owner: 'Sales Desk', status: 'Done', note: 'Tin nhắn đầu tiên đã bám template an toàn cho khách.' },
      { label: 'Lead data gate', owner: 'Sales Desk', status: 'Active', note: 'Còn thiếu tên + số điện thoại nên chưa mở tạo lead.' },
      { label: 'Technical handoff trigger', owner: 'Technical Desk', status: 'Pending', note: 'Chỉ bật khi khách trả lời đủ công suất/scope.' },
    ],
    exportArtifacts: [
      { name: 'Zalo reply draft', channel: 'Customer chat', state: 'Ready to share', eta: 'Ready now', note: 'Có thể gửi ngay vì chưa chứa giá nội bộ.' },
      { name: 'Customer-safe catalog excerpt', channel: 'Attachment', state: 'Approved', eta: 'Ready now', note: 'Đã rút trang phù hợp để gửi cùng phản hồi.' },
      { name: 'Lead brief', channel: 'Internal handoff', state: 'Draft', eta: 'After customer reply', note: 'Chỉ hình thành khi đủ dữ liệu liên hệ và nhu cầu.' },
    ],
    messages: [
      { role: 'assistant', meta: 'Sales Desk mode · lead response shell', content: 'Em đã soạn sẵn một phản hồi ngắn để giữ nhịp với khách, đồng thời xin tên và số điện thoại trước khi tạo lead hoặc gửi báo giá.' },
      { role: 'user', meta: 'Lead nóng · khách hỏi nhanh qua Zalo', content: 'Khách đang hỏi tủ bơm chữa cháy cho nhà xưởng nhỏ. Soạn giúp tôi câu trả lời gọn và hỏi thêm thông tin cần thiết.' },
      { role: 'assistant', meta: 'Draft ready · customer info pending', content: 'Em đề xuất trả lời: “Anh/chị cho em xin tên và số điện thoại để em gửi báo giá đúng thông tin ạ. Nếu cần, anh/chị cho em xin thêm công suất hoặc diện tích công trình để bên em tư vấn đúng model.”' },
    ],
    stationBoard: {
      title: 'Thread được chọn',
      status: 'Sales Desk · lead nóng đang chờ dữ liệu',
      summary: 'Toàn bộ station chuyển ưu tiên sang giữ SLA phản hồi và chống tạo lead sai khi chưa đủ đầu vào.',
    },
    stationFocus: {
      queueLead: { task: 'Gửi draft phản hồi lead tủ bơm', owner: 'Sales Desk', eta: '08m', status: 'Ready to ship' },
      policyLead: { label: 'Lead data gate', detail: 'Không tạo lead khi chưa có số điện thoại và chưa đối chiếu lịch sử theo SĐT.', status: 'Enforced' },
      rosterNote: 'Sales Desk đang dẫn nhịp; Admin chỉ vào sau khi lead đủ thông tin và cần gán quyền/phụ trách.',
      adminHeadline: 'Luồng này cho thấy workspace biết tự siết rule dữ liệu trước khi tạo lead hay mở quyền sâu hơn.',
      reviewLabel: 'SLA response in focus',
    },
  },
  {
    threadTitle: 'Tra cứu căn cứ thoát nạn công trình hỗn hợp',
    workspaceName: 'AI Station PCCC Vietnam',
    projectLabel: 'Knowledge Desk · legal summary',
    deskLabel: 'Knowledge Desk',
    authStageKey: 'google',
    authWorkspaceHint: 'SSO hợp với chuyên gia nội bộ vào nhanh để tra cứu, rà nguồn và publish note dưới đúng workspace/domain.',
    authTrustNote: 'Domain @pccc.vn khớp nên vào nhanh, nhưng publish ra thư viện chung vẫn giữ bước peer review.',
    roleLandingLabel: 'Knowledge publish queue',
    roleWorkspaceState: 'Knowledge mode mở thẳng source pack, peer review và publish rail thay vì generic dashboard.',
    metrics: [
      { label: 'Sources attached', value: '05', note: 'QC06 · TCVN · note nội bộ và 2 trích dẫn liên quan' },
      { label: 'Peer review', value: '01', note: 'Còn 1 lượt kiểm tra chéo trước khi publish' },
      { label: 'Output size', value: '1 trang', note: 'Tóm tắt để sale và kỹ thuật cùng dùng được' },
    ],
    files: [
      { name: 'QC06_2022_BXD.pdf', kind: 'PDF · quy chuẩn', status: 'Primary source' },
      { name: 'TCVN_thoat_nan_mixuse.pdf', kind: 'PDF · excerpt', status: 'Cross-check required' },
      { name: 'Legal_summary_mixuse.md', kind: 'Note · 1 page', status: 'Ready for peer review' },
    ],
    outputs: [
      'Legal summary — 1 trang · ready to export',
      'Danh sách điểm dễ nhầm — internal only',
      'Note kiểm tra chéo — peer review pending',
    ],
    pulse: [
      { label: 'Knowledge context', note: 'Tra cứu thoát nạn cho công trình hỗn hợp, chuẩn bị note 1 trang cho team dùng chung' },
      { label: 'Source hygiene', note: 'Đã gắn nguồn và phân biệt rõ excerpt với diễn giải nội bộ', tone: 'good' },
      { label: 'Publish gate', note: 'Cần một lượt peer review trước khi đưa vào library chung' },
    ],
    activities: [
      { time: '09:40', title: 'Knowledge Desk gom nguồn', detail: 'Khóa 5 nguồn liên quan và tách nội dung có thể trích dẫn.', tone: 'good' },
      { time: '09:56', title: 'AI rút note 1 trang', detail: 'Biến căn cứ dài thành phiên bản sale/kỹ thuật dễ tiêu hóa.' },
      { time: '10:07', title: 'Peer review được bật', detail: 'Giữ publish ở trạng thái chờ để tránh sai viện dẫn.', tone: 'warning' },
    ],
    handoffSteps: [
      { label: 'Nguồn gốc viện dẫn đã gắn', detail: 'Mỗi trích dẫn đều nối về file gốc.', done: true },
      { label: 'Note 1 trang đã tạo', detail: 'Dùng được cho sale và kỹ thuật.', done: true },
      { label: 'Peer review', detail: 'Cần kiểm tra chéo trước khi publish vào workspace library.', done: false },
    ],
    approvalSteps: [
      { label: 'Source map completed', owner: 'Knowledge Desk', status: 'Done', note: 'Nguồn và diễn giải đã được tách sạch.' },
      { label: 'Peer review', owner: 'Knowledge Desk', status: 'Active', note: 'Đang chờ một lượt review chéo trước publish.' },
      { label: 'Library release', owner: 'Owner / Admin', status: 'Pending', note: 'Chỉ cần cho note đi vào thư viện dùng chung sau khi review xong.' },
    ],
    exportArtifacts: [
      { name: 'Legal summary 1 trang', channel: 'Workspace library', state: 'Needs approval', eta: '20m', note: 'Sẵn publish nhưng còn chờ peer review.' },
      { name: 'Sales-safe version', channel: 'Internal share', state: 'Draft', eta: '10m', note: 'Có thể xuất thêm phiên bản ít jargon cho sale.' },
      { name: 'Source cross-check note', channel: 'Reviewer package', state: 'Approved', eta: 'Ready now', note: 'Dùng để reviewer kiểm tra nhanh nguồn.' },
    ],
    messages: [
      { role: 'assistant', meta: 'Knowledge Desk mode · legal synthesis', content: 'Em đã gom các căn cứ liên quan đến thoát nạn cho công trình hỗn hợp và rút thành note 1 trang để sale, kỹ thuật và hồ sơ cùng dùng chung.' },
      { role: 'user', meta: 'Need legal clarity', content: 'Tôi cần bản tóm tắt gọn, có nguồn, và chỉ ra những chỗ team hay hiểu sai khi tư vấn cho công trình hỗn hợp.' },
      { role: 'assistant', meta: 'Ready to export · peer review pending', content: 'Em đã chia phần căn cứ bắt buộc, phần dễ nhầm và phần cần kiểm tra chéo. Nếu anh muốn, em có thể xuất thêm một bản “không jargon” để sale dùng trực tiếp.' },
    ],
    stationBoard: {
      title: 'Thread được chọn',
      status: 'Knowledge Desk · publish gate đang mở',
      summary: 'Station chuyển trọng tâm sang source hygiene, review trước publish và tái sử dụng tri thức cho toàn workspace.',
    },
    stationFocus: {
      queueLead: { task: 'Peer review note thoát nạn công trình hỗn hợp', owner: 'Knowledge Desk', eta: '20m', status: 'Ready for review' },
      policyLead: { label: 'Library publish review', detail: 'Note pháp lý trước khi vào thư viện chung phải có ít nhất 1 lượt kiểm tra chéo nguồn.', status: 'Enabled' },
      rosterNote: 'Knowledge Desk là điểm chính; Sales và Technical là người dùng downstream của output này.',
      adminHeadline: 'Luồng này làm AI Station trông như một knowledge engine có kiểm soát nguồn chứ không chỉ là chat đẹp.',
      reviewLabel: 'Knowledge publish in focus',
    },
  },
  {
    threadTitle: 'Onboarding kỹ sư mới vào thư viện nội bộ',
    workspaceName: 'AI Station PCCC Vietnam',
    projectLabel: 'Admin Desk · onboarding nội bộ',
    deskLabel: 'Admin Desk',
    authStageKey: 'signup',
    authWorkspaceHint: 'Phù hợp cho người mới vào team: tạo tài khoản, gán desk, cấp scope thư viện và cho thấy họ không bị thả vào workspace một cách mù mờ.',
    authTrustNote: 'Workspace setup làm rõ owner, desk được vào, thư viện được thấy và các bước approval nếu quyền vượt chuẩn.',
    roleLandingLabel: 'Owner cockpit',
    roleWorkspaceState: 'Flow này mở vào setup board, seat logic và approval queue thay vì đưa user mới vào chat chung.',
    metrics: [
      { label: 'Onboarding assets', value: '06', note: 'FAQ · SOP · checklist tuần đầu · policy read list' },
      { label: 'Access scopes', value: '03', note: 'Technical Desk · shared library · assigned projects' },
      { label: 'Pending approvals', value: '01', note: 'Chờ admin chốt quyền nếu cần scope rộng hơn' },
    ],
    files: [
      { name: 'FAQ_onboarding_ky_su.md', kind: 'Markdown · internal', status: 'Needs rename polish' },
      { name: 'SOP_thu_vien_noi_bo.pdf', kind: 'PDF · internal', status: 'Required reading' },
      { name: 'Checklist_tuan_dau.docx', kind: 'DOCX · onboarding', status: 'Ready to assign' },
    ],
    outputs: [
      'FAQ onboarding — draft v1',
      'Checklist tuần đầu — ready',
      'Scope access note — admin review pending',
    ],
    pulse: [
      { label: 'Onboarding context', note: 'Chuẩn hóa cách kỹ sư mới vào workspace, đọc SOP và thấy đúng thư viện được cấp' },
      { label: 'Library access', note: 'Chỉ mở shared technical library và project được gán', tone: 'good' },
      { label: 'Permission change', note: 'Nếu đổi từ Technical sang Admin, luồng sẽ giữ ở trạng thái chờ duyệt', tone: 'warning' },
    ],
    activities: [
      { time: '08:55', title: 'Admin Desk gom tài liệu onboarding', detail: 'Tách FAQ, SOP và checklist tuần đầu thành bộ đầu vào rõ ràng.', tone: 'good' },
      { time: '09:12', title: 'AI đề xuất rename sạch hơn', detail: 'Gợi ý chuẩn hóa tên FAQ và gắn source cho thư viện.' },
      { time: '09:28', title: 'Access scope đang chờ duyệt', detail: 'Chưa mở quyền admin hay toàn workspace cho user mới.', tone: 'warning' },
    ],
    handoffSteps: [
      { label: 'FAQ onboarding đã tạo', detail: 'Bao phủ tuần đầu, SOP cần đọc và nơi hỏi support.', done: true },
      { label: 'Checklist tuần đầu sẵn sàng', detail: 'Dùng để mentor theo dõi tiến độ.', done: true },
      { label: 'Admin approval nếu mở rộng quyền', detail: 'Giữ workspace an toàn khi tăng scope ngoài chuẩn Technical Desk.', done: false },
    ],
    approvalSteps: [
      { label: 'Onboarding pack assembled', owner: 'Admin Desk', status: 'Done', note: 'FAQ + checklist + reading path đã gom đủ.' },
      { label: 'Desk scope review', owner: 'Owner / Admin', status: 'Active', note: 'Đang kiểm tra xem user mới chỉ cần Technical Desk hay cần scope rộng hơn.' },
      { label: 'Invite release', owner: 'Admin Desk', status: 'Pending', note: 'Chỉ gửi lời mời cuối khi quyền đã chốt rõ.' },
    ],
    exportArtifacts: [
      { name: 'Onboarding checklist', channel: 'Mentor handoff', state: 'Approved', eta: 'Ready now', note: 'Có thể giao mentor ngay.' },
      { name: 'Invite with scoped access', channel: 'Workspace invite', state: 'Needs approval', eta: '12m', note: 'Còn chờ chốt quyền trước khi gửi.' },
      { name: 'FAQ pack', channel: 'Technical library', state: 'Draft', eta: '06m', note: 'Cần rename và polish trước khi đưa vào library.' },
    ],
    messages: [
      { role: 'assistant', meta: 'Admin Desk mode · onboarding shell', content: 'Em đang dựng bộ onboarding cho kỹ sư mới để họ vào đúng Technical Desk, thấy đúng thư viện và biết phải đọc SOP nào trong tuần đầu.' },
      { role: 'user', meta: 'Need structured onboarding', content: 'Giúp tôi biến tài liệu rời rạc thành gói onboarding rõ ràng cho kỹ sư mới, có FAQ và checklist tuần đầu.' },
      { role: 'assistant', meta: 'Workspace setup + access cues', content: 'Em đã gom được FAQ, checklist tuần đầu và note scope truy cập. Nếu anh muốn mở quyền rộng hơn Technical Desk, em sẽ gắn thêm bước admin approval để không lỏng quyền.' },
    ],
    stationBoard: {
      title: 'Thread được chọn',
      status: 'Admin Desk · onboarding controls',
      summary: 'Toàn station nghiêng sang setup workspace, seat logic, invite scope và library access cho user mới.',
    },
    stationFocus: {
      queueLead: { task: 'Rà role guest cho đối tác hồ sơ', owner: 'Admin Desk', eta: 'Today', status: 'Pending approval' },
      policyLead: { label: 'Role elevation approval', detail: 'Mọi thay đổi từ scope desk chuẩn sang admin hoặc toàn workspace đều phải qua duyệt.', status: 'Active' },
      rosterNote: 'Admin Desk đang dẫn kịch bản; Technical Desk là người nhận onboarding sau khi scope được chốt.',
      adminHeadline: 'Thread này khiến auth, workspace và station nhập vào cùng một câu chuyện cấp quyền thực tế.',
      reviewLabel: 'Onboarding controls in focus',
    },
  },
]
