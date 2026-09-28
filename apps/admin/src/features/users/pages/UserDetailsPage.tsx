import EditIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from '@saas/i18n';
import { NameAvatar, PageHeader, PageLoader } from '@saas/ui';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { BackLink } from '../components/BackLink';
import { RoleChip, StatusChip } from '../components/UserChips';
import { UserQueryError } from '../components/UserQueryError';
import { useUser } from '../hooks/api/useUser';

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography component="div">{children}</Typography>
    </Box>
  );
}

export function UserDetailsPage() {
  const { t } = useTranslation('users');
  const { userId = '' } = useParams();
  const { data: user, isPending, isError, error, refetch } = useUser(userId);

  if (isPending) return <PageLoader />;
  if (isError) return <UserQueryError error={error} onRetry={() => void refetch()} />;

  return (
    <>
      <PageHeader
        eyebrow={<BackLink to="/users" label={t('allUsers')} />}
        title={user.name}
        subtitle={user.jobTitle || undefined}
        actions={
          <Button component={Link} to="edit" variant="contained" startIcon={<EditIcon />}>
            {t('edit')}
          </Button>
        }
      />
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
          <NameAvatar name={user.name} size={64} />
          <Stack direction="row" spacing={1}>
            <RoleChip role={user.role} />
            <StatusChip status={user.status} />
          </Stack>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Field label={t('email')}>{user.email}</Field>
          <Field label={t('jobTitle')}>{user.jobTitle || '—'}</Field>
          <Field label={t('memberSince')}>{dateFormat.format(new Date(user.createdAt))}</Field>
          <Field label={t('userId')}>{user.id}</Field>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Field label={t('bio')}>{user.bio || '—'}</Field>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
