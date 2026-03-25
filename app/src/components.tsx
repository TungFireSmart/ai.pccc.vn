import { useMemo, useState } from 'react'
import type {
  AccountCard,
  AccessRow,
  ActivityItem,
  AuthSession,
  AuthStage,
  AuthTrustItem,
  Feature,
  FileItem,
  FlowStep,
  HandoffStep,
  InboxItem,
  Message,
  MiniMetric,
  NavItem,
  Persona,
  PolicyItem,
  Screen,
  Stat,
  StationCard,
  StationQueueItem,
  TeamMember,
  WorkspaceBoard,
  ChatThread,
  ThreadContextPack,
} from './data'
import {
  accessMatrix,
  accountCards,
  authBenefits,
  authFlowSteps,
  authSessions,
  authStages,
  authTrustItems,
  chatThreads,
  conversationStates,
  personas,
  policyItems,
  productFeatures,
  stationBoards,
  stationCards,
  stationQueue,
  stationRoster,
  stationTimeline,
  suggestedPrompts,
} from './data'


const pilotTracks = [
  {
    title: 'Use case clarity',
    status: 'Strong',
    detail: 'Sale · kỹ thuật · hồ sơ · knowledge · onboarding đều đã có câu chuyện, đầu ra và quyền đi kèm.',
  },
  {
    title: 'Workflow realism',
    status: 'Improving',
    detail: 'Thread đã có owner, SLA, handoff, file stack và output rail; checkpoint này đẩy thêm execution layer và next-step guidance.',
  },
  {
    title: 'Enterprise trust',
    status: 'Credible',
    detail: 'Auth có device/session/invite/domain cues; AI Station có access matrix, queue, policy center và admin direction.',
  },
]

const useCaseFit = [
  {
    title: 'Lead nóng cần phản hồi nhanh',
    fit: 'High fit',
    note: 'Chat giữ SLA, nhắc thiếu dữ liệu, gắn handoff sang sale hoặc kỹ thuật mà không mất context.',
  },
  {
    title: 'Rà HSMT / hồ sơ deadline gấp',
    fit: 'High fit',
    note: 'Thread có artifact queue, risk flags, owner visibility và checklist bàn giao để tránh hụt bước.',
  },
  {
    title: 'Tra cứu căn cứ + đưa vào thư viện',
    fit: 'Good fit',
    note: 'Knowledge flow đã có nguồn, peer-review cues và station policy để kiểm soát publish.',
  },
  {
    title: 'Onboarding thành viên mới',
    fit: 'Good fit',
    note: 'Auth + station kể được câu chuyện workspace entry, desk scope, session trust và role elevation.',
  },
]

function WorkflowSnapshot({ activeContext }: { activeContext: ThreadContextPack }) {
  const completed = activeContext.handoffSteps.filter((item) => item.done).length
  const total = activeContext.handoffSteps.length
  const progress = Math.round((completed / Math.max(total, 1)) * 100)
  const blockers = activeContext.handoffSteps.filter((item) => !item.done)
  const nextAction = blockers[0]?.detail ?? 'Thread đã đủ điều kiện để export hoặc lưu làm template.'

  return (
    <div className="workflow-snapshot-grid">
      <article className="workflow-snapshot-card emphasis">
        <small className="sidebar-label">Execution score</small>
        <strong>{progress}% ready</strong>
        <p>{completed}/{total} handoff step hoàn tất. Thread đang bám theo {activeContext.stationFocus.reviewLabel.toLowerCase()} để tránh rơi khỏi nhịp duyệt.</p>
      </article>
      <article className="workflow-snapshot-card">
        <small className="sidebar-label">Next unblock</small>
        <strong>{blockers[0]?.label ?? 'Ready to ship'}</strong>
        <p>{nextAction}</p>
      </article>
      <article className="workflow-snapshot-card">
        <small className="sidebar-label">Artifacts in motion</small>
        <strong>{activeContext.outputs.length} outputs</strong>
        <p>{activeContext.outputs.slice(0, 2).join(' · ')}</p>
      </article>
    </div>
  )
}

function PilotTrackGrid() {
  return (
    <div className="pilot-track-grid">
      {pilotTracks.map((item) => (
        <article className="pilot-track-card" key={item.title}>
          <small className="sidebar-label">{item.status}</small>
          <strong>{item.title}</strong>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  )
}

function UseCaseFitGrid() {
  return (
    <div className="usecase-fit-grid">
      {useCaseFit.map((item) => (
        <article className="usecase-fit-card" key={item.title}>
          <div className="thread-footer-row compact">
            <strong>{item.title}</strong>
            <span className="badge subtle">{item.fit}</span>
          </div>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  )
}

function WorkflowBoard({ activeContext }: { activeContext: ThreadContextPack }) {
  const queued = activeContext.outputs
  const pending = activeContext.handoffSteps.filter((item) => !item.done)
  const done = activeContext.handoffSteps.filter((item) => item.done)

  return (
    <div className="workflow-board">
      <article className="workflow-lane glass-panel">
        <div className="lane-head">
          <small className="sidebar-label">Queued outputs</small>
          <span>{queued.length}</span>
        </div>
        <div className="lane-stack">
          {queued.map((item) => (
            <div className="lane-card" key={item}>
              <strong>{item}</strong>
              <p>Đang bám theo context hiện tại để xuất bản không lệch brief.</p>
            </div>
          ))}
        </div>
      </article>
      <article className="workflow-lane glass-panel">
        <div className="lane-head">
          <small className="sidebar-label">Waiting review</small>
          <span>{pending.length}</span>
        </div>
        <div className="lane-stack">
          {pending.map((item) => (
            <div className="lane-card warning" key={item.label}>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </article>
      <article className="workflow-lane glass-panel">
        <div className="lane-head">
          <small className="sidebar-label">Completed</small>
          <span>{done.length}</span>
        </div>
        <div className="lane-stack">
          {done.map((item) => (
            <div className="lane-card good" key={item.label}>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

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
            <span className={`badge subtle priority priority-${thread.priority.toLowerCase()}`}>{thread.priority}</span>
          </div>
          <div className="thread-footer-row">
            <div className="thread-state">{thread.state}</div>
            <small>{thread.sla}</small>
          </div>
          <small className="thread-handoff-note">{thread.handoff}</small>
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

function ActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <div className="activity-list">
      {items.map((item) => (
        <article className={`activity-card ${item.tone ?? 'default'}`} key={`${item.time}-${item.title}`}>
          <small>{item.time}</small>
          <strong>{item.title}</strong>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  )
}

function HandoffChecklist({ items }: { items: HandoffStep[] }) {
  return (
    <div className="handoff-list">
      {items.map((item) => (
        <article className={`handoff-card ${item.done ? 'done' : 'pending'}`} key={item.label}>
          <div className="handoff-check">{item.done ? '✓' : '•'}</div>
          <div>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

function SessionList({ items }: { items: AuthSession[] }) {
  return (
    <div className="session-list">
      {items.map((item) => (
        <article className="session-card" key={item.device}>
          <div>
            <strong>{item.device}</strong>
            <p>{item.location}</p>
          </div>
          <div className="session-meta">
            <span>{item.status}</span>
            <small>{item.lastSeen}</small>
          </div>
        </article>
      ))}
    </div>
  )
}

function AccessMatrix({ items }: { items: AccessRow[] }) {
  return (
    <div className="matrix-list">
      {items.map((item) => (
        <article className="matrix-card" key={item.role}>
          <strong>{item.role}</strong>
          <p>{item.scope}</p>
          <div className="matrix-meta">
            <span>{item.approval}</span>
            <small>{item.seat}</small>
          </div>
        </article>
      ))}
    </div>
  )
}

function PolicyList({ items }: { items: PolicyItem[] }) {
  return (
    <div className="policy-list">
      {items.map((item) => (
        <article className="policy-card" key={item.label}>
          <strong>{item.label}</strong>
          <p>{item.detail}</p>
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
        <div className="approval-banner">
          <strong>Admin setup ngay sau signup</strong>
          <p>Hệ thống gợi bật domain allowlist, mời team lead và xác nhận ai được làm billing owner.</p>
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
        <div className="approval-banner warning">
          <strong>Role cần owner review nếu nâng quyền</strong>
          <p>Nếu lời mời đổi từ Sales sang Admin hoặc truy cập file toàn workspace, hệ thống sẽ giữ ở trạng thái chờ duyệt.</p>
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
      <section className="section-block">
        <div className="section-head">
          <span className="eyebrow">PILOT SIGNAL</span>
          <h2>Checkpoint này bắt đầu nói bằng ngôn ngữ internal pilot thay vì concept review thuần túy</h2>
          <p>Ba trục cần cho pilot nội bộ — use case rõ, workflow có nhịp, auth/station có trust — giờ đã hiện diện trong cùng một câu chuyện.</p>
        </div>
        <PilotTrackGrid />
      </section>
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
              <strong>Thread có owner, priority, unread, SLA, artifacts, handoff checklist và activity rail</strong>
            </div>
            <div className="preview-tile">
              <small>Auth UX</small>
              <strong>Login, SSO, reset, invite và signup đều có trust narrative, device/session cues và admin approval logic</strong>
            </div>
            <div className="preview-tile">
              <small>AI Station</small>
              <strong>Có roster, queue, access matrix, policy center, seat logic và admin cues để đáng tin hơn cho môi trường doanh nghiệp</strong>
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
            Owner, priority, handoff checklist, activity rail, unread, files, output queue và pulse panel làm phần chat bớt “demo screen” và gần hơn với công cụ làm việc thật.
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

      <section className="section-block">
        <div className="section-head">
          <span className="eyebrow">BEST-FIRST PILOT USE CASES</span>
          <h2>Những job nên dùng để đưa bản này vào pilot nội bộ đầu tiên</h2>
          <p>Không cố ôm quá rộng. Bản này mạnh nhất khi bám các workflow có deadline, handoff và output rõ.</p>
        </div>
        <UseCaseFitGrid />
      </section>
    </>
  )
}

export function AuthScreen({
  activeContext,
  activeAuth,
  setActiveAuth,
}: {
  activeContext: ThreadContextPack
  activeAuth: string
  setActiveAuth: (value: string) => void
}) {
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

        <div className="context-bridge glass-panel">
          <small className="sidebar-label">Workspace-aware auth bridge</small>
          <strong>{activeContext.workspaceName}</strong>
          <p>{activeContext.authWorkspaceHint}</p>
          <div className="mini-tags stack">
            <span>{activeContext.projectLabel}</span>
            <span>{activeContext.deskLabel}</span>
            <span>{activeContext.stationFocus.reviewLabel}</span>
          </div>
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

        <div className="context-bridge compact glass-panel">
          <small className="sidebar-label">Trust note for current workspace state</small>
          <p>{activeContext.authTrustNote}</p>
        </div>

        <div className="section-subhead">
          <small className="sidebar-label">Session center</small>
        </div>
        <SessionList items={authSessions} />

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

export function ChatScreen({
  activeThread,
  setActiveThread,
  activeContext,
  setActiveAuth,
}: {
  activeThread: string
  setActiveThread: (value: string) => void
  activeContext: ThreadContextPack
  setActiveAuth: (value: string) => void
}) {
  const [composerMode, setComposerMode] = useState<'Ask' | 'Draft' | 'Extract' | 'Assign'>('Draft')
  const currentThread = useMemo(() => chatThreads.find((item) => item.title === activeThread) ?? chatThreads[0], [activeThread])
  const threadHealth = currentThread.priority === 'Critical' ? 'Owner visibility recommended' : currentThread.priority === 'High' ? 'Desk lead should monitor' : 'Routine handling is enough'

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
          <ThreadList items={chatThreads} activeTitle={activeThread} onSelect={(value) => { setActiveThread(value); }} />
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
            <h2>Khung chat quen thuộc, nhưng đã có owner, SLA, file stack, priority và output handoff như một công cụ làm việc thật</h2>
          </div>
          <div className="header-tags">
            <span>{activeContext.deskLabel}</span>
            <span>{activeContext.projectLabel}</span>
            <span>{currentThread.owner}</span>
            <span>{currentThread.priority}</span>
          </div>
        </div>

        <div className="context-bridge glass-panel">
          <small className="sidebar-label">Live workspace sync</small>
          <strong>{activeContext.workspaceName}</strong>
          <p>Chọn thread nào thì metrics, file stack, output rail, workspace pulse, AI Station focus và auth entry context đều đổi theo thread đó.</p>
          <div className="bridge-actions">
            <button className="secondary-btn slim" onClick={() => setActiveAuth(activeContext.authStageKey)}>Sync auth state</button>
            <span>{activeContext.stationFocus.reviewLabel}</span>
          </div>
        </div>

        <MetricGrid items={activeContext.metrics} />
        <WorkflowSnapshot activeContext={activeContext} />

        <div className="chat-title-strip">
          <div>
            <strong>{activeThread}</strong>
            <p>Đang dùng cùng project context, shared files và note kỹ thuật để tránh lệch output. Owner hiện tại: {currentThread.owner}. Handoff state: {currentThread.handoff}.</p>
          </div>
          <div className="title-actions">
            <button className="secondary-btn slim">Rename</button>
            <button className="secondary-btn slim">Assign</button>
            <button className="secondary-btn slim">Archive</button>
            <button className="secondary-btn slim danger">Delete</button>
          </div>
        </div>

        <div className="signal-strip glass-panel">
          <div>
            <small>Thread health</small>
            <strong>{threadHealth}</strong>
          </div>
          <div>
            <small>SLA</small>
            <strong>{currentThread.sla}</strong>
          </div>
          <div>
            <small>Handoff</small>
            <strong>{currentThread.handoff}</strong>
          </div>
        </div>

        <MessageList items={activeContext.messages} />

        <div className="chat-detail-grid">
          <div>
            <div className="section-subhead">
              <small className="sidebar-label">Artifacts & source files</small>
            </div>
            <FileList items={activeContext.files} />
          </div>
          <div>
            <div className="section-subhead">
              <small className="sidebar-label">Handoff checklist</small>
            </div>
            <HandoffChecklist items={activeContext.handoffSteps} />
          </div>
        </div>

        <div className="section-subhead">
          <small className="sidebar-label">Workflow board</small>
        </div>
        <WorkflowBoard activeContext={activeContext} />

        <div className="section-subhead">
          <small className="sidebar-label">Suggested prompts</small>
        </div>
        <div className="prompt-row">
          {suggestedPrompts.map((prompt) => (
            <button className="chip-btn" key={prompt}>{prompt}</button>
          ))}
        </div>

        <div className="composer-mode-row">
          {(['Ask', 'Draft', 'Extract', 'Assign'] as const).map((mode) => (
            <button key={mode} className={`badge mode-chip ${composerMode === mode ? 'active' : 'subtle'}`} onClick={() => setComposerMode(mode)}>
              {mode}
            </button>
          ))}
        </div>
        <div className="composer-row">
          <div className="upload-box">+ Tải PDF, DOCX, XLSX, ảnh, hồ sơ thầu hoặc công văn</div>
          <div className="composer-box">{composerMode === 'Assign' ? 'Chỉ định desk nhận việc, mô tả handoff và nêu rõ deadline…' : composerMode === 'Extract' ? 'Chọn phần cần bóc: tiêu chuẩn, thiết bị, checklist, căn cứ pháp lý…' : composerMode === 'Draft' ? 'Soạn email, Zalo, checklist hoặc note kỹ thuật từ context hiện tại…' : 'Mô tả yêu cầu, dán nội dung, hoặc kéo thả hồ sơ vào đây…'}</div>
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
          <InboxList items={activeContext.pulse} />
        </div>
        <div className="side-block">
          <small className="sidebar-label">Output rail</small>
          <div className="mini-tags stack">
            {activeContext.outputs.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="side-block">
          <small className="sidebar-label">Activity rail</small>
          <ActivityList items={activeContext.activities} />
        </div>
        <div className="side-block emphasis">
          <small className="sidebar-label">Thread controls</small>
          <p>{activeContext.stationFocus.adminHeadline}</p>
        </div>
      </aside>
    </section>
  )
}

export function StationScreen({
  signals,
  activeContext,
  setActiveThread,
  setScreen,
  setActiveAuth,
}: {
  signals: Stat[]
  activeContext: ThreadContextPack
  setActiveThread: (value: string) => void
  setScreen: (screen: Screen) => void
  setActiveAuth: (value: string) => void
}) {
  const syncedBoards = [activeContext.stationBoard, ...stationBoards.slice(0, 2)]
  const syncedQueue = [activeContext.stationFocus.queueLead, ...stationQueue.filter((item) => item.task !== activeContext.stationFocus.queueLead.task).slice(0, 3)]
  const syncedPolicies = [activeContext.stationFocus.policyLead, ...policyItems.filter((item) => item.label !== activeContext.stationFocus.policyLead.label).slice(0, 2)]
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

      <div className="context-bridge glass-panel">
        <small className="sidebar-label">Station synced with selected thread</small>
        <strong>{activeContext.threadTitle}</strong>
        <p>{activeContext.stationFocus.adminHeadline}</p>
        <div className="bridge-actions">
          <button className="secondary-btn slim" onClick={() => { setScreen('chat'); setActiveThread(activeContext.threadTitle) }}>Open this thread</button>
          <button className="secondary-btn slim" onClick={() => { setScreen('auth'); setActiveAuth(activeContext.authStageKey) }}>Open auth state</button>
          <span>{activeContext.stationFocus.reviewLabel}</span>
        </div>
      </div>

      <BoardGrid items={syncedBoards} />
      <StatGrid stats={signals} />
      <PilotTrackGrid />
      <AccountGrid items={accountCards} />

      <div className="station-main">
        <div className="station-left glass-panel">
          <div className="station-shell-head">
            <strong>Workspace desks</strong>
            <span>Thiết kế để sau này cắm member thật, role thật, quota, project access, audit trail và handoff logic.</span>
          </div>
          <StationCardGrid items={stationCards} />

          <div className="context-bridge compact glass-panel">
            <small className="sidebar-label">Roster note</small>
            <p>{activeContext.stationFocus.rosterNote}</p>
          </div>

          <div className="section-subhead roomy">
            <small className="sidebar-label">Team roster</small>
          </div>
          <TeamGrid items={stationRoster} />

          <div className="section-subhead roomy">
            <small className="sidebar-label">Access matrix</small>
          </div>
          <AccessMatrix items={accessMatrix} />
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
          <QueueList items={syncedQueue} />

          <div className="section-subhead roomy">
            <small className="sidebar-label">Policy center</small>
          </div>
          <PolicyList items={syncedPolicies} />

          <div className="side-block emphasis">
            <small className="sidebar-label">Admin direction</small>
            <p>
              {activeContext.stationFocus.adminHeadline}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
