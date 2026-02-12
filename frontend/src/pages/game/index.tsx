import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Settings,
  Users,
  MessageSquare,
  Dices,
  Coins,
  Send,
  CheckCircle2,
  BarChart3,
  TrendingUp,
} from 'lucide-react'
import { GameBoard } from '@/components/ui/GameBoard'
import { SettingsModal } from '@/components/ui/SettingsModal'
import { HearthstoneSpinner } from '@/helper/HearthstoneSpinner'
import sidesPath from '@/assets/sides.webp'
import spinPath from '@/assets/spin.mp3'

// --- 常量 ---
type SymbolType = 'fish' | 'prawn' | 'crab' | 'rooster' | 'gourd' | 'coin'

const SYMBOLS: { id: SymbolType; label: string; icon: string; multiplier: string; color: string }[] = [
  { id: 'gourd', label: '宝葫芦', icon: '🍐', multiplier: '1:1', color: 'text-green-400' },
  { id: 'fish', label: '咸鱼', icon: '🐟', multiplier: '1:1', color: 'text-red-400' },
  { id: 'prawn', label: '皮皮虾', icon: '🦐', multiplier: '1:2', color: 'text-orange-400' },
  { id: 'crab', label: '大闸蟹', icon: '🦀', multiplier: '1:5', color: 'text-emerald-400' },
  { id: 'rooster', label: '铁公鸡', icon: '🐓', multiplier: '1:1', color: 'text-red-500' },
  { id: 'coin', label: '金铜板', icon: '🪙', multiplier: '1:10', color: 'text-yellow-400' },
]

const MOCK_CHAT = [
  { user: '韭菜_001', msg: '梭哈葫芦，输了下海', type: 'chat' },
  { user: 'System', msg: '玩家 [慈善家] 重仓买入 🦀', type: 'system' },
  { user: '赌神_HK', msg: '庄家这手气有点黑', type: 'chat' },
]

// --- 主页面 ---
export function GamePage() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const gameController = HearthstoneSpinner.getInstance(roomId ?? '1', {
    column: 3,
    sidesPath: sidesPath,
    sideNumber: 6,
    audioPath: spinPath,
  })
  console.log('room id', roomId)

  // 状态管理
  const [isDealer] = useState(true)
  const [activeTab, setActiveTab] = useState<'bet' | 'chat' | 'users'>('bet')
  const [gameState, setGameState] = useState<'betting' | 'rolling' | 'result'>('betting')
  const [diceResult, setDiceResult] = useState<SymbolType[] | null>(null)
  const [bets, setBets] = useState<Record<string, number>>({})

  // 房间设置状态
  const [showSettings, setShowSettings] = useState(false)
  const [roomConfig, setRoomConfig] = useState({ name: '韭菜收割机_101', private: false })

  // 聊天滚动 Ref
  const chatEndRef = useRef<HTMLDivElement>(null)

  const pageTab = [
    { id: 'bet', label: isDealer ? '市场监控' : '下注', icon: isDealer ? BarChart3 : Coins },
    { id: 'chat', label: '内幕', icon: MessageSquare },
    { id: 'users', label: '名册', icon: Users },
  ] as const

  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeTab])

  // 游戏逻辑
  const handleRoll = () => {
    if (gameState !== 'betting') return
    setGameState('rolling')
    setDiceResult(null)
    const targets = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6))
    gameController.runTo({
      column: targets,
      duration: 3000,
    })
    setTimeout(() => {
      const result: SymbolType[] = []
      for (let i = 0; i < 3; i++) result.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id)
      setDiceResult(result)
      setGameState('result')
      setTimeout(() => setGameState('betting'), 5000)
    }, 2000)
  }

  const handleBet = (symbolId: string, amount: number) => {
    if (gameState !== 'betting') return
    setBets((prev) => ({ ...prev, [symbolId]: (prev[symbolId] || 0) + amount }))
  }

  const handleSaveSettings = (data: Partial<Room>) => {
    console.log('Saving Settings:', data)
    setRoomConfig({ name: data.name ?? roomConfig.name, private: !!data.private })
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
                  gameState === 'betting' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
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
          <GameBoard gameController={gameController} diceResult={diceResult} isRolling={gameState === 'rolling'} />
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
                    <div className="space-y-6">
                      <button
                        onClick={handleRoll}
                        disabled={gameState !== 'betting'}
                        className={`w-full py-6 rounded-xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl ${
                          gameState === 'betting'
                            ? 'bg-linear-to-r from-red-600 to-orange-600 text-white shadow-red-900/30 hover:brightness-110'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                        }`}>
                        <Dices size={24} className={gameState === 'rolling' ? 'animate-spin' : ''} />
                        {gameState === 'betting' ? '开盘收割 (ROLL)' : '结算中...'}
                      </button>
                      <div className="space-y-3">
                        <h3 className="text-xs text-slate-500 font-mono uppercase flex items-center gap-2">
                          <TrendingUp size={14} /> Market Depth
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                          {SYMBOLS.map((s) => (
                            <div
                              key={s.id}
                              className="bg-slate-900/50 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{s.icon}</span>
                                <span className="text-sm font-bold text-slate-300">{s.label}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-mono text-emerald-400 font-bold">¥ 8888</div>
                                <div className="text-[10px] text-slate-600">Total Bets</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 pb-20">
                      {SYMBOLS.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-white/5 active:bg-slate-800 transition-colors group">
                          <div className="w-10 h-10 flex items-center justify-center bg-slate-950 rounded-lg text-2xl border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                            {s.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-200">{s.label}</span>
                              <span className="text-[10px] px-1.5 rounded bg-slate-800 text-slate-400">
                                {s.multiplier}
                              </span>
                            </div>
                            <div className="flex gap-2 mt-1.5">
                              {[10, 50, 100].map((val) => (
                                <button
                                  key={val}
                                  onClick={() => handleBet(s.id, val)}
                                  className="text-[10px] text-slate-500 hover:text-white hover:bg-emerald-600 bg-slate-950 px-2 py-0.5 rounded border border-white/5 transition-colors">
                                  +{val}
                                </button>
                              ))}
                            </div>
                          </div>
                          <input
                            type="number"
                            placeholder="0"
                            value={bets[s.id] || ''}
                            onChange={(e) => handleBet(s.id, parseInt(e.target.value) || 0)}
                            className="w-20 bg-transparent border-b border-slate-700 py-1 text-right text-base font-mono text-emerald-400 focus:border-emerald-500 outline-none placeholder:text-slate-700 transition-colors"
                          />
                        </div>
                      ))}
                      <div className="pt-4">
                        <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center gap-2 transition-all">
                          <CheckCircle2 size={18} /> 确认下注 (Invest)
                        </button>
                      </div>
                    </div>
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
                  className="flex flex-col h-full absolute inset-0">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {MOCK_CHAT.map((msg, i) => (
                      <div
                        key={i}
                        className={`text-xs p-3 rounded-xl max-w-[85%] ${
                          msg.type === 'system'
                            ? 'bg-emerald-950/20 text-emerald-400 mx-auto w-full text-center border border-emerald-500/10'
                            : msg.user.includes('我')
                              ? 'bg-emerald-600 text-white ml-auto rounded-tr-none'
                              : 'bg-slate-800 text-slate-300 mr-auto rounded-tl-none'
                        }`}>
                        {msg.type !== 'system' && (
                          <span className="block font-bold text-[9px] opacity-50 mb-1">{msg.user}</span>
                        )}
                        {msg.msg}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="flex-none p-3 bg-slate-950/80 backdrop-blur border-t border-white/5">
                    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        placeholder="Leak insider info (发布内幕)..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                      />
                      <button className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 transition-colors">
                        <Send size={18} />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Tab C: Users */}
              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 overflow-y-auto p-4 space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-white/5 hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-white/5">
                          {i}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-300">韭菜_{i}号</div>
                          <div className="text-[10px] text-slate-500">Total Bet: ¥{i * 100}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/30 text-emerald-500 border border-emerald-500/20">
                          Online
                        </span>
                      </div>
                    </div>
                  ))}
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
        isPrivate={roomConfig.private}
      />
    </div>
  )
}
