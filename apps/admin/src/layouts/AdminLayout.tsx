import { useAuth } from '@saas/auth';
import { AppShell, UserMenu } from '@saas/ui';
import { Outlet } from 'react-router';
import { env } from '@/config/env';
import { features } from '@/router/features';

const navItems = features.flatMap((feature) => feature.navItems ?? []);

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <AppShell
      productName="Admin Console"
      navItems={navItems}
      headerActions={
        user && (
          <UserMenu
            name={user.name}
            email={user.email}
            links={[{ label: 'My profile', href: env.VITE_PROFILE_APP_URL }]}
            onLogout={() => void logout()}
          />
        )
      }
    >
      <Outlet />
    </AppShell>
  );
}