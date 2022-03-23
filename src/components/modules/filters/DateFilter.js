import { DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";

export default function DateFilter({
  value,
  onChange: setValue,
  placeholder,
  inputProps,
  ...props
}) {
  return (
    <DatePicker
      {...props}
      value={value}
      onChange={(newValue) => setValue(newValue)}
      renderInput={(params) => (
        <TextField {...inputProps} {...params} label={placeholder} />
      )}
    />
  );
}
