import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTranslation } from '@saas/i18n';
import { ErrorState } from '@saas/ui';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

export function RouteErrorBoundary() {
  const { t } = useTranslation('core');
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  console.error(error);

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', mt: 8 }}>
      <ErrorState
        message={t('unexpectedError')}
        action={
          <Button variant="contained" onClick={() => window.location.reload()}>
            {t('reloadPage')}
          </Button>
        }
      />
    </Box>
  );
}

export function NotFoundPage() {
  const { t } = useTranslation('core');
  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', mt: 8 }}>
      <ErrorState
        title={t('pageNotFound')}
        message={t('pageNotFoundMessage')}
        action={
          <Button component={Link} to="/" variant="contained">
            {t('goHome')}
          </Button>
        }
      />
    </Box>
  );
}