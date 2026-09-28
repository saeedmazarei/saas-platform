import { NotFoundPage, RouteErrorBoundary } from '@saas/app-core';
import { GuestOnly, LoginPage, RequireAuth } from '@saas/auth';
import { useTranslation } from '@saas/i18n';
import { DemoCredentials } from '@saas/ui';
import { createBrowserRouter, Navigate } from 'react-router';
import { AdminLayout } from '@/layouts/AdminLayout';
import { env } from '@/config/env';
import { features } from './features';

/** The shared login page, with this app's name and (in mock mode) its demo account. */
function AdminLogin() {
  const { t } = useTranslation('app');
  return (
    <GuestOnly>
      <LoginPage
        productName={t('productName')}
        footer={env.VITE_ENABLE_MOCKS && <DemoCredentials email="admin@example.com" password="password123" />}
      />
    </GuestOnly>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AdminLogin />,
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