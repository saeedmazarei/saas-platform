import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { NameAvatar, PageHeader, PageLoader } from '@saas/ui';
import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useParams } from 'react-router';
import { usersQueries } from '../api/queries';
import { BackLink } from '../components/BackLink';
import { RoleChip, StatusChip } from '../components/UserChips';
import { UserQueryError } from '../components/UserQueryError';

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
  const { userId = '' } = useParams();
  const { data: user, isPending, isError, error, refetch } = useQuery(usersQueries.detail(userId));

  if (isPending) return <PageLoader />;
  if (isError) return <UserQueryError error={error} onRetry={() => void refetch()} />;

  return (
    <>
      <PageHeader
        eyebrow={<BackLink to="/users" label="All users" />}
        title={user.name}
        subtitle={user.jobTitle || undefined}
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
          <Field label="Email">{user.email}</Field>
          <Field label="Job title">{user.jobTitle || '—'}</Field>
          <Field label="Member since">{dateFormat.format(new Date(user.createdAt))}</Field>
          <Field label="User ID">{user.id}</Field>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Field label="Bio">{user.bio || '—'}</Field>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
