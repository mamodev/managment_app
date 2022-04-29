import { Autocomplete, TextField } from "@mui/material";

export default function AutocompleteFilter({
  value,
  onChange: setValue,
  name,
  placeholder,
  inputProps,
  options = [],
  error = false,
  required = false,
  helperText,
  ...props
}) {
  return (
    <Autocomplete
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      options={options}
      renderInput={(params) => (
        <TextField
          {...inputProps}
          {...params}
          error={(required && value === null) || error}
          helperText={helperText}
          label={placeholder}
        />
      )}
      {...props}
    />
  );
}
