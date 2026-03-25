import { useMemo, useState } from 'react'
import './App.css'
import { heroStats, navItems, stationSignals, threadContextPacks, type FlowStageKey, type Screen, type WorkspaceModeKey } from './data'
import { AuthScreen, ChatScreen, HomeScreen, StationScreen, TopNav } from './components'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeThread, setBậtThread] = useState(threadContextPacks[0].threadTitle)
  const [activeAuth, setBậtAuth] = useState(threadContextPacks[0].authStageKey)
  const [activeMode, setBậtMode] = useState<WorkspaceModeKey>('owner')
  const [activeStage, setBậtStage] = useState<FlowStageKey>('review')
  const activeContext = useMemo(() => threadContextPacks.find((item) => item.threadTitle === activeThread) ?? threadContextPacks[0], [activeThread])
  const reviewRibbon = useMemo(() => {
    if (screen === 'auth') {
      return {
        title: 'Cần xem · vào đúng quyền',
        description: 'Màn này trả lời nhanh: vào đúng workspace và đúng quyền chưa.',
        tags: ['Auth-aware', 'Scoped entry', 'Trust'],
      }
    }

    if (screen === 'chat') {
      return {
        title: 'Cần xem · thread làm việc thật',
        description: 'Màn này phải cho thấy thread đủ thật để tin được.',
        tags: ['Ownership', 'Approval', 'Continuity'],
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
      title: 'Next · sẵn để duyệt',
      description: 'Role-based landing, approval và export đã đủ để bản này gần sản phẩm nội bộ hơn.',
      tags: ['Role-based workspace', 'Approval + export realism', 'Pilot-ready flows'],
    }
  }, [screen])

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

        {screen === 'home' && <HomeScreen heroStats={heroStats} setScreen={setScreen} activeMode={activeMode} setBậtMode={setBậtMode} activeContext={activeContext} activeStage={activeStage} setBậtStage={setBậtStage} />}
        {screen === 'auth' && <AuthScreen activeContext={activeContext} activeAuth={activeAuth} setBậtAuth={setBậtAuth} activeMode={activeMode} />}
        {screen === 'chat' && <ChatScreen activeThread={activeThread} setBậtThread={setBậtThread} activeContext={activeContext} setBậtAuth={setBậtAuth} activeMode={activeMode} activeStage={activeStage} setBậtStage={setBậtStage} />}
        {screen === 'station' && <StationScreen signals={stationSignals} activeContext={activeContext} setBậtThread={setBậtThread} setScreen={setScreen} setBậtAuth={setBậtAuth} activeMode={activeMode} activeStage={activeStage} setBậtStage={setBậtStage} />}
      </main>
    </div>
  )
}

export default App
