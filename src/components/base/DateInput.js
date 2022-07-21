import { DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";

function getMinDate() {
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 2);
  return minDate;
}
function getMaxDate() {
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() + 5);
  return minDate;
}

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
  console.log(value);
  const isValidDate = value instanceof Date && isFinite(value);

  return (
    <DatePicker
      {...props}
      value={value}
      onChange={(newValue) => setValue(newValue)}
      minDate={getMinDate()}
      maxDate={getMaxDate()}
      renderInput={(params) => (
        <TextField
          {...inputProps}
          {...params}
          error={error || (value && !isValidDate)}
          helperText={value && isValidDate ? helperText : "La data non è valida"}
          autoComplete={autocomplete}
          label={placeholder}
        />
      )}
    />
  );
}
