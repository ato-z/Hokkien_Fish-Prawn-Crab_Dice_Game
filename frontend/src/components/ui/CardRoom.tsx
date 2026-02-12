import type React from 'react'
import { Banknote, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

export const CardRoom: React.FC<{ room: Room }> = ({ room }) => {
  return (
    <section className="group relative bg-slate-900 border border-white/5 rounded-xl p-4 cursor-pointer hover:border-emerald-500/30 transition-all active:scale-[0.99] overflow-hidden">
      <Sprout className="absolute -right-4 -bottom-4 text-emerald-900/10 w-24 h-24 rotate-12 group-hover:rotate-6 transition-transform pointer-events-none" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1 flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500">#{room.id}</span>
            {room.hot && (
              <span className="px-1.5 py-0.5 rounded-lg bg-red-950/40 text-red-400 text-[9px] border border-red-900/30 font-bold">
                高危
              </span>
            )}
          </div>
          <h3 className="font-bold text-base text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
            {room.name}
          </h3>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">{room.sub}</p>
        </div>

        {/* 右侧：状态/进入 */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={cn(
              'text-[10px] px-2 py-0.5 rounded text-right whitespace-nowrap',
              room.tag === '适合新手' ? 'text-emerald-400 bg-emerald-950/30' : 'text-slate-400 bg-slate-800/50'
            )}>
            {room.tag}
          </span>
        </div>
      </div>

      <div className="my-3 border-t border-dashed border-white/10" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-300">
          <div className="p-1 rounded bg-slate-800 text-emerald-500">
            <Banknote size={14} />
          </div>
          <span className="font-mono font-bold text-sm">¥{room.minBet}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[10px] text-slate-500 font-mono">
            <span className={room.players >= room.maxPlayers - 1 ? 'text-red-400' : 'text-slate-400'}>
              {room.players}
            </span>
            <span className="opacity-50">/{room.maxPlayers}</span>
          </div>
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full',
                room.players >= room.maxPlayers - 2 ? 'bg-red-500' : 'bg-emerald-500'
              )}
              style={{ width: `${(room.players / room.maxPlayers) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
