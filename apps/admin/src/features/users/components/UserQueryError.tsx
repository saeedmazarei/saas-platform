import Button from '@mui/material/Button';
import { isApiError } from '@saas/api-client';
import { useTranslation } from '@saas/i18n';
import { ErrorState } from '@saas/ui';
import { Link } from 'react-router';

export function UserQueryError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const { t } = useTranslation('users');
  if (isApiError(error) && error.status === 404) {
    return (
      <ErrorState
        title={t('notFound')}
        message={t('notFoundMessage')}
        action={
          <Button component={Link} to="/users" variant="contained">
            {t('backToUsers')}
          </Button>
        }
      />
    );
  }
  return <ErrorState message={error.message} onRetry={onRetry} />;
}
