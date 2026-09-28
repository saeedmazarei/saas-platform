import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { isApiError } from '@saas/api-client';
import { updateUserSchema, type UpdateUserInput, type User } from '@saas/domain';
import { useTranslation } from '@saas/i18n';
import { FormTextField } from '@saas/ui';
import { useForm } from 'react-hook-form';

type UserEditFormProps = {
  user: User;
  isSelf: boolean;
  onSubmit: (values: UpdateUserInput) => Promise<unknown>;
  onCancel: () => void;
};

export function UserEditForm({ user, isSelf, onSubmit, onCancel }: UserEditFormProps) {
  const { t } = useTranslation('users');
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      jobTitle: user.jobTitle,
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      if (isApiError(error) && error.status === 409) {
        setError('email', { message: error.message });
      } else {
        setError('root', { message: isApiError(error) ? error.message : t('couldNotSave') });
      }
    }
  });

  return (
    <Stack component="form" spacing={2.5} onSubmit={submit} noValidate>
      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      <FormTextField control={control} name="name" label={t('fullName')} />
      <FormTextField control={control} name="email" label={t('email')} type="email" />
      <FormTextField control={control} name="jobTitle" label={t('jobTitle')} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormTextField
          control={control}
          name="role"
          label={t('role')}
          select
          disabled={isSelf}
          helperText={isSelf ? t('cannotChangeOwnRole') : undefined}
        >
          <MenuItem value="user">{t('roles.user')}</MenuItem>
          <MenuItem value="admin">{t('roles.admin')}</MenuItem>
        </FormTextField>
        <FormTextField
          control={control}
          name="status"
          label={t('status')}
          select
          disabled={isSelf}
          helperText={isSelf ? t('cannotSuspendSelf') : undefined}
        >
          <MenuItem value="active">{t('statuses.active')}</MenuItem>
          <MenuItem value="suspended">{t('statuses.suspended')}</MenuItem>
        </FormTextField>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={isSubmitting}>
          {t('cancel')}
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting} disabled={!isDirty}>
          {t('saveChanges')}
        </Button>
      </Stack>
    </Stack>
  );
}
