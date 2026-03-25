import { useMemo, useState } from 'react'
import './App.css'
import { heroStats, navItems, stationSignals, threadContextPacks, type Screen, type WorkspaceModeKey } from './data'
import { AuthScreen, ChatScreen, HomeScreen, StationScreen, TopNav } from './components'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeThread, setActiveThread] = useState(threadContextPacks[0].threadTitle)
  const [activeAuth, setActiveAuth] = useState(threadContextPacks[0].authStageKey)
  const [activeMode, setActiveMode] = useState<WorkspaceModeKey>('owner')
  const activeContext = useMemo(() => threadContextPacks.find((item) => item.threadTitle === activeThread) ?? threadContextPacks[0], [activeThread])

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand brand-button" onClick={() => setScreen('home')}>
          <div className="brand-mark">AI</div>
          <div className="brand-copy">
            <strong>ai.pccc.vn</strong>
            <small>Premium AI workspace cho ngành PCCC Việt Nam</small>
          </div>
        </button>
        <TopNav items={navItems} screen={screen} setScreen={setScreen} />
      </header>

      <main className="main-shell">
        <section className="review-ribbon glass-panel">
          <div>
            <strong>Next checkpoint · internal-test readiness</strong>
            <p>Role-aware landing, approval chain và export rail đã được đưa vào cùng thread/workspace context để prototype bớt tĩnh và gần sản phẩm dùng nội bộ hơn.</p>
          </div>
          <div className="mini-tags right">
            <span>Role-based workspace</span>
            <span>Approval + export realism</span>
            <span>Pilot-ready flows</span>
          </div>
        </section>

        {screen === 'home' && <HomeScreen heroStats={heroStats} setScreen={setScreen} activeMode={activeMode} setActiveMode={setActiveMode} activeContext={activeContext} />}
        {screen === 'auth' && <AuthScreen activeContext={activeContext} activeAuth={activeAuth} setActiveAuth={setActiveAuth} activeMode={activeMode} />}
        {screen === 'chat' && <ChatScreen activeThread={activeThread} setActiveThread={setActiveThread} activeContext={activeContext} setActiveAuth={setActiveAuth} activeMode={activeMode} />}
        {screen === 'station' && <StationScreen signals={stationSignals} activeContext={activeContext} setActiveThread={setActiveThread} setScreen={setScreen} setActiveAuth={setActiveAuth} activeMode={activeMode} />}
      </main>
    </div>
  )
}

export default App
