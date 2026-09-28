import { hasRole, useAuth } from '@saas/auth';
import { AppShell, UserMenu } from '@saas/ui';
import { Outlet } from 'react-router';
import { env } from '@/config/env';
import { features } from '@/router/features';

const navItems = features.flatMap((feature) => feature.navItems ?? []);

export function ProfileLayout() {
  const { user, logout } = useAuth();

  return (
    <AppShell
      productName="My Account"
      navItems={navItems}
      headerActions={
        user && (
          <UserMenu
            name={user.name}
            email={user.email}
            links={hasRole(user, ['admin']) ? [{ label: 'Admin console', href: env.VITE_ADMIN_APP_URL }] : []}
            onLogout={() => void logout()}
          />
        )
      }
    >
      <Outlet />
    </AppShell>
  );
}
