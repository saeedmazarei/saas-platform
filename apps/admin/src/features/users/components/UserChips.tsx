import Chip from '@mui/material/Chip';
import type { UserRole, UserStatus } from '@saas/domain';
import { useTranslation } from '@saas/i18n';

export function RoleChip({ role }: { role: UserRole }) {
  const { t } = useTranslation('users');
  return (
    <Chip
      size="small"
      label={t(`roles.${role}`)}
      color={role === 'admin' ? 'primary' : 'default'}
      variant="outlined"
    />
  );
}

export function StatusChip({ status }: { status: UserStatus }) {
  const { t } = useTranslation('users');
  return (
    <Chip
      size="small"
      label={t(`statuses.${status}`)}
      color={status === 'active' ? 'success' : 'warning'}
    />
  );
}
