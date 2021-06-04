import { Control, Controller, FieldPath } from "react-hook-form";
import TextField from "@material-ui/core/TextField";

interface FormFieldProps<T> {
  control: Control<T>;
  label: string;
  name: FieldPath<T>;
  autoComplete?: string;
  type?: "text" | "password";
}

export const FormField = <T,>({
  control,
  label,
  name,
  type = "text",
  autoComplete,
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { invalid, error } }) => (
        <TextField
          variant="outlined"
          fullWidth
          type={type}
          label={label}
          autoComplete={autoComplete}
          error={invalid}
          helperText={error?.message}
          {...field}
        />
      )}
    />
  );
};
