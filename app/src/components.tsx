import { useMemo, useState } from 'react'
import type {
  AccountCard,
  AccessRow,
  ActivityItem,
  ApprovalStep,
  AuthSession,
  AuthStage,
  AuthTrustItem,
  ExportArtifact,
  Feature,
  FileItem,
  FlowStageKey,
  FlowStep,
  HandoffStep,
  TransitionMoment,
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
  WorkspaceMode,
  WorkspaceModeKey,
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
  workspaceModes,
} from './data'

const pilotTracks = [
  {
    title: 'Use case clarity',
    status: 'Strong',
    detail: 'Sale · kỹ thuật · hồ sơ · knowledge · onboarding đều đã có câu chuyện, đầu ra và quyền đi kèm.',
  },
  {
    title: 'Workflow realism',
    status: 'Stronger',
    detail: 'Thread giờ có execution score, approval chain, export rail và role landing để gần pilot nội bộ hơn.',
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
        <small className="sidebar-label">Tiến độ</small>
        <strong>{progress}% xong</strong>
        <p>{completed}/{total} bước đã xong. Thread đang bám theo {activeContext.stationFocus.reviewLabel.toLowerCase()}.</p>
      </article>
      <article className="workflow-snapshot-card">
        <small className="sidebar-label">Việc kế</small>
        <strong>{blockers[0]?.label ?? 'Ready to ship'}</strong>
        <p>{nextAction}</p>
      </article>
      <article className="workflow-snapshot-card">
        <small className="sidebar-label">Output</small>
        <strong>{activeContext.output.length} output</strong>
        <p>{activeContext.output.slice(0, 2).join(' · ')}</p>
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
  const queued = activeContext.output
  const pending = activeContext.handoffSteps.filter((item) => !item.done)
  const done = activeContext.handoffSteps.filter((item) => item.done)

  return (
    <div className="workflow-board">
      <article className="workflow-lane glass-panel">
        <div className="lane-head">
          <small className="sidebar-label">Queued output</small>
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
          <small className="sidebar-label">Chờ duyệt</small>
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
          <small className="sidebar-label">Xong</small>
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

function RoleModeSwitch({ activeMode, setBậtMode }: { activeMode: WorkspaceModeKey; setBậtMode: (value: WorkspaceModeKey) => void }) {
  return (
    <div className="role-mode-switch glass-panel">
      <div>
        <small className="sidebar-label">Vai trò</small>
        <strong>Đổi vai trò xem</strong>
        <p>Landing, ưu tiên và quyền duyệt đổi theo người đang dùng.</p>
      </div>
      <div className="mode-pill-row">
        {workspaceModes.map((mode) => (
          <button key={mode.key} className={`mode-pill ${activeMode === mode.key ? 'active' : ''}`} onClick={() => setBậtMode(mode.key)}>
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function LandingStatePanel({ mode, activeContext }: { mode: WorkspaceMode; activeContext: ThreadContextPack }) {
  return (
    <div className="landing-state-grid">
      <article className="workflow-snapshot-card emphasis">
        <small className="sidebar-label">Điểm vào</small>
        <strong>{mode.landing}</strong>
        <p>{activeContext.roleLandingLabel} · {mode.workspaceState}</p>
      </article>
      <article className="workflow-snapshot-card">
        <small className="sidebar-label">Mục tiêu</small>
        <strong>{mode.primaryGoal}</strong>
        <p>{activeContext.roleWorkspaceState}</p>
      </article>
      <article className="workflow-snapshot-card">
        <small className="sidebar-label">Quyền duyệt</small>
        <strong>{mode.canApprove}</strong>
        <p>{mode.focus.join(' · ')}</p>
      </article>
    </div>
  )
}

function ApprovalRail({ items }: { items: ApprovalStep[] }) {
  return (
    <div className="approval-rail">
      {items.map((item) => (
        <article className={`approval-step ${item.status.toLowerCase().replace(/\s+/g, '-')}`} key={item.label}>
          <div className="approval-step-head">
            <strong>{item.label}</strong>
            <span>{item.status}</span>
          </div>
          <small>{item.owner}</small>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  )
}

function ExportRail({ items }: { items: ExportArtifact[] }) {
  return (
    <div className="export-rail">
      {items.map((item) => (
        <article className={`export-card state-${item.state.toLowerCase().replace(/\s+/g, '-')}`} key={item.name}>
          <div className="approval-step-head">
            <strong>{item.name}</strong>
            <span>{item.state}</span>
          </div>
          <small>{item.channel} · ETA {item.eta}</small>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  )
}


function StageNavigator({ items, activeStage, setBậtStage }: { items: { key: FlowStageKey; label: string; owner: string; status: string; detail: string }[]; activeStage: FlowStageKey; setBậtStage: (value: FlowStageKey) => void }) {
  return (
    <div className="stage-navigator glass-panel">
      <div>
        <small className="sidebar-label">Flow</small>
        <strong>Cần xem → duyệt → xuất/gửi</strong>
        <p>Đổi stage để thấy việc đổi theo từng bước.</p>
      </div>
      <div className="stage-pill-row">
        {items.map((item) => (
          <button key={item.key} className={`stage-pill ${activeStage === item.key ? 'active' : ''}`} onClick={() => setBậtStage(item.key)}>
            <small>{item.status}</small>
            <strong>{item.label}</strong>
            <span>{item.owner}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function LiveFlowPanel({ activeContext, activeStage }: { activeContext: ThreadContextPack; activeStage: FlowStageKey }) {
  const stage = activeContext.stageFlow.find((item) => item.key === activeStage) ?? activeContext.stageFlow[0]
  const stageIndex = activeContext.stageFlow.findIndex((item) => item.key === stage.key)
  const relatedTransition = activeContext.transitionMoments[Math.min(stageIndex, activeContext.transitionMoments.length - 1)]
  const relatedArtifact = activeContext.exportArtifacts[Math.min(stageIndex, activeContext.exportArtifacts.length - 1)]

  return (
    <div className="live-flow-grid">
      <article className="live-flow-card emphasis">
        <small className="sidebar-label">Stage</small>
        <strong>{stage.label}</strong>
        <p>{stage.detail}</p>
        <div className="mini-tags stack">
          <span>{stage.owner}</span>
          <span>{stage.status}</span>
          <span>{activeContext.stationFocus.reviewLabel}</span>
        </div>
      </article>
      <article className="live-flow-card">
        <small className="sidebar-label">Move</small>
        <strong>{relatedTransition?.from} → {relatedTransition?.to}</strong>
        <p>{relatedTransition?.note}</p>
        <div className="thread-footer-row compact">
          <span className={`badge subtle transition-state transition-${relatedTransition?.status.toLowerCase()}`}>{relatedTransition?.status}</span>
          <small>ETA {relatedTransition?.eta}</small>
        </div>
      </article>
      <article className="live-flow-card">
        <small className="sidebar-label">Output</small>
        <strong>{relatedArtifact?.name}</strong>
        <p>{relatedArtifact?.note}</p>
        <div className="thread-footer-row compact">
          <span className={`badge subtle`}>{relatedArtifact?.state}</span>
          <small>{relatedArtifact?.channel}</small>
        </div>
      </article>
    </div>
  )
}

function TransitionRail({ items }: { items: TransitionMoment[] }) {
  return (
    <div className="transition-rail">
      {items.map((item) => (
        <article className={`transition-card state-${item.status.toLowerCase()}`} key={`${item.from}-${item.to}-${item.eta}`}>
          <div className="approval-step-head">
            <strong>{item.from} → {item.to}</strong>
            <span>{item.status}</span>
          </div>
          <small>ETA {item.eta}</small>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  )
}

function DecisionPulse({ activeContext, activeMode, activeStage }: { activeContext: ThreadContextPack; activeMode: WorkspaceModeKey; activeStage: FlowStageKey }) {
  const mode = workspaceModes.find((item) => item.key === activeMode) ?? workspaceModes[0]
  const stage = activeContext.stageFlow.find((item) => item.key === activeStage) ?? activeContext.stageFlow[0]
  const nextPending = activeContext.handoffSteps.find((item) => !item.done)

  return (
    <div className="decision-pulse glass-panel">
      <div className="decision-pulse-copy">
        <small className="sidebar-label">Now</small>
        <strong>{mode.label} · {stage.label}</strong>
        <p>
          Đang xem thread <strong>{activeContext.threadTitle}</strong> với trọng tâm <strong>{activeContext.stationFocus.reviewLabel}</strong>.
          Bước kế tiếp: {nextPending?.label ?? 'Có thể export hoặc share.'}
        </p>
      </div>
      <div className="decision-pulse-grid">
        <article className="decision-pulse-card">
          <small className="sidebar-label">Thread</small>
          <strong>{activeContext.projectLabel}</strong>
          <p>{activeContext.deskLabel} · {activeContext.roleLandingLabel}</p>
        </article>
        <article className="decision-pulse-card emphasis">
          <small className="sidebar-label">Next</small>
          <strong>{nextPending?.label ?? 'Ready to move'}</strong>
          <p>{nextPending?.detail ?? 'Có thể chuyển sang export hoặc share.'}</p>
        </article>
      </div>
    </div>
  )
}

export function TopNav({ items, screen, setScreen }: { items: NavItem[]; screen: Screen; setScreen: (screen: Screen) => void }) {
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
  return <div className="stat-grid">{stats.map((stat) => <article className="stat-card" key={stat.label}><small>{stat.label}</small><strong>{stat.value}</strong><p>{stat.note}</p></article>)}</div>
}
function FeatureGrid({ items }: { items: Feature[] }) {
  return <div className="feature-grid">{items.map((item) => <article className="feature-card" key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
}
function PersonaGrid({ items }: { items: Persona[] }) {
  return <div className="persona-grid">{items.map((persona) => <article className="persona-card" key={persona.title}><h3>{persona.title}</h3><p>{persona.summary}</p><div className="mini-tags">{persona.output.map((output) => <span key={output}>{output}</span>)}</div></article>)}</div>
}
function AuthTabs({ items, active, setBật }: { items: AuthStage[]; active: string; setBật: (value: string) => void }) {
  return <div className="auth-tab-row">{items.map((item) => <button key={item.key} className={active === item.key ? 'active' : ''} onClick={() => setBật(item.key)}><span>{item.title}</span><small>{item.badge}</small></button>)}</div>
}
function FlowGrid({ items }: { items: FlowStep[] }) {
  return <div className="flow-grid">{items.map((item) => <article className="flow-card" key={item.title}><strong>{item.title}</strong><p>{item.caption}</p></article>)}</div>
}
function ThreadList({ items, activeTitle, onSelect }: { items: ChatThread[]; activeTitle: string; onSelect: (value: string) => void }) {
  return <div className="thread-list">{items.map((thread) => <button className={`thread-card ${activeTitle === thread.title ? 'active' : ''}`} key={thread.title} onClick={() => onSelect(thread.title)}><div className="thread-card-top"><span>{thread.segment}</span><small>{thread.updatedAt}</small></div><strong>{thread.title}</strong><small>{thread.preview}</small><div className="thread-meta-row"><span className="badge subtle">{thread.owner}</span>{thread.unread && <span className="badge subtle">{thread.unread}</span>}<span className={`badge subtle priority priority-${thread.priority.toLowerCase()}`}>{thread.priority}</span></div><div className="thread-footer-row"><div className="thread-state">{thread.state}</div><small>{thread.sla}</small></div><small className="thread-handoff-note">{thread.handoff}</small></button>)}</div>
}
function MessageList({ items }: { items: Message[] }) { return <div className="message-list">{items.map((message, index) => <article className={`message-row ${message.role}`} key={`${message.role}-${index}`}><div className="message-avatar">{message.role === 'assistant' ? 'AI' : 'AN'}</div><div className="message-bubble">{message.meta && <small>{message.meta}</small>}<p>{message.content}</p></div></article>)}</div> }
function InboxList({ items }: { items: InboxItem[] }) { return <div className="stack-list">{items.map((item) => <article className={`stack-card ${item.tone ?? 'default'}`} key={item.label}><strong>{item.label}</strong><p>{item.note}</p></article>)}</div> }
function BoardGrid({ items }: { items: WorkspaceBoard[] }) { return <div className="board-grid">{items.map((board) => <article className="board-card" key={board.title}><small>{board.title}</small><strong>{board.status}</strong><p>{board.summary}</p></article>)}</div> }
function StationCardGrid({ items }: { items: StationCard[] }) { return <div className="station-grid">{items.map((card) => <article className="station-card" key={card.title}><h3>{card.title}</h3><p>{card.description}</p><ul>{card.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div> }
function AccountGrid({ items }: { items: AccountCard[] }) { return <div className="account-grid">{items.map((item) => <article className="account-card" key={item.title}><div className="account-head"><strong>{item.title}</strong>{item.badge && <span>{item.badge}</span>}</div><ul>{item.lines.map((line) => <li key={line}>{line}</li>)}</ul></article>)}</div> }
function MetricGrid({ items }: { items: MiniMetric[] }) { return <div className="metric-grid">{items.map((item) => <article className="metric-card" key={item.label}><small>{item.label}</small><strong>{item.value}</strong><p>{item.note}</p></article>)}</div> }
function FileList({ items }: { items: FileItem[] }) { return <div className="file-list">{items.map((item) => <article className="file-card" key={item.name}><div><strong>{item.name}</strong><p>{item.kind}</p></div><span>{item.status}</span></article>)}</div> }
function TrustList({ items }: { items: AuthTrustItem[] }) { return <div className="trust-list">{items.map((item) => <article className={`trust-card ${item.tone ?? 'default'}`} key={item.label}><strong>{item.label}</strong><p>{item.detail}</p></article>)}</div> }
function TeamGrid({ items }: { items: TeamMember[] }) { return <div className="team-grid">{items.map((item) => <article className="team-card" key={item.name}><div className="team-card-head"><strong>{item.name}</strong><span>{item.status}</span></div><small>{item.role}</small><p>{item.focus}</p></article>)}</div> }
function QueueList({ items }: { items: StationQueueItem[] }) { return <div className="queue-list">{items.map((item) => <article className="queue-card" key={item.task}><strong>{item.task}</strong><p>{item.owner} · ETA {item.eta}</p><span>{item.status}</span></article>)}</div> }
function ActivityList({ items }: { items: ActivityItem[] }) { return <div className="activity-list">{items.map((item) => <article className={`activity-card ${item.tone ?? 'default'}`} key={`${item.time}-${item.title}`}><small>{item.time}</small><strong>{item.title}</strong><p>{item.detail}</p></article>)}</div> }
function HandoffChecklist({ items }: { items: HandoffStep[] }) { return <div className="handoff-list">{items.map((item) => <article className={`handoff-card ${item.done ? 'done' : 'pending'}`} key={item.label}><div className="handoff-check">{item.done ? '✓' : '•'}</div><div><strong>{item.label}</strong><p>{item.detail}</p></div></article>)}</div> }
function SessionList({ items }: { items: AuthSession[] }) { return <div className="session-list">{items.map((item) => <article className="session-card" key={item.device}><div><strong>{item.device}</strong><p>{item.location}</p></div><div className="session-meta"><span>{item.status}</span><small>{item.lastSeen}</small></div></article>)}</div> }
function AccessMatrix({ items }: { items: AccessRow[] }) { return <div className="matrix-list">{items.map((item) => <article className="matrix-card" key={item.role}><strong>{item.role}</strong><p>{item.scope}</p><div className="matrix-meta"><span>{item.approval}</span><small>{item.seat}</small></div></article>)}</div> }
function PolicyList({ items }: { items: PolicyItem[] }) { return <div className="policy-list">{items.map((item) => <article className="policy-card" key={item.label}><strong>{item.label}</strong><p>{item.detail}</p><span>{item.status}</span></article>)}</div> }

function AuthPreview({ stage }: { stage: AuthStage }) {
  if (stage.key === 'signup') return <div className="auth-form-shell"><div className="auth-brand"><div className="brand-mark">AI</div><div><strong>Tạo workspace mới</strong><small>Tạo workspace cho team PCCC</small></div></div><label>Tên workspace<input value="AI Station PCCC Vietnam" readOnly /></label><div className="double-grid"><label>Quy mô<input value="6–15 thành viên" readOnly /></label><label>Use case<input value="HSMT + Sale + Knowledge" readOnly /></label></div><div className="double-grid"><label>Billing<input value="admin@pccc.vn" readOnly /></label><label>Desk đầu tiên<input value="Bid Desk" readOnly /></label></div><div className="approval-banner"><strong>Setup ngay sau signup</strong><p>Hệ thống gợi bật domain allowlist, mời team lead và chốt billing owner.</p></div><button className="primary-btn full">Tạo workspace</button><p className="form-note">Sau bước này hệ thống sẽ gợi ý mời các desk chính.</p></div>
  if (stage.key === 'google') return <div className="auth-form-shell"><div className="auth-brand"><div className="brand-mark">G</div><div><strong>Tiếp tục với Google</strong><small>Vào nhanh cho owner và thành viên được mời</small></div></div><div className="highlight-panel"><strong>Domain</strong><p>pccc.vn · Cho phép vào workspace “AI Station PCCC Vietnam” với vai trò Owner.</p></div><div className="double-grid auth-mini-grid"><div className="mini-check-card"><strong>Domain policy</strong><p>Chỉ email công ty và lời mời hợp lệ mới được vào.</p></div><div className="mini-check-card"><strong>Vào xong</strong><p>Mở thẳng AI Station với thread, desk và queue gần nhất.</p></div></div><button className="social-btn">Chọn tài khoản Google</button></div>
  if (stage.key === 'reset') return <div className="auth-form-shell"><div className="auth-brand"><div className="brand-mark">↺</div><div><strong>Khôi phục truy cập</strong><small>Vào lại nhanh khi cần gấp</small></div></div><label>Email công việc<input value="admin@pccc.vn" readOnly /></label><div className="double-grid auth-mini-grid"><div className="mini-check-card"><strong>Hết hạn</strong><p>15 phút · dùng một lần · xác nhận nếu vào từ máy lạ.</p></div><div className="mini-check-card"><strong>Khôi phục</strong><p>Có thể dùng mã dự phòng hoặc email recovery nếu mất điện thoại.</p></div></div><button className="primary-btn full">Gửi link đặt lại mật khẩu</button><div className="signup-box compact"><strong>Sau khi gửi</strong><p>Link có hiệu lực 15 phút. Nếu email đúng, anh sẽ nhận hướng dẫn ngay.</p></div></div>
  if (stage.key === 'invite') return <div className="auth-form-shell"><div className="auth-brand"><div className="brand-mark">IN</div><div><strong>Tham gia team</strong><small>Nhận lời mời vào workspace</small></div></div><div className="invite-card"><small>Lời mời</small><strong>AI Station PCCC Vietnam</strong><p>Người mời: admin@pccc.vn · Vai trò: Sales Lead · Scope: Sales Desk · Hết hạn sau 23 giờ</p></div><div className="double-grid auth-mini-grid"><div className="mini-check-card"><strong>Phạm vi</strong><p>Chỉ thấy thread, tài liệu và output của Sales Desk và project được chia sẻ.</p></div><div className="mini-check-card"><strong>Màn đầu</strong><p>Mở dashboard cá nhân với queue và việc cần follow-up.</p></div></div><div className="approval-banner warning"><strong>Nâng quyền cần duyệt</strong><p>Nếu lời mời đổi sang Admin hoặc mở rộng quyền, hệ thống sẽ giữ ở trạng thái chờ duyệt.</p></div><div className="double-grid"><button className="secondary-btn">Xem quyền</button><button className="primary-btn">Vào workspace</button></div></div>
  return <div className="auth-form-shell"><div className="auth-brand"><div className="brand-mark">AI</div><div><strong>ai.pccc.vn</strong><small>Đăng nhập vào workspace PCCC</small></div></div><button className="social-btn">Tiếp tục với Google</button><div className="divider"><span>hoặc email công việc</span></div><label>Email<input value="admin@pccc.vn" readOnly /></label><label>Mật khẩu<input value="••••••••••••" readOnly /></label><div className="double-grid auth-mini-grid"><div className="mini-check-card"><strong>MFA</strong><p>OTP qua app xác thực khi đăng nhập từ thiết bị lạ hoặc khi thay đổi quyền admin.</p></div><div className="mini-check-card"><strong>Workspace</strong><p>AI Station PCCC Vietnam · Owner landing · đồng bộ thread và queue gần nhất.</p></div></div><div className="auth-row"><label className="checkbox-row"><input type="checkbox" checked readOnly /> Giữ đăng nhập</label><button className="text-link">Quên mật khẩu?</button></div><button className="primary-btn full">Đăng nhập</button><div className="signup-box"><strong>Chưa có workspace</strong><p>Tạo workspace cho sale, kỹ thuật, hồ sơ và thư viện nội bộ.</p><button className="secondary-btn full">Tạo workspace mới</button></div></div>
}

export function HomeScreen({ heroStats, setScreen, activeMode, setBậtMode, activeContext, activeStage, setBậtStage }: { heroStats: Stat[]; setScreen: (screen: Screen) => void; activeMode: WorkspaceModeKey; setBậtMode: (value: WorkspaceModeKey) => void; activeContext: ThreadContextPack; activeStage: FlowStageKey; setBậtStage: (value: FlowStageKey) => void }) {
  const mode = workspaceModes.find((item) => item.key === activeMode) ?? workspaceModes[0]
  return <><RoleModeSwitch activeMode={activeMode} setBậtMode={setBậtMode} /><StageNavigator items={activeContext.stageFlow} activeStage={activeStage} setBậtStage={setBậtStage} /><DecisionPulse activeContext={activeContext} activeMode={activeMode} activeStage={activeStage} /><section className="section-block"><div className="section-head"><span className="eyebrow">PILOT</span><h2>Bản này đã đủ để xem như một pilot nội bộ</h2><p>Use case, workflow và độ tin cậy giờ đã đi cùng nhau trong một mạch rõ ràng.</p></div><PilotTrackGrid /></section><section className="hero-panel"><div className="hero-copy"><div className="eyebrow">AI PCCC · CHAT-FIRST</div><h1>Prototype này đã gần hơn với một SaaS thật: chat rõ việc, auth rõ quyền, AI Station rõ điều phối.</h1><p>Mục tiêu là để người duyệt nhìn vào thấy ngay: đây có thể thành một nền làm việc thật cho ngành PCCC.</p><div className="hero-actions"><button className="primary-btn" onClick={() => setScreen('chat')}>Xem chat</button><button className="secondary-btn" onClick={() => setScreen('auth')}>Xem auth</button><button className="secondary-btn" onClick={() => setScreen('station')}>Xem AI Station</button></div><StatGrid stats={heroStats} /></div><div className="hero-preview glass-panel"><div className="window-bar"><span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span><span className="window-title">ai.pccc.vn / role-aware pilot</span></div><div className="hero-preview-stack"><div className="preview-tile highlight"><small>Role-aware landing</small><strong>{mode.landing} · mỗi vai trò thấy workspace entry khác nhau thay vì cùng một dashboard</strong></div><div className="preview-tile"><small>Approval rail</small><strong>Mỗi thread có approval chain rõ: AI draft → desk sign-off → owner release</strong></div><div className="preview-tile"><small>Export realism</small><strong>Output có trạng thái Draft / Needs approval / Approved / Ready to share theo từng kênh</strong></div><div className="preview-tile"><small>PCCC specialization</small><strong>Tất cả flow vẫn neo chắc vào sale, HSMT, kỹ thuật, SOP và thư viện nội bộ</strong></div></div></div></section><section className="section-block"><div className="section-head"><span className="eyebrow">ROLE ENTRY</span><h2>Mỗi vai trò vào app sẽ thấy đúng điểm bắt đầu của mình</h2><p>Nhờ vậy bản này bớt giống concept tĩnh và giống sản phẩm thật hơn.</p></div><LandingStatePanel mode={mode} activeContext={activeContext} /></section><section className="section-block"><div className="section-head"><span className="eyebrow">LIVE FLOW</span><h2>Bản này đã có nhịp chạy việc thật</h2><p>Người duyệt có thể đổi stage để thấy việc đang ở đâu, ai chốt và bước nào đang chờ.</p></div><LiveFlowPanel activeContext={activeContext} activeStage={activeStage} /></section><section className="section-block"><div className="section-head"><span className="eyebrow">ĐIỂM MỚI</span><h2>Một lát cắt sâu hơn, thật hơn và dễ tin hơn</h2><p>Trọng tâm là làm chắc những chỗ sẽ bị soi đầu tiên khi nghĩ tới sản phẩm thật.</p></div><FeatureGrid items={productFeatures} /></section><section className="section-block story-layout"><div className="story-card glass-panel"><span className="eyebrow">CHAT</span><h2>Không còn giống một khung hỏi đáp tĩnh; giờ đã có dấu hiệu thread đang được vận hành bởi team.</h2><p>Owner, priority, handoff checklist, activity rail, unread, files, output queue và pulse panel làm phần chat bớt “demo screen” và gần hơn với công cụ làm việc thật.</p></div><div className="story-card glass-panel"><span className="eyebrow">OUTPUT</span><h2>Approval rail + export states cho thấy sản phẩm hiểu “được tạo ra” khác với “được phép gửi đi”.</h2><p>Đây là điểm rất quan trọng nếu muốn đưa bản này vào pilot nội bộ mà không tạo cảm giác AI được thả tự do.</p></div></section><section className="section-block"><div className="section-head"><span className="eyebrow">VAI TRÒ</span><h2>Giá trị theo vai trò vẫn rõ, nhưng đã gắn với ownership và desk logic thực tế hơn</h2></div><PersonaGrid items={personas} /></section><section className="section-block"><div className="section-head"><span className="eyebrow">USE CASE</span><h2>Những việc nên dùng để pilot nội bộ đầu tiên</h2><p>Bản này mạnh nhất ở workflow có deadline, handoff và output rõ.</p></div><UseCaseFitGrid /></section></>
}

export function AuthScreen({ activeContext, activeAuth, setBậtAuth, activeMode }: { activeContext: ThreadContextPack; activeAuth: string; setBậtAuth: (value: string) => void; activeMode: WorkspaceModeKey }) {
  const activeStage = useMemo(() => authStages.find((item) => item.key === activeAuth) ?? authStages[0], [activeAuth])
  const mode = workspaceModes.find((item) => item.key === activeMode) ?? workspaceModes[0]
  return <section className="auth-layout deep-auth"><div className="auth-copy"><div className="section-head left"><span className="eyebrow">AUTH</span><h2>Auth không chỉ để đăng nhập, mà để vào đúng workspace</h2><p>Màn này gom các trạng thái chính: vào lại, tạo mới, Google, khôi phục và lời mời.</p></div><div className="context-bridge glass-panel"><small className="sidebar-label">Auth bridge</small><strong>{activeContext.workspaceName}</strong><p>{activeContext.authWorkspaceHint}</p><div className="mini-tags stack"><span>{activeContext.projectLabel}</span><span>{activeContext.deskLabel}</span><span>{mode.landing}</span><span>{activeContext.stationFocus.reviewLabel}</span></div></div><AuthTabs items={authStages} active={activeAuth} setBật={setBậtAuth} /><div className="stage-summary glass-panel"><div><div className="mini-tags"><span>{activeStage.badge}</span></div><strong>{activeStage.title}</strong><p>{activeStage.description}</p></div><small>{activeStage.helper}</small></div><FlowGrid items={authFlowSteps} /><TrustList items={authTrustItems} /><div className="context-bridge compact glass-panel"><small className="sidebar-label">Landing after auth</small><p>{mode.label} sẽ mở vào <strong>{activeContext.roleLandingLabel}</strong> thay vì một màn chung, để người dùng thấy đúng việc và đúng quyền ngay.</p></div><div className="section-subhead"><small className="sidebar-label">Phiên đăng nhập</small></div><SessionList items={authSessions} /><FeatureGrid items={authBenefits} /></div><div className="auth-panel glass-panel"><div className="window-bar"><span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span><span className="window-title">Secure login · {activeStage.title}</span></div><AuthPreview stage={activeStage} /></div></section>
}

export function ChatScreen({ activeThread, setBậtThread, activeContext, setBậtAuth, activeMode, activeStage, setBậtStage }: { activeThread: string; setBậtThread: (value: string) => void; activeContext: ThreadContextPack; setBậtAuth: (value: string) => void; activeMode: WorkspaceModeKey; activeStage: FlowStageKey; setBậtStage: (value: FlowStageKey) => void }) {
  const [composerMode, setComposerMode] = useState<'Ask' | 'Draft' | 'Extract' | 'Giao'>('Draft')
  const currentThread = useMemo(() => chatThreads.find((item) => item.title === activeThread) ?? chatThreads[0], [activeThread])
  const threadHealth = currentThread.priority === 'Critical' ? 'Owner visibility recommended' : currentThread.priority === 'High' ? 'Desk lead should monitor' : 'Routine handling is enough'
  const mode = workspaceModes.find((item) => item.key === activeMode) ?? workspaceModes[0]
  return <section className="chat-shell-layout expanded-chat"><aside className="chat-sidebar glass-panel"><div className="sidebar-top"><button className="primary-btn full">+ Phiên chat mới</button><div className="search-chip">Tìm theo công trình, khách hàng, SOP, tiêu chuẩn…</div><div className="mini-tags stack"><span>{mode.label}</span><span>Open</span><span>Giaoed</span><span>Cần duyệt</span><span>Lưud</span></div></div><div className="sidebar-section"><div className="sidebar-header-line"><small className="sidebar-label">Conversation list</small><span>12 threads</span></div><ThreadList items={chatThreads} activeTitle={activeThread} onSelect={(value) => { setBậtThread(value) }} /></div><div className="sidebar-section compact-gap"><div className="sidebar-header-line"><small className="sidebar-label">Quick actions</small></div><InboxList items={conversationStates} /></div></aside><main className="chat-main glass-panel"><div className="chat-head-row"><div><span className="eyebrow">CHAT · PCCC</span><h2>Khung chat quen thuộc, nhưng đã có đủ lớp để làm việc thật</h2></div><div className="header-tags"><span>{activeContext.deskLabel}</span><span>{activeContext.projectLabel}</span><span>{currentThread.owner}</span><span>{currentThread.priority}</span></div></div><div className="context-bridge glass-panel"><small className="sidebar-label">Sync</small><strong>{activeContext.workspaceName}</strong><p>Đổi thread là toàn bộ context, output, approval và trạng thái liên quan đổi theo.</p><div className="bridge-actions"><button className="secondary-btn slim" onClick={() => setBậtAuth(activeContext.authStageKey)}>Sync auth</button><span>{mode.landing}</span><span>{activeContext.stationFocus.reviewLabel}</span></div></div><DecisionPulse activeContext={activeContext} activeMode={activeMode} activeStage={activeStage} /><LandingStatePanel mode={mode} activeContext={activeContext} /><StageNavigator items={activeContext.stageFlow} activeStage={activeStage} setBậtStage={setBậtStage} /><LiveFlowPanel activeContext={activeContext} activeStage={activeStage} /><MetricGrid items={activeContext.metrics} /><WorkflowSnapshot activeContext={activeContext} /><div className="chat-title-strip"><div><strong>{activeThread}</strong><p>Đang dùng cùng project context, shared files và note kỹ thuật để tránh lệch output. Owner hiện tại: {currentThread.owner}. Handoff state: {currentThread.handoff}.</p></div><div className="title-actions"><button className="secondary-btn slim">Đổi tên</button><button className="secondary-btn slim">Giao</button><button className="secondary-btn slim">Lưu</button><button className="secondary-btn slim danger">Xóa</button></div></div><div className="signal-strip glass-panel"><div><small>Tình trạng</small><strong>{threadHealth}</strong></div><div><small>SLA</small><strong>{currentThread.sla}</strong></div><div><small>Handoff</small><strong>{currentThread.handoff}</strong></div></div><MessageList items={activeContext.messages} /><div className="section-subhead"><small className="sidebar-label">Luồng duyệt</small></div><ApprovalRail items={activeContext.approvalSteps} /><div className="section-subhead"><small className="sidebar-label">Luồng xuất</small></div><ExportRail items={activeContext.exportArtifacts} /><div className="section-subhead"><small className="sidebar-label">Transitions</small></div><TransitionRail items={activeContext.transitionMoments} /><div className="chat-detail-grid"><div><div className="section-subhead"><small className="sidebar-label">File</small></div><FileList items={activeContext.files} /></div><div><div className="section-subhead"><small className="sidebar-label">Checklist</small></div><HandoffChecklist items={activeContext.handoffSteps} /></div></div><div className="section-subhead"><small className="sidebar-label">Bảng việc</small></div><WorkflowBoard activeContext={activeContext} /><div className="section-subhead"><small className="sidebar-label">Gợi ý</small></div><div className="prompt-row">{suggestedPrompts.map((prompt) => <button className="chip-btn" key={prompt}>{prompt}</button>)}</div><div className="composer-mode-row">{(['Ask', 'Draft', 'Extract', 'Giao'] as const).map((modeOption) => <button key={modeOption} className={`badge mode-chip ${composerMode === modeOption ? 'active' : 'subtle'}`} onClick={() => setComposerMode(modeOption)}>{modeOption}</button>)}</div><div className="composer-row"><div className="upload-box">+ Tải PDF, DOCX, XLSX, ảnh, hồ sơ thầu hoặc công văn</div><div className="composer-box">{composerMode === 'Giao' ? 'Chỉ định desk, mô tả handoff và deadline…' : composerMode === 'Extract' ? 'Chọn phần cần bóc: tiêu chuẩn, thiết bị, checklist…' : composerMode === 'Draft' ? 'Soạn email, Zalo, checklist hoặc note kỹ thuật…' : 'Mô tả yêu cầu hoặc kéo hồ sơ vào đây…'}</div><button className="primary-btn composer-send">Gửi</button></div><div className="composer-footnote">Agent sẽ giữ chung context theo thread hiện tại, gợi xuất checklist · email · note kỹ thuật, hiển thị trạng thái approval/export và cho phép giao ownership sang desk khác khi cần.</div></main><aside className="chat-sidepanel glass-panel"><div className="side-block"><small className="sidebar-label">Context</small><strong>{currentThread.owner}</strong><p>{currentThread.state} · {currentThread.sla} · dùng chung project context để giảm lệch giữa các artifact.</p></div><div className="side-block"><small className="sidebar-label">Nhịp làm việc</small><InboxList items={activeContext.pulse} /></div><div className="side-block"><small className="sidebar-label">Output</small><div className="mini-tags stack">{activeContext.output.map((item) => <span key={item}>{item}</span>)}</div></div><div className="side-block"><small className="sidebar-label">Hoạt động</small><ActivityList items={activeContext.activities} /></div><div className="side-block"><small className="sidebar-label">Desk continuity</small><TransitionRail items={activeContext.transitionMoments.slice(0, 2)} /></div><div className="side-block emphasis"><small className="sidebar-label">Điều khiển</small><p>{activeContext.stationFocus.adminHeadline}</p></div></aside></section>
}

export function StationScreen({ signals, activeContext, setBậtThread, setScreen, setBậtAuth, activeMode, activeStage, setBậtStage }: { signals: Stat[]; activeContext: ThreadContextPack; setBậtThread: (value: string) => void; setScreen: (screen: Screen) => void; setBậtAuth: (value: string) => void; activeMode: WorkspaceModeKey; activeStage: FlowStageKey; setBậtStage: (value: FlowStageKey) => void }) {
  const syncedBoards = [activeContext.stationBoard, ...stationBoards.slice(0, 2)]
  const syncedQueue = [activeContext.stationFocus.queueLead, ...stationQueue.filter((item) => item.task !== activeContext.stationFocus.queueLead.task).slice(0, 3)]
  const syncedPolicies = [activeContext.stationFocus.policyLead, ...policyItems.filter((item) => item.label !== activeContext.stationFocus.policyLead.label).slice(0, 2)]
  const mode = workspaceModes.find((item) => item.key === activeMode) ?? workspaceModes[0]
  return <section className="station-layout"><div className="section-head left"><span className="eyebrow">AI STATION</span><h2>AI Station giờ đáng tin hơn vì gom người, việc và quyền vào cùng một chỗ</h2><p>Đây là nơi owner thấy thành viên, desk, quyền truy cập, hàng chờ và nhịp phối hợp của team.</p></div><DecisionPulse activeContext={activeContext} activeMode={activeMode} activeStage={activeStage} /><LandingStatePanel mode={mode} activeContext={activeContext} /><StageNavigator items={activeContext.stageFlow} activeStage={activeStage} setBậtStage={setBậtStage} /><LiveFlowPanel activeContext={activeContext} activeStage={activeStage} /><div className="context-bridge glass-panel"><small className="sidebar-label">Station sync</small><strong>{activeContext.threadTitle}</strong><p>{activeContext.stationFocus.adminHeadline}</p><div className="bridge-actions"><button className="secondary-btn slim" onClick={() => { setScreen('chat'); setBậtThread(activeContext.threadTitle) }}>Mở thread</button><button className="secondary-btn slim" onClick={() => { setScreen('auth'); setBậtAuth(activeContext.authStageKey) }}>Mở auth</button><span>{mode.label}</span><span>{activeContext.stationFocus.reviewLabel}</span></div></div><BoardGrid items={syncedBoards} /><StatGrid stats={signals} /><PilotTrackGrid /><AccountGrid items={accountCards} /><div className="station-main"><div className="station-left glass-panel"><div className="station-shell-head"><strong>Desks</strong><span>Thiết kế để sau này gắn member, role, quota và handoff logic.</span></div><StationCardGrid items={stationCards} /><div className="context-bridge compact glass-panel"><small className="sidebar-label">Ghi chú</small><p>{activeContext.stationFocus.rosterNote}</p></div><div className="section-subhead roomy"><small className="sidebar-label">Team</small></div><TeamGrid items={stationRoster} /><div className="section-subhead roomy"><small className="sidebar-label">Quyền</small></div><AccessMatrix items={accessMatrix} /></div><div className="station-right glass-panel"><div className="station-shell-head"><strong>Timeline</strong><span>Cho cảm giác một trạm điều phối có queue và review rõ ràng.</span></div><div className="timeline-list">{stationTimeline.map((item) => <div className="timeline-item" key={item}>{item}</div>)}</div><div className="section-subhead roomy"><small className="sidebar-label">Queue</small></div><QueueList items={syncedQueue} /><div className="section-subhead roomy"><small className="sidebar-label">Policy</small></div><PolicyList items={syncedPolicies} /><div className="section-subhead roomy"><small className="sidebar-label">Luồng duyệt</small></div><ApprovalRail items={activeContext.approvalSteps} /><div className="section-subhead roomy"><small className="sidebar-label">Transitions</small></div><TransitionRail items={activeContext.transitionMoments} /><div className="side-block emphasis"><small className="sidebar-label">Admin note</small><p>{activeContext.stationFocus.adminHeadline}</p></div></div></div></section>
}
