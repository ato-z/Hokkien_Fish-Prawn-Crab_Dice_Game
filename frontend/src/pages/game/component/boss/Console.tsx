import { GAME_STATE_STRING } from '@/enum'
import { betAllAtom } from '@/store/player'
import { useAtom } from 'jotai'
import { Dices, TrendingUp } from 'lucide-react'
import { useCallback } from 'react'
import { BetListRenderer } from '../ConsoleCommon'

interface ConsoleBossProp {
  state: GameState
  onTap: () => void
}

interface ConsoleBossProp {
  state: GameState
  onTap: () => void
}

export const ConsoleBoss = ({ state, onTap }: ConsoleBossProp) => {
  const [betAll] = useAtom(betAllAtom)

  const handleRoll = useCallback(() => {
    if (state !== 'betting') return
    onTap()
  }, [state, onTap])

  return (
    <aside className="flex flex-col h-full gap-4">
      {/* 顶部控制按钮 */}
      <div className="p-1">
        <button
          type="button"
          onClick={handleRoll}
          disabled={state !== 'betting'}
          className={[
            'w-full py-5 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl relative overflow-hidden active:scale-[0.98]',
            state === 'betting'
              ? 'bg-linear-to-r from-red-600 to-orange-600 text-white shadow-red-900/30 hover:brightness-110'
              : '',
            state === 'rolling' ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-wait' : '',
            state === 'result'
              ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 cursor-default shadow-[0_0_15px_rgba(16,185,129,0.1)]'
              : '',
          ].join(' ')}>
          <Dices size={20} className={state === 'rolling' ? 'animate-spin' : ''} />
          {GAME_STATE_STRING[state as keyof typeof GAME_STATE_STRING] || state}
        </button>
      </div>

      {/* 市场深度列表 (复用逻辑) */}
      <div className="flex-1 flex flex-col bg-slate-950/30 border border-white/10 rounded-xl">
        <div className="flex items-center gap-2 p-3 border-b border-white/5 bg-slate-900/80">
          <TrendingUp size={14} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-200">市场深度 (Market Depth)</span>
        </div>

        <div className="flex-1 p-2">
          {/* 这里直接使用 Shared Render，不传 onDelete 即为只读模式 */}
          <BetListRenderer bets={betAll} />
        </div>
      </div>
    </aside>
  )
}
