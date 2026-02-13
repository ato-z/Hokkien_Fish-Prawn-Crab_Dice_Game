import { CheckCircle2 } from 'lucide-react'

interface ConsolePlayerProp {
  state: GameState
}

export const ConsolePlayer = ({ state }: ConsolePlayerProp) => {
  console.log('player', state)
  return (
    <aside className="flex flex-col gap-2">
      <div className="pt-4">
        <button
          type="button"
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center gap-2 transition-all">
          <CheckCircle2 size={18} /> 梭哈 (ALL IN)
        </button>
      </div>
    </aside>
  )
}
