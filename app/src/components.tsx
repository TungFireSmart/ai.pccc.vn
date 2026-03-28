import { useEffect, useMemo, useState } from 'react'
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
  api,
  type AssistantActionBrief,
  type AuthResponse,
  type DocumentRecord,
  type DocumentRetrieveResponse,
  type ExecuteOutputAutomationMode,
  type FileRecord,
  type OutputEventRecord,
  type OutputRecord,
  type StationSummary,
  type ThreadDetail,
  type ThreadRecord,
  type WorkspaceMemberOption,
  type WorkspaceSummary,
} from './api'
import { clearAuthState, saveAuthState, type AuthState } from './auth-store'
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

function mapOutputToApprovalSteps(outputs: OutputRecord[]): ApprovalStep[] {
  return outputs.slice(0, 4).map((output) => ({
    label: output.title,
    owner: output.approvedById ? 'Owner sign-off' : output.kind,
    status: output.approvalStatus === 'APPROVED' ? 'Done' : output.approvalStatus === 'CHANGES_REQUESTED' ? 'Pending' : 'Active',
    note: output.approvalNote ?? (output.approvalStatus === 'APPROVED'
      ? 'Artifact đã được duyệt trên backend và sẵn để đi tiếp.'
      : output.approvalStatus === 'CHANGES_REQUESTED'
        ? 'Backend đang giữ ở trạng thái cần chỉnh trước khi release.'
        : 'Artifact đang chờ duyệt trên backend.'),
  }))
}

function mapOutputToExportArtifacts(outputs: OutputRecord[]): ExportArtifact[] {
  return outputs.slice(0, 4).map((output) => ({
    name: output.title,
    channel: output.exportChannel ?? 'Internal rail',
    state: output.exportStatus === 'EXPORTED' ? 'Ready to share' : output.exportStatus === 'READY' ? 'Approved' : output.approvalStatus === 'APPROVED' ? 'Needs approval' : 'Draft',
    eta: output.exportStatus === 'EXPORTED' ? 'sent' : output.exportStatus === 'READY' ? 'ready now' : 'review',
    note: output.exportNote ?? (output.documentId ? 'Output này đang gắn với document thật trong thread.' : 'Output này đang theo dõi như artifact thật ở backend.'),
  }))
}

function WorkflowSnapshot({ activeContext, liveDocuments, liveRetrieveCount }: { activeContext: ThreadContextPack; liveDocuments?: DocumentRecord[]; liveRetrieveCount?: number }) {
  const completed = activeContext.handoffSteps.filter((item) => item.done).length
  const total = activeContext.handoffSteps.length
  const progress = Math.round((completed / Math.max(total, 1)) * 100)
  const blockers = activeContext.handoffSteps.filter((item) => !item.done)
  const hasLiveDocs = Boolean(liveDocuments && liveDocuments.length > 0)
  const nextAction = hasLiveDocs
    ? blockers[0]?.detail ?? 'Luồng tài liệu đã có dữ liệu thật, có thể tiếp tục retrieve hoặc export.'
    : blockers[0]?.detail ?? 'Thread đã đủ điều kiện để export hoặc lưu làm template.'

  return (
    <div className="workflow-snapshot-grid">
      <article className="workflow-snapshot-card emphasis">
        <small className="sidebar-label">Tiến độ</small>
        <strong>{progress}% xong</strong>
        <p>{completed}/{total} bước đã xong. Thread đang bám theo {activeContext.stationFocus.reviewLabel.toLowerCase()}.</p>
      </article>
      <article className="workflow-snapshot-card">
        <small className="sidebar-label">Việc kế</small>
        <strong>{hasLiveDocs ? 'Retrieve + trích dẫn' : blockers[0]?.label ?? 'Ready to ship'}</strong>
        <p>{nextAction}</p>
      </article>
      <article className="workflow-snapshot-card">
        <small className="sidebar-label">Output</small>
        <strong>{hasLiveDocs ? `${liveDocuments?.length ?? 0} documents` : `${activeContext.outputs.length} output`}</strong>
        <p>{hasLiveDocs ? `${liveRetrieveCount ?? 0} kết quả retrieve · ${(liveDocuments ?? []).filter((item) => item.status === 'INGESTED').length} document đã ingest` : activeContext.outputs.slice(0, 2).join(' · ')}</p>
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

function WorkflowBoard({ activeContext, liveDocuments, retrieve }: { activeContext: ThreadContextPack; liveDocuments?: DocumentRecord[]; retrieve?: DocumentRetrieveResponse | null }) {
  const hasLiveDocs = Boolean(liveDocuments && liveDocuments.length > 0)
  const queued = hasLiveDocs
    ? (liveDocuments ?? []).map((item) => ({ title: item.title, detail: `${item.file.originalName} · ${item.chunks.length} chunks · ${item.status}` }))
    : activeContext.outputs.map((item) => ({ title: item, detail: 'Đang bám theo context hiện tại để xuất bản không lệch brief.' }))
  const pending = hasLiveDocs
    ? (liveDocuments ?? []).filter((item) => item.status !== 'INGESTED').map((item) => ({ label: `Ingest ${item.title}`, detail: `Document này vẫn ở trạng thái ${item.status.toLowerCase()} nên chưa retrieve ổn định.` }))
    : activeContext.handoffSteps.filter((item) => !item.done)
  const done = hasLiveDocs
    ? [
        ...(liveDocuments ?? []).filter((item) => item.status === 'INGESTED').map((item) => ({ label: item.title, detail: `${item.chunks.length} chunks sẵn cho retrieve và citation.` })),
        ...((retrieve?.results ?? []).slice(0, 2).map((item) => ({ label: `Chunk ${item.chunkIndex + 1}`, detail: `${item.citation.fileName} · ${item.citation.sourceType}` }))),
      ]
    : activeContext.handoffSteps.filter((item) => item.done)

  return (
    <div className="workflow-board">
      <article className="workflow-lane glass-panel">
        <div className="lane-head">
          <small className="sidebar-label">{hasLiveDocs ? 'Live documents' : 'Queued output'}</small>
          <span>{queued.length}</span>
        </div>
        <div className="lane-stack">
          {queued.map((item) => (
            <div className="lane-card" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </article>
      <article className="workflow-lane glass-panel">
        <div className="lane-head">
          <small className="sidebar-label">{hasLiveDocs ? 'Chờ ingest' : 'Chờ duyệt'}</small>
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
          <small className="sidebar-label">{hasLiveDocs ? 'Đã retrieve' : 'Xong'}</small>
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

function RoleModeSwitch({ activeMode, setActiveMode }: { activeMode: WorkspaceModeKey; setActiveMode: (value: WorkspaceModeKey) => void }) {
  return (
    <div className="role-mode-switch glass-panel">
      <div>
        <small className="sidebar-label">Vai trò</small>
        <strong>Đổi vai trò xem</strong>
        <p>Landing, ưu tiên và quyền duyệt đổi theo người đang dùng.</p>
      </div>
      <div className="mode-pill-row">
        {workspaceModes.map((mode) => (
          <button key={mode.key} className={`mode-pill ${activeMode === mode.key ? 'active' : ''}`} onClick={() => setActiveMode(mode.key)}>
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


function StageNavigator({ items, activeStage, setActiveStage }: { items: { key: FlowStageKey; label: string; owner: string; status: string; detail: string }[]; activeStage: FlowStageKey; setActiveStage: (value: FlowStageKey) => void }) {
  return (
    <div className="stage-navigator glass-panel">
      <div>
        <small className="sidebar-label">Flow</small>
        <strong>Cần xem → duyệt → xuất/gửi</strong>
        <p>Đổi stage để thấy việc đổi theo từng bước.</p>
      </div>
      <div className="stage-pill-row">
        {items.map((item) => (
          <button key={item.key} className={`stage-pill ${activeStage === item.key ? 'active' : ''}`} onClick={() => setActiveStage(item.key)}>
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
  return <div className="persona-grid">{items.map((persona) => <article className="persona-card" key={persona.title}><h3>{persona.title}</h3><p>{persona.summary}</p><div className="mini-tags">{persona.outputs.map((output) => <span key={output}>{output}</span>)}</div></article>)}</div>
}
function AuthTabs({ items, active, setActive }: { items: AuthStage[]; active: string; setActive: (value: string) => void }) {
  return <div className="auth-tab-row">{items.map((item) => <button key={item.key} className={active === item.key ? 'active' : ''} onClick={() => setActive(item.key)}><span>{item.title}</span><small>{item.badge}</small></button>)}</div>
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
function FileList({ items, liveFiles }: { items: FileItem[]; liveFiles?: FileRecord[] }) {
  if (liveFiles && liveFiles.length > 0) {
    return <div className="file-list">{liveFiles.map((item) => <article className="file-card" key={item.id}><div><strong>{item.originalName}</strong><p>{item.mimeType} · {(item.sizeBytes / 1024).toFixed(1)} KB</p></div><span>{item.status}</span></article>)}</div>
  }

  return <div className="file-list">{items.map((item) => <article className="file-card" key={item.name}><div><strong>{item.name}</strong><p>{item.kind}</p></div><span>{item.status}</span></article>)}</div>
}
function TrustList({ items }: { items: AuthTrustItem[] }) { return <div className="trust-list">{items.map((item) => <article className={`trust-card ${item.tone ?? 'default'}`} key={item.label}><strong>{item.label}</strong><p>{item.detail}</p></article>)}</div> }
function TeamGrid({ items }: { items: TeamMember[] }) { return <div className="team-grid">{items.map((item) => <article className="team-card" key={item.name}><div className="team-card-head"><strong>{item.name}</strong><span>{item.status}</span></div><small>{item.role}</small><p>{item.focus}</p></article>)}</div> }
function QueueList({ items }: { items: StationQueueItem[] }) { return <div className="queue-list">{items.map((item) => <article className="queue-card" key={item.task}><strong>{item.task}</strong><p>{item.owner} · ETA {item.eta}</p><span>{item.status}</span></article>)}</div> }
function ActivityList({ items }: { items: ActivityItem[] }) { return <div className="activity-list">{items.map((item) => <article className={`activity-card ${item.tone ?? 'default'}`} key={`${item.time}-${item.title}`}><small>{item.time}</small><strong>{item.title}</strong><p>{item.detail}</p></article>)}</div> }
function HandoffChecklist({ items }: { items: HandoffStep[] }) { return <div className="handoff-list">{items.map((item) => <article className={`handoff-card ${item.done ? 'done' : 'pending'}`} key={item.label}><div className="handoff-check">{item.done ? '✓' : '•'}</div><div><strong>{item.label}</strong><p>{item.detail}</p></div></article>)}</div> }
function SessionList({ items }: { items: AuthSession[] }) { return <div className="session-list">{items.map((item) => <article className="session-card" key={item.device}><div><strong>{item.device}</strong><p>{item.location}</p></div><div className="session-meta"><span>{item.status}</span><small>{item.lastSeen}</small></div></article>)}</div> }
function AccessMatrix({ items }: { items: AccessRow[] }) { return <div className="matrix-list">{items.map((item) => <article className="matrix-card" key={item.role}><strong>{item.role}</strong><p>{item.scope}</p><div className="matrix-meta"><span>{item.approval}</span><small>{item.seat}</small></div></article>)}</div> }
function PolicyList({ items }: { items: PolicyItem[] }) { return <div className="policy-list">{items.map((item) => <article className="policy-card" key={item.label}><strong>{item.label}</strong><p>{item.detail}</p><span>{item.status}</span></article>)}</div> }

function buildAssistantTimelineEntries(input: { threadDetail: ThreadDetail | null; outputs: OutputRecord[]; documents: DocumentRecord[]; brief: AssistantBriefState | null }): AssistantTimelineEntry[] {
  const entries: AssistantTimelineEntry[] = []

  if (input.threadDetail) {
    const recentMessages = input.threadDetail.messages.slice(-3).reverse()
    recentMessages.forEach((message) => {
      entries.push({
        label: message.role === 'assistant' ? 'Assistant replied' : 'User asked',
        detail: message.content.length > 140 ? `${message.content.slice(0, 140)}…` : message.content,
        meta: new Date(message.createdAt).toLocaleString(),
        tone: message.role === 'assistant' ? 'good' : 'default',
      })
    })
  }

  input.outputs.slice(0, 3).forEach((output) => {
    entries.push({
      label: `Artifact · ${output.title}`,
      detail: `Approve ${output.approvalStatus} · export ${output.exportStatus}${output.exportChannel ? ` · ${output.exportChannel}` : ''}`,
      meta: new Date(output.updatedAt).toLocaleString(),
      tone: output.approvalStatus === 'APPROVED' || output.exportStatus === 'EXPORTED' ? 'good' : output.approvalStatus === 'CHANGES_REQUESTED' ? 'warning' : 'default',
    })
  })

  input.documents.slice(0, 2).forEach((document) => {
    entries.push({
      label: `Evidence · ${document.title}`,
      detail: `${document.status} · ${document.chunks.length} chunks · ${document.file.originalName}`,
      meta: new Date(document.createdAt).toLocaleString(),
      tone: document.status === 'INGESTED' ? 'good' : 'default',
    })
  })

  if (input.brief) {
    entries.unshift({
      label: 'Next step',
      detail: `${input.brief.action.nextAction} · ${input.brief.action.approvalLabel} · ${input.brief.action.exportLabel}`,
      meta: input.brief.linkedDocumentTitle ?? 'Composer orchestration',
      tone: 'good',
    })
  }

  return entries.slice(0, 6)
}

function buildStationTimeline(input: { threadDetail: ThreadDetail | null; outputs: OutputRecord[]; documents: DocumentRecord[] }): string[] {
  if (!input.threadDetail) return stationTimeline

  const items = [
    `Thread live: ${input.threadDetail.title} · ${input.threadDetail.messages.length} messages · ${input.threadDetail.outputs.length} outputs`,
    input.outputs[0] ? `Release mới nhất: ${input.outputs[0].title} · approve ${input.outputs[0].approvalStatus} · export ${input.outputs[0].exportStatus}` : 'Chưa có artifact backend mới trong thread này.',
    input.documents[0] ? `Evidence mới nhất: ${input.documents[0].title} · ${input.documents[0].status} · ${input.documents[0].chunks.length} chunks` : 'Chưa có evidence backend gắn vào thread này.',
    `Updated: ${new Date(input.threadDetail.updatedAt).toLocaleString()}`,
  ]

  return items
}

function buildStationQueue(input: { threadDetail: ThreadDetail | null; outputs: OutputRecord[]; documents: DocumentRecord[]; fallbackLead: StationQueueItem }): StationQueueItem[] {
  if (!input.threadDetail) return [input.fallbackLead, ...stationQueue.filter((item) => item.task !== input.fallbackLead.task).slice(0, 3)]

  const liveItems: StationQueueItem[] = []

  input.outputs.slice(0, 3).forEach((output) => {
    liveItems.push({
      task: output.title,
      owner: output.approvalStatus === 'APPROVED' ? 'Release rail' : output.kind,
      eta: output.exportStatus === 'EXPORTED' ? 'Done' : output.exportStatus === 'READY' ? 'Now' : 'Next',
      status: output.approvalStatus === 'CHANGES_REQUESTED' ? 'Cần sửa' : output.approvalStatus === 'APPROVED' ? (output.exportStatus === 'EXPORTED' ? 'Đã xuất' : 'Sẵn xuất') : 'Chờ duyệt',
    })
  })

  input.documents.filter((document) => document.status !== 'INGESTED').slice(0, 2).forEach((document) => {
    liveItems.push({
      task: `Ingest ${document.title}`,
      owner: 'Evidence rail',
      eta: 'Soon',
      status: 'Chờ ingest',
    })
  })

  if (liveItems.length === 0) {
    liveItems.push({
      task: `Theo dõi ${input.threadDetail.title}`,
      owner: 'Station sync',
      eta: 'Now',
      status: 'Đang theo dõi',
    })
  }

  return liveItems.slice(0, 4)
}

function AssistantTimelinePanel({ entries }: { entries: AssistantTimelineEntry[] }) {
  if (entries.length === 0) return null
  return <div className="activity-list">{entries.map((entry) => <article className={`activity-card ${entry.tone ?? 'default'}`} key={`${entry.label}-${entry.meta}`}><small>{entry.meta}</small><strong>{entry.label}</strong><p>{entry.detail}</p></article>)}</div>
}

function OutputHistoryRail({ events, emptyLabel }: { events: OutputEventRecord[]; emptyLabel: string }) {
  if (events.length === 0) {
    return <div className="output-history-rail empty"><p>{emptyLabel}</p></div>
  }

  return <div className="output-history-rail">{events.map((event) => <article className="output-history-card" key={event.id}><div className="thread-footer-row compact"><strong>{event.label}</strong><small>{new Date(event.createdAt).toLocaleString()}</small></div><p>{event.note ?? 'Không có ghi chú thêm cho bước này.'}</p><div className="mini-tags stack"><span>{event.eventType}</span><span>{event.actor?.fullName ?? 'System'}</span></div></article>)}</div>
}

type StationQueueSelection = StationSummary['queue'][number]

function StationLiveQueuePanel({ auth, fallbackQueueLead, fallbackTimeline, onOpenThread }: { auth: AuthState; fallbackQueueLead: StationQueueItem; fallbackTimeline: string[]; onOpenThread?: (threadTitle: string) => void }) {
  const token = auth?.token
  const [summary, setSummary] = useState<StationSummary | null>(null)
  const [activeThread, setActiveThread] = useState<ThreadDetail | null>(null)
  const [outputs, setOutputs] = useState<OutputRecord[]>([])
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [selectedQueueItem, setSelectedQueueItem] = useState<StationQueueSelection | null>(null)
  const [selectedOutputHistory, setSelectedOutputHistory] = useState<OutputEventRecord[]>([])
  const [error, setError] = useState<string | null>(null)

  async function hydrateThread(threadId: string, preferredQueueItem?: StationQueueSelection | null) {
    if (!token) return
    const [threadDetail, nextOutputs, nextDocuments] = await Promise.all([
      api.getThread(token, threadId),
      api.getOutputs(token, threadId),
      api.getDocuments(token, threadId),
    ])

    setActiveThread(threadDetail)
    setOutputs(nextOutputs)
    setDocuments(nextDocuments)

    const candidate = preferredQueueItem ?? selectedQueueItem
    if (candidate?.entityType === 'OUTPUT' && candidate.entityId) {
      const history = await api.getOutputHistory(token, candidate.entityId)
      setSelectedOutputHistory(history)
    } else {
      setSelectedOutputHistory([])
    }
  }

  async function loadStationState(preferredQueueItem?: StationQueueSelection | null) {
    if (!token) return
    try {
      setError(null)
      const nextSummary = await api.getStationSummary(token, 6)
      setSummary(nextSummary)

      const leadQueueItem = preferredQueueItem ?? nextSummary.queue[0] ?? null
      setSelectedQueueItem(leadQueueItem)

      const leadThreadId = leadQueueItem?.threadId ?? nextSummary.timeline[0]?.threadId
      if (!leadThreadId) {
        setActiveThread(null)
        setOutputs([])
        setDocuments([])
        setSelectedOutputHistory([])
        return
      }

      await hydrateThread(leadThreadId, leadQueueItem)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Station sync failed')
    }
  }

  async function handleSelectQueueItem(item: StationQueueSelection) {
    if (!token) return
    try {
      setError(null)
      setSelectedQueueItem(item)
      await hydrateThread(item.threadId, item)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Queue drill-down failed')
    }
  }

  useEffect(() => {
    void loadStationState()
  }, [token])

  const fallbackLiveTimeline = buildStationTimeline({ threadDetail: activeThread, outputs, documents })
  const timeline = token
    ? summary?.timeline?.length
      ? summary.timeline.map((item) => `${item.threadTitle} · ${item.detail} · ${item.counts.messages} msg · ${item.counts.documents} docs · ${item.counts.outputs} outputs`)
      : fallbackLiveTimeline
    : fallbackTimeline
  const queue = token && summary?.queue?.length ? summary.queue.slice(0, 6) : []
  const fallbackQueue = buildStationQueue({ threadDetail: activeThread, outputs, documents, fallbackLead: fallbackQueueLead })
  const selectedOutput = selectedQueueItem?.entityType === 'OUTPUT' ? outputs.find((item) => item.id === selectedQueueItem.entityId) ?? null : null
  const selectedDocument = selectedQueueItem?.entityType === 'DOCUMENT'
    ? documents.find((item) => item.id === selectedQueueItem.entityId || item.id === selectedQueueItem.documentId) ?? null
    : selectedOutput?.documentId
      ? documents.find((item) => item.id === selectedOutput.documentId) ?? null
      : null

  return <div className="station-live-block"><div className="station-shell-head"><strong>{token ? 'Live station sync' : 'Timeline'}</strong><span>{token ? 'Queue và timeline đang đọc từ backend summary nhiều thread. Bấm từng item để drill xuống đúng thread, output hoặc document.' : 'Cho cảm giác một trạm điều phối có queue và review rõ ràng.'}</span></div>{token && <><div className="thread-footer-row compact"><small>{activeThread ? `Lead thread · ${activeThread.title}` : 'Chưa có thread live'}</small><button className="secondary-btn slim" onClick={() => void loadStationState(selectedQueueItem)}>Refresh</button></div>{summary && <div className="workflow-snapshot-grid compact-station-summary"><article className="workflow-snapshot-card emphasis"><small className="sidebar-label">Threads</small><strong>{summary.counts.activeThreads}/{summary.counts.threads}</strong><p>Đang có {summary.counts.outputs} output và {summary.counts.documents} documents trong vùng summary.</p></article><article className="workflow-snapshot-card"><small className="sidebar-label">Approval</small><strong>{summary.counts.pendingApproval} chờ duyệt</strong><p>{summary.counts.changesRequested} cần sửa · {summary.counts.readyToExport} sẵn xuất.</p></article><article className="workflow-snapshot-card"><small className="sidebar-label">Evidence</small><strong>{summary.counts.ingestedDocuments} đã ingest</strong><p>{summary.counts.exported} output đã xuất qua release rail.</p></article></div>}</>}<div className="timeline-list">{timeline.map((item) => <div className="timeline-item" key={item}>{item}</div>)}</div><div className="section-subhead roomy"><small className="sidebar-label">Queue</small></div>{token && queue.length > 0 ? <div className="station-drilldown-grid"><div className="station-queue-column">{queue.map((item) => <button key={`${item.entityType}-${item.entityId}`} className={`queue-card queue-card-button ${selectedQueueItem?.entityId === item.entityId ? 'active' : ''}`} onClick={() => void handleSelectQueueItem(item)}><strong>{item.label}</strong><p>{item.owner} · {item.threadTitle} · ETA {item.eta}</p><span>{item.status}</span></button>)}</div><div className="station-detail-column"><div className="queue-drilldown-card"><small className="sidebar-label">Drill-down</small><strong>{selectedQueueItem?.label ?? 'Chọn một queue item'}</strong><p>{selectedQueueItem ? `${selectedQueueItem.threadTitle} · ${selectedQueueItem.note}` : 'Queue item được chọn sẽ mở ra đúng thread, output hoặc evidence liên quan.'}</p><div className="mini-tags stack">{selectedQueueItem && <><span>{selectedQueueItem.entityType}</span><span>{selectedQueueItem.status}</span><span>{selectedQueueItem.threadTitle}</span></>}</div><div className="thread-footer-row compact">{activeThread && <button className="secondary-btn slim" onClick={() => onOpenThread?.(activeThread.title)}>Mở thread này</button>}<small>{selectedOutput ? `Output ${selectedOutput.approvalStatus} / ${selectedOutput.exportStatus}` : selectedDocument ? `Document ${selectedDocument.status}` : 'Awaiting selection'}</small></div></div>{selectedOutput && <div className="queue-drilldown-card"><small className="sidebar-label">Output</small><strong>{selectedOutput.title}</strong><p>{selectedOutput.content}</p><div className="mini-tags stack"><span>{selectedOutput.kind}</span><span>{selectedOutput.approvalStatus}</span><span>{selectedOutput.exportStatus}</span>{selectedOutput.exportChannel && <span>{selectedOutput.exportChannel}</span>}</div></div>}{selectedDocument && <div className="queue-drilldown-card"><small className="sidebar-label">Evidence</small><strong>{selectedDocument.title}</strong><p>{selectedDocument.file.originalName} · {selectedDocument.sourceType} · {selectedDocument.chunks.length} chunks</p><div className="mini-tags stack"><span>{selectedDocument.status}</span><span>{selectedDocument.file.mimeType}</span><span>{selectedDocument.threadId ?? 'workspace'}</span></div></div>}{selectedQueueItem?.entityType === 'OUTPUT' && <div className="queue-drilldown-card"><small className="sidebar-label">Job log</small><OutputHistoryRail events={selectedOutputHistory} emptyLabel="Output này chưa có history sâu hơn." /></div>}</div></div> : <QueueList items={fallbackQueue} />} {error && <p className="error-note">{error}</p>}</div>
}

type ApiThreadPanelState = {
  threads: ThreadRecord[]
  activeThreadId: string | null
  threadDetail: ThreadDetail | null
  error: string | null
}

type ApiDocumentPanelState = {
  files: FileRecord[]
  documents: DocumentRecord[]
  activeDocumentId: string | null
  retrieve: DocumentRetrieveResponse | null
  error: string | null
}

type ApiOutputPanelState = {
  outputs: OutputRecord[]
  selectedOutputId: string | null
  history: OutputEventRecord[]
  error: string | null
}

type AssistantBriefState = {
  summary: string
  action: AssistantActionBrief
  linkedOutputId?: string | null
  linkedDocumentTitle?: string | null
}

type AssistantTimelineEntry = {
  label: string
  detail: string
  meta: string
  tone?: 'default' | 'good' | 'warning'
}

function BackendAuthPanel({ auth, setAuth }: { auth: AuthState; setAuth: (value: AuthState) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [fullName, setFullName] = useState('Tung Owner')
  const [workspaceName, setWorkspaceName] = useState('AI Station PCCC Vietnam')
  const [workspaceSlug, setWorkspaceSlug] = useState('ai-station-pccc-vietnam')
  const [email, setEmail] = useState('owner@pccc.vn')
  const [password, setPassword] = useState('12345678')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<AuthResponse | null>(auth)
  const [workspace, setWorkspace] = useState<WorkspaceSummary | null>(null)

  async function refreshWorkspace(token: string) {
    try {
      const result = await api.getWorkspace(token)
      setWorkspace(result)
    } catch {
      setWorkspace(null)
    }
  }

  async function handleSubmit() {
    try {
      setSubmitting(true)
      setError(null)
      const result = mode === 'login'
        ? await api.login(email, password)
        : await api.register({ email, password, fullName, workspaceName, workspaceSlug })
      setSession(result)
      setAuth(result)
      saveAuthState(result)
      await refreshWorkspace(result.token)
      window.dispatchEvent(new Event('ai-pccc-auth-changed'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auth failed')
    } finally {
      setSubmitting(false)
    }
  }

  function handleLogout() {
    setSession(null)
    setWorkspace(null)
    setAuth(null)
    clearAuthState()
    window.dispatchEvent(new Event('ai-pccc-auth-changed'))
  }

  useEffect(() => {
    setSession(auth)
    if (auth?.token) {
      void refreshWorkspace(auth.token)
    } else {
      setWorkspace(null)
    }
  }, [auth])

  return <div className="backend-auth-panel glass-panel"><div className="thread-footer-row compact"><strong>Backend session</strong><div className="mini-tags"><span>{mode}</span><span>{session ? 'connected' : 'local only'}</span></div></div><div className="double-grid"><button className={`secondary-btn ${mode === 'login' ? 'active-lite' : ''}`} onClick={() => setMode('login')}>Login</button><button className={`secondary-btn ${mode === 'register' ? 'active-lite' : ''}`} onClick={() => setMode('register')}>Register</button></div>{mode === 'register' && <><label>Họ tên<input value={fullName} onChange={(e) => setFullName(e.target.value)} /></label><label>Tên workspace<input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} /></label><label>Slug<input value={workspaceSlug} onChange={(e) => setWorkspaceSlug(e.target.value)} /></label></>}<label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Mật khẩu<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" /></label><button className="primary-btn full" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập thật' : 'Tạo workspace thật'}</button>{session && <button className="secondary-btn full" onClick={handleLogout}>Đăng xuất local</button>}{error && <p className="error-note">{error}</p>}{session && <div className="signup-box compact"><strong>{session.user.fullName}</strong><p>{session.workspace.name} · {session.role ?? 'OWNER'}</p><small>Token đã lưu local để nối tiếp sang chat/API.</small></div>}{workspace && <div className="signup-box compact"><strong>Workspace thật</strong><p>{workspace.name} · {workspace.members.length} thành viên</p><small>{workspace.members.map((member) => `${member.user.fullName} (${member.role})`).join(' · ')}</small></div>}</div>
}

function ApiThreadPanel({ auth, onUseThread, onStateChange }: { auth: AuthState; onUseThread?: (title: string) => void; onStateChange?: (value: ApiThreadPanelState) => void }) {
  const token = auth?.token
  const [threads, setThreads] = useState<ThreadRecord[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [threadDetail, setThreadDetail] = useState<ThreadDetail | null>(null)
  const [newTitle, setNewTitle] = useState('Thread test phase 2')
  const [newMessage, setNewMessage] = useState('Xin tóm tắt tài liệu này')
  const [createOutput, setCreateOutput] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadThreads(preferredThreadId?: string | null) {
    if (!token) return
    try {
      setError(null)
      const result = await api.getThreads(token)
      setThreads(result)
      const nextActiveThreadId = preferredThreadId ?? activeThreadId ?? result[0]?.id ?? null
      if (nextActiveThreadId) {
        setActiveThreadId(nextActiveThreadId)
      } else {
        setThreadDetail(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load threads failed')
    }
  }

  async function loadThread(threadId: string) {
    if (!token) return
    try {
      setError(null)
      const result = await api.getThread(token, threadId)
      setThreadDetail(result)
      setActiveThreadId(threadId)
      onUseThread?.(result.title)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load thread failed')
    }
  }

  async function createThread() {
    if (!token) return
    try {
      setError(null)
      const created = await api.createThread(token, newTitle)
      await loadThreads(created.id)
      await loadThread(created.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create thread failed')
    }
  }

  async function sendMessage() {
    if (!token || !activeThreadId) return
    try {
      setError(null)
      await api.createMessage(token, activeThreadId, {
        role: 'user',
        content: newMessage,
        ...(createOutput ? { createOutput: { kind: 'CHAT_DRAFT', title: `${newMessage.slice(0, 36)}${newMessage.length > 36 ? '…' : ''}` } } : {}),
      })
      setNewMessage('')
      await loadThread(activeThreadId)
      await loadThreads(activeThreadId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send message failed')
    }
  }

  useEffect(() => {
    void loadThreads()
  }, [token])

  useEffect(() => {
    if (activeThreadId) {
      void loadThread(activeThreadId)
    }
  }, [activeThreadId])

  useEffect(() => {
    onStateChange?.({
      threads,
      activeThreadId,
      threadDetail,
      error,
    })
  }, [threads, activeThreadId, threadDetail, error, onStateChange])

  if (!token) {
    return <div className="embedded-api-panel glass-panel"><strong>Workspace pulse</strong><p>Đăng nhập thật ở màn Auth trước để mở thread live.</p></div>
  }

  return <div className="embedded-api-panel glass-panel"><div className="embedded-api-head"><div><small className="sidebar-label">Workspace pulse</small><strong>Thread live đang là mạch làm việc chính</strong></div><button className="secondary-btn slim" onClick={() => void loadThreads(activeThreadId)}>Refresh</button></div><div className="embedded-api-grid"><label>Thread mới<input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} /></label><button className="primary-btn" onClick={() => void createThread()}>Tạo thread</button></div><div className="thread-list mini-api-list">{threads.map((thread) => <button key={thread.id} className={`thread-card ${activeThreadId === thread.id ? 'active' : ''}`} onClick={() => void loadThread(thread.id)}><strong>{thread.title}</strong><small>{thread.status} · {thread._count?.messages ?? 0} msg · {thread._count?.documents ?? 0} docs · {thread._count?.outputs ?? 0} outputs</small></button>)}</div>{threadDetail && <div className="api-thread-detail"><div className="thread-footer-row compact"><strong>{threadDetail.title}</strong><small>{threadDetail.messages.length} messages · {threadDetail.documents.length} docs · {threadDetail.outputs.length} outputs</small></div><div className="mini-tags stack"><span>{threadDetail.files.length} files</span><span>{threadDetail.documents.length} evidence</span><span>{threadDetail.outputs.length} artifacts</span></div><div className="message-list slim">{threadDetail.messages.slice(-4).map((message) => <article className={`message-row ${message.role}`} key={message.id}><div className="message-avatar">{message.role === 'assistant' ? 'AI' : 'AN'}</div><div className="message-bubble"><small>{new Date(message.createdAt).toLocaleString()}</small><p>{message.content}</p></div></article>)}</div><div className="embedded-api-grid"><label>Thêm ghi chú<input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} /></label><button className="primary-btn" onClick={() => void sendMessage()} disabled={!newMessage.trim()}>Gửi</button></div><label className="checkbox-row"><input type="checkbox" checked={createOutput} onChange={(e) => setCreateOutput(e.target.checked)} /> Giữ lại một artifact cùng message này</label>{threadDetail.outputs.length > 0 && <div className="retrieval-result-list">{threadDetail.outputs.slice(0, 3).map((output) => <article className="retrieval-card" key={output.id}><strong>{output.title}</strong><p>{output.content}</p><small>{output.kind} · {output.status}</small></article>)}</div>}</div>}{error && <p className="error-note">{error}</p>}</div>
}

function ApiDocumentPanel({ auth, activeThreadId, onStateChange }: { auth: AuthState; activeThreadId?: string | null; onStateChange?: (value: ApiDocumentPanelState) => void }) {
  const token = auth?.token
  const [files, setFiles] = useState<FileRecord[]>([])
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [retrieve, setRetrieve] = useState<DocumentRetrieveResponse | null>(null)
  const [fileName, setFileName] = useState('hsmt-he-thong-pccc.txt')
  const [fileMime, setFileMime] = useState('text/plain')
  const [documentTitle, setDocumentTitle] = useState('HSMT hệ thống PCCC · bản nhập thử')
  const [ingestContent, setIngestContent] = useState('Tiêu chuẩn áp dụng cho hệ thống báo cháy tự động. Yêu cầu đầu báo, trung tâm báo cháy và bản vẽ triển khai phải đồng bộ theo hồ sơ mời thầu. Cần trích rõ căn cứ, đánh dấu khu vực dễ thiếu và giữ liên kết về file gốc để kỹ thuật rà soát.')
  const [query, setQuery] = useState('tiêu chuẩn')
  const [selectedUpload, setSelectedUpload] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadDocumentState(preferredDocumentId?: string | null, preferredThreadId = activeThreadId) {
    if (!token) return
    try {
      setError(null)
      const [nextFiles, nextDocuments] = await Promise.all([
        api.getFiles(token, preferredThreadId),
        api.getDocuments(token, preferredThreadId),
      ])
      setFiles(nextFiles)
      setDocuments(nextDocuments)
      const candidateId = preferredDocumentId ?? activeDocumentId ?? nextDocuments[0]?.id ?? null
      if (candidateId) {
        setActiveDocumentId(candidateId)
      } else {
        setActiveDocumentId(null)
        setRetrieve(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load documents failed')
    }
  }

  async function createFileAndDocument() {
    if (!token || !activeThreadId) return
    try {
      setError(null)
      const createdFile = await api.createFile(token, {
        originalName: fileName,
        mimeType: fileMime,
        storagePath: `/threads/${activeThreadId}/${fileName}`,
        sizeBytes: Math.max(ingestContent.length * 2, 512),
        threadId: activeThreadId,
      })
      const createdDocument = await api.createDocument(token, {
        fileId: createdFile.id,
        threadId: activeThreadId,
        title: documentTitle,
        sourceType: 'THREAD_FILE',
      })
      await loadDocumentState(createdDocument.id, activeThreadId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create document failed')
    }
  }

  async function uploadSelectedFile() {
    if (!token || !activeThreadId || !selectedUpload) return
    try {
      setError(null)
      const upload = selectedUpload
      const contentBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = typeof reader.result === 'string' ? reader.result : ''
          resolve(result.includes(',') ? result.split(',')[1] ?? '' : result)
        }
        reader.onerror = () => reject(reader.error ?? new Error('File read failed'))
        reader.readAsDataURL(upload)
      })
      const createdFile = await api.uploadFile(token, {
        originalName: upload.name,
        mimeType: upload.type || 'application/octet-stream',
        contentBase64,
        threadId: activeThreadId,
      })
      const createdDocument = await api.createDocument(token, {
        fileId: createdFile.id,
        threadId: activeThreadId,
        title: upload.name,
        sourceType: 'THREAD_UPLOAD',
      })
      setSelectedUpload(null)
      setFileName(upload.name)
      setFileMime(upload.type || 'application/octet-stream')
      setDocumentTitle(upload.name)
      await loadDocumentState(createdDocument.id, activeThreadId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  async function ingestActiveDocument() {
    if (!token || !activeDocumentId) return
    try {
      setError(null)
      await api.ingestDocument(token, activeDocumentId, {
        content: ingestContent,
        chunkSize: 180,
      })
      await loadDocumentState(activeDocumentId, activeThreadId)
      await retrieveActiveDocument(activeDocumentId, query)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ingest failed')
    }
  }

  async function retrieveActiveDocument(documentId = activeDocumentId, nextQuery = query) {
    if (!token || !documentId) return
    try {
      setError(null)
      const result = await api.retrieveDocument(token, documentId, nextQuery)
      setRetrieve(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Retrieve failed')
    }
  }

  useEffect(() => {
    void loadDocumentState(undefined, activeThreadId)
  }, [token, activeThreadId])

  useEffect(() => {
    if (activeDocumentId) {
      void retrieveActiveDocument(activeDocumentId, query)
    }
  }, [activeDocumentId])

  useEffect(() => {
    onStateChange?.({ files, documents, activeDocumentId, retrieve, error })
  }, [files, documents, activeDocumentId, retrieve, error, onStateChange])

  if (!token) {
    return <div className="embedded-api-panel glass-panel"><strong>Evidence</strong><p>Đăng nhập thật để dùng file, document và retrieve từ backend.</p></div>
  }

  if (!activeThreadId) {
    return <div className="embedded-api-panel glass-panel"><strong>Evidence</strong><p>Tạo hoặc chọn một thread live trước để gắn file và document đúng luồng.</p></div>
  }

  const activeDocument = documents.find((item) => item.id === activeDocumentId) ?? null

  return <div className="embedded-api-panel glass-panel"><div className="embedded-api-head"><div><small className="sidebar-label">Evidence</small><strong>Hồ sơ đang neo trực tiếp vào thread live</strong></div><button className="secondary-btn slim" onClick={() => void loadDocumentState(activeDocumentId, activeThreadId)}>Refresh</button></div><div className="mini-tags stack"><span>Thread-bound</span><span>{documents.length} documents</span><span>{files.length} files</span></div><div className="triple-grid"><label>Tên file<input value={fileName} onChange={(e) => setFileName(e.target.value)} /></label><label>MIME type<input value={fileMime} onChange={(e) => setFileMime(e.target.value)} /></label><label>Tiêu đề document<input value={documentTitle} onChange={(e) => setDocumentTitle(e.target.value)} /></label></div><div className="embedded-api-grid"><button className="primary-btn" onClick={() => void createFileAndDocument()}>Tạo metadata + document</button><button className="secondary-btn" onClick={() => void ingestActiveDocument()} disabled={!activeDocumentId}>Ingest document</button></div><div className="embedded-api-grid"><label>Tải file thật<input type="file" onChange={(e) => setSelectedUpload(e.target.files?.[0] ?? null)} /></label><button className="secondary-btn" onClick={() => void uploadSelectedFile()} disabled={!selectedUpload}>Upload vào storage</button></div>{documents.length > 0 && <div className="thread-list mini-api-list">{documents.map((document) => <button key={document.id} className={`thread-card ${activeDocumentId === document.id ? 'active' : ''}`} onClick={() => setActiveDocumentId(document.id)}><strong>{document.title}</strong><small>{document.status} · {document.file.originalName} · {document.chunks.length} chunks</small></button>)}</div>}<label>Đoạn ingest<input value={ingestContent} onChange={(e) => setIngestContent(e.target.value)} /></label><div className="embedded-api-grid"><label>Query retrieve<input value={query} onChange={(e) => setQuery(e.target.value)} /></label><button className="secondary-btn" onClick={() => void retrieveActiveDocument()} disabled={!activeDocumentId}>Retrieve</button></div>{activeDocument && <div className="api-thread-detail"><div className="thread-footer-row compact"><strong>{activeDocument.title}</strong><small>{activeDocument.status} · {activeDocument.chunks.length} chunks</small></div><div className="mini-tags stack"><span>{activeDocument.file.originalName}</span><span>{activeDocument.sourceType}</span><span>{activeDocument.file.mimeType}</span><span>{activeDocument.threadId ?? 'workspace'}</span></div>{retrieve?.results?.length ? <div className="retrieval-result-list">{retrieve.results.map((item) => <article className="retrieval-card" key={item.id}><strong>Chunk {item.chunkIndex + 1}</strong><p>{item.content}</p><small>{item.citation.fileName} · {item.citation.sourceType} · {item.citation.threadId ?? 'workspace'}</small></article>)}</div> : <p className="empty-note">Chưa có kết quả retrieve. Hãy ingest rồi chạy query.</p>}</div>}{error && <p className="error-note">{error}</p>}</div>
}
function ApiOutputPanel({ auth, activeThreadId, activeDocumentId, workspaceMembers = [], onStateChange }: { auth: AuthState; activeThreadId?: string | null; activeDocumentId?: string | null; workspaceMembers?: WorkspaceMemberOption[]; onStateChange?: (value: ApiOutputPanelState) => void }) {
  const token = auth?.token
  const [outputs, setOutputs] = useState<OutputRecord[]>([])
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null)
  const [history, setHistory] = useState<OutputEventRecord[]>([])
  const [title, setTitle] = useState('Draft email phản hồi HSMT')
  const [content, setContent] = useState('Đây là bản draft trả lời khách dựa trên document đang mở trong thread.')
  const [channel, setChannel] = useState('Zalo')
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [reviewerId, setReviewerId] = useState<string>('')
  const [automationMode, setAutomationMode] = useState<ExecuteOutputAutomationMode>('NEXT_STEP')
  const [automationNote, setAutomationNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadOutputHistory(outputId: string) {
    if (!token) return
    const result = await api.getOutputHistory(token, outputId)
    setHistory(result)
  }

  async function loadOutputs(preferredThreadId = activeThreadId, preferredOutputId?: string | null) {
    if (!token || !preferredThreadId) return
    try {
      setError(null)
      const result = await api.getOutputs(token, preferredThreadId)
      setOutputs(result)
      const nextSelectedId = preferredOutputId ?? selectedOutputId ?? result[0]?.id ?? null
      setSelectedOutputId(nextSelectedId)
      if (nextSelectedId) {
        await loadOutputHistory(nextSelectedId)
      } else {
        setHistory([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load outputs failed')
    }
  }

  async function createOutput() {
    if (!token || !activeThreadId) return
    try {
      setError(null)
      const created = await api.createOutput(token, {
        threadId: activeThreadId,
        documentId: activeDocumentId ?? undefined,
        kind: activeDocumentId ? 'DOCUMENT_DRAFT' : 'CHAT_DRAFT',
        title,
        content,
        status: 'DRAFT',
        approvalStatus: 'PENDING',
        exportStatus: 'NOT_READY',
        exportChannel: channel,
        exportNote: activeDocumentId ? 'Được tạo từ composer khi đang có document thật.' : 'Được tạo trực tiếp từ khối output workflow.',
      })
      setContent('')
      await loadOutputs(activeThreadId, created.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create output failed')
    }
  }

  async function patchOutput(outputId: string, payload: { title?: string; content?: string; assignedToId?: string | null; reviewedById?: string | null; approvalStatus?: 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED'; exportStatus?: 'NOT_READY' | 'READY' | 'EXPORTED'; exportChannel?: string; exportNote?: string }) {
    if (!token || !activeThreadId) return
    try {
      setError(null)
      setAutomationNote(null)
      await api.updateOutput(token, outputId, {
        ...payload,
        exportChannel: payload.exportChannel ?? channel,
      })
      await loadOutputs(activeThreadId, outputId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update output failed')
    }
  }

  async function executeSelectedOutput(outputId: string) {
    if (!token || !activeThreadId) return
    try {
      setError(null)
      const result = await api.executeOutputAutomation(token, outputId, automationMode)
      setAutomationNote(`${result.nextAction} · ${result.summary}`)
      await loadOutputs(activeThreadId, outputId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Automation executor failed')
    }
  }

  async function deleteSelectedOutput(outputId: string) {
    if (!token || !activeThreadId) return
    try {
      setError(null)
      setAutomationNote(null)
      await api.deleteOutput(token, outputId)
      const remaining = outputs.filter((item) => item.id !== outputId)
      const nextSelectedId = remaining[0]?.id ?? null
      setSelectedOutputId(nextSelectedId)
      if (nextSelectedId) {
        await loadOutputs(activeThreadId, nextSelectedId)
      } else {
        setOutputs([])
        setHistory([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete output failed')
    }
  }

  async function handleSelectOutput(outputId: string) {
    try {
      setError(null)
      setAutomationNote(null)
      setSelectedOutputId(outputId)
      await loadOutputHistory(outputId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load output history failed')
    }
  }

  useEffect(() => {
    void loadOutputs(activeThreadId)
  }, [token, activeThreadId])

  useEffect(() => {
    const selectedOutput = outputs.find((item) => item.id === selectedOutputId) ?? outputs[0] ?? null
    if (!selectedOutput) return
    setTitle(selectedOutput.title)
    setContent(selectedOutput.content)
    setChannel(selectedOutput.exportChannel ?? 'Internal rail')
    setAssigneeId(selectedOutput.assignedToId ?? '')
    setReviewerId(selectedOutput.reviewedById ?? '')
  }, [outputs, selectedOutputId])

  useEffect(() => {
    onStateChange?.({ outputs, selectedOutputId, history, error })
  }, [outputs, selectedOutputId, history, error, onStateChange])

  if (!token) {
    return <div className="embedded-api-panel glass-panel"><strong>Release rail</strong><p>Đăng nhập thật để approval, export và history dùng backend state.</p></div>
  }

  if (!activeThreadId) {
    return <div className="embedded-api-panel glass-panel"><strong>Release rail</strong><p>Chọn thread live trước để tạo artifact backend.</p></div>
  }

  const selectedOutput = outputs.find((item) => item.id === selectedOutputId) ?? outputs[0] ?? null
  const selectedAssignee = workspaceMembers.find((member) => member.user.id === assigneeId) ?? null
  const selectedReviewer = workspaceMembers.find((member) => member.user.id === reviewerId) ?? null
  const channelNeedsAssignee = ['zalo', 'email', 'sms', 'whatsapp'].includes(channel.trim().toLowerCase())
  const outputNeedsReviewer = selectedOutput ? (selectedOutput.kind === 'HANDOFF_NOTE' || selectedOutput.kind === 'DOCUMENT_EXTRACT' || channelNeedsAssignee) : false

  return <div className="embedded-api-panel glass-panel"><div className="embedded-api-head"><div><small className="sidebar-label">Release rail</small><strong>Artifact, duyệt, xuất và history đang đi cùng một tuyến</strong></div><button className="secondary-btn slim" onClick={() => void loadOutputs(activeThreadId, selectedOutputId)}>Refresh</button></div><div className="triple-grid"><label>Tiêu đề output<input value={title} onChange={(e) => setTitle(e.target.value)} /></label><label>Kênh xuất<input value={channel} onChange={(e) => setChannel(e.target.value)} /></label><label>Document link<input value={activeDocumentId ?? 'Chưa gắn document'} readOnly /></label></div><label>Nội dung output<input value={content} onChange={(e) => setContent(e.target.value)} /></label><div className="embedded-api-grid"><button className="primary-btn" onClick={() => void createOutput()} disabled={!title.trim() || !content.trim()}>Tạo output backend</button><span className="empty-note">{outputs.length} output trong thread này</span></div>{outputs.length > 0 && <div className="station-drilldown-grid"><div className="station-queue-column">{outputs.slice(0, 6).map((output) => <button className={`queue-card queue-card-button ${selectedOutput?.id === output.id ? 'active' : ''}`} key={output.id} onClick={() => void handleSelectOutput(output.id)}><strong>{output.title}</strong><p>{output.kind} · {output.approvalStatus} · {output.exportStatus}</p><span>{output.exportChannel ?? 'Internal rail'}</span></button>)}</div><div className="station-detail-column">{selectedOutput && <div className="queue-drilldown-card"><small className="sidebar-label">Output detail</small><strong>{selectedOutput.title}</strong><p>{selectedOutput.content}</p><div className="mini-tags stack"><span>{selectedOutput.kind}</span><span>{selectedOutput.approvalStatus}</span><span>{selectedOutput.exportStatus}</span>{selectedOutput.exportChannel && <span>{selectedOutput.exportChannel}</span>}</div><div className="mini-tags stack"><span>{selectedOutput.assignedAt ? 'Assigned' : 'Unassigned'}</span><span>{selectedOutput.reviewedAt ? 'Reviewed' : 'Not reviewed'}</span><span>{selectedOutput.releasedAt ? 'Released' : 'Not released'}</span>{selectedAssignee && <span>Owner · {selectedAssignee.user.fullName}</span>}{selectedReviewer && <span>Reviewer · {selectedReviewer.user.fullName}</span>}</div><div className="embedded-api-grid"><label>Người phụ trách<select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}><option value="">Chưa giao</option>{workspaceMembers.map((member) => <option key={member.user.id} value={member.user.id}>{member.user.fullName} · {member.role}</option>)}</select></label><button className="secondary-btn slim" onClick={() => void patchOutput(selectedOutput.id, { assignedToId: assigneeId || null })}>Lưu người phụ trách</button></div><div className="embedded-api-grid"><label>Reviewer<select value={reviewerId} onChange={(e) => setReviewerId(e.target.value)}><option value="">Chưa gán reviewer</option>{workspaceMembers.map((member) => <option key={member.user.id} value={member.user.id}>{member.user.fullName} · {member.role}</option>)}</select></label><button className="secondary-btn slim" onClick={() => void patchOutput(selectedOutput.id, { reviewedById: reviewerId || null })}>Lưu reviewer</button></div><div className="embedded-api-grid"><label>Automation mode<select value={automationMode} onChange={(e) => setAutomationMode(e.target.value as ExecuteOutputAutomationMode)}><option value="NEXT_STEP">Next step</option><option value="FORCE_REVIEW">Force review</option><option value="FORCE_EXPORT">Force export</option><option value="RESET_FLOW">Reset flow</option></select></label><span className="empty-note">Policy rail: export chỉ đi tiếp khi output đã được duyệt; kênh ngoài như Zalo/Email còn cần người phụ trách rõ ràng và một số output bắt buộc có reviewer.</span></div>{channelNeedsAssignee && !assigneeId && <p className="error-note">Kênh xuất ngoài đang yêu cầu gán người phụ trách trước khi chuyển sang READY hoặc EXPORTED.</p>}{outputNeedsReviewer && !reviewerId && <p className="error-note">Output này đang yêu cầu reviewer rõ ràng trước khi duyệt hoặc xuất.</p>}{automationNote && <p className="empty-note">{automationNote}</p>}<div className="thread-footer-row compact"><button className="secondary-btn slim" onClick={() => void executeSelectedOutput(selectedOutput.id)}>Chạy automation</button><button className="secondary-btn slim" onClick={() => void patchOutput(selectedOutput.id, { title, content, assignedToId: assigneeId || null, reviewedById: reviewerId || null, exportChannel: channel, exportNote: `Edited in release rail · ${channel}` })} disabled={!title.trim() || !content.trim()}>Lưu</button><button className="secondary-btn slim" onClick={() => void patchOutput(selectedOutput.id, { reviewedById: reviewerId || null, approvalStatus: 'APPROVED', exportStatus: selectedOutput.exportStatus === 'EXPORTED' ? 'EXPORTED' : 'READY' })}>Duyệt</button><button className="secondary-btn slim" onClick={() => void patchOutput(selectedOutput.id, { reviewedById: reviewerId || null, approvalStatus: 'CHANGES_REQUESTED', exportStatus: 'NOT_READY' })}>Yêu cầu sửa</button><button className="secondary-btn slim" onClick={() => void patchOutput(selectedOutput.id, { reviewedById: reviewerId || null, exportStatus: 'EXPORTED' })} disabled={selectedOutput.approvalStatus !== 'APPROVED'}>Đánh dấu đã xuất</button><button className="secondary-btn slim danger" onClick={() => void deleteSelectedOutput(selectedOutput.id)}>Xóa</button></div></div>}<div className="queue-drilldown-card"><small className="sidebar-label">Job log</small><OutputHistoryRail events={history} emptyLabel="Output này chưa có history sâu hơn." /></div></div></div>}{error && <p className="error-note">{error}</p>}</div>
}

function AuthPreview({ stage }: { stage: AuthStage }) {
  if (stage.key === 'signup') return <div className="auth-form-shell"><div className="auth-brand"><div className="brand-mark">AI</div><div><strong>Tạo workspace mới</strong><small>Tạo workspace cho team PCCC</small></div></div><label>Tên workspace<input value="AI Station PCCC Vietnam" readOnly /></label><div className="double-grid"><label>Quy mô<input value="6–15 thành viên" readOnly /></label><label>Use case<input value="HSMT + Sale + Knowledge" readOnly /></label></div><div className="double-grid"><label>Billing<input value="admin@pccc.vn" readOnly /></label><label>Desk đầu tiên<input value="Bid Desk" readOnly /></label></div><div className="approval-banner"><strong>Setup ngay sau signup</strong><p>Hệ thống gợi bật domain allowlist, mời team lead và chốt billing owner.</p></div><button className="primary-btn full">Tạo workspace</button><p className="form-note">Sau bước này hệ thống sẽ gợi ý mời các desk chính.</p></div>
  if (stage.key === 'google') return <div className="auth-form-shell"><div className="auth-brand"><div className="brand-mark">G</div><div><strong>Tiếp tục với Google</strong><small>Vào nhanh cho owner và thành viên được mời</small></div></div><div className="highlight-panel"><strong>Domain</strong><p>pccc.vn · Cho phép vào workspace “AI Station PCCC Vietnam” với vai trò Owner.</p></div><div className="double-grid auth-mini-grid"><div className="mini-check-card"><strong>Domain policy</strong><p>Chỉ email công ty và lời mời hợp lệ mới được vào.</p></div><div className="mini-check-card"><strong>Vào xong</strong><p>Mở thẳng AI Station với thread, desk và queue gần nhất.</p></div></div><button className="social-btn">Chọn tài khoản Google</button></div>
  if (stage.key === 'reset') return <div className="auth-form-shell"><div className="auth-brand"><div className="brand-mark">↺</div><div><strong>Khôi phục truy cập</strong><small>Vào lại nhanh khi cần gấp</small></div></div><label>Email công việc<input value="admin@pccc.vn" readOnly /></label><div className="double-grid auth-mini-grid"><div className="mini-check-card"><strong>Hết hạn</strong><p>15 phút · dùng một lần · xác nhận nếu vào từ máy lạ.</p></div><div className="mini-check-card"><strong>Khôi phục</strong><p>Có thể dùng mã dự phòng hoặc email recovery nếu mất điện thoại.</p></div></div><button className="primary-btn full">Gửi link đặt lại mật khẩu</button><div className="signup-box compact"><strong>Sau khi gửi</strong><p>Link có hiệu lực 15 phút. Nếu email đúng, anh sẽ nhận hướng dẫn ngay.</p></div></div>
  if (stage.key === 'invite') return <div className="auth-form-shell"><div className="auth-brand"><div className="brand-mark">IN</div><div><strong>Tham gia team</strong><small>Nhận lời mời vào workspace</small></div></div><div className="invite-card"><small>Lời mời</small><strong>AI Station PCCC Vietnam</strong><p>Người mời: admin@pccc.vn · Vai trò: Sales Lead · Scope: Sales Desk · Hết hạn sau 23 giờ</p></div><div className="double-grid auth-mini-grid"><div className="mini-check-card"><strong>Phạm vi</strong><p>Chỉ thấy thread, tài liệu và output của Sales Desk và project được chia sẻ.</p></div><div className="mini-check-card"><strong>Màn đầu</strong><p>Mở dashboard cá nhân với queue và việc cần follow-up.</p></div></div><div className="approval-banner warning"><strong>Nâng quyền cần duyệt</strong><p>Nếu lời mời đổi sang Admin hoặc mở rộng quyền, hệ thống sẽ giữ ở trạng thái chờ duyệt.</p></div><div className="double-grid"><button className="secondary-btn">Xem quyền</button><button className="primary-btn">Vào workspace</button></div></div>
  return <div className="auth-form-shell"><div className="auth-brand"><div className="brand-mark">AI</div><div><strong>ai.pccc.vn</strong><small>Đăng nhập vào workspace PCCC</small></div></div><button className="social-btn">Tiếp tục với Google</button><div className="divider"><span>hoặc email công việc</span></div><label>Email<input value="admin@pccc.vn" readOnly /></label><label>Mật khẩu<input value="••••••••••••" readOnly /></label><div className="double-grid auth-mini-grid"><div className="mini-check-card"><strong>MFA</strong><p>OTP qua app xác thực khi đăng nhập từ thiết bị lạ hoặc khi thay đổi quyền admin.</p></div><div className="mini-check-card"><strong>Workspace</strong><p>AI Station PCCC Vietnam · Owner landing · đồng bộ thread và queue gần nhất.</p></div></div><div className="auth-row"><label className="checkbox-row"><input type="checkbox" checked readOnly /> Giữ đăng nhập</label><button className="text-link">Quên mật khẩu?</button></div><button className="primary-btn full">Đăng nhập</button><div className="signup-box"><strong>Chưa có workspace</strong><p>Tạo workspace cho sale, kỹ thuật, hồ sơ và thư viện nội bộ.</p><button className="secondary-btn full">Tạo workspace mới</button></div></div>
}

export function HomeScreen({ heroStats, setScreen, activeMode, setActiveMode, activeContext, activeStage, setActiveStage }: { heroStats: Stat[]; setScreen: (screen: Screen) => void; activeMode: WorkspaceModeKey; setActiveMode: (value: WorkspaceModeKey) => void; activeContext: ThreadContextPack; activeStage: FlowStageKey; setActiveStage: (value: FlowStageKey) => void }) {
  const mode = workspaceModes.find((item) => item.key === activeMode) ?? workspaceModes[0]
  return <><RoleModeSwitch activeMode={activeMode} setActiveMode={setActiveMode} /><StageNavigator items={activeContext.stageFlow} activeStage={activeStage} setActiveStage={setActiveStage} /><DecisionPulse activeContext={activeContext} activeMode={activeMode} activeStage={activeStage} /><section className="section-block"><div className="section-head"><span className="eyebrow">PILOT</span><h2>Bản này đã đủ để xem như một pilot nội bộ</h2><p>Use case, workflow và độ tin cậy giờ đã đi cùng nhau trong một mạch rõ ràng.</p></div><PilotTrackGrid /></section><section className="hero-panel"><div className="hero-copy"><div className="eyebrow">AI PCCC · CHAT-FIRST</div><h1>Prototype này đã gần hơn với một SaaS thật: chat rõ việc, auth rõ quyền, AI Station rõ điều phối.</h1><p>Mục tiêu là để người duyệt nhìn vào thấy ngay: đây có thể thành một nền làm việc thật cho ngành PCCC.</p><div className="hero-actions"><button className="primary-btn" onClick={() => setScreen('chat')}>Xem chat</button><button className="secondary-btn" onClick={() => setScreen('auth')}>Xem auth</button><button className="secondary-btn" onClick={() => setScreen('station')}>Xem AI Station</button></div><StatGrid stats={heroStats} /></div><div className="hero-preview glass-panel"><div className="window-bar"><span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span><span className="window-title">ai.pccc.vn / role-aware pilot</span></div><div className="hero-preview-stack"><div className="preview-tile highlight"><small>Role-aware landing</small><strong>{mode.landing} · mỗi vai trò thấy workspace entry khác nhau thay vì cùng một dashboard</strong></div><div className="preview-tile"><small>Approval rail</small><strong>Mỗi thread có approval chain rõ: AI draft → desk sign-off → owner release</strong></div><div className="preview-tile"><small>Export realism</small><strong>Output có trạng thái Draft / Needs approval / Approved / Ready to share theo từng kênh</strong></div><div className="preview-tile"><small>PCCC specialization</small><strong>Tất cả flow vẫn neo chắc vào sale, HSMT, kỹ thuật, SOP và thư viện nội bộ</strong></div></div></div></section><section className="section-block"><div className="section-head"><span className="eyebrow">ROLE ENTRY</span><h2>Mỗi vai trò vào app sẽ thấy đúng điểm bắt đầu của mình</h2><p>Nhờ vậy bản này bớt giống concept tĩnh và giống sản phẩm thật hơn.</p></div><LandingStatePanel mode={mode} activeContext={activeContext} /></section><section className="section-block"><div className="section-head"><span className="eyebrow">LIVE FLOW</span><h2>Bản này đã có nhịp chạy việc thật</h2><p>Người duyệt có thể đổi stage để thấy việc đang ở đâu, ai chốt và bước nào đang chờ.</p></div><LiveFlowPanel activeContext={activeContext} activeStage={activeStage} /></section><section className="section-block"><div className="section-head"><span className="eyebrow">ĐIỂM MỚI</span><h2>Một lát cắt sâu hơn, thật hơn và dễ tin hơn</h2><p>Trọng tâm là làm chắc những chỗ sẽ bị soi đầu tiên khi nghĩ tới sản phẩm thật.</p></div><FeatureGrid items={productFeatures} /></section><section className="section-block story-layout"><div className="story-card glass-panel"><span className="eyebrow">CHAT</span><h2>Không còn giống một khung hỏi đáp tĩnh; giờ đã có dấu hiệu thread đang được vận hành bởi team.</h2><p>Owner, priority, handoff checklist, activity rail, unread, files, output queue và pulse panel làm phần chat bớt “demo screen” và gần hơn với công cụ làm việc thật.</p></div><div className="story-card glass-panel"><span className="eyebrow">OUTPUT</span><h2>Approval rail + export states cho thấy sản phẩm hiểu “được tạo ra” khác với “được phép gửi đi”.</h2><p>Đây là điểm rất quan trọng nếu muốn đưa bản này vào pilot nội bộ mà không tạo cảm giác AI được thả tự do.</p></div></section><section className="section-block"><div className="section-head"><span className="eyebrow">VAI TRÒ</span><h2>Giá trị theo vai trò vẫn rõ, nhưng đã gắn với ownership và desk logic thực tế hơn</h2></div><PersonaGrid items={personas} /></section><section className="section-block"><div className="section-head"><span className="eyebrow">USE CASE</span><h2>Những việc nên dùng để pilot nội bộ đầu tiên</h2><p>Bản này mạnh nhất ở workflow có deadline, handoff và output rõ.</p></div><UseCaseFitGrid /></section></>
}

export function AuthScreen({ activeContext, activeAuth, setActiveAuth, activeMode, auth, setAuth }: { activeContext: ThreadContextPack; activeAuth: string; setActiveAuth: (value: string) => void; activeMode: WorkspaceModeKey; auth: AuthState; setAuth: (value: AuthState) => void }) {
  const activeStage = useMemo(() => authStages.find((item) => item.key === activeAuth) ?? authStages[0], [activeAuth])
  const mode = workspaceModes.find((item) => item.key === activeMode) ?? workspaceModes[0]
  return <section className="auth-layout deep-auth"><div className="auth-copy"><div className="section-head left"><span className="eyebrow">AUTH</span><h2>Auth không chỉ để đăng nhập, mà để vào đúng workspace</h2><p>Màn này gom các trạng thái chính: vào lại, tạo mới, Google, khôi phục và lời mời.</p></div><div className="context-bridge glass-panel"><small className="sidebar-label">Auth bridge</small><strong>{auth?.workspace.name ?? activeContext.workspaceName}</strong><p>{auth ? `Đang giữ phiên local cho ${auth.user.email} · role ${auth.role ?? 'OWNER'} · workspace slug ${auth.workspace.slug}.` : activeContext.authWorkspaceHint}</p><div className="mini-tags stack"><span>{activeContext.projectLabel}</span><span>{activeContext.deskLabel}</span><span>{mode.landing}</span><span>{auth ? 'Backend session live' : activeContext.stationFocus.reviewLabel}</span></div></div><AuthTabs items={authStages} active={activeAuth} setActive={setActiveAuth} /><div className="stage-summary glass-panel"><div><div className="mini-tags"><span>{activeStage.badge}</span>{auth && <span>{auth.workspace.slug}</span>}</div><strong>{activeStage.title}</strong><p>{activeStage.description}</p></div><small>{auth ? `Signed in as ${auth.user.fullName}` : activeStage.helper}</small></div><BackendAuthPanel auth={auth} setAuth={setAuth} /><FlowGrid items={authFlowSteps} /><TrustList items={authTrustItems} /><div className="context-bridge compact glass-panel"><small className="sidebar-label">Landing after auth</small><p>{mode.label} sẽ mở vào <strong>{activeContext.roleLandingLabel}</strong> thay vì một màn chung, để người dùng thấy đúng việc và đúng quyền ngay.</p>{auth && <div className="mini-tags stack"><span>{auth.workspace.name}</span><span>{auth.user.email}</span><span>{auth.role ?? 'OWNER'}</span></div>}</div><div className="section-subhead"><small className="sidebar-label">Phiên đăng nhập</small></div><SessionList items={authSessions} /><FeatureGrid items={authBenefits} /></div><div className="auth-panel glass-panel"><div className="window-bar"><span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span><span className="window-title">Secure login · {activeStage.title}</span></div><AuthPreview stage={activeStage} /></div></section>
}

export function ChatScreen({ activeThread, setActiveThread, activeContext, setActiveAuth, activeMode, activeStage, setActiveStage, auth }: { activeThread: string; setActiveThread: (value: string) => void; activeContext: ThreadContextPack; setActiveAuth: (value: string) => void; activeMode: WorkspaceModeKey; activeStage: FlowStageKey; setActiveStage: (value: FlowStageKey) => void; auth: AuthState }) {
  const [composerMode, setComposerMode] = useState<'Ask' | 'Draft' | 'Extract' | 'Assign'>('Draft')
  const [composerText, setComposerText] = useState('Soạn draft phản hồi khách cho bộ HSMT này và giữ liên kết với document đang mở.')
  const [composerBusy, setComposerBusy] = useState(false)
  const [composerError, setComposerError] = useState<string | null>(null)
  const [assistantBrief, setAssistantBrief] = useState<AssistantBriefState | null>(null)
  const [workspaceSummary, setWorkspaceSummary] = useState<WorkspaceSummary | null>(null)
  const [apiState, setApiState] = useState<ApiThreadPanelState>({ threads: [], activeThreadId: null, threadDetail: null, error: null })
  const [documentState, setDocumentState] = useState<ApiDocumentPanelState>({ files: [], documents: [], activeDocumentId: null, retrieve: null, error: null })
  const [outputState, setOutputState] = useState<ApiOutputPanelState>({ outputs: [], selectedOutputId: null, history: [], error: null })
  const currentThread = useMemo(() => chatThreads.find((item) => item.title === activeThread) ?? chatThreads[0], [activeThread])
  const liveThreadCount = apiState.threads.length
  const liveMessageCount = apiState.threadDetail?.messages.length ?? 0
  const liveDocumentCount = documentState.documents.length
  const liveRetrieveCount = documentState.retrieve?.results.length ?? 0
  const usingLiveThread = Boolean(auth?.token && apiState.threadDetail)
  const usingLiveDocuments = Boolean(auth?.token && liveDocumentCount > 0)
  const liveApprovalSteps = outputState.outputs.length > 0 ? mapOutputToApprovalSteps(outputState.outputs) : activeContext.approvalSteps
  const liveExportArtifacts = outputState.outputs.length > 0 ? mapOutputToExportArtifacts(outputState.outputs) : activeContext.exportArtifacts
  const threadHealth = usingLiveThread
    ? liveMessageCount > 0
      ? 'Backend thread synced'
      : 'Backend thread empty · ready for first message'
    : currentThread.priority === 'Critical'
      ? 'Owner visibility recommended'
      : currentThread.priority === 'High'
        ? 'Desk lead should monitor'
        : 'Routine handling is enough'
  const mode = workspaceModes.find((item) => item.key === activeMode) ?? workspaceModes[0]
  const liveMessages = useMemo<Message[]>(() => {
    if (!apiState.threadDetail) return activeContext.messages
    return apiState.threadDetail.messages.map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content,
      meta: new Date(message.createdAt).toLocaleString(),
    }))
  }, [apiState.threadDetail, activeContext.messages])
  const conversationCountLabel = auth?.token ? `${liveThreadCount} backend threads` : '12 threads'
  const titleLabel = apiState.threadDetail?.title ?? activeThread
  const sideContextOwner = auth?.user.fullName ?? currentThread.owner
  const assistantTimelineEntries = useMemo(() => buildAssistantTimelineEntries({
    threadDetail: apiState.threadDetail,
    outputs: outputState.outputs,
    documents: documentState.documents,
    brief: assistantBrief,
  }), [apiState.threadDetail, outputState.outputs, documentState.documents, assistantBrief])

  useEffect(() => {
    async function loadWorkspaceSummary() {
      if (!auth?.token) {
        setWorkspaceSummary(null)
        return
      }

      try {
        const result = await api.getWorkspace(auth.token)
        setWorkspaceSummary(result)
      } catch {
        setWorkspaceSummary(null)
      }
    }

    void loadWorkspaceSummary()
  }, [auth?.token])

  async function handleComposerSend() {
    if (!auth?.token || !apiState.activeThreadId || !composerText.trim()) return
    try {
      setComposerBusy(true)
      setComposerError(null)
      const documentHint = documentState.documents.find((item) => item.id === documentState.activeDocumentId)
      const baseTitle = `${composerMode} · ${composerText.slice(0, 42)}${composerText.length > 42 ? '…' : ''}`
      const result = await api.createMessage(auth.token, apiState.activeThreadId, {
        role: 'user',
        content: composerText,
        orchestration: {
          mode: composerMode.toUpperCase() as 'ASK' | 'DRAFT' | 'EXTRACT' | 'ASSIGN',
          documentId: documentState.activeDocumentId ?? undefined,
          documentTitle: documentHint?.title,
          retrieveHits: liveRetrieveCount,
        },
        createOutput: composerMode === 'Ask'
          ? undefined
          : {
              kind: composerMode === 'Draft' ? 'CHAT_DRAFT' : composerMode === 'Extract' ? 'DOCUMENT_EXTRACT' : 'HANDOFF_NOTE',
              title: baseTitle,
              status: composerMode === 'Assign' ? 'IN_REVIEW' : 'DRAFT',
              approvalStatus: 'PENDING',
              approvalNote: composerMode === 'Assign' ? 'Cần lead chốt handoff trước khi release.' : 'Tạo từ composer trong chat shell.',
              exportStatus: composerMode === 'Draft' ? 'READY' : 'NOT_READY',
              exportChannel: composerMode === 'Draft' ? 'Zalo / Email' : composerMode === 'Assign' ? 'Internal desk' : 'Internal rail',
              exportNote: documentHint ? `Composer đang bám document ${documentHint.title}.` : 'Composer chưa gắn document thật.',
              documentId: documentState.activeDocumentId ?? undefined,
            },
      })
      const [nextThreadDetail, nextOutputs, nextHistory] = await Promise.all([
        api.getThread(auth.token, apiState.activeThreadId),
        api.getOutputs(auth.token, apiState.activeThreadId),
        result.output ? api.getOutputHistory(auth.token, result.output.id) : Promise.resolve([]),
      ])
      setApiState((prev) => ({ ...prev, threadDetail: nextThreadDetail, error: null }))
      setOutputState((prev) => ({
        outputs: nextOutputs,
        selectedOutputId: result.output?.id ?? prev.selectedOutputId,
        history: result.output ? nextHistory : prev.history,
        error: null,
      }))
      setAssistantBrief(result.actionBrief ? {
        summary: result.assistantMessage?.content ?? 'Assistant đã trả về brief điều phối cho bước tiếp theo.',
        action: result.actionBrief,
        linkedOutputId: result.output?.id,
        linkedDocumentTitle: documentHint?.title ?? null,
      } : null)
      setComposerText('')
    } catch (err) {
      setComposerError(err instanceof Error ? err.message : 'Composer action failed')
    } finally {
      setComposerBusy(false)
    }
  }

  return <section className="chat-shell-layout expanded-chat"><aside className="chat-sidebar glass-panel"><div className="sidebar-top"><button className="primary-btn full">+ Phiên chat mới</button><div className="search-chip">Tìm theo công trình, khách hàng, SOP, tiêu chuẩn…</div><div className="mini-tags stack"><span>{mode.label}</span><span>{auth ? 'API live' : 'Prototype'}</span><span>{auth?.workspace.slug ?? 'Assigned'}</span><span>{usingLiveThread ? 'Synced thread' : 'Cần duyệt'}</span><span>{usingLiveDocuments ? `${liveDocumentCount} docs` : 'Archived'}</span></div></div><div className="sidebar-section"><div className="sidebar-header-line"><small className="sidebar-label">Conversation list</small><span>{conversationCountLabel}</span></div><ThreadList items={chatThreads} activeTitle={activeThread} onSelect={(value) => { setActiveThread(value) }} /></div><div className="sidebar-section compact-gap"><div className="sidebar-header-line"><small className="sidebar-label">Quick actions</small></div><InboxList items={conversationStates} /></div></aside><main className="chat-main glass-panel"><div className="chat-head-row"><div><span className="eyebrow">CHAT · PCCC</span><h2>Khung chat quen thuộc, nhưng đã có đủ lớp để làm việc thật</h2></div><div className="header-tags"><span>{auth?.workspace.name ?? activeContext.deskLabel}</span><span>{activeContext.projectLabel}</span><span>{sideContextOwner}</span><span>{usingLiveThread ? `${liveMessageCount} messages` : currentThread.priority}</span></div></div><div className="context-bridge glass-panel"><small className="sidebar-label">Sync</small><strong>{auth?.workspace.name ?? activeContext.workspaceName}</strong><p>{usingLiveThread ? `Đang đồng bộ thread thật từ backend: ${apiState.threadDetail?.title}. Tin nhắn, hồ sơ, artifact và bước release đều đổ vào cùng màn này.` : 'Đổi thread là toàn bộ context, output, approval và trạng thái liên quan đổi theo.'}</p><div className="bridge-actions"><button className="secondary-btn slim" onClick={() => setActiveAuth(activeContext.authStageKey)}>Sync auth</button><span>{mode.landing}</span><span>{usingLiveThread ? auth?.workspace.slug : activeContext.stationFocus.reviewLabel}</span><span>{usingLiveDocuments ? `${liveRetrieveCount} retrieve hits` : 'Prototype docs'}</span></div></div>{assistantBrief && <div className="assistant-brief-strip glass-panel"><div><small className="sidebar-label">Assistant brief</small><strong>{assistantBrief.action.nextAction}</strong><p>{assistantBrief.summary}</p></div><div className="assistant-brief-meta"><span>{assistantBrief.action.mode}</span><span>{assistantBrief.action.approvalLabel}</span><span>{assistantBrief.action.exportLabel}</span>{assistantBrief.linkedDocumentTitle && <span>{assistantBrief.linkedDocumentTitle}</span>}</div></div>}<div className="section-subhead"><small className="sidebar-label">Assistant timeline</small></div><AssistantTimelinePanel entries={assistantTimelineEntries} /><div className="unified-live-grid integrated-live-grid"><ApiThreadPanel auth={auth} onUseThread={setActiveThread} onStateChange={setApiState} /><ApiDocumentPanel auth={auth} activeThreadId={apiState.activeThreadId} onStateChange={setDocumentState} /><ApiOutputPanel auth={auth} activeThreadId={apiState.activeThreadId} activeDocumentId={documentState.activeDocumentId} workspaceMembers={workspaceSummary?.members ?? []} onStateChange={setOutputState} /></div><DecisionPulse activeContext={activeContext} activeMode={activeMode} activeStage={activeStage} /><LandingStatePanel mode={mode} activeContext={activeContext} /><StageNavigator items={activeContext.stageFlow} activeStage={activeStage} setActiveStage={setActiveStage} /><LiveFlowPanel activeContext={activeContext} activeStage={activeStage} /><MetricGrid items={activeContext.metrics} /><WorkflowSnapshot activeContext={activeContext} liveDocuments={documentState.documents} liveRetrieveCount={liveRetrieveCount} /><div className="chat-title-strip"><div><strong>{titleLabel}</strong><p>{usingLiveThread ? `Thread backend đang mở với ${liveMessageCount} message. Workspace hiện tại: ${auth?.workspace.name}. ${usingLiveDocuments ? `Đã có ${liveDocumentCount} document thật, ${outputState.outputs.length} output thật và ${liveRetrieveCount} kết quả retrieve.` : ''}` : `Đang dùng cùng project context, shared files và note kỹ thuật để tránh lệch output. Owner hiện tại: ${currentThread.owner}. Handoff state: ${currentThread.handoff}.`}</p></div><div className="title-actions"><button className="secondary-btn slim">Đổi tên</button><button className="secondary-btn slim">Giao</button><button className="secondary-btn slim">Lưu</button><button className="secondary-btn slim danger">Xóa</button></div></div><div className="signal-strip glass-panel"><div><small>Tình trạng</small><strong>{threadHealth}</strong></div><div><small>SLA</small><strong>{usingLiveThread ? 'Live sync' : currentThread.sla}</strong></div><div><small>Handoff</small><strong>{usingLiveThread ? `${liveMessageCount} messages` : currentThread.handoff}</strong></div></div><MessageList items={liveMessages} /><div className="section-subhead"><small className="sidebar-label">Luồng duyệt</small></div><ApprovalRail items={liveApprovalSteps} /><div className="section-subhead"><small className="sidebar-label">Luồng xuất</small></div><ExportRail items={liveExportArtifacts} /><div className="section-subhead"><small className="sidebar-label">Job log</small></div><OutputHistoryRail events={outputState.history} emptyLabel={usingLiveThread ? 'Chọn hoặc tạo một output để xem history backend.' : 'History sẽ xuất hiện khi dùng thread live.'} /><div className="section-subhead"><small className="sidebar-label">Transitions</small></div><TransitionRail items={activeContext.transitionMoments} /><div className="chat-detail-grid"><div><div className="section-subhead"><small className="sidebar-label">File</small></div><FileList items={activeContext.files} liveFiles={documentState.files} /></div><div><div className="section-subhead"><small className="sidebar-label">Checklist</small></div><HandoffChecklist items={activeContext.handoffSteps} /></div></div><div className="section-subhead"><small className="sidebar-label">Bảng việc</small></div><WorkflowBoard activeContext={activeContext} liveDocuments={documentState.documents} retrieve={documentState.retrieve} /><div className="section-subhead"><small className="sidebar-label">Gợi ý</small></div><div className="prompt-row">{suggestedPrompts.map((prompt) => <button className="chip-btn" key={prompt}>{prompt}</button>)}</div><div className="composer-mode-row">{(['Ask', 'Draft', 'Extract', 'Assign'] as const).map((modeOption) => <button key={modeOption} className={`badge mode-chip ${composerMode === modeOption ? 'active' : 'subtle'}`} onClick={() => setComposerMode(modeOption)}>{modeOption}</button>)}</div><div className="composer-row"><div className="upload-box">{usingLiveDocuments ? `Đang có ${liveDocumentCount} file/document thật trong backend` : '+ Tải PDF, DOCX, XLSX, ảnh, hồ sơ thầu hoặc công văn'}</div><input className="composer-input" value={composerText} onChange={(e) => setComposerText(e.target.value)} placeholder={composerMode === 'Assign' ? 'Chỉ định desk, mô tả handoff và deadline…' : composerMode === 'Extract' ? 'Chọn phần cần bóc: tiêu chuẩn, thiết bị, checklist…' : composerMode === 'Draft' ? 'Soạn email, Zalo, checklist hoặc note kỹ thuật…' : 'Mô tả yêu cầu hoặc kéo hồ sơ vào đây…'} /><button className="primary-btn composer-send" onClick={() => void handleComposerSend()} disabled={!usingLiveThread || composerBusy || !composerText.trim()}>{composerBusy ? 'Đang gửi…' : 'Gửi'}</button></div><div className="composer-footnote">{usingLiveThread ? `Composer giờ không chỉ lưu text: nó trả về brief điều phối, có thể tạo artifact backend với approval/export state thật${documentState.activeDocumentId ? ' và gắn vào document đang mở' : ''}.` : 'Agent sẽ giữ chung context theo thread hiện tại, gợi xuất checklist · email · note kỹ thuật, hiển thị trạng thái approval/export và cho phép giao ownership sang desk khác khi cần.'}</div>{apiState.error && <p className="error-note">{apiState.error}</p>}{documentState.error && <p className="error-note">{documentState.error}</p>}{outputState.error && <p className="error-note">{outputState.error}</p>}{composerError && <p className="error-note">{composerError}</p>}</main><aside className="chat-sidepanel glass-panel"><div className="side-block"><small className="sidebar-label">Context</small><strong>{sideContextOwner}</strong><p>{usingLiveThread ? `${auth?.workspace.slug} · live backend thread · ${liveMessageCount} messages.` : `${currentThread.state} · ${currentThread.sla} · dùng chung project context để giảm lệch giữa các artifact.`}</p></div><div className="side-block"><small className="sidebar-label">Nhịp làm việc</small><InboxList items={activeContext.pulse} /></div><div className="side-block"><small className="sidebar-label">Output</small><div className="mini-tags stack">{outputState.outputs.length > 0 ? outputState.outputs.map((item) => <span key={item.id}>{item.title}</span>) : usingLiveDocuments ? documentState.documents.map((item) => <span key={item.id}>{item.title}</span>) : activeContext.outputs.map((item) => <span key={item}>{item}</span>)}</div>{assistantBrief && <p className="side-note">Next: {assistantBrief.action.nextAction}</p>}</div><div className="side-block"><small className="sidebar-label">Hoạt động</small><ActivityList items={activeContext.activities} /></div><div className="side-block"><small className="sidebar-label">Desk continuity</small><TransitionRail items={activeContext.transitionMoments.slice(0, 2)} /></div><div className="side-block emphasis"><small className="sidebar-label">Điều khiển</small><p>{usingLiveThread ? `Workspace ${auth?.workspace.name} đang sync với API thật. Thread, document flow và output workflow đều đang nằm ngay trong khung chat chính.` : activeContext.stationFocus.adminHeadline}</p></div></aside></section>
}

export function StationScreen({ signals, activeContext, setActiveThread, setScreen, setActiveAuth, activeMode, activeStage, setActiveStage, auth }: { signals: Stat[]; activeContext: ThreadContextPack; setActiveThread: (value: string) => void; setScreen: (screen: Screen) => void; setActiveAuth: (value: string) => void; activeMode: WorkspaceModeKey; activeStage: FlowStageKey; setActiveStage: (value: FlowStageKey) => void; auth: AuthState }) {
  const syncedBoards = [activeContext.stationBoard, ...stationBoards.slice(0, 2)]
  const syncedPolicies = [activeContext.stationFocus.policyLead, ...policyItems.filter((item) => item.label !== activeContext.stationFocus.policyLead.label).slice(0, 2)]
  const mode = workspaceModes.find((item) => item.key === activeMode) ?? workspaceModes[0]
  return <section className="station-layout"><div className="section-head left"><span className="eyebrow">AI STATION</span><h2>AI Station giờ đáng tin hơn vì gom người, việc và quyền vào cùng một chỗ</h2><p>Đây là nơi owner thấy thành viên, desk, quyền truy cập, hàng chờ và nhịp phối hợp của team.</p></div><DecisionPulse activeContext={activeContext} activeMode={activeMode} activeStage={activeStage} /><LandingStatePanel mode={mode} activeContext={activeContext} /><StageNavigator items={activeContext.stageFlow} activeStage={activeStage} setActiveStage={setActiveStage} /><LiveFlowPanel activeContext={activeContext} activeStage={activeStage} /><div className="context-bridge glass-panel"><small className="sidebar-label">Station sync</small><strong>{activeContext.threadTitle}</strong><p>{activeContext.stationFocus.adminHeadline}</p><div className="bridge-actions"><button className="secondary-btn slim" onClick={() => { setScreen('chat'); setActiveThread(activeContext.threadTitle) }}>Mở thread</button><button className="secondary-btn slim" onClick={() => { setScreen('auth'); setActiveAuth(activeContext.authStageKey) }}>Mở auth</button><span>{mode.label}</span><span>{activeContext.stationFocus.reviewLabel}</span></div></div><BoardGrid items={syncedBoards} /><StatGrid stats={signals} /><PilotTrackGrid /><AccountGrid items={accountCards} /><div className="station-main"><div className="station-left glass-panel"><div className="station-shell-head"><strong>Desks</strong><span>Thiết kế để sau này gắn member, role, quota và handoff logic.</span></div><StationCardGrid items={stationCards} /><div className="context-bridge compact glass-panel"><small className="sidebar-label">Ghi chú</small><p>{activeContext.stationFocus.rosterNote}</p></div><div className="section-subhead roomy"><small className="sidebar-label">Team</small></div><TeamGrid items={stationRoster} /><div className="section-subhead roomy"><small className="sidebar-label">Quyền</small></div><AccessMatrix items={accessMatrix} /></div><div className="station-right glass-panel"><StationLiveQueuePanel auth={auth} fallbackQueueLead={activeContext.stationFocus.queueLead} fallbackTimeline={stationTimeline} onOpenThread={(threadTitle) => { setActiveThread(threadTitle); setScreen('chat') }} /><div className="section-subhead roomy"><small className="sidebar-label">Policy</small></div><PolicyList items={syncedPolicies} /><div className="section-subhead roomy"><small className="sidebar-label">Luồng duyệt</small></div><ApprovalRail items={activeContext.approvalSteps} /><div className="section-subhead roomy"><small className="sidebar-label">Transitions</small></div><TransitionRail items={activeContext.transitionMoments} /><div className="side-block emphasis"><small className="sidebar-label">Admin note</small><p>{activeContext.stationFocus.adminHeadline}</p></div></div></div></section>
}
