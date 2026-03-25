import { useMemo, useState } from 'react'
import './App.css'
import { heroStats, navItems, stationSignals, threadContextPacks, type Screen } from './data'
import { AuthScreen, ChatScreen, HomeScreen, StationScreen, TopNav } from './components'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeThread, setActiveThread] = useState(threadContextPacks[0].threadTitle)
  const [activeAuth, setActiveAuth] = useState(threadContextPacks[0].authStageKey)
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
            <strong>Next checkpoint · internal-pilot pass</strong>
            <p>Thêm execution layer, pilot framing và workflow coherence để app bớt tĩnh và giống sản phẩm có thể đưa vào dùng nội bộ sớm.</p>
          </div>
          <div className="mini-tags right">
            <span>Workflow realism</span>
            <span>Pilot-ready use cases</span>
            <span>Trust + station</span>
          </div>
        </section>

        {screen === 'home' && <HomeScreen heroStats={heroStats} setScreen={setScreen} />}
        {screen === 'auth' && <AuthScreen activeContext={activeContext} activeAuth={activeAuth} setActiveAuth={setActiveAuth} />}
        {screen === 'chat' && <ChatScreen activeThread={activeThread} setActiveThread={setActiveThread} activeContext={activeContext} setActiveAuth={setActiveAuth} />}
        {screen === 'station' && <StationScreen signals={stationSignals} activeContext={activeContext} setActiveThread={setActiveThread} setScreen={setScreen} setActiveAuth={setActiveAuth} />}
      </main>
    </div>
  )
}

export default App
