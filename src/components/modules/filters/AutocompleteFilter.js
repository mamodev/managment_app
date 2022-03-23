import { Autocomplete, TextField } from "@mui/material";

export default function AutocompleteFilter({
  value,
  onChange: setValue,
  name,
  placeholder,
  inputProps,
  options = [],
  ...props
}) {
  return (
    <Autocomplete
      {...props}
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
      options={options}
      renderInput={(params) => (
        <TextField {...inputProps} {...params} label={placeholder} />
      )}
    />
  );
}
