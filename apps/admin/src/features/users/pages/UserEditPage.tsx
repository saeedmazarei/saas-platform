import Paper from '@mui/material/Paper';
import { useAuth } from '@saas/auth';
import { useTranslation } from '@saas/i18n';
import { PageHeader, PageLoader } from '@saas/ui';
import { useNavigate, useParams } from 'react-router';
import { BackLink } from '../components/BackLink';
import { UserEditForm } from '../components/UserEditForm';
import { UserQueryError } from '../components/UserQueryError';
import { useUpdateUser } from '../hooks/api/useUpdateUser';
import { useUser } from '../hooks/api/useUser';

export function UserEditPage() {
  const { t } = useTranslation('users');
  const { userId = '' } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { data: user, isPending, isError, error, refetch } = useUser(userId);
  const updateUser = useUpdateUser(userId);

  if (isPending) return <PageLoader />;
  if (isError) return <UserQueryError error={error} onRetry={() => void refetch()} />;

  const detailsPath = `/users/${user.id}`;

  return (
    <>
      <PageHeader eyebrow={<BackLink to={detailsPath} label={user.name} />} title={t('editUser')} />
      <Paper sx={{ p: 3, maxWidth: 720 }}>
        <UserEditForm
          user={user}
          isSelf={user.id === currentUser?.id}
          onSubmit={async (values) => {
            await updateUser.mutateAsync(values);
            await navigate(detailsPath);
          }}
          onCancel={() => void navigate(detailsPath)}
        />
      </Paper>
    </>
  );
}
