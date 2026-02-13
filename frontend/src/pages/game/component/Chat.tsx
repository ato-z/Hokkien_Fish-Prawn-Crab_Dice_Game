import { MOCK_CHAT } from '@/mock'
import { Send } from 'lucide-react'
import { useRef } from 'react'

/**
 * 聊天看板
 */
export const Chat = () => {
  // 聊天滚动 Ref
  const chatEndRef = useRef<HTMLDivElement>(null)

  return (
    <aside className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {MOCK_CHAT.map((msg, i) => (
          <div
            key={i}
            className={`text-xs p-3 rounded-xl max-w-[85%] ${
              msg.type === 'system'
                ? 'bg-emerald-950/20 text-emerald-400 mx-auto w-full text-center border border-emerald-500/10'
                : msg.user.includes('我')
                  ? 'bg-emerald-600 text-white ml-auto rounded-tr-none'
                  : 'bg-slate-800 text-slate-300 mr-auto rounded-tl-none'
            }`}>
            {msg.type !== 'system' && <span className="block font-bold text-[9px] opacity-50 mb-1">{msg.user}</span>}
            {msg.msg}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex-none p-3 bg-slate-950/80 backdrop-blur border-t border-white/5">
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Leak insider info (发布内幕)..."
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
          />
          <button
            type="button"
            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 transition-colors">
            <Send size={18} />
          </button>
        </form>
      </div>
    </aside>
  )
}
