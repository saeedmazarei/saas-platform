import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { isApiError } from '@saas/api-client';
import { updateProfileSchema, type UpdateProfileInput, type User } from '@saas/domain';
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
      setError('root', { message: isApiError(error) ? error.message : 'Could not save your profile.' });
    }
  });

  return (
    <Stack component="form" spacing={2.5} onSubmit={submit} noValidate>
      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      {saved && !isDirty && (
        <Alert severity="success" onClose={() => setSaved(false)}>
          Your profile has been updated.
        </Alert>
      )}
      <FormTextField control={control} name="name" label="Full name" />
      <FormTextField control={control} name="jobTitle" label="Job title" />
      <FormTextField
        control={control}
        name="bio"
        label="Bio"
        multiline
        minRows={3}
        helperText="A few words about yourself (max 500 characters)."
      />
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={() => reset()} disabled={!isDirty || isSubmitting}>
          Discard
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting} disabled={!isDirty}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
}
