import React from 'react'
import { TrendingUp, Layers, GripHorizontal, Zap, Ticket, X } from 'lucide-react'
import { eqTransform } from '@/helper/utils'

// 下注数据结构接口
interface BetData {
  eq: string
  value: number
}

// 颜色配置映射
const COLOR_CONFIG: Record<string, string> = {
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  red: 'text-red-400 bg-red-500/10 border-red-500/20',
}

// --- 1. 共享基础组件 (Shared Components) ---

/**
 * 区域标题组件
 */
const SectionHeader = ({ title, count, icon: Icon }: { title: string; count: number; icon: React.ElementType }) => (
  <div className="flex items-center gap-1.5 px-1 py-1.5 mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
    <Icon size={10} />
    {title} <span className="text-slate-600">({count})</span>
  </div>
)

/**
 * 通用下注项属性接口
 */
interface CommonBetItemProps {
  eq: string
  value: number
  onDelete?: () => void //如果不传，则是只读模式 (庄家模式)
}

/**
 * 紧凑型下注项 (用于单点)
 * 特点：2列布局，高度小
 */
const CompactBetItem = ({ eq, value, onDelete }: CommonBetItemProps) => {
  const element = eqTransform(eq)[0] // 单点通常只有一个元素

  return (
    <div className="relative flex items-center justify-between p-2 bg-slate-900/40 border border-white/5 rounded-lg hover:border-white/10 transition-colors group">
      {/* 左侧：颜色条 + 名称 + 金额 */}
      <div className="flex items-center gap-2 overflow-hidden">
        <span
          className={[
            'flex-none w-1.5 h-6 rounded-full',
            element.color === 'red' ? 'bg-red-500' : element.color === 'green' ? 'bg-emerald-500' : 'bg-blue-500',
          ].join(' ')}
        />
        <div className="flex flex-col leading-none">
          <span className="text-xs font-bold text-slate-300 truncate">{element.name}</span>
          <span className="text-[10px] text-emerald-500 font-mono mt-0.5">¥{value.toLocaleString()}</span>
        </div>
      </div>

      {/* 右侧：删除按钮 (仅在传入 onDelete 时渲染) */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1.5 -mr-1 text-slate-600 active:text-red-400 active:bg-red-500/10 rounded-md transition-colors touch-manipulation">
          <X size={14} />
        </button>
      )}
    </div>
  )
}

/**
 * 行式下注项 (用于双连/三连)
 * 特点：横向排列，节省垂直空间
 */
const RowBetItem = ({ eq, value, onDelete }: CommonBetItemProps) => {
  const elements = eqTransform(eq)

  return (
    <div className="flex items-center justify-between p-2 bg-slate-900/40 border border-white/5 rounded-lg hover:border-white/10 transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* 组合标签 */}
        <div className="flex gap-1 flex-wrap">
          {elements.map((el, i) => (
            <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded border ${COLOR_CONFIG[el.color]}`}>
              {el.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 ml-2 flex-none">
        <span className="text-xs font-mono text-emerald-400 font-bold">¥{value.toLocaleString()}</span>
        {onDelete && (
          <>
            <div className="w-px h-3 bg-white/10" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1 text-slate-600 active:text-red-400 active:bg-red-500/10 rounded transition-colors touch-manipulation">
              <X size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * 下注列表容器
 * 负责渲染具体的列表逻辑 (Single/Both/Set)
 */
export const BetListRenderer = ({
  bets,
  onDelete,
}: {
  bets: { single: BetData[]; both: BetData[]; set: BetData[] }
  onDelete?: (type: 'single' | 'both' | 'set', eq: string) => void
}) => {
  const totalCount = bets.single.length + bets.both.length + bets.set.length

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-37.5 text-slate-700 gap-2 opacity-70">
        {onDelete ? <Ticket size={24} strokeWidth={1.5} /> : <TrendingUp size={24} strokeWidth={1.5} />}
        <span className="text-[10px]">{onDelete ? '点击盘口下注' : '暂无市场数据'}</span>
      </div>
    )
  }

  return (
    <div className="space-y-3 pb-2">
      {/* 区域 A: 单点 (Grid 2列) */}
      {bets.single.length > 0 && (
        <section>
          <SectionHeader title="单点 (Single)" count={bets.single.length} icon={Zap} />
          <div className="grid grid-cols-2 gap-2">
            {bets.single.map((bet, i) => (
              <CompactBetItem
                key={`s-${i}`}
                eq={bet.eq}
                value={bet.value}
                onDelete={onDelete ? () => onDelete('single', bet.eq) : undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* 区域 B: 双连 (Row) */}
      {bets.both.length > 0 && (
        <section>
          <SectionHeader title="双连 (Combo)" count={bets.both.length} icon={GripHorizontal} />
          <div className="flex flex-col gap-1.5">
            {bets.both.map((bet, i) => (
              <RowBetItem
                key={`b-${i}`}
                eq={bet.eq}
                value={bet.value}
                onDelete={onDelete ? () => onDelete('both', bet.eq) : undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* 区域 C: 三连 (Row) */}
      {bets.set.length > 0 && (
        <section>
          <SectionHeader title="三连 (Triple)" count={bets.set.length} icon={Layers} />
          <div className="flex flex-col gap-1.5">
            {bets.set.map((bet, i) => (
              <RowBetItem
                key={`t-${i}`}
                eq={bet.eq}
                value={bet.value}
                onDelete={onDelete ? () => onDelete('set', bet.eq) : undefined}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
