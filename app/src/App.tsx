import { useMemo, useState } from 'react'
import './App.css'
import { heroStats, navItems, stationSignals, threadContextPacks, type FlowStageKey, type Screen, type WorkspaceModeKey } from './data'
import { AuthScreen, ChatScreen, HomeScreen, StationScreen, TopNav } from './components'
import { useAuthState } from './auth-store'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeThread, setActiveThread] = useState(threadContextPacks[0].threadTitle)
  const [activeAuth, setActiveAuth] = useState(threadContextPacks[0].authStageKey)
  const [activeMode, setActiveMode] = useState<WorkspaceModeKey>('owner')
  const [activeStage, setActiveStage] = useState<FlowStageKey>('review')
  const { auth, setAuth } = useAuthState()

  const activeContext = useMemo(() => threadContextPacks.find((item) => item.threadTitle === activeThread) ?? threadContextPacks[0], [activeThread])

  const reviewRibbon = useMemo(() => {
    if (screen === 'auth') {
      return {
        title: auth ? 'Cần xem · phiên đăng nhập' : 'Cần xem · vào đúng quyền',
        description: auth
          ? `Đã vào ${auth.workspace.name}. Có thể dùng token local để nối tiếp sang chat/API.`
          : 'Màn này trả lời nhanh: vào đúng workspace và đúng quyền chưa.',
        tags: auth ? ['Signed in', auth.workspace.slug, auth.role ?? 'member'] : ['Auth-aware', 'Scoped entry', 'Trust'],
      }
    }

    if (screen === 'chat') {
      return {
        title: 'Cần xem · thread làm việc thật',
        description: auth ? 'Đã sẵn nền auth local để nối tiếp thread thật từ API.' : 'Màn này phải cho thấy thread đủ thật để tin được.',
        tags: auth ? ['API-ready', 'Auth OK', 'Thread next'] : ['Ownership', 'Approval', 'Continuity'],
      }
    }

    if (screen === 'station') {
      return {
        title: 'Cần xem · điều phối đáng tin',
        description: 'AI Station phải cho thấy queue, policy, access và phối hợp đủ rõ.',
        tags: ['Queue + policy', 'Access', 'Cross-desk'],
      }
    }

    return {
      title: auth ? 'Next · Phase 2 đang chạy' : 'Next · sẵn để duyệt',
      description: auth ? `Auth local đã có. Tiếp theo là nối chat thật bằng API ở workspace ${auth.workspace.name}.` : 'Role-based landing, approval và export đã đủ để bản này gần sản phẩm nội bộ hơn.',
      tags: auth ? ['Phase 2', 'Backend live', 'Frontend next'] : ['Role-based workspace', 'Approval + export realism', 'Pilot-ready flows'],
    }
  }, [screen, auth])

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand brand-button" onClick={() => setScreen('home')}>
          <div className="brand-mark">AI</div>
          <div className="brand-copy">
            <strong>ai.pccc.vn</strong>
            <small>AI workspace cho ngành PCCC Việt Nam</small>
          </div>
        </button>
        <TopNav items={navItems} screen={screen} setScreen={setScreen} />
      </header>

      <main className="main-shell">
        <section className="review-ribbon glass-panel">
          <div>
            <strong>{reviewRibbon.title}</strong>
            <p>{reviewRibbon.description}</p>
          </div>
          <div className="mini-tags right">
            {reviewRibbon.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>

        {screen === 'home' && <HomeScreen heroStats={heroStats} setScreen={setScreen} activeMode={activeMode} setActiveMode={setActiveMode} activeContext={activeContext} activeStage={activeStage} setActiveStage={setActiveStage} />}
        {screen === 'auth' && <AuthScreen activeContext={activeContext} activeAuth={activeAuth} setActiveAuth={setActiveAuth} activeMode={activeMode} auth={auth} setAuth={setAuth} />}
        {screen === 'chat' && <ChatScreen activeThread={activeThread} setActiveThread={setActiveThread} activeContext={activeContext} setActiveAuth={setActiveAuth} activeMode={activeMode} activeStage={activeStage} setActiveStage={setActiveStage} auth={auth} />}
        {screen === 'station' && <StationScreen signals={stationSignals} activeContext={activeContext} setActiveThread={setActiveThread} setScreen={setScreen} setActiveAuth={setActiveAuth} activeMode={activeMode} activeStage={activeStage} setActiveStage={setActiveStage} auth={auth} />}
      </main>
    </div>
  )
}

export default App
