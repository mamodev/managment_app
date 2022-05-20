import { DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";

export default function DateInput({
  value,
  onChange: setValue,
  placeholder,
  inputProps,
  autocomplete = "off",
  helperText,
  error = false,
  ...props
}) {
  return (
    <DatePicker
      {...props}
      value={value}
      onChange={(newValue) => setValue(newValue)}
      renderInput={(params) => (
        <TextField
          {...inputProps}
          {...params}
          error={error}
          helperText={helperText}
          autoComplete={autocomplete}
          label={placeholder}
        />
      )}
    />
  );
}
