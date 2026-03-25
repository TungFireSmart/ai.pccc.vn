import { useMemo, useState } from 'react'
import type {
  AccountCard,
  AuthStage,
  Feature,
  FlowStep,
  InboxItem,
  Message,
  NavItem,
  Persona,
  Screen,
  Stat,
  StationCard,
  WorkspaceBoard,
  ChatThread,
} from './data'
import {
  accountCards,
  authBenefits,
  authFlowSteps,
  authStages,
  chatMessages,
  chatSideOutputs,
  chatThreads,
  conversationStates,
  personas,
  productFeatures,
  stationBoards,
  stationCards,
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
          <div className="thread-state">{thread.state}</div>
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

function AuthPreview({ stage }: { stage: AuthStage }) {
  if (stage.key === 'signup') {
    return (
      <div className="auth-form-shell">
        <div className="auth-brand">
          <div className="brand-mark">AI</div>
          <div>
            <strong>Tạo AI Station mới</strong>
            <small>Khởi tạo workspace cho sale, kỹ thuật và hồ sơ</small>
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
        <button className="social-btn">Chọn tài khoản Google</button>
        <div className="mini-tags stack">
          <span>SSO concept</span>
          <span>Domain-aware</span>
          <span>Invite-safe</span>
        </div>
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
        <button className="primary-btn full">Gửi link đặt lại mật khẩu</button>
        <div className="signup-box compact">
          <strong>Thông điệp hiển thị sau khi gửi</strong>
          <p>Link có hiệu lực 15 phút. Nếu email này thuộc workspace, anh sẽ nhận được hướng dẫn ngay.</p>
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
          <p>Người mời: admin@pccc.vn · Vai trò được gán: Sales Lead · Scope: Sales Desk + shared project library</p>
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
      <div className="auth-row">
        <label className="checkbox-row"><input type="checkbox" checked readOnly /> Giữ đăng nhập cho workspace này</label>
        <button className="text-link">Quên mật khẩu?</button>
      </div>
      <button className="primary-btn full">Đăng nhập</button>
      <div className="signup-box">
        <strong>Chưa có workspace?</strong>
        <p>Tạo team space cho sale, kỹ thuật, hồ sơ và thư viện nội bộ trong một flow onboarding ngắn.</p>
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
          <h1>Refactor mạnh hơn: chat app sâu hơn, auth rõ hơn, và lớp quản trị user/workspace đã có hình.</h1>
          <p>
            Bản này không chỉ đẹp hơn. Nó giải quyết đúng 3 điểm người duyệt cần thấy: cảm giác chat như sản phẩm thật,
            luồng vào/ra workspace rõ ràng, và câu chuyện quản trị doanh nghiệp đủ thuyết phục để tiếp tục productize.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setScreen('chat')}>Xem chat shell sâu hơn</button>
            <button className="secondary-btn" onClick={() => setScreen('auth')}>Xem auth flows</button>
            <button className="secondary-btn" onClick={() => setScreen('station')}>Xem workspace/admin</button>
          </div>
          <StatGrid stats={heroStats} />
        </div>

        <div className="hero-preview glass-panel">
          <div className="window-bar">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="window-title">ai.pccc.vn / review candidate v3</span>
          </div>
          <div className="hero-preview-stack">
            <div className="preview-tile highlight">
              <small>Chat shell</small>
              <strong>Sidebar có state, thread actions, context rail, composer và output flow rõ hơn</strong>
            </div>
            <div className="preview-tile">
              <small>Auth UX</small>
              <strong>Login · signup · Google · reset · team invite trong cùng một logic mạch lạc</strong>
            </div>
            <div className="preview-tile">
              <small>User management</small>
              <strong>Account, workspace, role, billing và admin concepts đã được đưa vào giao diện</strong>
            </div>
            <div className="preview-tile">
              <small>PCCC specialization</small>
              <strong>Toàn bộ sample flow vẫn neo chắc vào sale, HSMT, kỹ thuật và knowledge nội bộ</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <span className="eyebrow">WHAT CHANGED</span>
          <h2>Từ prototype đơn giản sang một frontend reviewable có chiều sâu sản phẩm</h2>
          <p>Trọng tâm không còn là “có màn hình”. Trọng tâm là mỗi màn hình đều kể được product story đúng phần việc của nó.</p>
        </div>
        <FeatureGrid items={productFeatures} />
      </section>

      <section className="section-block story-layout">
        <div className="story-card glass-panel">
          <span className="eyebrow">CHAT FEEL</span>
          <h2>Sidebar, thread state và output rail giúp màn chat gần trải nghiệm SaaS thật hơn nhiều.</h2>
          <p>
            Người duyệt có thể nhìn ra ngay: cuộc hội thoại nào đang active, cái nào nên archive, cái nào cần rename,
            và output nào đang được tạo từ cùng một context.
          </p>
        </div>
        <div className="story-card glass-panel">
          <span className="eyebrow">ADMIN NARRATIVE</span>
          <h2>Auth và workspace không còn rời rạc, mà nối thành câu chuyện owner → team → quyền → billing.</h2>
          <p>
            Đây là phần giúp bản prototype vượt khỏi “AI demo”. Nó gợi được cấu trúc sản phẩm đủ mạnh cho công ty PCCC dùng thật sau này.
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <span className="eyebrow">USER GROUPS</span>
          <h2>Giá trị theo vai trò vẫn rõ, nhưng nay đã gắn với quyền và điểm vào phù hợp</h2>
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
          <h2>Flow rõ từ cá nhân dùng thử đến team workspace, không còn chỉ là một form đăng nhập</h2>
          <p>
            Màn này cho thấy rõ những trạng thái quan trọng nhất của sản phẩm: quay lại workspace, tạo mới, đi vào bằng Google,
            khôi phục truy cập và chấp nhận lời mời vào team.
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

  return (
    <section className="chat-shell-layout expanded-chat">
      <aside className="chat-sidebar glass-panel">
        <div className="sidebar-top">
          <button className="primary-btn full">+ Phiên chat mới</button>
          <div className="search-chip">Tìm theo công trình, khách hàng, SOP…</div>
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
            <h2>Khung chat quen thuộc, nhưng có cảm giác điều phối công việc thật chứ không chỉ trả lời một lượt</h2>
          </div>
          <div className="header-tags">
            <span>Hồ sơ thầu</span>
            <span>Nhà xưởng Bình Dương</span>
            <span>Output ready</span>
          </div>
        </div>

        <div className="chat-title-strip">
          <div>
            <strong>{activeThread}</strong>
            <p>Đang dùng cùng project context, shared files và note kỹ thuật để tránh lệch output.</p>
          </div>
          <div className="title-actions">
            <button className="secondary-btn slim">Rename</button>
            <button className="secondary-btn slim">Archive</button>
            <button className="secondary-btn slim danger">Delete</button>
          </div>
        </div>

        <MessageList items={chatMessages} />

        <div className="prompt-row">
          {suggestedPrompts.map((prompt) => (
            <button className="chip-btn" key={prompt}>{prompt}</button>
          ))}
        </div>

        <div className="composer-row">
          <div className="upload-box">+ Tải PDF, DOCX, XLSX, ảnh, hồ sơ thầu hoặc công văn</div>
          <div className="composer-box">Mô tả yêu cầu, dán nội dung, hoặc kéo thả hồ sơ vào đây…</div>
          <button className="primary-btn composer-send">Gửi</button>
        </div>
        <div className="composer-footnote">
          Agent sẽ giữ chung context theo thread hiện tại và gợi xuất song song checklist · email · note kỹ thuật nếu phù hợp.
        </div>
      </main>

      <aside className="chat-sidepanel glass-panel">
        <div className="side-block">
          <small className="sidebar-label">Context live</small>
          <strong>Agent: Hồ sơ thầu</strong>
          <p>Đang ưu tiên rà HSMT, checklist nộp hồ sơ, draft email phân việc và note hỏi kỹ thuật.</p>
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
        <div className="side-block">
          <small className="sidebar-label">User menu concepts</small>
          <div className="mini-tags stack">
            <span>Account</span>
            <span>Workspace</span>
            <span>Role</span>
            <span>Billing</span>
            <span>Admin panel</span>
          </div>
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
        <h2>Khung workspace giờ có cả lớp account, team, role và admin narrative</h2>
        <p>
          Đây là tầng trên của chat app: nơi owner thấy được thành viên, workspace plan, quyền truy cập, billing concept
          và tiến trình phối hợp giữa sales · kỹ thuật · hồ sơ trên cùng một nền.
        </p>
      </div>

      <BoardGrid items={stationBoards} />
      <StatGrid stats={signals} />
      <AccountGrid items={accountCards} />

      <div className="station-main">
        <div className="station-left glass-panel">
          <div className="station-shell-head">
            <strong>Workspace desks</strong>
            <span>Thiết kế để sau này cắm member thật, role thật, quota, project access và audit trail</span>
          </div>
          <StationCardGrid items={stationCards} />
        </div>

        <div className="station-right glass-panel">
          <div className="station-shell-head">
            <strong>Live timeline</strong>
            <span>Gợi cảm giác một trạm điều phối công việc AI chứ không chỉ là hộp chat</span>
          </div>
          <div className="timeline-list">
            {stationTimeline.map((item) => (
              <div className="timeline-item" key={item}>{item}</div>
            ))}
          </div>
          <div className="side-block emphasis">
            <small className="sidebar-label">Admin direction</small>
            <p>
              Station này phù hợp để review đường productization: owner center, team invite, role-based workspace,
              shared library, audit summary và billing ownership trong cùng một câu chuyện sản phẩm.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
