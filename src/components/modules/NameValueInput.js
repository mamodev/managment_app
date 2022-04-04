import { Divider, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import BlankTextField from "components/base/BlankTextField";

export default function NameValueInput({
  name,
  value,
  inputComponent: InputComponent,
  onChange: setValue,
  editable = false,
}) {
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
      {InputComponent ? (
        <InputComponent
          variant="standard"
          sx={{ width: "167px" }}
          size="small"
          onChange={(val) => setValue(val)}
          value={value}
          disabled={!editable}
        />
      ) : (
        <BlankTextField
          onChange={(e) => setValue(e.target.value)}
          disabled={!editable}
          value={value}
          variant="standard"
          autoComplete="false"
        />
      )}
    </Stack>
  );
}
