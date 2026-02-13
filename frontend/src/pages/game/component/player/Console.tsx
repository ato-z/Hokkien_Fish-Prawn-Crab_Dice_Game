import { CheckCircle2, Coins } from 'lucide-react'
import { useAtom } from 'jotai'
import { currentJettonAtom, playerJettonAtom } from '@/store/player'
import { useEffect } from 'react'

interface ConsolePlayerProp {
  room: Room
}

export const ConsolePlayer = ({ room }: ConsolePlayerProp) => {
  // 当前选中的筹码索引（使用 jotai 全局状态）
  const [current, setCurrent] = useAtom(currentJettonAtom)
  const [jetton, setJetton] = useAtom(playerJettonAtom)
  // set(playerJettonAtom, roomInfo.jetton[get(currentJettonAtom)])

  useEffect(() => {
    setJetton(room.jetton[current])
  }, [setJetton, room, current])

  return (
    <aside className="flex flex-col gap-2">
      {/* 筹码列表 */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Coins size={14} />
          <span>选择筹码 (Select Jetton)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {room.jetton.map((value, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              className={`relative py-3 rounded-lg font-bold text-sm transition-all active:scale-95 ${
                current === index
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 border-2 border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-2 border-transparent hover:bg-slate-700 hover:border-slate-600'
              }`}>
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono">¥{value}</span>
                {current === index && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-emerald-900" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="text-[10px] text-slate-500 text-center font-mono">当前选中: ¥{jetton}</div>
      </div>

      {/* 梭哈按钮 */}
      <div className="pt-2">
        <button
          type="button"
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center gap-2 transition-all">
          <CheckCircle2 size={18} /> 梭哈 (ALL IN)
        </button>
      </div>
    </aside>
  )
}
