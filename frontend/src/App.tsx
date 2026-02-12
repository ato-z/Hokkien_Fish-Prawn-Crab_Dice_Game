import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// 引入页面组件
import { LoginPage } from '@/pages/login'
import { LobbyPage } from '@/pages/lobby'
import { GamePage } from '@/pages/game'
import { NotFoundPage } from '@/pages/404' // 修正了拼写 NouFound -> NotFound

// 引入刚刚创建的守卫组件
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === 1. 公开路由 (无需登录) === */}
        <Route path="/login" element={<LoginPage />} />

        {/* === 2. 受保护路由 (需要登录) === */}
        {/* 所有嵌套在 ProtectedRoute 下的路由都会经过登录检查 */}
        <Route element={<ProtectedRoute />}>
          {/* 根路径重定向到大厅 (如果没登录会被守卫拦截去 /login) */}
          <Route path="/" element={<Navigate to="/lobby" replace />} />

          <Route path="/lobby" element={<LobbyPage />} />

          {/* 动态路由：游戏房间 */}
          <Route path="/game/:roomId" element={<GamePage />} />
        </Route>

        {/* === 3. 404 处理 === */}
        {/* 注意：element 必须接收 JSX (<Component />)，而不是函数引用 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
