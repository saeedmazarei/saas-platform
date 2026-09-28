import { NotFoundPage, RouteErrorBoundary } from '@saas/app-core';
import { GuestOnly, LoginPage, RequireAuth } from '@saas/auth';
import { createBrowserRouter, Navigate } from 'react-router';
import { DemoCredentials } from '@/components/DemoCredentials';
import { AdminLayout } from '@/layouts/AdminLayout';
import { env } from '@/config/env';
import { features } from './features';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestOnly>
        <LoginPage
          productName="Admin Console"
          footer={env.VITE_ENABLE_MOCKS && <DemoCredentials email="admin@example.com" />}
        />
      </GuestOnly>
    ),
  },
  {
    element: (
      <RequireAuth roles={['admin']}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      {
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: <Navigate to="/users" replace /> },
          ...features.flatMap((feature) => feature.routes),
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);