// src/components/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function ProtectedRoute() {
  // TODO: 替换为真实的 Token 判断逻辑
  const isAuth = !!localStorage.getItem('token')
  const location = useLocation()

  if (!isAuth) {
    // 未登录：重定向到登录页，并记录当前想去的页面
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 已登录：渲染子路由
  return <Outlet />
}
