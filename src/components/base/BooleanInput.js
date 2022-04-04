import { FormControl, MenuItem, Select } from "@mui/material";

export default function BooleanInput({
  value,
  onChange: setValue,
  disabled = false,
  ...props
}) {
  return (
    <FormControl disabled={disabled} {...props}>
      <Select value={value} onChange={(e) => setValue(e.target.value)}>
        <MenuItem value={true}>Si</MenuItem>
        <MenuItem value={false}>No</MenuItem>
      </Select>
    </FormControl>
  );
}
