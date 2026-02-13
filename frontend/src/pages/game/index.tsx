import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Settings, Users, MessageSquare, Coins, BarChart3 } from 'lucide-react'
import { GameBoard } from '@/components/ui/GameBoard'
import { SettingsModal } from '@/components/ui/SettingsModal'
import { HearthstoneSpinner } from '@/helper/HearthstoneSpinner'
import sidesPath from '@/assets/sides.webp'
import spinPath from '@/assets/spin.mp3'
import { SYMBOL_TYPE } from '@/enum'
import { Chat } from './component/Chat'
import { ConsoleBoss } from './component/boss/Console'
import { ConsolePlayer } from './component/player/Console'
import { PlayerList } from './component/PlayerList'

// --- 主页面 ---
export function GamePage() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [roomConfig, setRoomConfig] = useState<Room>({
    id: '1',
    name: '韭菜收割机_101',
    sub: 'FERTILIZER ZONE',
    private: false,
    minBet: 0,
    jetton: [1, 5, 10],
    maxPlayers: 0,
    status: 'betting',
    tag: '无料',
  })
  const gameController = HearthstoneSpinner.getInstance(roomId ?? '1', {
    column: 3,
    sideNumber: 6,
    sidesPath: sidesPath,
    audioPath: spinPath,
  })
  console.log('room id', roomId)

  // 状态管理
  const [isDealer] = useState(false)
  const [activeTab, setActiveTab] = useState<'bet' | 'chat' | 'users'>('bet')
  const [diceResult, setDiceResult] = useState<SYMBOL_TYPE[] | null>(null)

  // 房间设置状态
  const [showSettings, setShowSettings] = useState(false)

  const pageTab = [
    { id: 'bet', label: isDealer ? '监控' : '下注', icon: isDealer ? BarChart3 : Coins },
    { id: 'chat', label: '内幕', icon: MessageSquare },
    { id: 'users', label: '农场', icon: Users },
  ] as const

  // 游戏逻辑
  const handleRoll = async () => {
    setRoomConfig({
      ...roomConfig,
      status: 'rolling',
    })
    setDiceResult(null)
    const targets = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6)) as SYMBOL_TYPE[]

    // 等待动画完成
    await gameController.runTo({
      column: targets,
      duration: 5000,
    })

    // 动画完成后显示结果
    setDiceResult(targets)
    setRoomConfig({
      ...roomConfig,
      status: 'result',
    })

    // 3秒后可以再次开盘
    setTimeout(() => {
      setRoomConfig({
        ...roomConfig,
        status: 'betting',
      })
    }, 3000)
  }

  const handleSaveSettings = (data: Partial<Room>) => {
    console.log('Saving Settings:', data)
    // setRoomConfig({ name: data.name ?? roomConfig.name, private: !!data.private })
    setShowSettings(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden relative">
      {/* 1. Header */}
      <header className="flex-none sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/lobby')}
            className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              {roomConfig.name}
              <span
                className={`w-2 h-2 rounded-full ${
                  roomConfig.status === 'betting' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              />
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <div className="text-[10px] text-slate-500 uppercase">My Assets</div>
            <div className="text-xs font-mono text-amber-400 font-bold">¥88,800</div>
          </div>
          {/* 庄家设置按钮入口 */}
          {isDealer && (
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="p-2 -mr-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              <Settings size={20} />
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Layout (PC Grid / Mobile Col) */}
      <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 p-0 lg:p-6 max-w-400 mx-auto w-full relative z-0">
        {/* Left: Game Board */}
        <section className="lg:col-span-7 flex flex-col p-2 lg:p-0">
          <GameBoard
            onChoice={console.log}
            gameController={gameController}
            diceResult={diceResult}
            isRolling={roomConfig.status === 'rolling'}
          />
        </section>

        {/* Right: Panel */}
        <section className="lg:col-span-5 flex flex-col bg-slate-900/0 lg:bg-slate-900/30 lg:border lg:border-white/5 lg:rounded-2xl overflow-hidden relative">
          <div className="flex-none p-2 lg:p-4 pb-0">
            <div className="flex p-1 bg-slate-900 rounded-lg border border-white/5 shadow-lg">
              {pageTab.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded transition-all ${
                    activeTab === tab.id
                      ? 'bg-slate-800 text-emerald-400 shadow-sm border border-white/5'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}>
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative flex flex-col">
            <AnimatePresence mode="wait">
              {/* Tab A: Bet/Monitor */}
              {activeTab === 'bet' && (
                <motion.div
                  key="bet"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isDealer ? (
                    <ConsoleBoss onTap={handleRoll} state={roomConfig.status} />
                  ) : (
                    <ConsolePlayer room={roomConfig} />
                  )}
                </motion.div>
              )}

              {/* Tab B: Chat */}
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0">
                  <Chat />
                </motion.div>
              )}

              {/* Tab C: Users */}
              {activeTab === 'users' && (
                <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 ">
                  <PlayerList />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* 3. Settings Modal (Placed at Root Level) */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        roomName={roomConfig.name}
        isPrivate={false}
      />
    </div>
  )
}
