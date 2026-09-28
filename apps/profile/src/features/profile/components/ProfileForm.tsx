import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { isApiError } from '@saas/api-client';
import { updateProfileSchema, type UpdateProfileInput, type User } from '@saas/domain';
import { useTranslation } from '@saas/i18n';
import { FormTextField } from '@saas/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ProfileFormProps = {
  user: User;
  onSubmit: (values: UpdateProfileInput) => Promise<User>;
};

const toFormValues = (user: User): UpdateProfileInput => ({
  name: user.name,
  jobTitle: user.jobTitle,
  bio: user.bio,
});

export function ProfileForm({ user, onSubmit }: ProfileFormProps) {
  const { t } = useTranslation('profile');
  const [saved, setSaved] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: toFormValues(user),
  });

  const submit = handleSubmit(async (values) => {
    setSaved(false);
    try {
      const updated = await onSubmit(values);
      // The saved values become the new starting point, so "Save" is disabled again.
      reset(toFormValues(updated));
      setSaved(true);
    } catch (error) {
      setError('root', { message: isApiError(error) ? error.message : t('couldNotSave') });
    }
  });

  return (
    <Stack component="form" spacing={2.5} onSubmit={submit} noValidate>
      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      {saved && !isDirty && (
        <Alert severity="success" onClose={() => setSaved(false)}>
          {t('updated')}
        </Alert>
      )}
      <FormTextField control={control} name="name" label={t('fullName')} />
      <FormTextField control={control} name="jobTitle" label={t('jobTitle')} />
      <FormTextField
        control={control}
        name="bio"
        label={t('bio')}
        multiline
        minRows={3}
        helperText={t('bioHelp')}
      />
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={() => reset()} disabled={!isDirty || isSubmitting}>
          {t('discard')}
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting} disabled={!isDirty}>
          {t('save')}
        </Button>
      </Stack>
    </Stack>
  );
}
