import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Settings, Users, MessageSquare, Coins, BarChart3 } from 'lucide-react'
import { SYMBOL_TYPE } from '@/enum'
import { useAtom, useSetAtom } from 'jotai'
import { gameControllerAtom, roomInfoAtom, roomStatusAtom, startRollAtom, withRoomIdAtom } from '@/store/game'
import { bossAtom, pushBetAllAtom, pushBetSelfAtom } from '@/store/player'
import { RoomTransition } from '@/components/ui/RoomTransition'
import { GameBoard } from '@/components/ui/GameBoard'
import { Chat } from './component/Chat'
import { ConsoleBoss } from './component/boss/Console'
import { ConsolePlayer } from './component/player/Console'
import { PlayerList } from './component/PlayerList'

// --- 主页面 ---
export function GamePage() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [activeTab, setActiveTab] = useState<'bet' | 'chat' | 'users'>('bet')
  const [roomConfig] = useAtom(roomInfoAtom)
  const [isBoss] = useAtom(bossAtom)
  const [roomState] = useAtom(roomStatusAtom)
  const [gameController] = useAtom(gameControllerAtom)
  const withRoomId = useSetAtom(withRoomIdAtom)
  const startRoll = useSetAtom(startRollAtom)

  const pushBetSelf = useSetAtom(pushBetSelfAtom)
  const pushBetAll = useSetAtom(pushBetAllAtom)

  const pageTab = [
    { id: 'bet', label: isBoss ? '监控' : '下注', icon: isBoss ? BarChart3 : Coins },
    { id: 'chat', label: '内幕', icon: MessageSquare },
    { id: 'users', label: '农场', icon: Users },
  ] as const

  // 游戏逻辑
  const handleRoll = async () => {
    const targets = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6)) as SYMBOL_TYPE[]
    startRoll({ duration: 6000, column: targets })
  }

  // 点击下注和
  const handleBetTap: OnChoiceTap = useCallback(
    (key, indexs) => {
      if (roomState === 'rolling') return void 0

      const eq = indexs instanceof Array ? indexs.join('_') : indexs.toString()

      pushBetSelf({
        key,
        eq,
        notice: (key, eq, value) => {
          console.log('在这里通知服务器...')
          pushBetAll({ key, target: { eq, value } })
        },
      })
    },
    [roomState, pushBetSelf, pushBetAll]
  )

  // 获取房号
  useEffect(() => {
    if (roomId) withRoomId(roomId.toString())
    return () => {
      gameController?.destroy()
    }
  }, [roomId, withRoomId, gameController])

  if (roomConfig === null) return <RoomTransition />

  return (
    <div className="h-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden relative">
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
                  roomState === 'betting' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
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
          {isBoss && (
            <Link
              to={`/edit-room/${roomId}`}
              className="p-2 -mr-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              <Settings size={20} />
            </Link>
          )}
        </div>
      </header>

      {/* 2. Main Layout */}
      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row h-auto">
        <section className="aspect-square w-full lg:h-full lg:w-auto">
          {gameController && <GameBoard gameController={gameController} onChoiceTap={handleBetTap} />}
        </section>

        <section className="flex-1 relative p-3 flex flex-col gap-3 lg:gap-4 overflow-hidden">
          <div className="flex-none pb-0">
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

          <div className="flex-1 overflow-y-scroll ">
            <AnimatePresence mode="wait">
              {activeTab === 'bet' && (
                <motion.div
                  key="bet"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full overflow-y-scroll relative">
                  {isBoss ? (
                    <ConsoleBoss onTap={handleRoll} state={roomState} />
                  ) : (
                    <ConsolePlayer room={roomConfig} onChoiceTap={handleBetTap} />
                  )}
                </motion.div>
              )}

              {/* Tab B: Chat */}
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full overflow-y-scroll relative">
                  <Chat />
                </motion.div>
              )}

              {/* Tab C: Users */}
              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full overflow-y-scroll relative">
                  <PlayerList />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  )
}
