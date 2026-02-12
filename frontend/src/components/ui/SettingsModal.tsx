import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, KeyRound, Save, Settings, Shield, Trash2, X } from 'lucide-react'
import { useState } from 'react'

export const SettingsModal = ({
  isOpen,
  onClose,
  onSave,
  roomName,
  isPrivate,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Room>) => void
  roomName: string
  isPrivate: boolean
}) => {
  // 内部状态
  const [form, setForm] = useState<Partial<Room>>({ name: roomName, private: isPrivate, password: '' })

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-950/50">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Settings size={16} /> 房间配置 (Room Config)
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Room Name */}
              <label className="space-y-2">
                <label className="text-xs text-slate-500 font-mono uppercase">Room Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-sm text-slate-200 focus:border-emerald-500 outline-none"
                />
              </label>

              {/* Privacy Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-500 font-mono uppercase flex items-center gap-2">
                    <Shield size={14} /> Security
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, private: !form.private })}
                    className={`w-10 h-5 rounded-full relative transition-colors ${
                      form.private ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}>
                    <div
                      className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                        form.private ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="text-[10px] text-slate-500">
                  {form.private ? '状态: 私密 (需要密钥)' : '状态: 公开 (任意进入)'}
                </div>

                <AnimatePresence>
                  {form.private && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-white/5">
                        <KeyRound size={14} className="text-emerald-500" />
                        <input
                          type="text"
                          placeholder="设置新密钥..."
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          className="bg-transparent w-full text-sm outline-none placeholder:text-slate-600"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-dashed border-white/10">
                <div className="bg-red-950/10 border border-red-500/20 rounded-lg p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-red-400 flex items-center gap-1">
                      <AlertTriangle size={14} /> DANGER ZONE
                    </div>
                    <div className="text-[10px] text-red-400/60">此操作不可逆，将强制结算并关闭房间</div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-2 bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 rounded text-red-400 text-xs font-bold transition-colors flex items-center gap-1">
                    <Trash2 size={14} />
                    跑路 (Rug)
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950/50 border-t border-white/5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                取消
              </button>
              <button
                type="button"
                onClick={() => onSave(form)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                <Save size={14} />
                保存变更
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
