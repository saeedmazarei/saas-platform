import Chip from '@mui/material/Chip';
import type { UserRole, UserStatus } from '@saas/domain';

export function RoleChip({ role }: { role: UserRole }) {
  return (
    <Chip
      size="small"
      label={role === 'admin' ? 'Admin' : 'User'}
      color={role === 'admin' ? 'primary' : 'default'}
      variant="outlined"
    />
  );
}

export function StatusChip({ status }: { status: UserStatus }) {
  return (
    <Chip
      size="small"
      label={status === 'active' ? 'Active' : 'Suspended'}
      color={status === 'active' ? 'success' : 'warning'}
    />
  );
}
