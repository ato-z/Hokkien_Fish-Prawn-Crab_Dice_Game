import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// 引入页面组件
import { LoginPage } from '@/pages/login'
import { LobbyPage } from '@/pages/lobby'
import { GamePage } from '@/pages/game'
import { NotFoundPage } from '@/pages/404'

// 引入刚刚创建的守卫组件
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { CreateRoomPage } from './pages/create-room'
import { ProfilePage } from './pages/profile'

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
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* 动态路由：游戏房间 */}
          <Route path="/game/:roomId" element={<GamePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
