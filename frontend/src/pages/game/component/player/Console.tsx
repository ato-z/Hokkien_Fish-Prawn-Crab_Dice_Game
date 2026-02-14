import { CheckCircle2, Coins, Ticket } from 'lucide-react'
import { useAtom } from 'jotai'
import { betSelfAtom, currentJettonAtom, playerJettonAtom } from '@/store/player'
import { useEffect, useMemo } from 'react'
import { BetListRenderer } from '../ConsoleCommon'

// --- 主组件 ---
interface ConsolePlayerProp {
  room: Room
  onChoiceTap: OnChoiceTap
}

export const ConsolePlayer = ({ room, onChoiceTap }: ConsolePlayerProp) => {
  const [current, setCurrent] = useAtom(currentJettonAtom)
  const [jetton, setJetton] = useAtom(playerJettonAtom)
  const [betSelf] = useAtom(betSelfAtom)

  // 计算总金额
  const totalAmount = useMemo(() => {
    return [...betSelf.single, ...betSelf.both, ...betSelf.set].reduce((sum, bet) => sum + bet.value, 0)
  }, [betSelf])

  const totalCount = betSelf.single.length + betSelf.both.length + betSelf.set.length

  useEffect(() => {
    setJetton(room.jetton[current])
  }, [setJetton, room, current])

  // 处理删除适配器
  const handleDelete = (type: 'single' | 'both' | 'set', eq: string) => {
    if (type === 'single') {
      onChoiceTap(type, parseInt(eq))
    } else if (type === 'both') {
      onChoiceTap(type, eq.split('_').map(Number) as [number, number])
    } else {
      onChoiceTap(type, eq.split('_').map(Number) as [number, number, number])
    }
  }

  return (
    <aside className="flex flex-col h-full gap-2 overflow-hidden select-none">
      {/* 筹码选择器 */}
      <div className="bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex-none shadow-lg">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
            <Coins size={12} className="text-amber-400" />
            Chips
          </div>
          <div className="text-[10px] font-mono text-emerald-400 font-bold">Current: ¥{jetton}</div>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {room.jetton.map((value, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setCurrent(index)}
              className={[
                'relative py-2 rounded-lg font-bold text-[10px] md:text-xs font-mono transition-all border',
                current === index
                  ? 'bg-emerald-700/80 text-white border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-800/50 text-slate-500 border-transparent active:bg-slate-700',
              ].join(' ')}>
              {value >= 1000 ? `${value / 1000}k` : value}
              {current === index && (
                <div className="absolute -top-1 -right-1 bg-emerald-400 text-emerald-950 rounded-full p-px shadow-sm">
                  <CheckCircle2 size={8} strokeWidth={4} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 下注列表 (使用共享渲染器) */}
      <div className="flex-1 flex flex-col bg-slate-950/30 border border-white/10 rounded-xl overflow-hidden relative">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-slate-900/80">
          <div className="flex items-center gap-1.5">
            <Ticket size={12} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-200">我的注单</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{totalCount} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-800">
          {/* 传入 betSelf 和 handleDelete 开启编辑模式 */}
          <BetListRenderer bets={betSelf} onDelete={handleDelete} />
        </div>

        {/* 底部统计 */}
        {totalCount > 0 && (
          <div className="flex-none p-3 bg-slate-900 border-t border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Total Bet</span>
                <span className="text-lg font-bold text-emerald-400 font-mono leading-none">
                  ¥{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
