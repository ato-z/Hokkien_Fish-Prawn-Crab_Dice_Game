import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Lock, Loader2, KeyRound, ArrowRight, AlertTriangle, ShieldCheck, Wifi } from 'lucide-react'
import { useSetAtom } from 'jotai'
import { motion, AnimatePresence } from 'framer-motion'
import Typewriter from 'typewriter-effect' // 引入打字机
import { apiGetRoomInfoById, apiPostRoomJoinById } from '@/api'
import { withRoomIdAtom } from '@/store/game'
import { BackgroundCommon } from './Background'

// --- 类型定义 ---
type JoinStatus = 'loading' | 'joining' | 'need_password' | 'error'

export const RoomTransition = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const withRoomId = useSetAtom(withRoomIdAtom)

  const [status, setStatus] = useState<JoinStatus>('loading')
  const [roomConfig, setRoomConfig] = useState<Room | null>(null)
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // 尝试加入
  const attemptJoin = useCallback(
    async (pwd?: string) => {
      if (!roomId) return
      try {
        setStatus('joining')
        setErrorMsg('')
        await apiPostRoomJoinById(roomId, pwd)

        // 模拟连接成功的延迟感
        setTimeout(() => {
          withRoomId(roomId)
        }, 800)
      } catch (error) {
        console.error('加入失败', error)
        setStatus('need_password')
        // 赛博风错误提示
        setErrorMsg(pwd ? '访问被拒绝：密钥指纹不匹配' : '连接被防火墙拦截')
        setPassword('')
      }
    },
    [roomId, withRoomId]
  )

  const handleSubmitPassword = () => {
    if (!password) return
    attemptJoin(password)
  }

  // 初始化检查
  useEffect(() => {
    const initRoom = async () => {
      if (!roomId) return
      try {
        setStatus('loading')
        const roomInfo = await apiGetRoomInfoById(roomId)
        setRoomConfig(roomInfo)

        // TODO: 替换为真实的权限判断逻辑
        const isOwner = false
        const isInRoom = false

        if (isOwner || isInRoom) {
          withRoomId(roomId)
        } else if (roomInfo.private) {
          setStatus('need_password')
        } else {
          attemptJoin()
        }
      } catch {
        setStatus('error')
        setErrorMsg('信号在以太网中丢失 (Signal Lost)')
      }
    }
    initRoom()
  }, [roomId, withRoomId, attemptJoin])

  // --- 渲染部分 ---

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans flex items-center justify-center p-4 overflow-hidden">
      <BackgroundCommon />

      <AnimatePresence mode="wait">
        {/* 状态 1: 加载中 / 加入中 */}
        {(status === 'loading' || status === 'joining') && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="flex flex-col items-center gap-6 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 bg-slate-900 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-900/50">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
              </div>
              {/* 装饰性角标 */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-emerald-500" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-emerald-500" />
            </div>

            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-emerald-400 tracking-widest font-mono min-h-7">
                {/* 打字机效果 */}
                <Typewriter
                  options={{
                    strings: [
                      '正在建立神经链路...',
                      '正在同步量子密钥...',
                      '正在绕过 ICE 防火墙...',
                      '正在下载意识备份...',
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                    cursor: '█',
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 font-mono">TARGET NODE: 0x{roomId?.slice(0, 6).toUpperCase()}</p>
            </div>
          </motion.div>
        )}

        {/* 状态 2: 需要密码 */}
        {status === 'need_password' && (
          <motion.div
            key="password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm z-10">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              {/* 顶部光效 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-linear-to-r from-transparent via-amber-500/50 to-transparent blur-sm" />

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/5 flex items-center justify-center mx-auto mb-4 shadow-inner relative">
                  <Lock className="w-7 h-7 text-amber-400" />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500/20 p-1 rounded-md border border-amber-500/30">
                    <ShieldCheck size={10} className="text-amber-300" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">高安防扇区</h2>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono uppercase">
                  <Wifi size={10} className="text-emerald-500" />
                  Security Protocol Active
                </div>
              </div>

              <div className="space-y-4">
                {/* 房间信息卡片 */}
                {roomConfig && (
                  <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-500">扇区代号</span>
                    <span className="text-xs font-bold text-slate-200">{roomConfig.name || 'Unknown'}</span>
                  </div>
                )}

                {/* 密码输入框 */}
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-amber-400 transition-colors">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorMsg) setErrorMsg('')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitPassword()}
                    placeholder="输入访问凭证..."
                    className={`w-full bg-slate-950 border rounded-xl py-3.5 pl-11 pr-4 text-sm text-center tracking-widest text-white outline-none transition-all placeholder:text-slate-600 placeholder:tracking-normal font-mono ${
                      errorMsg
                        ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                        : 'border-white/10 focus:border-amber-500/50 focus:bg-slate-900 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    }`}
                    autoFocus
                  />
                </div>

                {/* 错误提示 */}
                <div className="h-5 flex items-center justify-center">
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1.5 text-xs text-red-400 font-bold">
                      <AlertTriangle size={12} />
                      {errorMsg}
                    </motion.div>
                  )}
                </div>

                {/* 提交按钮 */}
                <button
                  type="button"
                  onClick={handleSubmitPassword}
                  disabled={!password}
                  className="w-full py-3.5 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn">
                  <span className="group-hover/btn:translate-x-1 transition-transform">强制解密 (DECRYPT)</span>
                  <ArrowRight
                    size={16}
                    className={`transition-all ${!password ? 'opacity-0' : 'opacity-100 group-hover/btn:translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate(-1)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  断开连接 (ABORT)
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 状态 3: 错误 */}
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 bg-slate-900/80 backdrop-blur-md border border-red-500/20 p-8 rounded-2xl text-center max-w-xs shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">连接中断</h3>
            <p className="text-xs text-slate-400 mb-6 font-mono leading-relaxed">{errorMsg}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all border border-white/5 hover:border-white/10">
              重置信号增幅器
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
