import { Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import BlankTextField from "components/base/BlankTextField";

export default function NameValueInput({
  name,
  value,
  inputComponent: InputComponent,
  multiline,
  onChange: setValue,
  editable = false,
  error = false,
}) {
  return (
    <Stack
      direction="row"
      justifyContent="right"
      alignItems="center"
      spacing={1}
    >
      <Box
        sx={{
          width: 150,
          textAlign: "right",
          borderRight: 2,
          pr: 1.5,
          borderColor: grey[500],
        }}
      >
        <Typography>
          <strong>{name}</strong>
        </Typography>
      </Box>

      {InputComponent ? (
        <InputComponent
          error={error}
          variant="standard"
          sx={{ width: 200 }}
          size="small"
          onChange={(val) => setValue(val)}
          value={value}
          disabled={!editable}
        />
      ) : (
        <BlankTextField
          multiline={multiline}
          error={error}
          sx={{ width: 200 }}
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
