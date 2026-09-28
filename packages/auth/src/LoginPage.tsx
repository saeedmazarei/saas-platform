import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { isApiError } from '@saas/api-client';
import { loginSchema, type LoginInput } from '@saas/domain';
import { FormTextField } from '@saas/ui';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from './AuthProvider';

type LoginPageProps = {
  productName: string;
  footer?: ReactNode;
};

export function LoginPage({ productName, footer }: LoginPageProps) {
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
    } catch (error) {
      setError('root', {
        message: isApiError(error) ? error.message : 'Could not sign in. Please try again.',
      });
    }
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Stack component="form" spacing={2.5} onSubmit={onSubmit} noValidate>
          <div>
            <Typography variant="h5" component="h1">
              Sign in
            </Typography>
            <Typography color="text.secondary">to continue to {productName}</Typography>
          </div>
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
          <FormTextField
            control={control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
          />
          <FormTextField
            control={control}
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
            Sign in
          </Button>
          {footer}
        </Stack>
      </Paper>
    </Box>
  );
}