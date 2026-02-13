import { CheckCircle2, Coins, Trash2, Ticket, Layers, Zap, GripHorizontal } from 'lucide-react'
import { useAtom } from 'jotai'
import { betSelfAtom, currentJettonAtom, playerJettonAtom } from '@/store/player'
import { useEffect, useMemo } from 'react'
import { eqTransform } from '@/helper/utils'

/**
 * 颜色映射配置
 */
const COLOR_CONFIG = {
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  red: 'text-red-400 bg-red-500/10 border-red-500/20',
}

/**
 * 辅助组件：下注类型图标
 */
const BetTypeBadge = ({ count }: { count: number }) => {
  if (count === 3)
    return (
      <span className="p-1 rounded bg-purple-500/20 text-purple-400" title="三连">
        <Layers size={12} />
      </span>
    )
  if (count === 2)
    return (
      <span className="p-1 rounded bg-orange-500/20 text-orange-400" title="双连">
        <GripHorizontal size={12} />
      </span>
    )
  return (
    <span className="p-1 rounded bg-slate-700/50 text-slate-400" title="单点">
      <Zap size={12} />
    </span>
  )
}

/**
 * 下注项组件
 */
function BetItem({
  eq,
  value,
  onDelete,
}: {
  eq: string
  value: number
  onDelete: (eq: string, value: number) => void
}) {
  const elements = eqTransform(eq)

  return (
    <div className="group relative flex items-center justify-between p-3 bg-slate-900/60 border border-white/5 rounded-xl hover:border-emerald-500/30 transition-all active:scale-[0.99]">
      {/* 左侧：内容 */}
      <div className="flex items-center gap-3">
        {/* 类型图标 */}
        <BetTypeBadge count={elements.length} />

        {/* 押注目标 */}
        <div className="flex gap-1.5 flex-wrap">
          {elements.map((element, index) => (
            <span
              key={index}
              className={['px-2 py-0.5 rounded text-xs font-bold border', COLOR_CONFIG[element.color]].join(' ')}>
              {element.name}
            </span>
          ))}
        </div>
      </div>

      {/* 右侧：金额 & 删除 */}
      <div className="flex items-center gap-3 pl-2">
        <div className="text-right">
          <div className="text-emerald-400 font-bold font-mono text-sm tracking-wide">¥{value.toLocaleString()}</div>
        </div>

        {/* 悬停显示删除按钮 (移动端可以直接显示或左滑，这里做个简单点击) */}
        <button
          onClick={() => onDelete(eq, value)}
          type="button"
          className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

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

  // 计算总注数
  const totalCount = betSelf.single.length + betSelf.both.length + betSelf.set.length

  useEffect(() => {
    setJetton(room.jetton[current])
  }, [setJetton, room, current])

  return (
    <aside className="flex flex-col h-full gap-3 overflow-hidden">
      <div className="bg-slate-950/50 backdrop-blur-sm border border-white/10 rounded-2xl p-3 flex-none">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <Coins size={12} className="text-amber-400" />
            Chip Selector
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Current: ¥{jetton}</div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {room.jetton.map((value, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              className={[
                'relative py-2 rounded-lg font-bold text-xs font-mono transition-all active:scale-95 border',
                current === index
                  ? 'bg-linear-to-br from-emerald-600 to-emerald-800 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700 hover:text-slate-200',
              ].join(' ')}>
              {value >= 1000 ? `${value / 1000}k` : value}
              {current === index && (
                <div className="absolute -top-1.5 -right-1.5 bg-emerald-400 text-emerald-950 rounded-full p-px shadow-sm">
                  <CheckCircle2 size={10} strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 下注列表 (弹性伸缩) */}
      <div className="flex-1 flex flex-col bg-slate-950/30 border border-white/10 rounded-2xl overflow-hidden relative">
        {/* 列表头部 */}
        <div className="flex items-center justify-between p-3 border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Ticket size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-200">下注单 (Order Slip)</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            {totalCount} item{totalCount > 1 ? 's' : ''}
          </span>
        </div>

        {/* 滚动区域 */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-none">
          {totalCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2 opacity-60">
              <Coins size={32} strokeWidth={1} />
              <span className="text-xs">暂无下注，点击盘口下注</span>
            </div>
          ) : (
            <>
              {/* 分组渲染，增加视觉间隔 */}
              {betSelf.single.length > 0 && (
                <div className="space-y-2">
                  {/* 可选：增加一个小标题 <div className="text-[10px] text-slate-600 px-2">单点</div> */}
                  {betSelf.single.map((bet, i) => (
                    <BetItem key={`s-${i}`} {...bet} onDelete={(eq) => onChoiceTap('single', parseInt(eq))} />
                  ))}
                </div>
              )}

              {betSelf.both.length > 0 && (
                <div className="space-y-2 pt-1">
                  {betSelf.both.map((bet, i) => (
                    <BetItem
                      key={`b-${i}`}
                      {...bet}
                      onDelete={(eq) => onChoiceTap('both', eq.split('_').map((i) => parseInt(i)) as [number, number])}
                    />
                  ))}
                </div>
              )}

              {betSelf.set.length > 0 && (
                <div className="space-y-2 pt-1">
                  {betSelf.set.map((bet, i) => (
                    <BetItem
                      key={`t-${i}`}
                      {...bet}
                      onDelete={(eq) =>
                        onChoiceTap('set', eq.split('_').map((i) => parseInt(i)) as [number, number, number])
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {/* 底部留白，防止被 Footer 遮挡 */}
          <div className="h-2" />
        </div>

        {/* 3. 底部统计栏 (Sticky Footer) */}
        {totalCount > 0 && (
          <div className="p-3 bg-slate-900 border-t border-emerald-500/20 shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Total Risk</span>
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
