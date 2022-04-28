import { TextField } from "@mui/material";

export default function FormTextField({
  value,
  onChange: change,
  required = false,
  ...props
}) {
  return (
    <TextField
      {...props}
      value={value}
      variant="standard"
      error={required && value === ""}
      onChange={(e) => change(e.target.value)}
    />
  );
}
