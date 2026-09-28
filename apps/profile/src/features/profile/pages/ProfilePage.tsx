import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from '@saas/i18n';
import { ErrorState, PageHeader, PageLoader } from '@saas/ui';
import { ProfileForm } from '../components/ProfileForm';
import { ProfileSummary } from '../components/ProfileSummary';
import { useMyProfile } from '../hooks/api/useMyProfile';
import { useUpdateProfile } from '../hooks/api/useUpdateProfile';

export function ProfilePage() {
  const { t } = useTranslation('profile');
  const { data: user, isPending, isError, error, refetch } = useMyProfile();
  const updateProfile = useUpdateProfile();

  if (isPending) return <PageLoader />;
  if (isError) return <ErrorState message={error.message} onRetry={() => void refetch()} />;

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <Box
        sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, alignItems: 'start' }}
      >
        <ProfileSummary user={user} />
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('personalDetails')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('managedByAdmin')}
          </Typography>
          <ProfileForm user={user} onSubmit={updateProfile.mutateAsync} />
        </Paper>
      </Box>
    </>
  );
}
