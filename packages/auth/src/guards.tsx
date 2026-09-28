import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { User, UserRole } from '@saas/domain';
import { ErrorState } from '@saas/ui';
import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation, type Location } from 'react-router';
import { useAuth } from './AuthProvider';

export const hasRole = (user: User | null, roles?: readonly UserRole[]) =>
  user !== null && (!roles || roles.includes(user.role));

type RequireAuthProps = {
  roles?: readonly UserRole[];
  loginPath?: string;
  children?: ReactNode;
};

export function RequireAuth({ roles, loginPath = '/login', children }: RequireAuthProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to={loginPath} replace state={{ from: location }} />;

  if (!hasRole(user, roles)) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 12, px: 2 }}>
        <ErrorState
          title="Access denied"
          message={`You are signed in as ${user.email}, which does not have access to this application.`}
          action={
            <Button variant="contained" onClick={() => void logout()}>
              Sign in with another account
            </Button>
          }
        />
      </Box>
    );
  }

  return children ?? <Outlet />;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const from = (location.state as { from?: Location } | null)?.from;
    const target = from ? `${from.pathname}${from.search}${from.hash}` : '/';
    return <Navigate to={target} replace />;
  }
  return children;
}