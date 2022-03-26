import { Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import NameValueInput from "components/modules/NameValueInput";

export default function ApiDataHeader({ columns = [], data, ...props }) {
  data = data?.length > 0 && data?.reduce((object, next) => object);

  return (
    <Stack
      {...props}
      direction="row"
      alignItems="start"
      justifyContent="space-between"
      sx={{ border: 2, borderColor: grey[400], py: 2, px: 5, borderRadius: 4 }}
    >
      {data &&
        columns.map((e, i) => (
          <Stack key={i}>
            {e?.map((e, i) => (
              <NameValueInput
                name={e.nameid ? data[e.nameid] : e.name}
                value={data[e.id]}
                key={i}
              />
            ))}
          </Stack>
        ))}
    </Stack>
  );
}
