import { GAME_STATE_STRING } from '@/enum'
import { Dices, TrendingUp } from 'lucide-react'
import { useCallback } from 'react'

interface ConsoleBossProp {
  state: GameState
  onTap: () => void
}

/**
 * 专家的操作台
 */
export const ConsoleBoss = ({ state, onTap }: ConsoleBossProp) => {
  const handleRoll = useCallback(() => {
    if (state !== 'betting') return void 0
    if (onTap) onTap()
  }, [state, onTap])

  return (
    <aside className="flex flex-col h-full gap-6">
      <button
        type="button"
        onClick={handleRoll}
        disabled={state !== 'betting'}
        className={[
          'w-full py-6 rounded-xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl relative overflow-hidden',
          state === 'betting' && [
            'bg-linear-to-r from-red-600 to-orange-600 text-white', // 激进的渐变色
            'shadow-red-900/30 border-transparent',
          ],
          state === 'rolling' && ['bg-slate-800 text-slate-500', 'border-white/5 cursor-wait'],
          state === 'result' && [
            'bg-emerald-950/30 text-emerald-400',
            'border-emerald-500/20 cursor-default',
            'shadow-[0_0_15px_rgba(16,185,129,0.1)]',
          ],
        ].join(' ')}>
        <Dices size={24} className={state === 'rolling' ? 'animate-spin' : ''} />
        {GAME_STATE_STRING[state]}
      </button>
      <div className="space-y-3">
        <h3 className="text-xs text-slate-500 font-mono uppercase flex items-center gap-2">
          <TrendingUp size={14} /> Market Depth
        </h3>
        <div className="grid grid-cols-1 gap-2">押注看板</div>
      </div>
    </aside>
  )
}
