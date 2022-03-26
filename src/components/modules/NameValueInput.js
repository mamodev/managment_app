import { Divider, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import BlankTextField from "components/base/BlankTextField";

export default function NameValueInput({ name, value, disabled = true }) {
  return (
    <Stack
      direction="row"
      justifyContent="right"
      alignItems="center"
      spacing={1}
    >
      <Typography>
        <strong>{name}</strong>
      </Typography>
      <Divider
        sx={{ border: 1, borderColor: grey[400] }}
        orientation="vertical"
        flexItem
      />
      <BlankTextField
        sx={{ width: "fit-content" }}
        disabled={disabled}
        value={value}
        variant="standard"
        autoComplete="false"
      />
    </Stack>
  );
}
