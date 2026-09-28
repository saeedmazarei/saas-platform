import TextField, { type TextFieldProps } from '@mui/material/TextField';
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
  const { field, fieldState } = useController({ control, name });

  return (
    <TextField
      {...props}
      {...field}
      value={field.value ?? ''}
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message ?? helperText}
    />
  );
}