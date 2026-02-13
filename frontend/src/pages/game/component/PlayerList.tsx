export const PlayerList = () => {
  return (
    <article className="p-4">
      <ul className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <li
            key={i}
            className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-white/5 hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-white/5">
                {i}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-300">韭菜_{i}号</div>
                <div className="text-[10px] text-slate-500">Total Bet: ¥{i * 100}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/30 text-emerald-500 border border-emerald-500/20">
                Online
              </span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}
