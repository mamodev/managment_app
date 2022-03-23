import { TextField } from "@mui/material";

export default function TextFilter({
  value,
  onChange: setValue,
  placeholder,
  ...props
}) {
  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      label={placeholder}
    />
  );
}
