import { hasRole, useAuth } from '@saas/auth';
import { useTranslation } from '@saas/i18n';
import { AppShell, UserMenu } from '@saas/ui';
import { Outlet } from 'react-router';
import { env } from '@/config/env';
import { features } from '@/router/features';

const navItems = features.flatMap((feature) => feature.navItems ?? []);

export function ProfileLayout() {
  const { t } = useTranslation('app');
  const { user, logout } = useAuth();

  return (
    <AppShell
      productName={t('productName')}
      navItems={navItems}
      headerActions={
        user && (
          <UserMenu
            name={user.name}
            email={user.email}
            links={hasRole(user, ['admin']) ? [{ label: t('adminConsole'), href: env.VITE_ADMIN_APP_URL }] : []}
            onLogout={() => void logout()}
          />
        )
      }
    >
      <Outlet />
    </AppShell>
  );
}
