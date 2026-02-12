import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Coins, Users, Lock, Unlock, Type, Tag, Sparkles, Banknote, KeyRound } from 'lucide-react'
import { BackgroundCommon } from '@/components/ui/Background'

export function CreateRoomPage() {
  const navigate = useNavigate()

  // 初始状态
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    sub: '',
    minBet: 0,
    maxPlayers: 6,
    private: true,
    password: '', // 默认为空
    players: 1,
    status: 'waiting',
    hot: true,
  })

  // 动态计算 Tag
  useEffect(() => {
    let autoTag = '普通盘口'
    const bet = formData.minBet || 0

    if (bet === 0)
      autoTag = '无料' // 免费场
    else if (bet <= 20) autoTag = '新手诱饵'
    else if (bet <= 100) autoTag = '进阶收割'
    else if (bet > 200) autoTag = '重症监护室'

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({ ...prev, tag: autoTag }))
  }, [formData.minBet])

  // 处理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 简单的校验
    if (formData.private && !formData.password) {
      alert('内幕交易必须设置密钥！')
      return
    }

    const newRoom: Room = {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      name: formData.name || `未命名盘口 ${Math.floor(Math.random() * 100)}`,
      sub: formData.sub || 'NEW LISTING',
      minBet: formData.minBet || 0,
      players: 1,
      maxPlayers: formData.maxPlayers || 6,
      status: 'waiting',
      tag: formData.tag || '尝试',
      hot: true,
      private: formData.private,
      password: formData.password,
    }

    console.log('创建房间:', newRoom)
    navigate('/lobby')
  }

  return (
    <div className="min-h-screen w-full relative font-sans text-slate-200 pb-12">
      <BackgroundCommon />

      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-100">发起 IPO (创建房间)</h1>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-8 relative z-10">
        <section className="space-y-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono ml-1">Preview (效果预览)</div>
          <div className="opacity-90 pointer-events-none transform scale-[0.98] origin-top">
            <div className="relative bg-slate-900 border border-emerald-500/50 rounded-xl p-4 overflow-hidden shadow-2xl shadow-emerald-900/20">
              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-1 flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">#Preview</span>
                    <span className="px-1.5 py-0.5 rounded-lg bg-red-950/40 text-red-400 text-[9px] border border-red-900/30 font-bold">
                      NEW
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-200 truncate">{formData.name || '未命名项目...'}</h3>
                  <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                    {formData.sub || 'PENDING CODE...'}
                  </p>
                </div>
                {/* Tag 显示 */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded text-right whitespace-nowrap transition-colors font-bold ${
                    (formData.minBet || 0) === 0
                      ? 'text-slate-900 bg-emerald-400'
                      : (formData.minBet || 0) > 100
                        ? 'text-red-400 bg-red-950/30'
                        : 'text-emerald-400 bg-emerald-950/30'
                  }`}>
                  {formData.tag}
                </span>
              </div>
              <div className="my-3 border-t border-dashed border-emerald-500/20" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="p-1 rounded bg-slate-800 text-emerald-500">
                    <Banknote size={14} />
                  </div>
                  <span className="font-mono font-bold text-sm">
                    {/* 金额为 0 显示 FREE */}
                    {(formData.minBet || 0) === 0 ? 'FREE' : `¥${formData.minBet}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  {formData.private && <Lock size={10} className="text-amber-500" />}
                  <span>1/{formData.maxPlayers} 席位</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 输入组 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium ml-1 flex items-center gap-2">
                <Type size={14} /> 项目名称 (Room Name)
              </label>
              <input
                type="text"
                maxLength={12}
                placeholder="例如: 快速回本计划"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-emerald-500/50 focus:outline-none transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium ml-1 flex items-center gap-2">
                <Tag size={14} /> 代号 (Subtitle)
              </label>
              <input
                type="text"
                maxLength={20}
                placeholder="例如: HIGH RISK ZONE"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 font-mono uppercase focus:border-emerald-500/50 focus:outline-none transition-colors"
                value={formData.sub}
                onChange={(e) => setFormData({ ...formData, sub: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          {/* 滑块组 */}
          <div className="bg-slate-900/30 border border-white/5 rounded-xl p-5 space-y-6">
            {/* 门票金额 (支持 0) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400 flex items-center gap-2">
                  <Coins size={14} /> 入场门票 (Min Bet)
                </label>
                <span
                  className={`font-mono font-bold transition-colors ${
                    (formData.minBet || 0) === 0 ? 'text-emerald-400' : 'text-emerald-400'
                  }`}>
                  {(formData.minBet || 0) === 0 ? '无料 (免费)' : `¥ ${formData.minBet}`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                className="w-full accent-emerald-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                value={formData.minBet}
                onChange={(e) => setFormData({ ...formData, minBet: parseInt(e.target.value) })}
                title="门票金额"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>¥0 (慈善)</span>
                <span>¥1000 (首富)</span>
              </div>
            </div>

            <div className="w-full h-px bg-white/5" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400 flex items-center gap-2">
                  <Users size={14} /> 最大韭菜数 (Max Players)
                </label>
                <span className="font-mono text-slate-200">{formData.maxPlayers} 人</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[2, 4, 6, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, maxPlayers: num })}
                    className={`flex-1 min-w-12.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                      formData.maxPlayers === num
                        ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400'
                        : 'bg-slate-800 border-transparent text-slate-500 hover:bg-slate-700'
                    }`}>
                    {num}人
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => setFormData({ ...formData, private: !formData.private })}
              className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer active:scale-[0.99] transition-all duration-300 ${
                formData.private ? 'bg-amber-950/20 border-amber-500/30' : 'bg-slate-900/30 border-white/5'
              }`}>
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full transition-colors ${
                    formData.private ? 'bg-amber-900/20 text-amber-500' : 'bg-slate-800 text-slate-500'
                  }`}>
                  {formData.private ? <Lock size={18} /> : <Unlock size={18} />}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-bold transition-colors ${
                      formData.private ? 'text-amber-500' : 'text-slate-300'
                    }`}>
                    {formData.private ? '内幕交易 (私密)' : '公开市场 (公开)'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {formData.private ? '需要密钥才能进入' : '任何人都可以进来送钱'}
                  </span>
                </div>
              </div>
              <div
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  formData.private ? 'bg-amber-600' : 'bg-slate-700'
                }`}>
                <div
                  className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
                    formData.private ? 'left-6' : 'left-1'
                  }`}
                />
              </div>
            </div>

            {/* 密码输入框 (动画展开) */}
            <AnimatePresence>
              {formData.private && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden">
                  <div className="bg-amber-950/10 border border-amber-500/20 rounded-xl p-1 flex items-center">
                    <div className="p-3 text-amber-500/50">
                      <KeyRound size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="设置准入密钥 (Password)"
                      className="w-full outline-none bg-transparent border-none text-amber-400 placeholder:text-amber-500/30 focus:ring-0 text-sm font-mono tracking-widest"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 group mt-8">
            <Sparkles size={18} className="text-emerald-200" />
            <span>立即上市 (Create)</span>
          </motion.button>
        </form>
      </main>
    </div>
  )
}
