import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { User } from '@saas/domain';
import { useTranslation } from '@saas/i18n';
import { NameAvatar } from '@saas/ui';

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });

export function ProfileSummary({ user }: { user: User }) {
  const { t } = useTranslation('profile');

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <NameAvatar name={user.name} size={88} />
        <div>
          <Typography variant="h6">{user.name}</Typography>
          <Typography color="text.secondary">{user.jobTitle || t('noJobTitle')}</Typography>
        </div>
        <Typography variant="body2">{user.email}</Typography>
        <Chip size="small" label={t(`roles.${user.role}`)} />
        <Typography variant="caption" color="text.secondary">
          {t('memberSince', { date: dateFormat.format(new Date(user.createdAt)) })}
        </Typography>
      </Stack>
    </Paper>
  );
}
