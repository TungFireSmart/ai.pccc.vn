import { useMemo, useState } from 'react'
import type {
  AccountCard,
  AuthStage,
  AuthTrustItem,
  Feature,
  FileItem,
  FlowStep,
  InboxItem,
  Message,
  MiniMetric,
  NavItem,
  Persona,
  Screen,
  Stat,
  StationCard,
  StationQueueItem,
  TeamMember,
  WorkspaceBoard,
  ChatThread,
} from './data'
import {
  accountCards,
  authBenefits,
  authFlowSteps,
  authStages,
  authTrustItems,
  activeThreadFiles,
  chatMessages,
  chatMetrics,
  chatSideOutputs,
  chatThreads,
  conversationStates,
  personas,
  productFeatures,
  stationBoards,
  stationCards,
  stationQueue,
  stationRoster,
  stationTimeline,
  suggestedPrompts,
  workspacePulse,
} from './data'

export function TopNav({
  items,
  screen,
  setScreen,
}: {
  items: NavItem[]
  screen: Screen
  setScreen: (screen: Screen) => void
}) {
  return (
    <nav className="topnav">
      {items.map((item) => (
        <button key={item.key} className={screen === item.key ? 'active' : ''} onClick={() => setScreen(item.key)}>
          {item.label}
        </button>
      ))}
    </nav>
  )
}

function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="stat-grid">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <small>{stat.label}</small>
          <strong>{stat.value}</strong>
          <p>{stat.note}</p>
        </article>
      ))}
    </div>
  )
}

function FeatureGrid({ items }: { items: Feature[] }) {
  return (
    <div className="feature-grid">
      {items.map((item) => (
        <article className="feature-card" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  )
}

function PersonaGrid({ items }: { items: Persona[] }) {
  return (
    <div className="persona-grid">
      {items.map((persona) => (
        <article className="persona-card" key={persona.title}>
          <h3>{persona.title}</h3>
          <p>{persona.summary}</p>
          <div className="mini-tags">
            {persona.outputs.map((output) => (
              <span key={output}>{output}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

function AuthTabs({ items, active, setActive }: { items: AuthStage[]; active: string; setActive: (value: string) => void }) {
  return (
    <div className="auth-tab-row">
      {items.map((item) => (
        <button key={item.key} className={active === item.key ? 'active' : ''} onClick={() => setActive(item.key)}>
          <span>{item.title}</span>
          <small>{item.badge}</small>
        </button>
      ))}
    </div>
  )
}

function FlowGrid({ items }: { items: FlowStep[] }) {
  return (
    <div className="flow-grid">
      {items.map((item) => (
        <article className="flow-card" key={item.title}>
          <strong>{item.title}</strong>
          <p>{item.caption}</p>
        </article>
      ))}
    </div>
  )
}

function ThreadList({ items, activeTitle, onSelect }: { items: ChatThread[]; activeTitle: string; onSelect: (value: string) => void }) {
  return (
    <div className="thread-list">
      {items.map((thread) => (
        <button className={`thread-card ${activeTitle === thread.title ? 'active' : ''}`} key={thread.title} onClick={() => onSelect(thread.title)}>
          <div className="thread-card-top">
            <span>{thread.segment}</span>
            <small>{thread.updatedAt}</small>
          </div>
          <strong>{thread.title}</strong>
          <small>{thread.preview}</small>
          <div className="thread-meta-row">
            <span className="badge subtle">{thread.owner}</span>
            {thread.unread && <span className="badge subtle">{thread.unread}</span>}
          </div>
          <div className="thread-footer-row">
            <div className="thread-state">{thread.state}</div>
            <small>{thread.sla}</small>
          </div>
        </button>
      ))}
    </div>
  )
}

function MessageList({ items }: { items: Message[] }) {
  return (
    <div className="message-list">
      {items.map((message, index) => (
        <article className={`message-row ${message.role}`} key={`${message.role}-${index}`}>
          <div className="message-avatar">{message.role === 'assistant' ? 'AI' : 'AN'}</div>
          <div className="message-bubble">
            {message.meta && <small>{message.meta}</small>}
            <p>{message.content}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

function InboxList({ items }: { items: InboxItem[] }) {
  return (
    <div className="stack-list">
      {items.map((item) => (
        <article className={`stack-card ${item.tone ?? 'default'}`} key={item.label}>
          <strong>{item.label}</strong>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  )
}

function BoardGrid({ items }: { items: WorkspaceBoard[] }) {
  return (
    <div className="board-grid">
      {items.map((board) => (
        <article className="board-card" key={board.title}>
          <small>{board.title}</small>
          <strong>{board.status}</strong>
          <p>{board.summary}</p>
        </article>
      ))}
    </div>
  )
}

function StationCardGrid({ items }: { items: StationCard[] }) {
  return (
    <div className="station-grid">
      {items.map((card) => (
        <article className="station-card" key={card.title}>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
          <ul>
            {card.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

function AccountGrid({ items }: { items: AccountCard[] }) {
  return (
    <div className="account-grid">
      {items.map((item) => (
        <article className="account-card" key={item.title}>
          <div className="account-head">
            <strong>{item.title}</strong>
            {item.badge && <span>{item.badge}</span>}
          </div>
          <ul>
            {item.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

function MetricGrid({ items }: { items: MiniMetric[] }) {
  return (
    <div className="metric-grid">
      {items.map((item) => (
        <article className="metric-card" key={item.label}>
          <small>{item.label}</small>
          <strong>{item.value}</strong>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  )
}

function FileList({ items }: { items: FileItem[] }) {
  return (
    <div className="file-list">
      {items.map((item) => (
        <article className="file-card" key={item.name}>
          <div>
            <strong>{item.name}</strong>
            <p>{item.kind}</p>
          </div>
          <span>{item.status}</span>
        </article>
      ))}
    </div>
  )
}

function TrustList({ items }: { items: AuthTrustItem[] }) {
  return (
    <div className="trust-list">
      {items.map((item) => (
        <article className={`trust-card ${item.tone ?? 'default'}`} key={item.label}>
          <strong>{item.label}</strong>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  )
}

function TeamGrid({ items }: { items: TeamMember[] }) {
  return (
    <div className="team-grid">
      {items.map((item) => (
        <article className="team-card" key={item.name}>
          <div className="team-card-head">
            <strong>{item.name}</strong>
            <span>{item.status}</span>
          </div>
          <small>{item.role}</small>
          <p>{item.focus}</p>
        </article>
      ))}
    </div>
  )
}

function QueueList({ items }: { items: StationQueueItem[] }) {
  return (
    <div className="queue-list">
      {items.map((item) => (
        <article className="queue-card" key={item.task}>
          <strong>{item.task}</strong>
          <p>{item.owner} · ETA {item.eta}</p>
          <span>{item.status}</span>
        </article>
      ))}
    </div>
  )
}

function AuthPreview({ stage }: { stage: AuthStage }) {
  if (stage.key === 'signup') {
    return (
      <div className="auth-form-shell">
        <div className="auth-brand">
          <div className="brand-mark">AI</div>
          <div>
            <strong>Tạo AI Station mới</strong>
            <small>Khởi tạo workspace cho sale, kỹ thuật, hồ sơ và thư viện nội bộ</small>
          </div>
        </div>
        <label>
          Tên workspace
          <input value="AI Station PCCC Vietnam" readOnly />
        </label>
        <div className="double-grid">
          <label>
            Quy mô team
            <input value="6–15 thành viên" readOnly />
          </label>
          <label>
            Use case ưu tiên
            <input value="HSMT + Sale + Knowledge" readOnly />
          </label>
        </div>
        <div className="double-grid">
          <label>
            Billing owner
            <input value="admin@pccc.vn" readOnly />
          </label>
          <label>
            First desk to enable
            <input value="Bid Desk" readOnly />
          </label>
        </div>
        <button className="primary-btn full">Tạo workspace</button>
        <p className="form-note">Sau bước này hệ thống sẽ gợi ý mời Sales Lead, Technical Lead và Bid Desk vào workspace.</p>
      </div>
    )
  }

  if (stage.key === 'google') {
    return (
      <div className="auth-form-shell">
        <div className="auth-brand">
          <div className="brand-mark">G</div>
          <div>
            <strong>Tiếp tục với Google</strong>
            <small>Fast path cho owner và thành viên được mời</small>
          </div>
        </div>
        <div className="highlight-panel">
          <strong>Detected domain</strong>
          <p>pccc.vn · Cho phép vào workspace “AI Station PCCC Vietnam” với vai trò Owner.</p>
        </div>
        <div className="double-grid auth-mini-grid">
          <div className="mini-check-card">
            <strong>Domain policy</strong>
            <p>Chỉ email công ty và lời mời hợp lệ mới vào được workspace chính.</p>
          </div>
          <div className="mini-check-card">
            <strong>Landing after entry</strong>
            <p>Mở thẳng AI Station với các thread, desk và review queue gần nhất.</p>
          </div>
        </div>
        <button className="social-btn">Chọn tài khoản Google</button>
      </div>
    )
  }

  if (stage.key === 'reset') {
    return (
      <div className="auth-form-shell">
        <div className="auth-brand">
          <div className="brand-mark">↺</div>
          <div>
            <strong>Khôi phục truy cập</strong>
            <small>Flow an tâm cho lúc user cần vào dự án gấp</small>
          </div>
        </div>
        <label>
          Email công việc
          <input value="admin@pccc.vn" readOnly />
        </label>
        <div className="double-grid auth-mini-grid">
          <div className="mini-check-card">
            <strong>Link hết hạn sau</strong>
            <p>15 phút · dùng một lần · yêu cầu xác nhận device nếu truy cập từ máy lạ.</p>
          </div>
          <div className="mini-check-card">
            <strong>Recovery fallback</strong>
            <p>Có thể dùng backup codes hoặc xác nhận qua email recovery nếu mất điện thoại.</p>
          </div>
        </div>
        <button className="primary-btn full">Gửi link đặt lại mật khẩu</button>
        <div className="signup-box compact">
          <strong>Thông điệp sau khi gửi</strong>
          <p>Link có hiệu lực 15 phút. Nếu email này thuộc workspace, anh sẽ nhận được hướng dẫn ngay cùng cảnh báo bảo mật nếu đây không phải yêu cầu của anh.</p>
        </div>
      </div>
    )
  }

  if (stage.key === 'invite') {
    return (
      <div className="auth-form-shell">
        <div className="auth-brand">
          <div className="brand-mark">IN</div>
          <div>
            <strong>Tham gia team</strong>
            <small>Chấp nhận lời mời vào workspace từ chủ tài khoản</small>
          </div>
        </div>
        <div className="invite-card">
          <small>Lời mời hợp lệ</small>
          <strong>AI Station PCCC Vietnam</strong>
          <p>Người mời: admin@pccc.vn · Vai trò: Sales Lead · Scope: Sales Desk + shared project library · Hết hạn sau 23 giờ</p>
        </div>
        <div className="double-grid auth-mini-grid">
          <div className="mini-check-card">
            <strong>Data scope</strong>
            <p>Chỉ thấy thread, library và output thuộc Sales Desk + các project được chia sẻ.</p>
          </div>
          <div className="mini-check-card">
            <strong>First landing</strong>
            <p>Mở dashboard cá nhân với handoff queue và quy trình follow-up khách mới.</p>
          </div>
        </div>
        <div className="double-grid">
          <button className="secondary-btn">Xem quyền truy cập</button>
          <button className="primary-btn">Vào workspace</button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-form-shell">
      <div className="auth-brand">
        <div className="brand-mark">AI</div>
        <div>
          <strong>ai.pccc.vn</strong>
          <small>Đăng nhập vào workspace PCCC của anh</small>
        </div>
      </div>
      <button className="social-btn">Tiếp tục với Google</button>
      <div className="divider"><span>hoặc dùng email công việc</span></div>
      <label>
        Email
        <input value="admin@pccc.vn" readOnly />
      </label>
      <label>
        Mật khẩu
        <input value="••••••••••••" readOnly />
      </label>
      <div className="double-grid auth-mini-grid">
        <div className="mini-check-card">
          <strong>MFA</strong>
          <p>OTP qua app xác thực khi đăng nhập từ thiết bị lạ hoặc khi thay đổi quyền admin.</p>
        </div>
        <div className="mini-check-card">
          <strong>Workspace target</strong>
          <p>AI Station PCCC Vietnam · Owner landing · đồng bộ thread và queue gần nhất.</p>
        </div>
      </div>
      <div className="auth-row">
        <label className="checkbox-row"><input type="checkbox" checked readOnly /> Giữ đăng nhập cho workspace này</label>
        <button className="text-link">Quên mật khẩu?</button>
      </div>
      <button className="primary-btn full">Đăng nhập</button>
      <div className="signup-box">
        <strong>Chưa có workspace?</strong>
        <p>Tạo team space cho sale, kỹ thuật, hồ sơ và thư viện nội bộ trong một flow onboarding ngắn nhưng đủ rõ quyền và ownership.</p>
        <button className="secondary-btn full">Tạo workspace mới</button>
      </div>
    </div>
  )
}

export function HomeScreen({ heroStats, setScreen }: { heroStats: Stat[]; setScreen: (screen: Screen) => void }) {
  return (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow">AI PCCC PLATFORM · CHAT-FIRST WORKSPACE</div>
          <h1>Bản checkpoint này đẩy sản phẩm gần hơn một SaaS thật: chat có nhịp vận hành, auth có trust, và AI Station có logic điều phối.</h1>
          <p>
            Mục tiêu không phải thêm màn hình cho nhiều. Mục tiêu là để người duyệt nhìn vào thấy ngay: sản phẩm này có thể lớn lên thành
            một nền làm việc thật cho sale, kỹ thuật, hồ sơ và admin trong ngành PCCC.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setScreen('chat')}>Xem chat shell sâu hơn</button>
            <button className="secondary-btn" onClick={() => setScreen('auth')}>Xem auth flows</button>
            <button className="secondary-btn" onClick={() => setScreen('station')}>Xem AI Station</button>
          </div>
          <StatGrid stats={heroStats} />
        </div>

        <div className="hero-preview glass-panel">
          <div className="window-bar">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="window-title">ai.pccc.vn / next checkpoint</span>
          </div>
          <div className="hero-preview-stack">
            <div className="preview-tile highlight">
              <small>Chat management</small>
              <strong>Thread có owner, unread, SLA, file context, artifacts và handoff cues</strong>
            </div>
            <div className="preview-tile">
              <small>Auth UX</small>
              <strong>Login, SSO, reset, invite và signup đều có trust narrative thay vì chỉ là form đẹp</strong>
            </div>
            <div className="preview-tile">
              <small>AI Station</small>
              <strong>Có roster, queue, desks, usage và admin cues để đáng tin hơn cho môi trường doanh nghiệp</strong>
            </div>
            <div className="preview-tile">
              <small>PCCC specialization</small>
              <strong>Tất cả sample flow vẫn neo chắc vào sale, HSMT, kỹ thuật, SOP và thư viện nội bộ</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <span className="eyebrow">WHAT CHANGED</span>
          <h2>Một vertical slice sâu hơn, ít demo hơn và đáng tin hơn</h2>
          <p>Trọng tâm là tăng độ thật của những chỗ sẽ bị soi đầu tiên khi nghĩ về việc productize.</p>
        </div>
        <FeatureGrid items={productFeatures} />
      </section>

      <section className="section-block story-layout">
        <div className="story-card glass-panel">
          <span className="eyebrow">CHAT FEEL</span>
          <h2>Không còn giống một khung hỏi đáp tĩnh; giờ đã có dấu hiệu thread đang được vận hành bởi team.</h2>
          <p>
            Owner, SLA, unread, files, output queue và pulse panel làm phần chat bớt “demo screen” và gần hơn với công cụ làm việc thật.
          </p>
        </div>
        <div className="story-card glass-panel">
          <span className="eyebrow">STATION LAYER</span>
          <h2>AI Station bây giờ kể được câu chuyện từ account → team → desk → queue → policy.</h2>
          <p>
            Đây là thứ làm cho sản phẩm có vẻ đủ lực để đi tiếp sang MVP, thay vì dừng lại ở một landing đẹp có hộp chat.
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <span className="eyebrow">USER GROUPS</span>
          <h2>Giá trị theo vai trò vẫn rõ, nhưng đã gắn với ownership và desk logic thực tế hơn</h2>
        </div>
        <PersonaGrid items={personas} />
      </section>
    </>
  )
}

export function AuthScreen() {
  const [activeAuth, setActiveAuth] = useState('login')
  const activeStage = useMemo(() => authStages.find((item) => item.key === activeAuth) ?? authStages[0], [activeAuth])

  return (
    <section className="auth-layout deep-auth">
      <div className="auth-copy">
        <div className="section-head left">
          <span className="eyebrow">AUTH EXPERIENCE</span>
          <h2>Auth được nâng từ “đăng nhập đẹp” thành “vào đúng workspace với đủ tín hiệu an toàn”</h2>
          <p>
            Màn này cho thấy các trạng thái quan trọng nhất của một sản phẩm B2B: quay lại workspace, tạo mới, vào bằng Google,
            khôi phục truy cập, chấp nhận lời mời và hiểu ngay mình đang đi vào phạm vi nào.
          </p>
        </div>

        <AuthTabs items={authStages} active={activeAuth} setActive={setActiveAuth} />

        <div className="stage-summary glass-panel">
          <div>
            <div className="mini-tags"><span>{activeStage.badge}</span></div>
            <strong>{activeStage.title}</strong>
            <p>{activeStage.description}</p>
          </div>
          <small>{activeStage.helper}</small>
        </div>

        <FlowGrid items={authFlowSteps} />
        <TrustList items={authTrustItems} />
        <FeatureGrid items={authBenefits} />
      </div>

      <div className="auth-panel glass-panel">
        <div className="window-bar">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
          <span className="window-title">Secure entry · {activeStage.title}</span>
        </div>
        <AuthPreview stage={activeStage} />
      </div>
    </section>
  )
}

export function ChatScreen() {
  const [activeThread, setActiveThread] = useState(chatThreads.find((item) => item.active)?.title ?? chatThreads[0].title)
  const currentThread = useMemo(() => chatThreads.find((item) => item.title === activeThread) ?? chatThreads[0], [activeThread])

  return (
    <section className="chat-shell-layout expanded-chat">
      <aside className="chat-sidebar glass-panel">
        <div className="sidebar-top">
          <button className="primary-btn full">+ Phiên chat mới</button>
          <div className="search-chip">Tìm theo công trình, khách hàng, SOP, tiêu chuẩn, ticket nội bộ…</div>
          <div className="mini-tags stack">
            <span>Open</span>
            <span>Assigned</span>
            <span>Need review</span>
            <span>Archived</span>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-header-line">
            <small className="sidebar-label">Conversation list</small>
            <span>12 threads</span>
          </div>
          <ThreadList items={chatThreads} activeTitle={activeThread} onSelect={setActiveThread} />
        </div>

        <div className="sidebar-section compact-gap">
          <div className="sidebar-header-line">
            <small className="sidebar-label">Quick actions</small>
          </div>
          <InboxList items={conversationStates} />
        </div>
      </aside>

      <main className="chat-main glass-panel">
        <div className="chat-head-row">
          <div>
            <span className="eyebrow">CHATGPT-LIKE SHELL · PCCC MODE</span>
            <h2>Khung chat quen thuộc, nhưng đã có owner, SLA, file stack và output handoff như một công cụ làm việc thật</h2>
          </div>
          <div className="header-tags">
            <span>Hồ sơ thầu</span>
            <span>Nhà xưởng Bình Dương</span>
            <span>{currentThread.owner}</span>
          </div>
        </div>

        <MetricGrid items={chatMetrics} />

        <div className="chat-title-strip">
          <div>
            <strong>{activeThread}</strong>
            <p>Đang dùng cùng project context, shared files và note kỹ thuật để tránh lệch output. Owner hiện tại: {currentThread.owner}.</p>
          </div>
          <div className="title-actions">
            <button className="secondary-btn slim">Rename</button>
            <button className="secondary-btn slim">Assign</button>
            <button className="secondary-btn slim">Archive</button>
            <button className="secondary-btn slim danger">Delete</button>
          </div>
        </div>

        <MessageList items={chatMessages} />

        <div className="section-subhead">
          <small className="sidebar-label">Artifacts & source files</small>
        </div>
        <FileList items={activeThreadFiles} />

        <div className="prompt-row">
          {suggestedPrompts.map((prompt) => (
            <button className="chip-btn" key={prompt}>{prompt}</button>
          ))}
        </div>

        <div className="composer-mode-row">
          <span className="badge">Ask</span>
          <span className="badge subtle">Draft</span>
          <span className="badge subtle">Extract</span>
          <span className="badge subtle">Assign</span>
        </div>
        <div className="composer-row">
          <div className="upload-box">+ Tải PDF, DOCX, XLSX, ảnh, hồ sơ thầu hoặc công văn</div>
          <div className="composer-box">Mô tả yêu cầu, dán nội dung, hoặc kéo thả hồ sơ vào đây…</div>
          <button className="primary-btn composer-send">Gửi</button>
        </div>
        <div className="composer-footnote">
          Agent sẽ giữ chung context theo thread hiện tại, gợi xuất checklist · email · note kỹ thuật và cho phép giao ownership sang desk khác khi cần.
        </div>
      </main>

      <aside className="chat-sidepanel glass-panel">
        <div className="side-block">
          <small className="sidebar-label">Context live</small>
          <strong>{currentThread.owner}</strong>
          <p>{currentThread.state} · {currentThread.sla} · dùng chung project context để giảm lệch giữa các artifact.</p>
        </div>
        <div className="side-block">
          <small className="sidebar-label">Workspace pulse</small>
          <InboxList items={workspacePulse} />
        </div>
        <div className="side-block">
          <small className="sidebar-label">Output rail</small>
          <div className="mini-tags stack">
            {chatSideOutputs.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="side-block emphasis">
          <small className="sidebar-label">Thread controls</small>
          <p>Cho thấy hướng sản phẩm: assign owner, track unread, export artifact, archive xong việc và giữ decision trail theo từng thread.</p>
        </div>
      </aside>
    </section>
  )
}

export function StationScreen({ signals }: { signals: Stat[] }) {
  return (
    <section className="station-layout">
      <div className="section-head left">
        <span className="eyebrow">AI STATION · WORKSPACE ADMIN</span>
        <h2>AI Station giờ đáng tin hơn vì có người, việc, queue, usage và admin direction trong cùng một không gian</h2>
        <p>
          Đây là tầng trên của chat app: nơi owner thấy thành viên, desk, quyền truy cập, queue chờ xử lý, billing concept,
          library signal và tiến trình phối hợp giữa sales · kỹ thuật · hồ sơ trên cùng một nền.
        </p>
      </div>

      <BoardGrid items={stationBoards} />
      <StatGrid stats={signals} />
      <AccountGrid items={accountCards} />

      <div className="station-main">
        <div className="station-left glass-panel">
          <div className="station-shell-head">
            <strong>Workspace desks</strong>
            <span>Thiết kế để sau này cắm member thật, role thật, quota, project access, audit trail và handoff logic.</span>
          </div>
          <StationCardGrid items={stationCards} />

          <div className="section-subhead roomy">
            <small className="sidebar-label">Team roster</small>
          </div>
          <TeamGrid items={stationRoster} />
        </div>

        <div className="station-right glass-panel">
          <div className="station-shell-head">
            <strong>Live timeline</strong>
            <span>Gợi cảm giác một trạm điều phối công việc AI có queue và review, chứ không chỉ là hộp chat đẹp.</span>
          </div>
          <div className="timeline-list">
            {stationTimeline.map((item) => (
              <div className="timeline-item" key={item}>{item}</div>
            ))}
          </div>

          <div className="section-subhead roomy">
            <small className="sidebar-label">Handoff queue</small>
          </div>
          <QueueList items={stationQueue} />

          <div className="side-block emphasis">
            <small className="sidebar-label">Admin direction</small>
            <p>
              Station này đã đủ sức kể đường productization: owner center, trusted entry, desk-based workspace,
              shared library, queue visibility, audit summary và billing ownership trong cùng một narrative.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
