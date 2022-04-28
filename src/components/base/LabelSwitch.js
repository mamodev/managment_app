import { Stack, Switch, Typography } from "@mui/material";

export default function LabelSwitch({ value, onChange: change, label }) {
  return (
    <Stack direction="row" alignItems="center">
      <Switch checked={value} onChange={(e, checked) => change(checked)} />
      <Typography variant="subtitle2">{label}</Typography>
    </Stack>
  );
}
