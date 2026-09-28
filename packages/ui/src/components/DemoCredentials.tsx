import Alert from '@mui/material/Alert';

/** Shows a demo account on the login page. Apps render it only when the mock API is on. */
export function DemoCredentials({ email, password }: { email: string; password: string }) {
  return (
    <Alert severity="info" variant="outlined">
      Demo account: <strong>{email}</strong> / <strong>{password}</strong>
    </Alert>
  );
}
