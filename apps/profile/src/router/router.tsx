import { NotFoundPage, RouteErrorBoundary } from '@saas/app-core';
import { GuestOnly, LoginPage, RequireAuth } from '@saas/auth';
import { DemoCredentials } from '@saas/ui';
import { createBrowserRouter, Navigate } from 'react-router';
import { env } from '@/config/env';
import { ProfileLayout } from '@/layouts/ProfileLayout';
import { features } from './features';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestOnly>
        <LoginPage
          productName="My Account"
          footer={env.VITE_ENABLE_MOCKS && <DemoCredentials email="user@example.com" password="password123" />}
        />
      </GuestOnly>
    ),
  },
  {
    // Any signed-in user may use this app, so no role is required.
    element: (
      <RequireAuth>
        <ProfileLayout />
      </RequireAuth>
    ),
    children: [
      {
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: <Navigate to="/profile" replace /> },
          ...features.flatMap((feature) => feature.routes),
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
