import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, Dices, ChevronRight, Hash, Smile } from 'lucide-react'
import { BackgroundCommon } from '@/components/ui/Background'

// --- 输入框组件 ---
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode
  label: string
}

const InputField = ({ icon, label, className, type = 'text', ...props }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="space-y-1 group">
      <label className="text-[10px] font-mono font-medium text-slate-500 ml-1 group-focus-within:text-emerald-400 transition-colors uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
          {icon}
        </div>
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={`w-full bg-slate-900/60 border border-white/10 text-slate-200 text-sm rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-slate-600 transition-all duration-300 backdrop-blur-sm ${className || ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}

// --- 主页面 ---
export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative font-sans text-slate-200">
      <BackgroundCommon />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm" // max-w-sm 适合移动端
      >
        {/* Logo 区域 */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-linear-to-br from-slate-800 to-slate-950 border border-white/10 shadow-2xl mb-2 group">
            <Dices className="w-8 h-8 text-emerald-500 group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-100 tracking-tight">财富再分配模拟器</h1>
          <p className="text-slate-500 text-xs tracking-widest uppercase font-mono">Wealth Redistribution Gateway</p>
        </div>

        {/* 卡片容器 */}
        <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {/* 顶部高光条 */}
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />

          {/* 切换 Tabs：文案修改 */}
          <div className="flex p-1 bg-slate-900/80 rounded-lg mb-6 relative border border-white/5">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-xs font-bold rounded relative z-10 transition-colors duration-300 ${
                isLogin ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}>
              老韭菜归队
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-xs font-bold rounded relative z-10 transition-colors duration-300 ${
                !isLogin ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}>
              萌新入场
            </button>

            {/* 切换滑块 */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-emerald-950/50 border border-emerald-500/30 rounded transition-all duration-300 ease-spring ${
                isLogin ? 'left-1' : 'left-[calc(50%+4px)]'
              }`}
            />
          </div>

          {/* 表单区域 */}
          <div className="relative min-h-70">
            <AnimatePresence mode="wait">
              {isLogin ? (
                // === 登录表单 ===
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}>
                  <InputField label="Trader ID (交易代码)" placeholder="请输入您的账号" icon={<Hash size={16} />} />
                  <InputField
                    label="Private Key (支付密钥)"
                    type="password"
                    placeholder="请输入密码"
                    icon={<Lock size={16} />}
                  />

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300 transition-colors">
                      <input
                        type="checkbox"
                        className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20 accent-emerald-500"
                      />
                      保持在线
                    </label>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group mt-2">
                    回来回本
                    <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                  onSubmit={(e) => e.preventDefault()}>
                  <InputField
                    label="Alias (江湖绰号)"
                    placeholder="以后富豪榜上写谁的名字?"
                    icon={<Smile size={16} />}
                  />

                  <InputField
                    label="Key (设置密钥)"
                    type="password"
                    placeholder="6-12位字符"
                    icon={<Lock size={16} />}
                  />

                  <InputField
                    label="Confirm (确认密钥)"
                    type="password"
                    placeholder="别输错了"
                    icon={<Lock size={16} />}
                  />

                  <button
                    type="button"
                    className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-3 rounded-lg shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group mt-4">
                    签署卖身契
                    <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
