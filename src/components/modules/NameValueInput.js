import { TableCell, TableRow, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import BlankTextField from "components/base/BlankTextField";

export default function NameValueInput({
  name,
  value,
  inputComponent: InputComponent,
  multiline,
  onChange: setValue,
  editable = false,
  error = false,
  width = 200,
}) {
  return (
    <TableRow>
      <TableCell
        sx={{
          p: 0,
          pr: 1,
          whiteSpace: "nowrap",
          border: 0,
          textAlign: "right",
          borderRight: 2,
          borderColor: grey[500],
        }}
      >
        <Typography>
          <strong>{name}</strong>
        </Typography>
      </TableCell>

      <TableCell sx={{ p: 0, pl: 1, border: 0 }}>
        {InputComponent ? (
          <InputComponent
            error={error}
            variant="standard"
            sx={{ width: width }}
            size="small"
            onChange={(val) => setValue(val)}
            value={value}
            disabled={!editable}
          />
        ) : (
          <BlankTextField
            multiline={multiline}
            error={error}
            sx={{ width: width }}
            onChange={(e) => setValue(e.target.value)}
            disabled={!editable}
            value={value}
            variant="standard"
            autoComplete="false"
          />
        )}
      </TableCell>
    </TableRow>
  );
}
