import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { useTranslation } from '@saas/i18n';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

type FormTextFieldProps<TValues extends FieldValues> = Omit<
  TextFieldProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'error'
> & {
  control: Control<TValues>;
  name: FieldPath<TValues>;
};

export function FormTextField<TValues extends FieldValues>({
  control,
  name,
  helperText,
  ...props
}: FormTextFieldProps<TValues>) {
  const { t } = useTranslation('validation');
  const { field, fieldState } = useController({ control, name });
  const errorMessage = fieldState.error?.message;

  return (
    <TextField
      {...props}
      {...field}
      value={field.value ?? ''}
      error={Boolean(fieldState.error)}
      // Validation messages are translation keys; server messages have no key and are shown as they are.
      helperText={errorMessage ? t(errorMessage, { defaultValue: errorMessage }) : helperText}
    />
  );
}