import Alert from '@mui/material/Alert';

export function DemoCredentials({ email }: { email: string }) {
  return (
    <Alert severity="info" variant="outlined">
      Demo account: <strong>{email}</strong> / <strong>password123</strong>
    </Alert>
  );
}