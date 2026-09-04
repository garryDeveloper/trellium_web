import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './protected-route'
import { GuestOnlyRoute } from './guest-route'
import { PlaceholderPage } from './placeholder-page'
import { AppLayout } from './app-layout'
import { LoginPage } from '@/features/auth/pages/login.page'
import { BoardsPage } from '@/features/boards/pages/boards.page'
import { BoardPage } from '@/features/boards/pages/board.page'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestOnlyRoute>
        <LoginPage />
      </GuestOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestOnlyRoute>
        <PlaceholderPage
          title="Registro"
          description="Todavía no está implementado (T1.1)."
        />
      </GuestOnlyRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <BoardsPage /> },
      { path: 'boards/:boardId', element: <BoardPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
