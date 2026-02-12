import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Typewriter from 'typewriter-effect'
import { Sprout, Banknote, Search, ChefHat, LogOut, Ticket } from 'lucide-react'
import { BackgroundCommon } from '@/components/ui/Background'
import { FUNNY_QUOTES, MOCK_ROOMS } from '@/mock'
import { CardRoom } from '@/components/ui/CardRoom'

export function LobbyPage() {
  const navigate = useNavigate()
  const user = { name: '慈善家_007', balance: 88800 }

  return (
    <div className="min-h-screen w-full relative font-sans text-slate-200 pb-24">
      <BackgroundCommon />

      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center">
              <Sprout size={18} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">{user.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                <Banknote size={12} />
                <span>{user.balance.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => navigate('/login')} className="p-2 text-slate-400 hover:text-white">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6 relative z-10">
        <div className="space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-900/50 text-[10px] text-emerald-400 font-mono tracking-wider mb-2">
              <ChefHat size={12} />
              <span>HARVEST SEASON</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-100">韭菜种植基地</h1>
            <div className="text-xs text-slate-500 font-mono mt-1 h-5 flex items-center">
              <span className="text-emerald-600 mr-2">System:</span>
              <Typewriter
                options={{
                  strings: FUNNY_QUOTES,
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  cursor: '_',
                }}
              />
            </div>
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input
              type="text"
              placeholder="搜索房间号..."
              className="w-full bg-slate-900/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm focus:border-emerald-500/30 focus:outline-none transition-colors placeholder:text-slate-700"
            />
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <motion.button
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            onClick={() => navigate('/create-room')}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer group relative flex flex-col items-center justify-center gap-3 rounded-xl p-4 border-2 border-dashed border-white/10 hover:border-brand-strong/50 hover:bg-brand-strong/5 transition-all duration-300">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center transition-transform ">
              <Ticket className="text-emerald-400" size={18} />
            </div>
            <span className="text-sm font-medium text-emerald-100/80">申请一张新的入场券 (创建)</span>
          </motion.button>

          {MOCK_ROOMS.map((room) => (
            <motion.div
              key={room.id}
              variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
              onClick={() => navigate(`/game/${room.id}`)}>
              <CardRoom room={room} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
