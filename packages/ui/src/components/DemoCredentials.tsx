import Alert from '@mui/material/Alert';
import { useTranslation } from '@saas/i18n';

/** Shows a demo account on the login page. Apps render it only when the mock API is on. */
export function DemoCredentials({ email, password }: { email: string; password: string }) {
  const { t } = useTranslation('ui');

  return (
    <Alert severity="info" variant="outlined">
      {t('demoAccount')} <strong>{email}</strong> / <strong>{password}</strong>
    </Alert>
  );
}
