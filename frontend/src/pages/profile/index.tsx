import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Lock,
  Save,
  Camera,
  ShieldCheck,
  LogOut,
  KeyRound,
  Fingerprint,
  Loader2,
  Sprout,
  type LucideIcon,
} from 'lucide-react'

// --- 类型定义 ---
interface InputGroupProps {
  label: string
  icon: LucideIcon // Lucide 图标的类型
  type?: React.HTMLInputTypeAttribute // HTML 输入框类型 (text, password, etc.)
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void // 精确的事件类型
  placeholder?: string
}

// --- 组件：输入框封装 ---
const InputGroup = ({ label, icon: Icon, type = 'text', value, onChange, placeholder }: InputGroupProps) => (
  <div className="space-y-1.5">
    <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
        <Icon size={16} />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:border-emerald-500/50 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600"
      />
    </div>
  </div>
)

export function ProfilePage() {
  const navigate = useNavigate()

  // --- 状态管理 ---
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nickname, setNickname] = useState<string>('韭菜_007')

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  // --- 处理函数 ---
  const handleSaveProfile = () => {
    setIsLoading(true)
    // 模拟 API 请求
    setTimeout(() => {
      setIsLoading(false)
      // 这里可以加个 toast
      alert('身份信息已更新 / Identity Updated')
    }, 1500)
  }

  const handleLogout = () => {
    if (window.confirm('确定要断开连接吗？')) {
      navigate('/login')
    }
  }

  const handlePasswordChange = (field: keyof typeof passwords) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-10">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold text-slate-100 tracking-wide">身份枢纽 (Identity Hub)</h1>
        <div className="w-5" />
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* 2. 个人档案卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden">
          {/* 背景装饰线 */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 via-emerald-700 to-slate-800" />
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

          {/* 头像区域：韭菜本体 */}
          <div className="relative mb-4 group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-emerald-950/30 border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden relative group-hover:border-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Sprout size={40} className="text-emerald-400 drop-shadow-lg" />

              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                <Camera size={24} className="text-emerald-200" />
              </div>
            </div>
            <div
              className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-950 rounded-full animate-pulse"
              title="Online"
            />
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">{nickname}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5 font-mono">
              UID: 89757
            </span>
            <span className="text-[10px] bg-emerald-950/30 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 font-bold">
              <ShieldCheck size={12} /> KYC Verified
            </span>
          </div>

          {/* 资产简报 */}
          <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-white/5">
            <div className="text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Total Assets</div>
              <div className="text-lg font-mono font-bold text-amber-400 mt-1">¥ 88,800</div>
            </div>
            <div className="text-center border-l border-white/5">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Contribution</div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-1">Level 4</div>
            </div>
          </div>
        </motion.div>

        {/* 3. 修改信息表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider pl-1">
              <Fingerprint size={14} className="text-emerald-500" />
              <span>Public Profile (公开身份)</span>
            </div>

            <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-4">
              <InputGroup
                label="Alias / 昵称"
                icon={User}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50">
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                更新档案 (Update Profile)
              </button>
            </div>
          </section>

          {/* B. 安全设置 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider pl-1">
              <KeyRound size={14} className="text-amber-500" />
              <span>Security (安全凭证)</span>
            </div>

            <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 space-y-4">
              <InputGroup
                label="Current Key / 原密码"
                icon={Lock}
                type="password"
                placeholder="验证您的身份..."
                value={passwords.current}
                onChange={handlePasswordChange('current')}
              />

              {/* 分割线 */}
              <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-2" />

              <InputGroup
                label="New Key / 新密码"
                icon={KeyRound}
                type="password"
                placeholder="设置新密钥..."
                value={passwords.new}
                onChange={handlePasswordChange('new')}
              />
              <InputGroup
                label="Confirm Key / 确认密码"
                icon={ShieldCheck}
                type="password"
                placeholder="再次输入..."
                value={passwords.confirm}
                onChange={handlePasswordChange('confirm')}
              />

              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.98] disabled:opacity-50">
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                重置密钥 (Reset Key)
              </button>
            </div>
          </section>
        </motion.div>

        {/* 4. Logout */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
            <LogOut size={16} />
            断开神经连接 (Disconnect)
          </button>
        </motion.div>
      </main>
    </div>
  )
}
